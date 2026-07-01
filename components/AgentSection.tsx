"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Send } from "lucide-react";
import { SectionHeader } from "./SectionHeader";
import { useT } from "@/lib/i18n";
import { useLanguage } from "@/lib/Language";
import { useViewMode } from "@/lib/ViewMode";
import { palette } from "./viz/primitives/colors";

const MAX_CLIENT_TURNS = 8;
const MAX_INPUT_CHARS = 500;

type ChatMsg = { role: "user" | "assistant"; content: string };
type TraceEv = { t: number; kind: string; label: string; detail?: string };
type Mode = "live" | "replay" | null;

const KIND_COLORS: Record<string, string> = {
  guard: palette.lime,
  llm: palette.orange,
  tool: palette.cyan,
  result: palette.magenta,
  usage: palette.blue,
  info: palette.textMuted,
  error: palette.red,
};

// The show_section tool lands here: scroll the visitor to the section the
// agent is talking about and pulse it briefly. Only known ids are honored.
function scrollToSection(target: string) {
  if (!/^[a-z]+$/.test(target)) return;
  const el = document.getElementById(target);
  if (!el || el.tagName !== "SECTION") return;
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  el.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
  el.classList.remove("agent-flash");
  // restart the animation if the same section is targeted twice
  void el.offsetWidth;
  el.classList.add("agent-flash");
  window.setTimeout(() => el.classList.remove("agent-flash"), 2000);
}

