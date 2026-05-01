"use client";

import { useState, useId, useMemo } from "react";
import { motion } from "framer-motion";
import { palette } from "./primitives/colors";
import { useInView, usePrefersReducedMotion } from "./primitives/useInView";

type NodeKind = "user" | "orchestrator" | "agent" | "knowledge" | "skill" | "db" | "component";

type Node = {
  id: string;
  label: string;
  sub?: string;
  kind: NodeKind;
  x: number;
  y: number;
  w: number;
  h: number;
};

type Edge = {
  from: string;
  to: string;
  delay?: number;
  role?: "request" | "retrieve" | "respond";
};

type Architecture = {
  id: "web" | "whatsapp";
  label: string;
  viewBox: { w: number; h: number };
  nodes: Node[];
  edges: Edge[];
  footer: string;
};

// ─────────────────────────────────────────────────────────────────────────────
// WEB · prexxweb — 2 agents + form-based RAG recommender
// ─────────────────────────────────────────────────────────────────────────────
const WEB: Architecture = {
  id: "web",
  label: "web · 2 agents",
  viewBox: { w: 580, h: 220 },
  nodes: [
    { id: "user", label: "user", sub: "web", kind: "user", x: 8, y: 88, w: 60, h: 44 },
    { id: "orch", label: "orchestrator", sub: "langgraph", kind: "orchestrator", x: 80, y: 88, w: 116, h: 44 },
    { id: "welcome", label: "welcome agent", sub: "intent + form", kind: "agent", x: 208, y: 24, w: 140, h: 40 },
    { id: "support", label: "support agent", sub: "orders + escalate", kind: "agent", x: 208, y: 156, w: 140, h: 40 },
    { id: "rag", label: "rag · vertex ai", sub: "embeddings + llm", kind: "knowledge", x: 360, y: 24, w: 140, h: 40 },
    { id: "supabase", label: "supabase", sub: "users · orders", kind: "db", x: 360, y: 156, w: 140, h: 40 },
  ],
  edges: [
    { from: "user", to: "orch", role: "request", delay: 0 },
    { from: "orch", to: "welcome", role: "request", delay: 0.3 },
    { from: "orch", to: "support", role: "request", delay: 0.5 },
    { from: "welcome", to: "rag", role: "retrieve", delay: 0.75 },
    { from: "support", to: "supabase", role: "retrieve", delay: 0.9 },
  ],
  footer: "cloud run · vertex ai · supabase · gemini → openai",
};

// ─────────────────────────────────────────────────────────────────────────────
// WHATSAPP · whatsappbot — 4 agents (recommendations are a tool of welcome,
// not a separate agent). supabase is shared across commerce / support / async.
// ─────────────────────────────────────────────────────────────────────────────
const WA: Architecture = {
  id: "whatsapp",
  label: "whatsapp · 4 agents",
  viewBox: { w: 600, h: 280 },
  nodes: [
    { id: "user", label: "whatsapp", sub: "webhook", kind: "user", x: 8, y: 118, w: 76, h: 44 },
    { id: "orch", label: "orchestrator", sub: "langgraph", kind: "orchestrator", x: 100, y: 118, w: 120, h: 44 },
    { id: "welcome", label: "welcome", sub: "search + reco", kind: "agent", x: 236, y: 14, w: 140, h: 36 },
    { id: "commerce", label: "commerce", sub: "checkout · cart", kind: "agent", x: 236, y: 78, w: 140, h: 36 },
    { id: "support", label: "support", sub: "orders · pdf", kind: "agent", x: 236, y: 142, w: 140, h: 36 },
    { id: "async", label: "async order", sub: "oneclinik · video", kind: "agent", x: 236, y: 220, w: 140, h: 36 },
    { id: "rag", label: "rag", sub: "embeddings + llm", kind: "knowledge", x: 392, y: 14, w: 140, h: 36 },
    { id: "transbank", label: "transbank", sub: "payment", kind: "skill", x: 392, y: 78, w: 140, h: 36 },
    { id: "flows", label: "meta flows", sub: "forms · nodos", kind: "skill", x: 392, y: 142, w: 140, h: 36 },
    { id: "supabase", label: "supabase", sub: "users · pagos · orders", kind: "db", x: 392, y: 200, w: 140, h: 56 },
  ],
  edges: [
    { from: "user", to: "orch", role: "request", delay: 0 },
    { from: "orch", to: "welcome", role: "request", delay: 0.3 },
    { from: "orch", to: "commerce", role: "request", delay: 0.45 },
    { from: "orch", to: "support", role: "request", delay: 0.6 },
    { from: "orch", to: "async", role: "request", delay: 0.75 },
    { from: "welcome", to: "rag", role: "retrieve", delay: 0.9 },
    { from: "commerce", to: "transbank", role: "retrieve", delay: 1.0 },
    { from: "commerce", to: "flows", role: "retrieve", delay: 1.05 },
    { from: "async", to: "flows", role: "retrieve", delay: 1.15 },
    { from: "commerce", to: "supabase", role: "retrieve", delay: 1.2 },
    { from: "support", to: "supabase", role: "retrieve", delay: 1.25 },
    { from: "async", to: "supabase", role: "retrieve", delay: 1.3 },
  ],
  footer: "cloud run · whatsapp business · transbank · meta flows · supabase",
};

