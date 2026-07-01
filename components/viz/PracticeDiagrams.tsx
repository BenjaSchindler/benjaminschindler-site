"use client";

import { useId } from "react";
import { palette } from "./primitives/colors";
import { usePrefersReducedMotion } from "./primitives/useInView";

/**
 * Four small concept diagrams for the AI Engineering Practice section.
 * Shared system: 300×88 viewBox, hairline strokes, 8px mono labels,
 * blue (--accent) for structure, orange (--accent-warm) as the single
 * highlight, slate as the neutral second fill. Illustrative only — no
 * invented measurements; real numbers live in the evidence text.
 */

const MONO = "var(--font-mono)";
const BLUE = palette.green; // scikit blue (see colors.ts)
const ORANGE = palette.orange;

function Frame({ children, label }: { children: React.ReactNode; label: string }) {
  return (
    <div className="h-[104px] rounded border border-[var(--border)] bg-[var(--surface-raised)]/60 overflow-hidden">
      <svg
        viewBox="0 0 300 88"
        className="block w-full h-full"
        preserveAspectRatio="xMidYMid meet"
        role="img"
        aria-label={label}
      >
        {children}
      </svg>
    </div>
  );
}

// ── Harness: in → guard → model (⇄ tools, ⇄ state) → out ────────────────────
export function HarnessDiagram() {
  const reduced = usePrefersReducedMotion();
  const id = useId();
  const railY = 46;

  const box = (
    x: number,
    y: number,
    w: number,
    h: number,
    stroke: string,
    fill: string,
  ) => (
    <rect x={x} y={y} width={w} height={h} rx={5} fill={fill} stroke={stroke} strokeWidth={1} />
  );

  return (
    <Frame label="Harness schematic: input passes a guardrail into the model, which calls tools and state, then responds">
      <defs>
        <marker
          id={`${id}-arrow`}
          viewBox="0 0 8 8"
          refX="6"
          refY="4"
          markerWidth="5"
          markerHeight="5"
          orient="auto"
        >
          <path d="M0,0 L7,4 L0,8 Z" fill={BLUE} opacity={0.8} />
        </marker>
      </defs>

      {/* main rail + vertical links (drawn first, under the boxes) */}
      <line
        x1={6}
        y1={railY}
        x2={292}
        y2={railY}
        stroke={BLUE}
        strokeOpacity={0.5}
        strokeWidth={1.2}
        markerEnd={`url(#${id}-arrow)`}
      />
      <line x1={150} y1={22} x2={150} y2={32} stroke={BLUE} strokeOpacity={0.35} strokeWidth={1} />
      <line x1={150} y1={60} x2={150} y2={66} stroke={BLUE} strokeOpacity={0.35} strokeWidth={1} />

      {/* token traveling the rail — passes under the components */}
      {!reduced && (
        <circle r={2.4} fill={ORANGE} opacity={0.95} style={{ filter: `drop-shadow(0 0 4px ${ORANGE})` }}>
          <animateMotion path={`M6 ${railY} H292`} dur="4.2s" repeatCount="indefinite" />
        </circle>
      )}

      {box(34, 36, 48, 20, "rgba(52, 153, 205, 0.7)", "rgba(52, 153, 205, 0.10)")}
      {box(118, 32, 64, 28, "rgba(247, 147, 30, 0.85)", "rgba(247, 147, 30, 0.08)")}
      {box(120, 6, 60, 16, "rgba(52, 153, 205, 0.45)", "rgba(52, 153, 205, 0.06)")}
      {box(120, 66, 60, 16, "rgba(52, 153, 205, 0.45)", "rgba(52, 153, 205, 0.06)")}

      <text x={6} y={40} fontSize={8} fontFamily={MONO} fill={palette.textMuted}>
        in
      </text>
      <text x={292} y={40} fontSize={8} fontFamily={MONO} fill={palette.textMuted} textAnchor="end">
        out
      </text>
      <text x={58} y={49} fontSize={8} fontFamily={MONO} fill={palette.textDim} textAnchor="middle">
        guard
      </text>
      <text x={150} y={49} fontSize={9} fontFamily={MONO} fontWeight={500} fill={ORANGE} textAnchor="middle">
        model
      </text>
      <text x={150} y={17} fontSize={8} fontFamily={MONO} fill={palette.textMuted} textAnchor="middle">
        tools
      </text>
      <text x={150} y={77} fontSize={8} fontFamily={MONO} fill={palette.textMuted} textAnchor="middle">
        state
      </text>
    </Frame>
  );
}

