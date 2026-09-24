"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  ArrowUpRight,
  Briefcase,
  Check,
  ClipboardList,
  Compass,
  Copy,
  Download,
  Mail,
  Maximize2,
  Minimize2,
  PlayCircle,
  Rocket,
  Send,
  X,
} from "lucide-react";
import { useT } from "@/lib/i18n";
import { useLanguage } from "@/lib/Language";
import { useViewMode } from "@/lib/ViewMode";
import { useData } from "@/lib/data";
import {
  JD_PREFIX,
  mailtoHref,
  matchEmailDraft,
  type EmailDraft,
  type MatchReport,
} from "@/lib/agent/match";
import { isPageTarget, resolveTarget, type PageTarget } from "@/lib/agent/targets";
import { palette } from "./viz/primitives/colors";

const MAX_CLIENT_TURNS = 8;
const MAX_INPUT_CHARS = 500;
const MAX_JD_CHARS = 16000; // mirrors LIMITS.maxJdChars server-side

type ChatMsg = {
  role: "user" | "assistant";
  content: string;
  report?: MatchReport;
  email?: EmailDraft;
  sources?: PageTarget[];
};
type TraceEv = { t: number; kind: string; label: string; detail?: string };
type Mode = "live" | "replay" | null;
type Tab = "chat" | "trace" | "evals";

// Shape of public/evals.json, produced by scripts/run-evals.mjs.
type EvalsFile = {
  date: string;
  commit?: string;
  model: string;
  total: number;
  passed: number;
  cases: {
    id: string;
    category: string;
    pass: boolean;
    checks?: { name: string; pass: boolean; note?: string }[];
  }[];
};

const VERDICT_COLORS: Record<MatchReport["rows"][number]["verdict"], string> = {
  met: palette.lime,
  partial: palette.orange,
  missing: palette.red,
};

// Concise mode renders on the warm light palette, where the neon dark-theme
// verdict colors wash out — use ink-dark equivalents instead.
const VERDICT_COLORS_LIGHT: typeof VERDICT_COLORS = {
  met: "#3f7b2f",
  partial: "#9a5b00",
  missing: "#b3261e",
};

const KIND_COLORS: Record<string, string> = {
  guard: palette.lime,
  llm: palette.orange,
  tool: palette.cyan,
  result: palette.magenta,
  usage: palette.blue,
  info: palette.textMuted,
  error: palette.red,
};

// The show_section tool and the source chips land here: scroll the visitor to
// a section, card, or demo tab and pulse it briefly. Only known targets pass.
function focusOnPage(target: string) {
  if (!isPageTarget(target)) return;
  const { elementId, tab } = resolveTarget(target);
  if (tab) window.dispatchEvent(new CustomEvent("agent:focus", { detail: { tab } }));
  const el = document.getElementById(elementId);
  if (!el) return;
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  el.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
  el.classList.remove("agent-flash");
  // restart the animation if the same section is targeted twice
  void el.offsetWidth;
  el.classList.add("agent-flash");
  window.setTimeout(() => el.classList.remove("agent-flash"), 2000);
}

// Card answers (match table, email draft) have little or no prose, but the
// model needs to see them next turn — "make the email shorter" must work —
// and the API rejects empty turns. Send a compact text rendering instead.
function toWireTurn(m: ChatMsg): { role: ChatMsg["role"]; content: string } {
  if (m.role === "user") return { role: m.role, content: m.content };
  const parts = [m.content.trim()];
  if (m.report) {
    parts.push(
      `[Match table shown] ${m.report.role} · fit ${m.report.fit} · ${m.report.rows.map((r) => `${r.requirement}: ${r.verdict}`).join("; ")}`,
    );
  }
  if (m.email) parts.push(`[Email draft shown] Subject: ${m.email.subject}\n${m.email.body}`);
  return { role: m.role, content: parts.filter(Boolean).join("\n") || "(no answer)" };
}

export function AgentWidget() {
  const { detailed, hydrated } = useViewMode();
  if (!hydrated) return null;
  // Remount on mode switch so technical-only tabs do not leak into concise mode.
  return <FloatingAgent key={detailed ? "technical" : "concise"} detailed={detailed} />;
}