const ARCHITECTURES: Architecture[] = [WEB, WA];

const KIND_STYLES: Record<NodeKind, { bg: string; border: string; text: string }> = {
  user: { bg: "rgba(146, 146, 146, 0.18)", border: "#3a3a3a", text: palette.text },
  orchestrator: { bg: "rgba(167, 139, 250, 0.16)", border: "rgba(167, 139, 250, 0.8)", text: palette.violet },
  agent: { bg: "rgba(34, 211, 238, 0.14)", border: "rgba(34, 211, 238, 0.75)", text: palette.cyan },
  knowledge: { bg: "rgba(244, 114, 182, 0.14)", border: "rgba(244, 114, 182, 0.7)", text: palette.magenta },
  skill: { bg: "rgba(163, 230, 53, 0.14)", border: "rgba(163, 230, 53, 0.7)", text: palette.lime },
  db: { bg: "rgba(96, 165, 250, 0.14)", border: "rgba(96, 165, 250, 0.7)", text: palette.blue },
  component: { bg: "rgba(251, 146, 60, 0.14)", border: "rgba(251, 146, 60, 0.7)", text: palette.amber },
};

const ROLE_COLORS: Record<NonNullable<Edge["role"]>, string> = {
  request: palette.cyan,
  retrieve: palette.magenta,
  respond: palette.lime,
};

function buildPath(a: Node, b: Node): string {
  const sx = a.x + a.w;
  const sy = a.y + a.h / 2;
  const tx = b.x;
  const ty = b.y + b.h / 2;
  const dx = tx - sx;
  const cp1x = sx + dx * 0.5;
  const cp1y = sy;
  const cp2x = sx + dx * 0.5;
  const cp2y = ty;
  return `M ${sx} ${sy} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${tx} ${ty}`;
}