export function AgentSection() {
  const { detailed } = useViewMode();
  const t = useT();
  const { lang } = useLanguage();

  const [msgs, setMsgs] = useState<ChatMsg[]>([]);
  const [traces, setTraces] = useState<TraceEv[]>([]);
  const [mode, setMode] = useState<Mode>(null);
  const [model, setModel] = useState<string | null>(null);
  const [streaming, setStreaming] = useState(false);
  const [input, setInput] = useState("");
  const abortRef = useRef<AbortController | null>(null);
  const chatRef = useRef<HTMLDivElement | null>(null);
  const traceRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => () => abortRef.current?.abort(), []);
  useEffect(() => {
    chatRef.current?.scrollTo({ top: chatRef.current.scrollHeight });
  }, [msgs]);
  useEffect(() => {
    traceRef.current?.scrollTo({ top: traceRef.current.scrollHeight });
  }, [traces]);

  const userTurns = msgs.filter((m) => m.role === "user").length;
  const capped = userTurns >= MAX_CLIENT_TURNS;

  const sendQuestion = useCallback(
    async (question: string) => {
      const q = question.trim().slice(0, MAX_INPUT_CHARS);
      if (!q || streaming || capped) return;
      setInput("");

      const history: ChatMsg[] = [...msgs, { role: "user", content: q }];
      setMsgs([...history, { role: "assistant", content: "" }]);
      setTraces([]);
      setStreaming(true);

      const appendToAnswer = (text: string) =>
        setMsgs((cur) => {
          const next = cur.slice();
          const last = next[next.length - 1];
          next[next.length - 1] = { ...last, content: last.content + text };
          return next;
        });

      const ac = new AbortController();
      abortRef.current = ac;
      try {
        const res = await fetch("/api/agent", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ messages: history, lang }),
          signal: ac.signal,
        });
        if (!res.ok || !res.body) throw new Error(`http ${res.status}`);

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";
        for (;;) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });
          const frames = buffer.split("\n\n");
          buffer = frames.pop() ?? "";
          for (const frame of frames) {
            const line = frame.trim();
            if (!line.startsWith("data: ")) continue;
            let msg: Record<string, unknown>;
            try {
              msg = JSON.parse(line.slice(6));
            } catch {
              continue;
            }
            if (msg.type === "delta" && typeof msg.text === "string") {
              appendToAnswer(msg.text);
            } else if (msg.type === "trace") {
              setTraces((cur) => [...cur, msg as unknown as TraceEv]);
            } else if (msg.type === "mode") {
              setMode(msg.mode as Mode);
              setModel(typeof msg.model === "string" ? msg.model : null);
            } else if (msg.type === "ui" && msg.action === "scroll_to") {
              scrollToSection(String(msg.target));
            }
          }
        }
      } catch {
        if (!ac.signal.aborted) appendToAnswer(t.agent.errorLine);
      } finally {
        setStreaming(false);
      }
    },
    [msgs, lang, streaming, capped, t.agent.errorLine],
  );

  if (!detailed) return null;

  return (
    <section id="agent" className="py-20 sm:py-28 px-6 sm:px-8">
      <div className="max-w-5xl mx-auto">
        <SectionHeader
          index="06"
          title={t.section.agentTitle}
          subtitle={t.section.agentSubtitle}
          accent="warm"
        />

        <motion.div
          initial={{ y: 12 }}
          whileInView={{ y: 0 }}
          viewport={{ once: true, margin: "-60px", amount: 0.05 }}
          transition={{ duration: 0.4 }}
          className="mt-8 rounded border border-[var(--border)] bg-[var(--surface)] overflow-hidden grid lg:grid-cols-5"
        >
          {/* ── Chat ── */}
          <div className="lg:col-span-3 flex flex-col border-b lg:border-b-0 lg:border-r border-[var(--border)]">
            <div ref={chatRef} className="h-[300px] sm:h-[340px] overflow-y-auto p-4 sm:p-5">
              {msgs.length === 0 ? (
                <div className="h-full flex flex-col justify-end gap-1.5">
                  {t.agent.suggested.map((q) => (
                    <button
                      key={q}
                      onClick={() => sendQuestion(q)}
                      className="self-start text-left text-[13px] px-3 py-1.5 rounded-md border border-[var(--border)] text-[var(--foreground-dim)] hover:border-[var(--accent)]/40 hover:text-[var(--foreground)] transition-colors"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {msgs.map((m, i) => (
                    <div key={i}>
                      <div
                        className="font-mono text-[10px] uppercase tracking-[0.14em]"
                        style={{
                          color: m.role === "user" ? palette.textMuted : palette.orange,
                        }}
                      >
                        {m.role === "user" ? t.agent.you : t.agent.agentLabel}
                      </div>
                      <p className="mt-1 text-[13px] sm:text-sm leading-relaxed text-[var(--foreground)] whitespace-pre-wrap">
                        {m.content}
                        {streaming && i === msgs.length - 1 && (
                          <span className="caret" aria-hidden>
                            {" "}
                          </span>
                        )}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                sendQuestion(input);
              }}
              className="flex items-center gap-2 border-t border-[var(--border)] p-2.5"
            >
              <input
                value={input}
                onChange={(e) => setInput(e.target.value.slice(0, MAX_INPUT_CHARS))}
                placeholder={capped ? t.agent.limitReached : t.agent.inputPlaceholder}
                disabled={streaming || capped}
                aria-label={t.agent.inputPlaceholder}
                className="flex-1 bg-transparent text-[13px] sm:text-sm text-[var(--foreground)] placeholder:text-[var(--foreground-muted)] px-2 py-1.5 outline-none disabled:opacity-60"
              />
              <button
                type="submit"
                disabled={streaming || capped || !input.trim()}
                aria-label={t.agent.send}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[var(--accent)] text-white text-xs font-medium hover:bg-[var(--accent-dim)] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Send className="size-3.5" /> {t.agent.send}
              </button>
            </form>
          </div>

          {/* ── Trace ── */}
          <div className="lg:col-span-2 flex flex-col bg-[var(--surface-raised)] min-w-0">
            <div className="flex items-center gap-2 px-4 py-2.5 border-b border-[var(--border)] font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--foreground-muted)]">
              <span>{t.agent.traceTitle}</span>
              {mode && (
                <span className="inline-flex items-center gap-1.5 normal-case">
                  <span
                    className={`size-1.5 rounded-full ${mode === "live" ? "pulse-dot" : ""}`}
                    style={{
                      background: mode === "live" ? palette.orange : palette.textMuted,
                    }}
                  />
                  {mode === "live" ? t.agent.live : t.agent.replay}
                </span>
              )}
              {model && (
                <span className="ml-auto normal-case tracking-normal text-[var(--foreground-dim)] truncate">
                  {model}
                </span>
              )}
            </div>
            <div
              ref={traceRef}
              className="h-[220px] lg:h-[340px] overflow-y-auto px-4 py-3 font-mono text-[10.5px] leading-relaxed"
              aria-live="off"
            >
              {traces.length === 0 ? (
                <p className="text-[var(--foreground-muted)]">
                  {"// "}
                  {t.agent.traceEmpty}
                </p>
              ) : (
                <ol className="space-y-1.5">
                  {traces.map((ev, i) => (
                    <li key={i} className="flex gap-2 items-baseline min-w-0">
                      <span
                        aria-hidden
                        className="size-1.5 rounded-full shrink-0 translate-y-[-1px]"
                        style={{ background: KIND_COLORS[ev.kind] ?? palette.textMuted }}
                      />
                      <span className="text-[var(--foreground-muted)] shrink-0 tabular-nums">
                        +{String(ev.t).padStart(4, "0")}ms
                      </span>
                      <span className="min-w-0">
                        <span style={{ color: KIND_COLORS[ev.kind] ?? palette.textDim }}>
                          {ev.label}
                        </span>
                        {ev.detail && (
                          <span className="text-[var(--foreground-muted)] break-words">
                            {" · "}
                            {ev.detail}
                          </span>
                        )}
                      </span>
                    </li>
                  ))}
                </ol>
              )}
            </div>
          </div>
        </motion.div>

        <p className="mt-3 font-mono text-[10px] text-[var(--foreground-muted)]">
          {t.agent.disclaimer}
        </p>
      </div>
    </section>
  );
}
