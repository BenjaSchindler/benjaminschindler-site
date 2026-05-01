"use client";

import { motion } from "framer-motion";
import { thesis } from "@/lib/data";
import { palette } from "./primitives/colors";

type Props = {
  highlightMethod?: string | null;
};

const COLOR_FOR_METHOD: Record<string, string> = {
  "Soft weighting": palette.orange,
  "Binary filter": palette.amber,
  "SMOTE (ref.)": palette.textMuted,
  EDA: palette.textMuted,
  "Inverse trans.": palette.textMuted,
};

export function ThesisResultsBars({ highlightMethod }: Props) {
  // Range used to scale bars: cover both negatives and positives symmetrically.
  const maxAbs = Math.max(...thesis.results.map((r) => Math.abs(r.delta)));
  const span = maxAbs * 1.2;

  return (
    <div className="rounded border border-[var(--border)] bg-[var(--surface)] p-3">
      <div className="font-mono text-[10px] uppercase tracking-wider text-[var(--foreground-muted)] mb-2">
        ΔF1 vs SMOTE · pp
      </div>
      <ul className="space-y-1.5">
        {thesis.results.map((r) => {
          const isHighlighted = highlightMethod === r.method;
          const isPositive = r.delta > 0;
          const barWidthPct = (Math.abs(r.delta) / span) * 50; // % of half-range
          const color = COLOR_FOR_METHOD[r.method] ?? palette.textDim;
          return (
            <li key={r.method} className="flex items-center gap-2">
              <div
                className="font-mono text-[10px] w-24 truncate"
                style={{
                  color: isHighlighted
                    ? palette.text
                    : r.isOurs
                      ? palette.textDim
                      : palette.textMuted,
                  fontWeight: isHighlighted ? 600 : 400,
                }}
              >
                {r.method}
              </div>
              {/* Bar canvas: 0 axis at center */}
              <div className="relative flex-1 h-3.5 flex items-center">
                <div className="absolute inset-y-0 left-1/2 w-px bg-[var(--border-strong)]" />
                <motion.div
                  className="absolute h-2 rounded-sm"
                  initial={{ width: 0 }}
                  animate={{ width: `${barWidthPct}%` }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  style={{
                    left: isPositive ? "50%" : `calc(50% - ${barWidthPct}%)`,
                    background: color,
                    opacity: isHighlighted ? 1 : 0.65,
                    boxShadow: isHighlighted ? `0 0 8px ${color}80` : undefined,
                  }}
                />
              </div>
              <div
                className="font-mono text-[10px] w-12 text-right"
                style={{
                  color: isHighlighted
                    ? color
                    : r.delta > 0
                      ? palette.textDim
                      : palette.textMuted,
                  fontWeight: isHighlighted ? 600 : 400,
                }}
              >
                {r.delta > 0 ? "+" : ""}
                {r.delta.toFixed(2)}
              </div>
            </li>
          );
        })}
      </ul>
      <div className="mt-2 pt-2 border-t border-[var(--border)] font-mono text-[9px] text-[var(--foreground-muted)]">
        n={thesis.stats.configs.toLocaleString()} · {thesis.stats.pValue} · cohen d {thesis.stats.cohenD.toFixed(2)}
      </div>
    </div>
  );
}