export function AgentGraph() {
  const [archIdx, setArchIdx] = useState(0);
  const [hovered, setHovered] = useState<string | null>(null);
  const [ref] = useInView<HTMLDivElement>({ threshold: 0.25 });
  const reduced = usePrefersReducedMotion();
  const gradId = useId();

  const arch = ARCHITECTURES[archIdx];

  const nodeMap = useMemo(
    () => new Map(arch.nodes.map((n) => [n.id, n])),
    [arch],
  );

  const highlightedNodes = useMemo(() => {
    if (!hovered) return null;
    const set = new Set([hovered]);
    arch.edges.forEach((e) => {
      if (e.from === hovered) set.add(e.to);
      if (e.to === hovered) set.add(e.from);
    });
    return set;
  }, [hovered, arch]);

  return (
    <div ref={ref} className="space-y-3 min-w-0 max-w-full">
      <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-2 sm:gap-3">
        <div className="font-mono text-[11px] uppercase tracking-wider text-[var(--foreground-muted)]">
          multi-agent · langgraph
        </div>
        <div
          role="tablist"
          aria-label="Architecture"
          className="inline-flex self-start sm:self-auto border border-[var(--border)] rounded overflow-hidden"
        >
          {ARCHITECTURES.map((a, i) => {
            const active = i === archIdx;
            return (
              <button
                key={a.id}
                role="tab"
                aria-selected={active}
                onClick={() => {
                  setArchIdx(i);
                  setHovered(null);
                }}
                className={
                  "px-2 py-0.5 font-mono text-[10px] transition-colors whitespace-nowrap " +
                  (active
                    ? "bg-[var(--accent)]/15 text-[var(--accent)]"
                    : "text-[var(--foreground-muted)] hover:text-[var(--foreground)]")
                }
              >
                {a.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="relative bg-[var(--surface)] border border-[var(--border)] rounded">
        <div className="overflow-x-auto sm:overflow-visible p-2 sm:aspect-[5/3] sm:w-full">
          <svg
            key={arch.id}
            viewBox={`0 0 ${arch.viewBox.w} ${arch.viewBox.h}`}
            className="block w-full h-auto min-w-[440px] sm:min-w-0 sm:h-full"
            preserveAspectRatio="xMidYMid meet"
            role="img"
            aria-label={`${arch.label}: LangGraph multi-agent architecture`}
          >
          <defs>
            {(["request", "retrieve", "respond"] as const).map((role) => (
              <marker
                key={role}
                id={`${gradId}-${arch.id}-${role}-head`}
                viewBox="0 0 8 8"
                refX="6"
                refY="4"
                markerWidth="5"
                markerHeight="5"
                orient="auto"
                markerUnits="strokeWidth"
              >
                <path d="M0,0 L7,4 L0,8 Z" fill={ROLE_COLORS[role]} opacity={0.95} />
              </marker>
            ))}
          </defs>

          {arch.edges.map((e, i) => {
            const a = nodeMap.get(e.from)!;
            const b = nodeMap.get(e.to)!;
            const d = buildPath(a, b);
            const role = e.role ?? "request";
            const dimmed =
              highlightedNodes && !(highlightedNodes.has(e.from) && highlightedNodes.has(e.to));
            return (
              <g
                key={`${arch.id}-edge-${i}`}
                opacity={dimmed ? 0.15 : 1}
                style={{ transition: "opacity 200ms" }}
              >
                <path
                  d={d}
                  fill="none"
                  stroke={ROLE_COLORS[role]}
                  strokeOpacity={0.7}
                  strokeWidth={1.4}
                  markerEnd={`url(#${gradId}-${arch.id}-${role}-head)`}
                />
                {!reduced && (
                  <Token
                    d={d}
                    color={ROLE_COLORS[role]}
                    delay={(e.delay ?? 0) * 0.45 + i * 0.15}
                  />
                )}
              </g>
            );
          })}

          {arch.nodes.map((n) => {
            const s = KIND_STYLES[n.kind];
            const isDim = highlightedNodes && !highlightedNodes.has(n.id);
            const isHover = hovered === n.id;
            return (
              <motion.g
                key={`${arch.id}-${n.id}`}
                onMouseEnter={() => setHovered(n.id)}
                onMouseLeave={() => setHovered(null)}
                onFocus={() => setHovered(n.id)}
                onBlur={() => setHovered(null)}
                tabIndex={0}
                style={{ cursor: "pointer", outline: "none" }}
                initial={{ opacity: 1 }}
                animate={{ opacity: isDim ? 0.35 : 1 }}
                transition={{ duration: 0.25 }}
              >
                <rect
                  x={n.x}
                  y={n.y}
                  width={n.w}
                  height={n.h}
                  rx={6}
                  fill={s.bg}
                  stroke={s.border}
                  strokeWidth={isHover ? 1.8 : 1}
                  style={{
                    filter: isHover ? `drop-shadow(0 0 8px ${s.border})` : undefined,
                    transition: "stroke-width 200ms, filter 200ms",
                  }}
                />
                <text
                  x={n.x + n.w / 2}
                  y={n.sub ? n.y + n.h / 2 - 1 : n.y + n.h / 2 + 4}
                  textAnchor="middle"
                  fill={s.text}
                  fontSize="10"
                  fontFamily="var(--font-mono)"
                  fontWeight="500"
                  style={{ pointerEvents: "none" }}
                >
                  {n.label}
                </text>
                {n.sub && (
                  <text
                    x={n.x + n.w / 2}
                    y={n.y + n.h / 2 + 11}
                    textAnchor="middle"
                    fill={palette.textMuted}
                    fontSize="8"
                    fontFamily="var(--font-mono)"
                    style={{ pointerEvents: "none" }}
                  >
                    {n.sub}
                  </text>
                )}
              </motion.g>
            );
          })}
          </svg>
        </div>
        {/* mobile swipe affordance — fade on the right edge */}
        <div
          aria-hidden
          className="sm:hidden pointer-events-none absolute top-0 bottom-0 right-0 w-12 rounded-r"
          style={{
            background:
              "linear-gradient(to right, transparent 0%, var(--surface) 90%)",
          }}
        />
        <div
          aria-hidden
          className="sm:hidden pointer-events-none absolute bottom-1 right-1.5 font-mono text-[9px] text-[var(--foreground-muted)] flex items-center gap-1"
        >
          <span>swipe</span>
          <span>→</span>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 font-mono text-[10px] text-[var(--foreground-muted)]">
        <Legend color={ROLE_COLORS.request} label="request" />
        <Legend color={ROLE_COLORS.retrieve} label="retrieve" />
        <span className="ml-auto truncate">{arch.footer}</span>
      </div>
    </div>
  );
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className="block w-3 h-px" style={{ background: color }} />
      {label}
    </span>
  );
}

function Token({ d, color, delay }: { d: string; color: string; delay: number }) {
  return (
    <circle r={2.5} fill={color} opacity={0.95} style={{ filter: `drop-shadow(0 0 4px ${color})` }}>
      <animateMotion path={d} dur="3.2s" begin={`${delay}s`} repeatCount="indefinite" rotate="auto" />
    </circle>
  );
}