// Both views use a quiet launcher. Technical view adds trace and eval tabs.
function FloatingAgent({ detailed }: { detailed: boolean }) {
  const t = useT();
  const { lang } = useLanguage();
  const { profile, thesis } = useData();
  const reduced = useReducedMotion();

  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [tab, setTab] = useState<Tab>("chat");
  const [msgs, setMsgs] = useState<ChatMsg[]>([]);
  const [traces, setTraces] = useState<TraceEv[]>([]);
  const [mode, setMode] = useState<Mode>(null);
  const [model, setModel] = useState<string | null>(null);
  const [streaming, setStreaming] = useState(false);
  const [input, setInput] = useState("");
  const [jdOpen, setJdOpen] = useState(false);
  const [jdText, setJdText] = useState("");
  const [expandedJd, setExpandedJd] = useState<Set<number>>(new Set());
  const [evals, setEvals] = useState<EvalsFile | "missing" | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const chatRef = useRef<HTMLDivElement | null>(null);
  const traceRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  // Accent tokens that read on both palettes (cyan washes out on beige).
  const verdictColors = detailed ? VERDICT_COLORS : VERDICT_COLORS_LIGHT;
  const matchAccentText = detailed ? "text-[var(--accent-cyan)]" : "text-[var(--accent-dim)]";
  const matchAccentBorder = detailed
    ? "border-[var(--accent-cyan)]/40 hover:border-[var(--accent-cyan)]"
    : "border-[var(--accent-dim)]/40 hover:border-[var(--accent-dim)]";
  const userLabelColor = detailed ? palette.textMuted : "var(--foreground-muted)";
  const agentLabelColor = detailed ? palette.orange : "var(--accent-gold-soft)";

  // Expanded mode grows the panel for long conversations and big pastes.
  const panelWidth = expanded
    ? "w-[min(44rem,calc(100vw-2rem))]"
    : "w-[min(24rem,calc(100vw-2rem))]";
  const bodyHeight = expanded ? "h-[min(60vh,560px)]" : "h-[min(52vh,400px)]";

  useEffect(() => () => abortRef.current?.abort(), []);
  useEffect(() => {
    chatRef.current?.scrollTo({ top: chatRef.current.scrollHeight });
  }, [msgs]);
  useEffect(() => {
    traceRef.current?.scrollTo({ top: traceRef.current.scrollHeight });
  }, [traces]);
  useEffect(() => {
    if (open && window.matchMedia("(min-width: 640px)").matches) inputRef.current?.focus();
  }, [open]);
  // Published eval results are a small static file; fetch once per mount.
  // Concise mode has no evals tab, so skip the fetch there.
  useEffect(() => {
    if (!open || !detailed || evals !== null) return;
    fetch("/evals.json")
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((data: EvalsFile) =>
        setEvals(Array.isArray(data.cases) ? data : "missing"),
      )
      .catch(() => setEvals("missing"));
  }, [open, detailed, evals]);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const userTurns = msgs.filter((m) => m.role === "user").length;
  const capped = userTurns >= MAX_CLIENT_TURNS;

  const sendQuestion = useCallback(
    async (question: string, isJd = false) => {
      const q = question.trim().slice(0, isJd ? MAX_JD_CHARS : MAX_INPUT_CHARS);
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
      const patchLast = (patch: Partial<ChatMsg>) =>
        setMsgs((cur) => {
          const next = cur.slice();
          next[next.length - 1] = { ...next[next.length - 1], ...patch };
          return next;
        });

      const ac = new AbortController();
      abortRef.current = ac;
      try {
        const res = await fetch("/api/agent", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          // view lets the server refuse scrolls to sections this variant
          // doesn't render (concise has no practice section).
          body: JSON.stringify({
            messages: history.map(toWireTurn),
            lang,
            view: detailed ? "technical" : "concise",
          }),
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
              focusOnPage(String(msg.target));
            } else if (msg.type === "ui" && msg.action === "email_draft") {
              const draft = (msg as { draft?: EmailDraft }).draft;
              if (draft?.to && draft.subject && draft.body) patchLast({ email: draft });
            } else if (msg.type === "sources" && Array.isArray(msg.targets)) {
              patchLast({ sources: (msg.targets as unknown[]).filter(isPageTarget) });
            } else if (msg.type === "ui" && msg.action === "match_report") {
              const report = (msg as { report?: MatchReport }).report;
              if (report?.rows?.length) patchLast({ report });
            }
          }
        }
      } catch {
        if (!ac.signal.aborted) appendToAnswer(t.agent.errorLine);
      } finally {
        setStreaming(false);
      }
    },
    [msgs, lang, detailed, streaming, capped, t.agent.errorLine],
  );

  return (
    <>
      {/* ── Panel ── */}
      <AnimatePresence>
        {open && (
          <motion.div
            role="dialog"
            aria-label={t.section.agentTitle}
            initial={reduced ? false : { y: 14, scale: 0.98 }}
            animate={{ y: 0, scale: 1 }}
            exit={reduced ? { opacity: 0 } : { y: 10, scale: 0.98, opacity: 0 }}
            transition={{ duration: reduced ? 0 : 0.22, ease: "easeOut" }}
            className={`fixed bottom-[6.5rem] right-4 sm:right-6 z-50 print:hidden ${panelWidth} max-h-[calc(100dvh-7.5rem)] rounded-lg border border-[var(--border)] bg-[var(--surface)] shadow-2xl shadow-black/40 overflow-hidden flex flex-col`}
          >
            <div className="shrink-0 flex items-center gap-2 px-4 py-2.5 border-b border-[var(--border)] bg-[var(--surface-raised)]">
              {detailed ? (
                <Rocket
                  aria-hidden
                  className="size-3.5 -rotate-45 text-[var(--accent-warm)]"
                />
              ) : (
                <Briefcase
                  aria-hidden
                  className="size-3.5 text-[var(--accent-gold-soft)]"
                />
              )}
              <span className="text-[13px] font-medium text-[var(--foreground)]">
                {t.section.agentTitle}
              </span>
              <button
                onClick={() => setExpanded((v) => !v)}
                aria-label={expanded ? t.agent.shrinkChat : t.agent.expandChat}
                title={expanded ? t.agent.shrinkChat : t.agent.expandChat}
                className="ml-auto p-1 rounded text-[var(--foreground-muted)] hover:text-[var(--foreground)] transition-colors"
              >
                {expanded ? <Minimize2 className="size-4" /> : <Maximize2 className="size-4" />}
              </button>
              <button
                onClick={() => setOpen(false)}
                aria-label={t.agent.closeChat}
                className="p-1 rounded text-[var(--foreground-muted)] hover:text-[var(--foreground)] transition-colors"
              >
                <X className="size-4" />
              </button>
            </div>

            {detailed && (
            <div className="shrink-0 flex items-center gap-1 px-2 py-1.5 border-b border-[var(--border)] font-mono text-[10px] uppercase tracking-[0.14em]">
              {(["chat", "trace", "evals"] as const).map((tb) => (
                <button
                  key={tb}
                  onClick={() => setTab(tb)}
                  className={`inline-flex items-center gap-1.5 px-2 py-1 rounded transition-colors ${
                    tab === tb
                      ? "bg-[var(--surface-raised)] text-[var(--foreground)]"
                      : "text-[var(--foreground-muted)] hover:text-[var(--foreground-dim)]"
                  }`}
                >
                  {tb === "chat"
                    ? t.agent.chatTab
                    : tb === "trace"
                      ? t.agent.traceTab
                      : t.agent.evalsTab}
                  {tb === "trace" && streaming && (
                    <span
                      aria-hidden
                      className="size-1.5 rounded-full pulse-dot"
                      style={{ background: palette.orange }}
                    />
                  )}
                  {tb === "evals" && typeof evals === "object" && evals !== null && (
                    <span
                      className="normal-case tracking-normal"
                      style={{
                        color: evals.passed === evals.total ? palette.lime : palette.orange,
                      }}
                    >
                      {evals.passed}/{evals.total}
                    </span>
                  )}
                </button>
              ))}
              <span className="ml-auto inline-flex items-center gap-1.5 normal-case text-[var(--foreground-muted)] min-w-0">
                {mode && (
                  <>
                    <span
                      className={`size-1.5 rounded-full shrink-0 ${mode === "live" ? "pulse-dot" : ""}`}
                      style={{
                        background: mode === "live" ? palette.orange : palette.textMuted,
                      }}
                    />
                    {mode === "live" ? t.agent.live : t.agent.replay}
                  </>
                )}
                {model && (
                  <span className="tracking-normal text-[var(--foreground-dim)] truncate">
                    {model}
                  </span>
                )}
              </span>
            </div>
            )}

            {tab === "chat" ? (
              <div
                ref={chatRef}
                className={`${bodyHeight} min-h-0 overflow-y-auto p-4`}
              >
                {msgs.length === 0 ? (
                  <div className="min-h-full flex flex-col justify-end gap-2">
                    <p className="font-mono text-[10px] text-[var(--foreground-muted)]">
                      {"// "}
                      {t.section.agentSubtitle}
                    </p>
                    {([
                      { key: "match", icon: ClipboardList, run: () => setJdOpen(true) },
                      { key: "tour", icon: Compass, run: () => sendQuestion(t.agent.tourQuestion) },
                      { key: "email", icon: Mail, run: () => sendQuestion(t.agent.emailQuestion) },
                    ] as const).map(({ key, icon: Icon, run }) => (
                      <button
                        key={key}
                        onClick={run}
                        className={`group flex items-center gap-3 rounded-md border px-3 py-2 text-left transition-colors ${
                          key === "match" ? matchAccentBorder : "border-[var(--border)] hover:border-[var(--accent)]/40"
                        }`}
                      >
                        <Icon aria-hidden className={`size-4 shrink-0 ${key === "match" ? matchAccentText : "text-[var(--foreground-muted)] group-hover:text-[var(--foreground)]"}`} />
                        <span className="min-w-0">
                          <span className="block text-[13px] font-medium text-[var(--foreground)]">{t.agent.capabilities[key].title}</span>
                          <span className="block text-[11.5px] leading-snug text-[var(--foreground-muted)]">{t.agent.capabilities[key].desc}</span>
                        </span>
                      </button>
                    ))}
                    <p className="mt-1 font-mono text-[10px] text-[var(--foreground-muted)]">{t.agent.askLabel}</p>
                    <div className="flex flex-wrap gap-1.5">
                      {t.agent.suggested.map((q) => (
                        <button
                          key={q}
                          onClick={() => sendQuestion(q)}
                          className="text-left text-[12px] px-2.5 py-1 rounded-md border border-[var(--border)] text-[var(--foreground-dim)] hover:border-[var(--accent)]/40 hover:text-[var(--foreground)] transition-colors"
                        >
                          {q}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {msgs.map((m, i) => {
                      const isJdMsg = m.role === "user" && m.content.startsWith(JD_PREFIX);
                      return (
                        <div key={i}>
                          <div
                            className="font-mono text-[10px] uppercase tracking-[0.14em]"
                            style={{
                              color: m.role === "user" ? userLabelColor : agentLabelColor,
                            }}
                          >
                            {m.role === "user" ? t.agent.you : t.agent.agentLabel}
                          </div>
                          {isJdMsg ? (
                            <div className="mt-1">
                              <span
                                className={`inline-flex items-center gap-1.5 font-mono text-[10px] px-1.5 py-0.5 rounded border ${
                                  detailed
                                    ? "border-[var(--accent-cyan)]/40"
                                    : "border-[var(--accent-dim)]/40"
                                } ${matchAccentText}`}
                              >
                                <ClipboardList className="size-3" aria-hidden />
                                {t.agent.jdLabel}
                              </span>
                              <p
                                className={`mt-1.5 text-[12px] leading-relaxed text-[var(--foreground-dim)] whitespace-pre-wrap ${
                                  expandedJd.has(i) ? "" : "line-clamp-3"
                                }`}
                              >
                                {m.content.slice(JD_PREFIX.length).trim()}
                              </p>
                              <button
                                onClick={() =>
                                  setExpandedJd((cur) => {
                                    const next = new Set(cur);
                                    if (next.has(i)) next.delete(i);
                                    else next.add(i);
                                    return next;
                                  })
                                }
                                className={`mt-0.5 font-mono text-[10px] hover:underline ${matchAccentText}`}
                              >
                                {expandedJd.has(i) ? t.agent.jdCollapse : t.agent.jdExpand}
                              </button>
                            </div>
                          ) : (
                            <p className="mt-1 text-[13px] leading-relaxed text-[var(--foreground)] whitespace-pre-wrap">
                              {m.content}
                              {streaming && i === msgs.length - 1 && (
                                <span className="caret" aria-hidden>
                                  {" "}
                                </span>
                              )}
                            </p>
                          )}
                          {m.report && (
                            <MatchCard
                              report={m.report}
                              verdictColors={verdictColors}
                              emailHref={mailtoHref(matchEmailDraft(m.report, profile.email, lang))}
                              resumeHref={t.resumeHref}
                            />
                          )}
                          {m.email && <EmailCard draft={m.email} />}
                          {m.role === "assistant" && !(streaming && i === msgs.length - 1) && (
                            <FollowUps
                              sources={m.sources ?? []}
                              detailed={detailed}
                              paperHref={thesis.paper.url}
                              onAsk={sendQuestion}
                            />
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            ) : tab === "trace" ? (
              <div
                ref={traceRef}
                className={`${bodyHeight} min-h-0 overflow-y-auto px-4 py-3 font-mono text-[10.5px] leading-relaxed bg-[var(--surface-raised)]`}
                aria-live="off"
              >
                {traces.length === 0 ? (
                  <div className="space-y-3 text-[var(--foreground-muted)]">
                    <p>
                      {"// "}
                      {t.agent.traceEmpty}
                    </p>
                    <div>
                      <p className="uppercase tracking-[0.14em] text-[9.5px]">
                        {t.agent.toolsTitle}
                      </p>
                      <ul className="mt-1.5 space-y-1">
                        {t.agent.toolsList.map((tool) => (
                          <li key={tool.name} className="flex gap-2 items-baseline min-w-0">
                            <span
                              aria-hidden
                              className="size-1.5 rounded-full shrink-0 translate-y-[-1px]"
                              style={{
                                // UI tools (they act on the visitor's page) vs data lookups
                                background: ["show_section", "report_match", "draft_email"].includes(tool.name)
                                  ? palette.orange
                                  : palette.cyan,
                              }}
                            />
                            <span className="min-w-0">
                              <span style={{ color: palette.textDim }}>{tool.name}</span>
                              <span className="break-words">
                                {" · "}
                                {tool.desc}
                              </span>
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
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
            ) : (
              <div className={`${bodyHeight} min-h-0 overflow-y-auto px-4 py-3 font-mono text-[10.5px] leading-relaxed bg-[var(--surface-raised)]`}>
                <p className="text-[var(--foreground-muted)]">
                  {"// "}
                  {t.agent.evalsIntro}
                </p>
                {typeof evals !== "object" || evals === null ? (
                  <p className="mt-3 text-[var(--foreground-muted)]">
                    {evals === "missing" ? t.agent.evalsEmpty : "…"}
                  </p>
                ) : (
                  <>
                    <p className="mt-3 text-[var(--foreground-dim)]">
                      <span
                        style={{
                          color:
                            evals.passed === evals.total ? palette.lime : palette.orange,
                        }}
                      >
                        {evals.passed}/{evals.total}
                      </span>
                      {" · "}
                      {evals.model}
                      {" · "}
                      {t.agent.evalsLastRun} {evals.date.slice(0, 10)}
                      {evals.commit ? ` · ${evals.commit}` : ""}
                    </p>
                    <ul className="mt-3 space-y-1.5">
                      {evals.cases.map((c) => (
                        <li key={c.id} className="flex gap-2 items-baseline min-w-0">
                          <span
                            aria-hidden
                            className="shrink-0"
                            style={{ color: c.pass ? palette.lime : palette.red }}
                          >
                            {c.pass ? "✓" : "✗"}
                          </span>
                          <span className="text-[var(--foreground-muted)] shrink-0">
                            {c.category}
                          </span>
                          <span className="min-w-0 break-words" style={{ color: palette.textDim }}>
                            {c.id}
                            {!c.pass && c.checks && (
                              <span className="text-[var(--foreground-muted)]">
                                {" · "}
                                {c.checks
                                  .filter((k) => !k.pass)
                                  .map((k) => k.name)
                                  .join(", ")}
                              </span>
                            )}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </>
                )}
              </div>
            )}

            {jdOpen ? (
              <div className="shrink-0 border-t border-[var(--border)] p-2.5 space-y-2">
                <textarea
                  value={jdText}
                  onChange={(e) => setJdText(e.target.value.slice(0, MAX_JD_CHARS))}
                  placeholder={t.agent.matchPlaceholder}
                  aria-label={t.agent.matchButton}
                  rows={expanded ? 12 : 5}
                  autoFocus
                  className={`w-full resize-none rounded-md border border-[var(--border)] bg-transparent p-2 text-[12.5px] leading-relaxed text-[var(--foreground)] placeholder:text-[var(--foreground-muted)] outline-none ${
                    detailed
                      ? "focus:border-[var(--accent-cyan)]/50"
                      : "focus:border-[var(--accent-dim)]/50"
                  }`}
                />
                <div className="flex items-center gap-2">
                  <p className="flex-1 font-mono text-[9.5px] leading-snug text-[var(--foreground-muted)]">
                    {t.agent.matchHint}
                  </p>
                  <span
                    className="font-mono text-[9.5px] tabular-nums shrink-0"
                    style={{
                      color:
                        jdText.length >= MAX_JD_CHARS
                          ? detailed
                            ? palette.red
                            : VERDICT_COLORS_LIGHT.missing
                          : "var(--foreground-muted)",
                    }}
                  >
                    {jdText.length.toLocaleString(lang === "es" ? "es-CL" : "en-US")}/
                    {MAX_JD_CHARS.toLocaleString(lang === "es" ? "es-CL" : "en-US")}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setJdOpen(false);
                      setJdText("");
                    }}
                    className="px-2.5 py-1.5 rounded-md text-xs text-[var(--foreground-muted)] hover:text-[var(--foreground)] transition-colors"
                  >
                    {t.agent.matchCancel}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const jd = jdText.trim();
                      if (!jd) return;
                      setJdOpen(false);
                      setJdText("");
                      setTab("chat");
                      sendQuestion(`${JD_PREFIX}\n${jd}`, true);
                    }}
                    disabled={streaming || capped || !jdText.trim()}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[var(--accent)] text-white text-xs font-medium hover:bg-[var(--accent-dim)] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <ClipboardList className="size-3.5" /> {t.agent.matchRun}
                  </button>
                </div>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  sendQuestion(input);
                }}
                className="shrink-0 flex items-center gap-2 border-t border-[var(--border)] p-2.5"
              >
                <button
                  type="button"
                  onClick={() => setJdOpen(true)}
                  aria-label={t.agent.matchButton}
                  title={t.agent.matchButton}
                  disabled={streaming || capped}
                  className={`p-1.5 rounded text-[var(--foreground-muted)] transition-colors disabled:opacity-40 ${
                    detailed
                      ? "hover:text-[var(--accent-cyan)]"
                      : "hover:text-[var(--accent)]"
                  }`}
                >
                  <ClipboardList className="size-4" />
                </button>
                <input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value.slice(0, MAX_INPUT_CHARS))}
                  placeholder={capped ? t.agent.limitReached : t.agent.inputPlaceholder}
                  disabled={streaming || capped}
                  aria-label={t.agent.inputPlaceholder}
                  className="flex-1 bg-transparent text-[13px] text-[var(--foreground)] placeholder:text-[var(--foreground-muted)] px-2 py-1.5 outline-none disabled:opacity-60"
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
            )}
            <p className="shrink-0 px-4 pb-2 font-mono text-[9.5px] leading-snug text-[var(--foreground-muted)]">
              {t.agent.disclaimer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* A fixed, quiet launcher keeps diagrams unobstructed. */}
      <div className="fixed bottom-4 right-4 z-50 print:hidden">
        <div>
          <motion.button
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? t.agent.closeChat : t.agent.openChat}
            aria-expanded={open}
            whileHover={reduced ? undefined : { scale: 1.04 }}
            whileTap={reduced ? undefined : { scale: 0.96 }}
            className={`flex size-12 items-center justify-center rounded-full bg-gradient-to-br from-[var(--accent)] to-[var(--accent-dim)] text-white shadow-lg ring-1 ${
              detailed ? "shadow-black/40 ring-white/15" : "shadow-black/25 ring-black/10"
            }`}
          >
            {open ? (
              <X className="size-5" aria-hidden />
            ) : detailed ? (
              <Rocket className="size-5 -rotate-45" aria-hidden />
            ) : (
              <Briefcase className="size-5" aria-hidden />
            )}
          </motion.button>
        </div>
      </div>
    </>
  );
}

// ── Answer attachments ───────────────────────────────────────────────────────

const chipClass =
  "inline-flex items-center gap-1 rounded border border-[var(--border)] px-1.5 py-0.5 text-[11px] text-[var(--foreground-dim)] hover:border-[var(--accent)]/50 hover:text-[var(--foreground)] transition-colors";
const primaryButton =
  "inline-flex items-center gap-1.5 rounded-md bg-[var(--accent)] px-2.5 py-1 text-[11.5px] font-medium text-white hover:bg-[var(--accent-dim)] transition-colors";
const secondaryButton =
  "inline-flex items-center gap-1.5 rounded-md border border-[var(--border)] px-2.5 py-1 text-[11.5px] text-[var(--foreground-dim)] hover:text-[var(--foreground)] transition-colors";

/** Source chips (where the answer's evidence lives on the page) plus up to two next steps. */
function FollowUps({
  sources,
  detailed,
  paperHref,
  onAsk,
}: {
  sources: PageTarget[];
  detailed: boolean;
  paperHref: string;
  onAsk: (question: string) => void;
}) {
  const t = useT();
  const has = (target: PageTarget) => sources.includes(target);
  const actions: { key: string; label: string; icon: typeof Mail; href?: string; external?: boolean; download?: boolean; run?: () => void }[] = [];
  if (has("thesis") || has("thesis-paper")) {
    actions.push({ key: "paper", label: t.agent.actions.paper, icon: ArrowUpRight, href: paperHref, external: true });
  }
  if (detailed && has("experience-doctor911") && !sources.some((s) => s.startsWith("doctor911-"))) {
    actions.push({ key: "demo", label: t.agent.actions.demo, icon: PlayCircle, run: () => focusOnPage("doctor911-whatsapp") });
  }
  if (has("contact")) {
    actions.push({ key: "cv", label: t.agent.actions.cv, icon: Download, href: t.resumeHref, download: true });
    actions.push({ key: "email", label: t.agent.actions.email, icon: Mail, run: () => onAsk(t.agent.emailQuestion) });
  }
  const shown = actions.slice(0, 2);
  if (sources.length === 0 && shown.length === 0) return null;

  return (
    <div className="mt-2 flex flex-wrap items-center gap-1.5">
      {sources.length > 0 && (
        <span className="font-mono text-[10px] text-[var(--foreground-muted)]">{t.agent.sourcesLabel}</span>
      )}
      {sources.map((target) => (
        <button key={target} type="button" onClick={() => focusOnPage(target)} className={chipClass}>
          {t.agent.targets[target]}
        </button>
      ))}
      {shown.map(({ key, label, icon: Icon, href, external, download, run }) =>
        href ? (
          <a
            key={key}
            href={href}
            {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
            {...(download ? { download: "Benjamin_Schindler_CV.pdf" } : {})}
            className={`${chipClass} !border-[var(--accent)]/40 !text-[var(--foreground)]`}
          >
            <Icon aria-hidden className="size-3" /> {label}
          </a>
        ) : (
          <button key={key} type="button" onClick={run} className={`${chipClass} !border-[var(--accent)]/40 !text-[var(--foreground)]`}>
            <Icon aria-hidden className="size-3" /> {label}
          </button>
        ),
      )}
    </div>
  );
}

/** draft_email output: the visitor sends it from their own mail app; nothing is sent from here. */
function EmailCard({ draft }: { draft: EmailDraft }) {
  const t = useT();
  const { profile } = useData();
  const [copied, setCopied] = useState(false);
  // Defense in depth: the server already pins the recipient; pin it again here.
  const safe = { ...draft, to: profile.email };
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(`${safe.subject}\n\n${safe.body}`);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      // clipboard blocked: the mail button still works
    }
  };
  return (
    <div className="mt-2 rounded-md border border-[var(--border)] overflow-hidden">
      <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[var(--surface-raised)] border-b border-[var(--border)] font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--foreground-muted)]">
        <Mail aria-hidden className="size-3" /> {t.agent.emailCard.title}
      </div>
      <div className="space-y-1.5 px-3 py-2 text-[12px]">
        <p className="text-[var(--foreground-muted)]">
          {t.agent.emailCard.to}: <span className="text-[var(--foreground-dim)]">{safe.to}</span>
        </p>
        <p className="font-medium text-[var(--foreground)]">{safe.subject}</p>
        <p className="whitespace-pre-wrap leading-relaxed text-[var(--foreground-dim)]">{safe.body}</p>
      </div>
      <div className="flex flex-wrap gap-2 px-3 py-2 border-t border-[var(--border)]">
        <a href={mailtoHref(safe)} className={primaryButton}>
          <Mail aria-hidden className="size-3.5" /> {t.agent.emailCard.open}
        </a>
        <button type="button" onClick={copy} className={secondaryButton}>
          {copied ? <Check aria-hidden className="size-3.5" /> : <Copy aria-hidden className="size-3.5" />}
          {copied ? t.agent.emailCard.copied : t.agent.emailCard.copy}
        </button>
      </div>
    </div>
  );
}

/** report_match output: fit at a glance, one row per requirement, and the obvious next step. */
function MatchCard({
  report,
  verdictColors,
  emailHref,
  resumeHref,
}: {
  report: MatchReport;
  verdictColors: typeof VERDICT_COLORS;
  emailHref: string;
  resumeHref: string;
}) {
  const t = useT();
  const counts = (["met", "partial", "missing"] as const)
    .map((v) => [v, report.rows.filter((r) => r.verdict === v).length] as const)
    .filter(([, n]) => n > 0);
  const fitColor =
    report.fit === "strong" ? verdictColors.met : report.fit === "partial" ? verdictColors.partial : verdictColors.missing;
  return (
    <div className="mt-2 rounded-md border border-[var(--border)] overflow-hidden">
      <div className="flex flex-wrap items-center gap-x-2 gap-y-1 px-3 py-2 bg-[var(--surface-raised)] border-b border-[var(--border)]">
        <span className="text-[12px] font-medium text-[var(--foreground)]">{report.role}</span>
        <span
          className="ml-auto font-mono text-[9px] uppercase tracking-[0.1em] px-1.5 py-0.5 rounded border"
          style={{ color: fitColor, borderColor: fitColor }}
        >
          {t.agent.fit[report.fit]}
        </span>
        <span className="basis-full font-mono text-[10px] text-[var(--foreground-muted)]">
          {counts.map(([v, n]) => `${n} ${t.agent.verdicts[v]}`).join(" · ")}
        </span>
      </div>
      <ul className="divide-y divide-[var(--border)]">
        {report.rows.map((r, j) => (
          <li key={j} className="px-3 py-2 flex items-start gap-2">
            <span
              className="shrink-0 mt-px font-mono text-[9px] uppercase tracking-[0.1em] px-1.5 py-0.5 rounded border"
              style={{ color: verdictColors[r.verdict], borderColor: verdictColors[r.verdict] }}
            >
              {t.agent.verdicts[r.verdict]}
            </span>
            <span className="min-w-0">
              <span className="block text-[12px] leading-snug text-[var(--foreground)]">{r.requirement}</span>
              <span className="block mt-0.5 text-[11px] leading-snug text-[var(--foreground-muted)]">{r.evidence}</span>
            </span>
          </li>
        ))}
      </ul>
      <p className="px-3 py-2 border-t border-[var(--border)] bg-[var(--surface-raised)] text-[11.5px] leading-relaxed text-[var(--foreground-dim)]">
        {report.summary}
      </p>
      <div className="flex flex-wrap gap-2 px-3 py-2 border-t border-[var(--border)]">
        <a href={emailHref} className={primaryButton}>
          <Mail aria-hidden className="size-3.5" /> {t.agent.actions.matchEmail}
        </a>
        <a href={resumeHref} download="Benjamin_Schindler_CV.pdf" className={secondaryButton}>
          <Download aria-hidden className="size-3.5" /> {t.agent.actions.cv}
        </a>
      </div>
    </div>
  );
}