// ── Prompt engineering: a versioned diff, not a string edit ──────────────────
export function PromptDiffDiagram() {
  return (
    <div
      className="h-[104px] rounded border border-[var(--border)] bg-[var(--surface-raised)]/60 px-3.5 flex flex-col justify-center gap-[3px] font-mono text-[10px] leading-[1.5] overflow-hidden"
      aria-label="Prompt diff: version 13 to 14 replaces a broad instruction with constraints, worked examples, and an output schema"
    >
      <div className="flex items-baseline justify-between text-[var(--foreground-muted)]">
        <span className="truncate">prompts/system.md</span>
        <span className="shrink-0">
          v13 <span className="text-[var(--accent-warm)]">→ v14</span>
        </span>
      </div>
      <div className="text-[#f87171]/90 truncate">− &quot;answer the user helpfully…&quot;</div>
      <div className="text-[#a3e635]/90 truncate">+ role · hard constraints · tone bounds</div>
      <div className="text-[#a3e635]/90 truncate">+ 2 worked examples · output schema</div>
      <div className="text-[var(--foreground-muted)] truncate">
        cached · A/B 50/50 · judge <span className="text-[var(--accent)]">✓</span>
      </div>
    </div>
  );
}

// ── Co-evolution: behavior shifts from harness code into the model ──────────
export function CoEvolutionDiagram() {
  const rows = [
    { label: "gen n−1", model: 0.38 },
    { label: "gen n", model: 0.6 },
    { label: "gen n+1", model: 0.78 },
  ];
  const x0 = 50;
  const x1 = 294;
  const gap = 2;

  return (
    <Frame label="Across model generations, the share of system behavior owned by the model grows and harness code is retired">
      {rows.map((r, i) => {
        const y = 10 + i * 24;
        const total = x1 - x0;
        const mw = Math.round(total * r.model);
        return (
          <g key={r.label}>
            <text x={44} y={y + 11} fontSize={8} fontFamily={MONO} fill={palette.textMuted} textAnchor="end">
              {r.label}
            </text>
            <rect x={x0} y={y} width={mw} height={15} rx={2} fill={BLUE} opacity={0.78} />
            <rect x={x0 + mw + gap} y={y} width={total - mw - gap} height={15} rx={2} fill={palette.borderStrong} opacity={0.5} />
            {i === 0 && (
              <>
                <text x={x0 + 5} y={y + 11} fontSize={8} fontFamily={MONO} fill={palette.bg} fontWeight={600}>
                  model
                </text>
                <text x={x0 + mw + gap + 5} y={y + 11} fontSize={8} fontFamily={MONO} fill={palette.textDim}>
                  harness
                </text>
              </>
            )}
          </g>
        );
      })}
      <text x={x0} y={86} fontSize={8} fontFamily={MONO} fill={palette.textMuted}>
        behavior owned by the model grows per generation
      </text>
    </Frame>
  );
}

// ── Evals: judge score climbs, release ships once it clears the gate ────────
export function EvalGateDiagram() {
  const pts = "8,68 44,61 80,64 116,52 152,56 188,42 224,32 268,20";
  const gateY = 36;

  return (
    <Frame label="Evaluation runs: an LLM-judge score rises across runs and the release ships once it clears the gate">
      <text x={8} y={13} fontSize={8} fontFamily={MONO} fill={palette.textMuted}>
        llm-judge score
      </text>

      {/* baseline + gate threshold */}
      <line x1={8} y1={76} x2={294} y2={76} stroke={palette.border} strokeWidth={1} />
      <line
        x1={8}
        y1={gateY}
        x2={268}
        y2={gateY}
        stroke={palette.borderStrong}
        strokeWidth={1}
        strokeDasharray="3 3"
      />
      <text x={272} y={gateY + 3} fontSize={8} fontFamily={MONO} fill={palette.textMuted}>
        gate
      </text>

      <polygon points={`${pts} 268,76 8,76`} fill={BLUE} opacity={0.07} />
      <polyline
        points={pts}
        fill="none"
        stroke={BLUE}
        strokeWidth={1.6}
        strokeLinejoin="round"
        strokeLinecap="round"
      />

      <circle cx={268} cy={20} r={3} fill={ORANGE} style={{ filter: `drop-shadow(0 0 5px ${ORANGE})` }} />
      <text x={260} y={17} fontSize={8} fontFamily={MONO} fill={ORANGE} textAnchor="end">
        ship
      </text>
    </Frame>
  );
}
