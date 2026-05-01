"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { palette } from "./primitives/colors";
import { useInView, usePrefersReducedMotion } from "./primitives/useInView";

type Stage = 0 | 1 | 2 | 3;

const QUERY = "top 5 customers last quarter";

const SQL_LINES = [
  "SELECT  name, SUM(amount) AS total",
  "FROM    orders",
  "WHERE   created_at >= now() - '1 quarter'",
  "GROUP BY name",
  "ORDER BY total DESC LIMIT 5;",
];

const RESULTS: Array<{ name: string; v: number }> = [
  { name: "Acme", v: 1.0 },
  { name: "Norix", v: 0.78 },
  { name: "Vega", v: 0.61 },
  { name: "Lume", v: 0.49 },
  { name: "Atra", v: 0.33 },
];

const STAGE_DURATIONS = [1500, 1700, 1900, 1900]; // ms per stage
const PAUSE_AT_END = 1100; // ms before restart

export function NL2SQLPipeline() {
  const [ref, inView] = useInView<HTMLDivElement>({ threshold: 0.3 });
  const reduced = usePrefersReducedMotion();
  const [stage, setStage] = useState<Stage>(0);
  const [paused, setPaused] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!inView || reduced || paused) return;

    function advance(s: Stage) {
      timeoutRef.current = setTimeout(
        () => {
          if (s < 3) {
            setStage((s + 1) as Stage);
          } else {
            // Pause at end, then restart
            timeoutRef.current = setTimeout(() => setStage(0), PAUSE_AT_END);
          }
        },
        STAGE_DURATIONS[s],
      );
    }
    advance(stage);
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [inView, reduced, paused, stage]);

  // Reduced motion: jump to final state
  useEffect(() => {
    if (reduced) setStage(3);
  }, [reduced]);

  return (
    <div
      ref={ref}
      className="space-y-3"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="flex items-baseline justify-between gap-3">
        <div className="font-mono text-[11px] uppercase tracking-wider text-[var(--foreground-muted)]">
          natural language → sql
        </div>
        <div className="font-mono text-[10px] text-[var(--foreground-muted)]">
          hover to pause
        </div>
      </div>

      <div className="w-full bg-[var(--surface)] border border-[var(--border)] rounded p-3 flex flex-col overflow-hidden sm:aspect-[5/3]">
        {/* Stage flow: vertical on mobile, horizontal on sm+ */}
        <div className="flex flex-col sm:grid sm:grid-cols-[1fr_8px_1fr_8px_1fr_8px_1fr] items-stretch gap-1.5 sm:gap-0 flex-1 min-h-0">
          <StageBox
            label="prompt"
            color={palette.amber}
            active={stage >= 0}
            done={stage > 0}
          >
            <PromptStage active={stage === 0} />
          </StageBox>
          <Arrow active={stage >= 1} color={palette.amber} />
          <StageBox label="llm" color={palette.cyan} active={stage >= 1} done={stage > 1}>
            <LLMStage active={stage === 1} />
          </StageBox>
          <Arrow active={stage >= 2} color={palette.cyan} />
          <StageBox label="sql" color={palette.magenta} active={stage >= 2} done={stage > 2}>
            <SQLStage active={stage === 2} />
          </StageBox>
          <Arrow active={stage >= 3} color={palette.magenta} />
          <StageBox label="result" color={palette.lime} active={stage >= 3} done={false}>
            <ResultStage active={stage === 3} />
          </StageBox>
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-0.5 font-mono text-[10px] text-[var(--foreground-muted)]">
          <span className="text-[var(--accent)]">$</span>
          <span className="truncate">flask · postgres · llm@gpt-4o-mini · azure</span>
          <span className="ml-auto whitespace-nowrap">stage {stage + 1} / 4</span>
        </div>
      </div>
    </div>
  );
}

function StageBox({
  label,
  color,
  active,
  done,
  children,
}: {
  label: string;
  color: string;
  active: boolean;
  done: boolean;
  children: React.ReactNode;
}) {
  return (
    <div
      className="rounded border bg-[var(--surface-raised)] flex flex-col overflow-hidden min-w-0 min-h-[56px] sm:min-h-0"
      style={{
        borderColor: active ? color : palette.border,
        boxShadow: active && !done ? `inset 0 0 0 1px ${color}40, 0 0 6px ${color}30` : "none",
        transition: "border-color 250ms, box-shadow 250ms",
      }}
    >
      <div
        className="px-2 py-1 font-mono text-[9px] uppercase tracking-wider"
        style={{ color: active ? color : palette.textMuted, borderBottom: `1px solid ${palette.border}` }}
      >
        {label}
      </div>
      <div className="flex-1 px-2 py-2 min-h-0">{children}</div>
    </div>
  );
}

