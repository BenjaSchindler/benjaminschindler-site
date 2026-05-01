"use client";

import { useId, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { buildThesisScatter } from "@/lib/synthetic";
import { palette, classColors } from "./primitives/colors";
import { ThesisResultsBars } from "./ThesisResultsBars";

type Mode = "anchors" | "smote" | "llm" | "filter";

const MODES: Array<{ id: Mode; label: string; resultMethod: string | null; tagline: string }> = [
  { id: "anchors", label: "anchors", resultMethod: null, tagline: "10 real samples · the starting point" },
  { id: "smote", label: "smote", resultMethod: "SMOTE (ref.)", tagline: "linear interpolation · controlled but no text" },
  { id: "llm", label: "llm raw", resultMethod: null, tagline: "fluid text · uncontrolled geometry" },
  { id: "filter", label: "llm + filter", resultMethod: "Soft weighting", tagline: "ours · keep only points in the safe region" },
];

const VIEW = 320; // SVG square viewBox size

// Convert dataset coordinates [-1, 1] to SVG pixel space with padding
function toX(x: number) {
  const pad = 12;
  return pad + ((x + 1) / 2) * (VIEW - pad * 2);
}
function toY(y: number) {
  const pad = 12;
  // Flip Y so positive goes up
  return VIEW - (pad + ((y + 1) / 2) * (VIEW - pad * 2));
}

export function ThesisScatter() {
  const [mode, setMode] = useState<Mode>("anchors");
  const dataset = useMemo(() => buildThesisScatter(17), []);
  const id = useId();
  const radiusInPx = (dataset.filterRadius / 2) * (VIEW - 24);

  const minorityCenterPx = {
    x: toX(dataset.minorityCentroid.x),
    y: toY(dataset.minorityCentroid.y),
  };

  const anchorById = useMemo(
    () => new Map(dataset.points.filter((p) => p.kind === "anchor").map((p) => [p.id, p])),
    [dataset.points],
  );

  const activeMode = MODES.find((m) => m.id === mode)!;

  return (
    <div className="space-y-3">
      {/* Mode selector */}
      <div className="flex flex-wrap gap-1.5 font-mono text-[10px]">
        {MODES.map((m) => (
          <button
            key={m.id}
            onClick={() => setMode(m.id)}
            className={`px-2.5 py-1 rounded border transition-all ${
              mode === m.id
                ? "border-[var(--accent-warm)] text-[var(--accent-warm)] bg-[var(--accent-warm)]/10 shadow-[0_0_12px_rgba(255,107,53,0.25)]"
                : "border-[var(--border-strong)] text-[var(--foreground-muted)] hover:text-[var(--foreground-dim)]"
            }`}
          >
            {m.label}
          </button>
        ))}
      </div>

      <div className="rounded border border-[var(--border)] bg-[var(--surface)] overflow-hidden">
        <div className="grid sm:grid-cols-5 gap-0">
          {/* Scatter */}
          <div className="sm:col-span-3 p-2">
            <svg
              viewBox={`0 0 ${VIEW} ${VIEW}`}
              className="w-full aspect-square"
              role="img"
              aria-label="Embedding-space scatter showing anchors, SMOTE midpoints, and LLM candidates with geometric filtering"
            >
              <defs>
                <radialGradient id={`${id}-glow`} cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor={palette.orange} stopOpacity="0.18" />
                  <stop offset="100%" stopColor={palette.orange} stopOpacity="0" />
                </radialGradient>
              </defs>

              {/* Faint grid */}
              <g opacity={0.25}>
                {[0.25, 0.5, 0.75].map((t) => (
                  <line
                    key={`vg${t}`}
                    x1={t * VIEW}
                    x2={t * VIEW}
                    y1="0"
                    y2={VIEW}
                    stroke={palette.border}
                    strokeWidth="1"
                  />
                ))}
                {[0.25, 0.5, 0.75].map((t) => (
                  <line
                    key={`hg${t}`}
                    x1="0"
                    x2={VIEW}
                    y1={t * VIEW}
                    y2={t * VIEW}
                    stroke={palette.border}
                    strokeWidth="1"
                  />
                ))}
              </g>

              {/* Other classes' clusters (always present, dim) */}
              {dataset.points
                .filter((p) => p.kind === "cluster")
                .map((p) => (
                  <circle
                    key={p.id}
                    cx={toX(p.x)}
                    cy={toY(p.y)}
                    r={2.6}
                    fill={classColors[p.cls]}
                    fillOpacity={0.35}
                  />
                ))}

              {/* Filter radius — visible in 'filter' and 'llm' modes */}
              <AnimatePresence>
                {(mode === "filter" || mode === "llm") && (
                  <motion.g
                    key="filter-ring"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4 }}
                  >
                    <circle
                      cx={minorityCenterPx.x}
                      cy={minorityCenterPx.y}
                      r={radiusInPx}
                      fill={`url(#${id}-glow)`}
                    />
                    <circle
                      cx={minorityCenterPx.x}
                      cy={minorityCenterPx.y}
                      r={radiusInPx}
                      fill="none"
                      stroke={palette.orange}
                      strokeOpacity={0.5}
                      strokeWidth={1}
                      strokeDasharray="3 3"
                    />
                    <text
                      x={minorityCenterPx.x + radiusInPx + 4}
                      y={minorityCenterPx.y - radiusInPx + 2}
                      fontSize="9"
                      fontFamily="var(--font-mono)"
                      fill={palette.orange}
                      opacity={0.85}
                    >
                      filter radius
                    </text>
                  </motion.g>
                )}
              </AnimatePresence>

              {/* SMOTE pair lines */}
              <AnimatePresence>
                {mode === "smote" &&
                  dataset.smotePairs.map(([aId, bId], i) => {
                    const a = anchorById.get(aId);
                    const b = anchorById.get(bId);
                    if (!a || !b) return null;
                    return (
                      <motion.line
                        key={`pair-${i}`}
                        x1={toX(a.x)}
                        y1={toY(a.y)}
                        x2={toX(b.x)}
                        y2={toY(b.y)}
                        stroke={palette.cyan}
                        strokeOpacity={0.28}
                        strokeWidth={1}
                        strokeDasharray="2 3"
                        initial={{ pathLength: 0, opacity: 0 }}
                        animate={{ pathLength: 1, opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.45, delay: i * 0.012 }}
                      />
                    );
                  })}
              </AnimatePresence>

              {/* SMOTE midpoints (squares) */}
              <AnimatePresence>
                {mode === "smote" &&
                  dataset.points
                    .filter((p) => p.kind === "smote")
                    .map((p, i) => (
                      <motion.rect
                        key={p.id}
                        x={toX(p.x) - 3}
                        y={toY(p.y) - 3}
                        width={6}
                        height={6}
                        fill="none"
                        stroke={palette.cyan}
                        strokeWidth={1.4}
                        initial={{ opacity: 0, scale: 0.4 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.4 }}
                        transition={{ duration: 0.3, delay: 0.2 + i * 0.025 }}
                        style={{ transformBox: "fill-box", transformOrigin: "center" }}
                      />
                    ))}
              </AnimatePresence>

              {/* LLM candidates (triangles) */}
              <AnimatePresence>
                {(mode === "llm" || mode === "filter") &&
                  dataset.points
                    .filter((p) => p.kind === "llm")
                    .map((p, i) => {
                      const filtered = mode === "filter" && !p.kept;
                      const color = filtered
                        ? palette.textMuted
                        : mode === "filter"
                          ? palette.green
                          : palette.orange;
                      return (
                        <motion.g
                          key={p.id}
                          initial={{ opacity: 0, scale: 0.4 }}
                          animate={{
                            opacity: filtered ? 0.18 : 1,
                            scale: 1,
                          }}
                          exit={{ opacity: 0, scale: 0.4 }}
                          transition={{ duration: 0.4, delay: i * 0.014 }}
                          style={{ transformBox: "fill-box", transformOrigin: "center" }}
                        >
                          <Triangle x={toX(p.x)} y={toY(p.y)} r={4.2} color={color} />
                          {filtered && (
                            <line
                              x1={toX(p.x) - 3}
                              y1={toY(p.y) - 3}
                              x2={toX(p.x) + 3}
                              y2={toY(p.y) + 3}
                              stroke={palette.textMuted}
                              strokeWidth={0.8}
                              opacity={0.7}
                            />
                          )}
                        </motion.g>
                      );
                    })}
              </AnimatePresence>

              {/* Anchors (stars) — always visible, on top */}
              {dataset.points
                .filter((p) => p.kind === "anchor")
                .map((p) => (
                  <Star
                    key={p.id}
                    x={toX(p.x)}
                    y={toY(p.y)}
                    r={6}
                    color={palette.orange}
                  />
                ))}
            </svg>

            <div className="mt-1 px-1 font-mono text-[10px] text-[var(--foreground-dim)]">
              <span className="text-[var(--accent-warm)]">{activeMode.label}</span>
              <span className="text-[var(--foreground-muted)]"> · {activeMode.tagline}</span>
            </div>
          </div>

          {/* Side panel: results bars + legend */}
          <div className="sm:col-span-2 p-3 bg-[var(--surface-raised)] border-t sm:border-t-0 sm:border-l border-[var(--border)] flex flex-col gap-3">
            <ThesisResultsBars highlightMethod={activeMode.resultMethod} />

            <div className="rounded border border-[var(--border)] bg-[var(--surface)] p-3">
              <div className="font-mono text-[10px] uppercase tracking-wider text-[var(--foreground-muted)] mb-2">
                legend
              </div>
              <ul className="space-y-1.5 font-mono text-[10px] text-[var(--foreground-dim)]">
                <LegendRow icon={<MiniStar color={palette.orange} />} label="real anchor (×10)" />
                <LegendRow icon={<MiniSquare color={palette.cyan} />} label="smote midpoint" />
                <LegendRow icon={<MiniTriangle color={palette.orange} />} label="llm candidate" />
                <LegendRow icon={<MiniTriangle color={palette.green} />} label="kept by filter" />
                <LegendRow icon={<MiniTriangle color={palette.textMuted} muted />} label="rejected" />
                <LegendRow icon={<MiniDot color={palette.cyan} />} label="other classes" />
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Glyphs ───────────────────────────────────────────────────────────────────

function Star({ x, y, r, color }: { x: number; y: number; r: number; color: string }) {
  // 5-point star
  const points: string[] = [];
  for (let i = 0; i < 10; i++) {
    const angle = (Math.PI * 2 * i) / 10 - Math.PI / 2;
    const radius = i % 2 === 0 ? r : r * 0.45;
    points.push(`${x + Math.cos(angle) * radius},${y + Math.sin(angle) * radius}`);
  }
  return (
    <polygon
      points={points.join(" ")}
      fill={color}
      stroke={palette.bg}
      strokeWidth={1}
      style={{ filter: `drop-shadow(0 0 4px ${color}80)` }}
    />
  );
}

function Triangle({ x, y, r, color }: { x: number; y: number; r: number; color: string }) {
  const h = r * 1.732; // equilateral
  return (
    <polygon
      points={`${x},${y - r} ${x + h / 2},${y + r / 2} ${x - h / 2},${y + r / 2}`}
      fill={color}
      fillOpacity={0.85}
    />
  );
}

function LegendRow({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <li className="flex items-center gap-2">
      <span className="size-3 inline-flex items-center justify-center">{icon}</span>
      <span>{label}</span>
    </li>
  );
}

function MiniStar({ color }: { color: string }) {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12">
      <Star x={6} y={6} r={5} color={color} />
    </svg>
  );
}
function MiniSquare({ color }: { color: string }) {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12">
      <rect x="2" y="2" width="8" height="8" fill="none" stroke={color} strokeWidth="1.4" />
    </svg>
  );
}
function MiniTriangle({ color, muted }: { color: string; muted?: boolean }) {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12">
      <Triangle x={6} y={6} r={5} color={color} />
      {muted && <line x1="2" y1="2" x2="10" y2="10" stroke={color} strokeWidth="0.8" />}
    </svg>
  );
}
function MiniDot({ color }: { color: string }) {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12">
      <circle cx="6" cy="6" r="3" fill={color} fillOpacity="0.5" />
    </svg>
  );
}
