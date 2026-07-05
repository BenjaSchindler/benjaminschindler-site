import OpenAI from "openai";
import { CV_TOOLS, runCvTool, SECTION_IDS } from "@/lib/agent/tools";
import { SYSTEM_PROMPT, AGENT_MODEL } from "@/lib/agent/prompt";
import { JD_PREFIX, validateMatchReport, type MatchReport } from "@/lib/agent/match";
import { pickReplay, type ReplayStep } from "@/lib/agent/replay";
import {
  checkBudget,
  checkRate,
  recordTokens,
  sanitizeMessages,
  LIMITS,
  type ChatTurn,
} from "@/lib/agent/guards";

export const maxDuration = 60;

// Tours chain one show_section call per stop, so the loop needs headroom
// beyond simple lookup-then-answer turns.
const MAX_LLM_ITERATIONS = 7;
const MAX_OUTPUT_TOKENS = 700;
const MAX_OUTPUT_TOKENS_MATCH = 1300; // a report_match payload alone runs several hundred tokens

type Wire =
  | { type: "mode"; mode: "live" | "replay"; model?: string }
  | { type: "trace"; t: number; kind: string; label: string; detail?: string }
  | { type: "delta"; text: string }
  | { type: "ui"; action: "scroll_to"; target: string }
  | { type: "ui"; action: "match_report"; report: MatchReport }
  | { type: "done"; t: number };

const enc = new TextEncoder();
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export async function POST(request: Request) {
  const raw = await request.text();
  if (raw.length > LIMITS.maxBodyBytes) {
    return Response.json({ error: "payload too large" }, { status: 413 });
  }
  let body: { messages?: unknown; lang?: unknown };
  try {
    body = JSON.parse(raw);
  } catch {
    return Response.json({ error: "invalid JSON" }, { status: 400 });
  }
  const turns = sanitizeMessages(body.messages);
  const lang = body.lang === "es" ? "es" : "en";
  if (!turns) {
    return Response.json({ error: "invalid messages" }, { status: 400 });
  }

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "local";
  // The eval runner authenticates with EVAL_KEY to skip per-IP rate limits —
  // a full suite from one IP would otherwise trip its own guardrails.
  const isEvalRun =
    Boolean(process.env.EVAL_KEY) &&
    request.headers.get("x-eval-key") === process.env.EVAL_KEY;
  const live =
    Boolean(process.env.OPENAI_API_KEY) &&
    (isEvalRun || (checkBudget().ok && checkRate(ip).ok));

  const t0 = Date.now();
  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      let closed = false;
      const send = (msg: Wire) => {
        if (closed) return;
        try {
          controller.enqueue(enc.encode(`data: ${JSON.stringify(msg)}\n\n`));
        } catch {
          closed = true;
        }
      };
      const trace = (kind: string, label: string, detail?: string) =>
        send({ type: "trace", t: Date.now() - t0, kind, label, detail });
      request.signal.addEventListener("abort", () => {
        closed = true;
      });

      try {
        if (live) {
          await runLive(turns, send, trace, request.signal);
        } else {
          await runReplay(lang, turns, send, trace, () => closed);
        }
      } catch {
        trace("error", "stream error", "the turn could not be completed");
        send({
          type: "delta",
          text:
            lang === "es"
              ? " Algo falló en este turno — intenta de nuevo en un momento."
              : " Something failed on this turn — try again in a moment.",
        });
      } finally {
        send({ type: "done", t: Date.now() - t0 });
        if (!closed) controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-store",
      "X-Accel-Buffering": "no",
    },
  });
}