function Arrow({ active, color }: { active: boolean; color: string }) {
  return (
    <div className="flex items-center justify-center self-center w-full sm:w-auto">
      <svg
        width="8"
        height="14"
        viewBox="0 0 8 14"
        className="rotate-90 sm:rotate-0"
      >
        <path
          d="M0 7 L7 7"
          stroke={active ? color : palette.border}
          strokeWidth="1.2"
          fill="none"
          style={{ transition: "stroke 250ms" }}
        />
        <path
          d="M5 4 L7 7 L5 10"
          stroke={active ? color : palette.border}
          strokeWidth="1.2"
          fill="none"
          style={{ transition: "stroke 250ms" }}
        />
      </svg>
    </div>
  );
}

// ── Stage contents ───────────────────────────────────────────────────────────

function PromptStage({ active }: { active: boolean }) {
  // Type the query when active.
  const [shown, setShown] = useState("");
  useEffect(() => {
    if (!active) {
      setShown(QUERY);
      return;
    }
    setShown("");
    let i = 0;
    const id = setInterval(() => {
      i++;
      setShown(QUERY.slice(0, i));
      if (i >= QUERY.length) clearInterval(id);
    }, 35);
    return () => clearInterval(id);
  }, [active]);
  return (
    <div className="font-mono text-[10px] leading-snug text-[var(--foreground)]">
      <span className="text-[var(--accent-warm)]">&gt; </span>
      {shown}
      {active && <span className="caret align-baseline">&nbsp;</span>}
    </div>
  );
}

function LLMStage({ active }: { active: boolean }) {
  return (
    <div className="h-full flex flex-col justify-center items-center gap-1.5">
      <div className="flex gap-1">
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="size-1.5 rounded-full"
            style={{ background: palette.cyan }}
            animate={
              active
                ? { opacity: [0.3, 1, 0.3], y: [0, -2, 0] }
                : { opacity: 0.4 }
            }
            transition={{
              duration: 0.9,
              repeat: active ? Infinity : 0,
              delay: i * 0.18,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>
      <div className="font-mono text-[8px] text-[var(--foreground-muted)] tracking-wider">
        {active ? "thinking" : "idle"}
      </div>
    </div>
  );
}

function SQLStage({ active }: { active: boolean }) {
  return (
    <div className="font-mono text-[8px] leading-tight text-[var(--foreground-dim)] space-y-0.5">
      {SQL_LINES.map((line, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, x: -4 }}
          animate={{ opacity: active ? 1 : 0.55, x: 0 }}
          transition={{ duration: 0.25, delay: active ? i * 0.18 : 0 }}
        >
          <SqlLine text={line} />
        </motion.div>
      ))}
    </div>
  );
}

function SqlLine({ text }: { text: string }) {
  // Lightweight syntax highlight: keywords vs the rest.
  const keywords = /\b(SELECT|FROM|WHERE|GROUP BY|ORDER BY|LIMIT|AS|now)\b/g;
  const parts: Array<{ kw: boolean; text: string }> = [];
  let last = 0;
  for (const m of text.matchAll(keywords)) {
    if (m.index! > last) parts.push({ kw: false, text: text.slice(last, m.index) });
    parts.push({ kw: true, text: m[0] });
    last = m.index! + m[0].length;
  }
  if (last < text.length) parts.push({ kw: false, text: text.slice(last) });
  return (
    <span>
      {parts.map((p, i) => (
        <span
          key={i}
          style={{ color: p.kw ? palette.magenta : "inherit", fontWeight: p.kw ? 600 : 400 }}
        >
          {p.text}
        </span>
      ))}
    </span>
  );
}

function ResultStage({ active }: { active: boolean }) {
  return (
    <div className="h-full flex flex-col justify-end gap-1">
      {RESULTS.map((r, i) => (
        <div key={r.name} className="flex items-center gap-1.5">
          <span className="font-mono text-[8px] text-[var(--foreground-muted)] w-6 truncate">
            {r.name}
          </span>
          <div className="flex-1 h-1 bg-[var(--border)] rounded-sm overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: active ? `${r.v * 100}%` : "0%" }}
              transition={{ duration: 0.4, delay: 0.1 + i * 0.07 }}
              className="h-full"
              style={{ background: palette.lime }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
