import OpenAI from "openai";
import { CV_TOOLS, runCvTool, SECTION_IDS, TECHNICAL_ONLY_SECTIONS } from "@/lib/agent/tools";
import { SYSTEM_PROMPTS, AGENT_MODEL, type SiteView } from "@/lib/agent/prompt";
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

// Tours run one model call per stop, often preceded by sequential data
// fetches to ground the stop notes (parallel tool calls are off outside
// match turns), so the loop needs generous headroom: worst observed tour is
// 4 fetches + 5 stops + closing text = 10 calls.
const MAX_LLM_ITERATIONS = 12;
// Dwell before every scroll after a turn's first: tours would otherwise jump
// stop to stop as fast as the model iterates, before the page even settles.
const TOUR_STOP_DWELL_MS = 2400;
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
  let body: { messages?: unknown; lang?: unknown; view?: unknown };
  try {
    body = JSON.parse(raw);
  } catch {
    return Response.json({ error: "invalid JSON" }, { status: 400 });
  }
  const turns = sanitizeMessages(body.messages);
  const lang = body.lang === "es" ? "es" : "en";
  const view: SiteView = body.view === "concise" ? "concise" : "technical";
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
          await runLive(turns, view, send, trace, request.signal);
        } else {
          await runReplay(lang, view, turns, send, trace, () => closed);
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
  view: SiteView,
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
  let scrollsSent = 0;
  let textSent = false;

  // show_section notes are assistant prose carried as a tool argument (terse
  // models won't interleave text with tool calls); stream them word by word
  // so they read like the model's own typing.
  const streamNote = async (note: string) => {
    const words = note.split(/\s+/);
    for (let i = 0; i < words.length; i += 3) {
      send({ type: "delta", text: (textSent || i > 0 ? " " : "") + words.slice(i, i + 3).join(" ") });
      textSent = true;
      await sleep(24);
    }
  };

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
        instructions: SYSTEM_PROMPTS[view],
        input,
        tools: CV_TOOLS,
        // One tool call per response keeps tours honest — each stop's scroll
        // arrives with its narration instead of one batched call chain. Match
        // turns keep parallel calls: they fan out over several data tools.
        parallel_tool_calls: hasJd,
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
    let responseHasText = false;
    for await (const event of stream) {
      if (event.type === "response.output_text.delta") {
        // Glue a space between a previously streamed note and fresh text.
        const glue = !responseHasText && textSent && !/^\s/.test(event.delta) ? " " : "";
        responseHasText = true;
        textSent = true;
        send({ type: "delta", text: glue + event.delta });
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
        const note = typeof args.note === "string" ? args.note.trim().slice(0, 400) : "";
        const hidden = view === "concise" && TECHNICAL_ONLY_SECTIONS.includes(target);
        const valid = (SECTION_IDS as readonly string[]).includes(target) && !hidden;
        if (valid) {
          if (scrollsSent > 0) await sleep(TOUR_STOP_DWELL_MS);
          send({ type: "ui", action: "scroll_to", target });
          scrollsSent++;
          if (note) await streamNote(note);
          out = JSON.stringify({
            ok: true,
            now_in_view: target,
            ...(note && {
              note_delivered: "the visitor already read your note — never repeat it in reply text",
            }),
          });
          trace(
            "result",
            call.name,
            `→ scrolled to #${target}${note ? " · note streamed" : ""}`,
          );
        } else {
          out = JSON.stringify({
            error: hidden
              ? `the ${target} section is not on the visitor's concise view — describe it in words instead`
              : "unknown section",
          });
          trace(
            "result",
            call.name,
            hidden ? `#${target} hidden in concise view` : "unknown section",
          );
        }
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
  view: SiteView,
  turns: ChatTurn[],
  send: (m: Wire) => void,
  trace: (kind: string, label: string, detail?: string) => void,
  isClosed: () => boolean,
) {
  send({ type: "mode", mode: "replay" });
  const script = pickReplay(lang, turns[turns.length - 1].content, view);
  for (const step of script.steps as ReplayStep[]) {
    if (isClosed()) return;
    await sleep(step.delay);
    if (step.kind === "trace") {
      trace(step.ev, step.label, step.detail);
    } else if (step.kind === "ui") {
      // Never scroll a concise-view visitor to a section their page lacks.
      if (view === "concise" && TECHNICAL_ONLY_SECTIONS.includes(step.target)) continue;
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