// ── Live mode: manual streaming tool loop (Responses API) ───────────────────
async function runLive(
  turns: ChatTurn[],
  send: (m: Wire) => void,
  trace: (kind: string, label: string, detail?: string) => void,
  signal: AbortSignal,
) {
  send({ type: "mode", mode: "live", model: AGENT_MODEL });
  trace(
    "guard",
    "input guard",
    `length ok · rate ok · turn ${turns.filter((t) => t.role === "user").length}/${LIMITS.maxUserTurns}`,
  );

  const client = new OpenAI();
  const input: OpenAI.Responses.ResponseInputItem[] = turns.map((t) => ({
    role: t.role,
    content: t.content,
  }));
  const hasJd = turns.some((t) => t.role === "user" && t.content.startsWith(JD_PREFIX));
  const maxOutputTokens = hasJd ? MAX_OUTPUT_TOKENS_MATCH : MAX_OUTPUT_TOKENS;

  for (let iter = 0; iter < MAX_LLM_ITERATIONS; iter++) {
    if (signal.aborted) return;
    trace(
      "llm",
      AGENT_MODEL,
      iter === 0 ? "streaming · reasoning none · tools available" : "continuing with tool results",
    );

    const stream = await client.responses.create(
      {
        model: AGENT_MODEL,
        instructions: SYSTEM_PROMPT,
        input,
        tools: CV_TOOLS,
        reasoning: { effort: "none" }, // non-reasoning mode
        // Sampling params are accepted only because reasoning is off; low
        // temperature damps rare-token glitches (cross-script token bleed).
        temperature: 0.2,
        text: { verbosity: "low" },
        max_output_tokens: maxOutputTokens,
        store: false, // stateless; the disclaimer promises no stored conversations
        stream: true,
      },
      { signal },
    );

    let completed: OpenAI.Responses.Response | null = null;
    for await (const event of stream) {
      if (event.type === "response.output_text.delta") {
        send({ type: "delta", text: event.delta });
      } else if (
        event.type === "response.output_item.added" &&
        event.item.type === "function_call"
      ) {
        trace("tool", event.item.name, "function_call requested");
      } else if (event.type === "response.completed") {
        completed = event.response;
      }
    }
    if (!completed) {
      trace("error", "incomplete", "the model response did not complete");
      return;
    }

    const u = completed.usage;
    if (u) {
      recordTokens(u.input_tokens + u.output_tokens);
      trace(
        "usage",
        "usage",
        `in ${u.input_tokens} · out ${u.output_tokens} · cached ${u.input_tokens_details?.cached_tokens ?? 0}`,
      );
    }

    const calls = completed.output.filter(
      (o): o is OpenAI.Responses.ResponseFunctionToolCall => o.type === "function_call",
    );
    if (calls.length === 0) return; // final answer — text already streamed

    // store:false → stateless: echo the model's output items back, then
    // append one function_call_output per call.
    input.push(...(completed.output as OpenAI.Responses.ResponseInputItem[]));
    for (const call of calls) {
      let args: Record<string, unknown> = {};
      try {
        args = JSON.parse(call.arguments || "{}");
      } catch {
        // leave args empty; the tool reports what it can
      }
      let out: string;
      if (call.name === "show_section") {
        // UI tool: executes in the visitor's browser via a wire event.
        const target = String(args.section ?? "");
        const valid = (SECTION_IDS as readonly string[]).includes(target);
        if (valid) send({ type: "ui", action: "scroll_to", target });
        out = JSON.stringify(
          valid ? { ok: true, now_in_view: target } : { error: "unknown section" },
        );
        trace("result", call.name, valid ? `→ scrolled to #${target}` : "unknown section");
      } else if (call.name === "report_match") {
        // UI tool: the table renders in the visitor's chat, not as text.
        const report = validateMatchReport(args);
        if (report) {
          send({ type: "ui", action: "match_report", report });
          out = JSON.stringify({
            ok: true,
            rendered:
              "match table shown to the visitor — close with 1-2 sentences, do not repeat it",
          });
          trace("result", call.name, `→ rendered ${report.rows.length} rows`);
        } else {
          out = JSON.stringify({
            error:
              "invalid report: expected {role, summary, rows:[{requirement, verdict: met|partial|missing, evidence}]}",
          });
          trace("result", call.name, "invalid payload rejected");
        }
      } else {
        out = runCvTool(call.name, args);
        trace("result", call.name, `${call.arguments || "{}"} → ${out.length} bytes`);
      }
      input.push({ type: "function_call_output", call_id: call.call_id, output: out });
    }
  }
  trace("info", "loop cap", `stopped after ${MAX_LLM_ITERATIONS} model calls`);
}

// ── Replay mode: recorded sessions, honestly labeled ────────────────────────
async function runReplay(
  lang: "en" | "es",
  turns: ChatTurn[],
  send: (m: Wire) => void,
  trace: (kind: string, label: string, detail?: string) => void,
  isClosed: () => boolean,
) {
  send({ type: "mode", mode: "replay" });
  const script = pickReplay(lang, turns[turns.length - 1].content);
  for (const step of script.steps as ReplayStep[]) {
    if (isClosed()) return;
    await sleep(step.delay);
    if (step.kind === "trace") {
      trace(step.ev, step.label, step.detail);
    } else if (step.kind === "ui") {
      send({ type: "ui", action: "scroll_to", target: step.target });
    } else {
      // Stream the recorded answer in small chunks so both modes read the same.
      const words = step.text.split(" ");
      for (let i = 0; i < words.length; i += 3) {
        if (isClosed()) return;
        send({ type: "delta", text: (i === 0 ? "" : " ") + words.slice(i, i + 3).join(" ") });
        await sleep(24);
      }
    }
  }
}
