"use client";

import { useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { buildThesisScatter } from "@/lib/synthetic";
import { palette, classColors } from "./primitives/colors";
import { DemoControls, useDemoPlayback } from "./primitives/DemoPlayback";
import { ThesisResultsBars } from "./ThesisResultsBars";
import { useLanguage } from "@/lib/Language";
import type { ThesisResultId } from "@/lib/data";

type Mode = "anchors" | "smote" | "llm" | "filter" | "weights";

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
  const { lang } = useLanguage();
  const es = lang === "es";
  const MODES: Array<{ id: Mode; label: string; resultId: ThesisResultId | null; narration: string }> = [
    { id: "anchors", label: es ? "Ejemplos" : "Examples", resultId: null, narration: es ? "10 ejemplos reales de la clase minoritaria: muy pocos para entrenar." : "10 real examples of the minority class: too few to train on." },
    { id: "smote", label: "SMOTE", resultId: "smote", narration: es ? "SMOTE interpola entre pares de ejemplos reales: solo rellena el espacio entre ellos." : "SMOTE interpolates between pairs of real examples: it only fills the space between them." },
    { id: "llm", label: "LLM", resultId: null, narration: es ? "Un LLM redacta candidatos nuevos. La mayoría cae cerca de la clase; algunos se desvían hacia otras." : "An LLM writes new candidates. Most land near the class; some drift toward other classes." },
    { id: "filter", label: es ? "LLM + filtro" : "LLM + filter", resultId: "binary-filter", narration: es ? "Se mide la distancia de cada candidato a su ejemplo real más cercano y se conservan los más cercanos." : "Each candidate is measured against its nearest real example, and the closest ones are kept." },
    { id: "weights", label: es ? "Ponderación" : "Weighting", resultId: "soft-weighting", narration: es ? "Ponderación suave: los conservados entrenan con más peso cuanto más cerca están." : "Soft weighting: kept candidates count more in training the closer they are." },
  ];
  const [ref, demo] = useDemoPlayback(MODES.length, 2600);
  const activeMode = MODES[demo.step];
  const mode = activeMode.id;
  const reduced = demo.reduced;
  const dataset = useMemo(() => buildThesisScatter(17), []);
  const anchorById = useMemo(
    () => new Map(dataset.points.filter((p) => p.kind === "anchor").map((p) => [p.id, p])),
    [dataset.points],
  );
  const candidates = dataset.points.filter((p) => p.kind === "llm");
  const showCandidates = mode === "llm" || mode === "filter" || mode === "weights";

  return (
    <div ref={ref} className="space-y-4">
      {/* Mode selector — also the step list of the guided tour */}
      <div role="group" aria-label={es ? "Método de aumento de datos" : "Data augmentation method"} className="flex flex-wrap gap-2 text-xs">
        {MODES.map((m, i) => (
          <button
            key={m.id}
            type="button"
            onClick={() => demo.seek(i)}
            aria-pressed={mode === m.id}
            className={`min-h-10 px-3 py-2 rounded-md border transition-colors ${
              mode === m.id
                ? "border-[var(--accent-warm)] text-[var(--accent-warm)] bg-[var(--accent-warm)]/10"
                : "border-[var(--border-strong)] text-[var(--foreground-muted)] hover:text-[var(--foreground-dim)]"
            }`}
          >
            <span className="mr-1.5 font-mono opacity-60">{i + 1}</span>{m.label}
          </button>
        ))}
      </div>

      <div className="rounded border border-[var(--border)] bg-[var(--surface)] overflow-hidden">
        <div className="grid sm:grid-cols-5 gap-0">
          {/* Scatter */}
          <div className="sm:col-span-3 p-2">
            <svg
              viewBox={`0 0 ${VIEW} ${VIEW}`}
              className="w-full aspect-square max-h-[420px]"
              role="img"
              aria-label={es ? `Esquema de embeddings: ${activeMode.label}. Puntos simulados.` : `Embedding illustration: ${activeMode.label}. Simulated points.`}
            >
              {/* Faint grid */}
              <g opacity={0.25}>
                {[0.25, 0.5, 0.75].map((t) => (
                  <g key={t}>
                    <line x1={t * VIEW} x2={t * VIEW} y1="0" y2={VIEW} stroke={palette.border} strokeWidth="1" />
                    <line x1="0" x2={VIEW} y1={t * VIEW} y2={t * VIEW} stroke={palette.border} strokeWidth="1" />
                  </g>
                ))}
              </g>

              {/* Other classes' clusters (always present, dim) */}
              {dataset.points
                .filter((p) => p.kind === "cluster")
                .map((p) => (
                  <circle key={p.id} cx={toX(p.x)} cy={toY(p.y)} r={2.6} fill={classColors[p.cls]} fillOpacity={0.35} />
                ))}

              {/* Distance from each candidate to its nearest real example — the filter's only criterion */}
              <AnimatePresence>
                {mode === "filter" &&
                  candidates.map((p, i) => {
                    const a = p.nearest ? anchorById.get(p.nearest) : undefined;
                    if (!a) return null;
                    return (
                      <motion.line
                        key={`d-${p.id}`}
                        x1={toX(p.x)}
                        y1={toY(p.y)}
                        x2={toX(a.x)}
                        y2={toY(a.y)}
                        stroke={p.kept ? palette.green : palette.textMuted}
                        strokeOpacity={p.kept ? 0.7 : 0.5}
                        strokeWidth={1}
                        strokeDasharray={p.kept ? undefined : "2 3"}
                        initial={reduced ? false : { pathLength: 0, opacity: 0 }}
                        animate={{ pathLength: 1, opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: reduced ? 0 : 0.5, delay: reduced ? 0 : i * 0.015 }}
                      />
                    );
                  })}
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
                        initial={reduced ? false : { pathLength: 0, opacity: 0 }}
                        animate={{ pathLength: 1, opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: reduced ? 0 : 0.45, delay: reduced ? 0 : i * 0.012 }}
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
                        initial={reduced ? false : { opacity: 0, scale: 0.4 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.4 }}
                        transition={{ duration: reduced ? 0 : 0.3, delay: reduced ? 0 : 0.2 + i * 0.025 }}
                        style={{ transformBox: "fill-box", transformOrigin: "center" }}
                      />
                    ))}
              </AnimatePresence>

              {/* LLM candidates (triangles). Weighting only applies to the kept set. */}
              <AnimatePresence>
                {showCandidates &&
                  candidates
                    .filter((p) => mode !== "weights" || p.kept)
                    .map((p, i) => {
                      const rejected = mode === "filter" && !p.kept;
                      const color = mode === "llm" ? palette.orange : rejected ? palette.textMuted : palette.green;
                      const weight = p.weight ?? 1;
                      return (
                        <motion.g
                          key={p.id}
                          initial={reduced ? false : { opacity: 0, scale: 0.4 }}
                          animate={{
                            opacity: mode === "weights" ? 0.25 + 0.75 * weight : rejected ? 0.35 : 1,
                            scale: mode === "weights" ? 0.7 + 0.6 * weight : 1,
                          }}
                          exit={{ opacity: 0, scale: 0.4 }}
                          transition={{ duration: reduced ? 0 : 0.4, delay: reduced ? 0 : i * 0.014 }}
                          style={{ transformBox: "fill-box", transformOrigin: "center" }}
                        >
                          <Triangle x={toX(p.x)} y={toY(p.y)} r={4.2} color={color} />
                          {rejected && (
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
                  <Star key={p.id} x={toX(p.x)} y={toY(p.y)} r={6} color={palette.orange} />
                ))}
            </svg>

            <div className="mt-2 min-h-16 px-2" aria-live="polite">
              <p className="text-sm leading-relaxed text-[var(--foreground)]">
                <span className="mr-2 font-mono text-xs text-[var(--accent-warm)]">{demo.step + 1}/{MODES.length}</span>
                {activeMode.narration}
              </p>
              {mode === "weights" && <p className="mt-1 text-xs text-[var(--foreground-muted)]">{es ? "Tamaño y opacidad ilustran el peso; no son pesos medidos." : "Size and opacity illustrate the weight; they are not measured weights."}</p>}
            </div>
          </div>

          {/* Side panel: results bars + legend */}
          <div className="sm:col-span-2 p-3 bg-[var(--surface-raised)] border-t sm:border-t-0 sm:border-l border-[var(--border)] flex flex-col gap-3">
            <ThesisResultsBars highlightId={activeMode.resultId} />

            <div className="rounded border border-[var(--border)] bg-[var(--surface)] p-3">
              <div className="text-xs uppercase tracking-wider text-[var(--foreground-muted)] mb-2">
                {es ? "Leyenda" : "Legend"}
              </div>
              <ul className="space-y-1.5 text-xs text-[var(--foreground-dim)]">
                <LegendRow icon={<MiniStar color={palette.orange} />} label={es ? "Ejemplo real (×10)" : "Real example (×10)"} />
                <LegendRow icon={<MiniSquare color={palette.cyan} />} label={es ? "Punto SMOTE" : "SMOTE point"} />
                <LegendRow icon={<MiniTriangle color={palette.orange} />} label={es ? "Candidato LLM" : "LLM candidate"} />
                <LegendRow icon={<MiniTriangle color={palette.green} />} label={es ? "Conservado" : "Kept"} />
                <LegendRow icon={<MiniTriangle color={palette.textMuted} muted />} label={es ? "Descartado" : "Rejected"} />
                <LegendRow icon={<MiniClasses />} label={es ? "Otras clases" : "Other classes"} />
              </ul>
            </div>
          </div>
        </div>
        <DemoControls playback={demo} label={es ? "Esquema ilustrativo · puntos simulados" : "Illustrative scheme · simulated points"} />
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
function MiniClasses() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12">
      <circle cx="3.5" cy="4" r="2" fill={classColors[0]} fillOpacity="0.6" />
      <circle cx="8.5" cy="4" r="2" fill={classColors[1]} fillOpacity="0.6" />
      <circle cx="6" cy="8.5" r="2" fill={classColors[4]} fillOpacity="0.6" />
    </svg>
  );
}
