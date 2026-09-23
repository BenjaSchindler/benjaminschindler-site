"use client";

import { useData, type ThesisResultId } from "@/lib/data";
import { useLanguage } from "@/lib/Language";
import { palette } from "./primitives/colors";

export function ThesisResultsBars({ highlightId }: { highlightId?: ThesisResultId | null }) {
  const { thesis } = useData();
  const { lang } = useLanguage();
  const locale = lang === "es" ? "es-CL" : "en-US";
  const span = Math.max(...thesis.results.map((r) => Math.abs(r.delta)), 1) * 1.2;
  return (
    <div className="rounded border border-[var(--border)] bg-[var(--surface)] p-3">
      <p className="text-xs font-medium text-[var(--foreground)]">{lang === "es" ? "Resultados de la tesis" : "Thesis results"}</p>
      <p className="mt-1 mb-3 text-xs text-[var(--foreground-muted)]">Δ macro-F1 vs. SMOTE · pp</p>
      <ul className="space-y-3">
        {thesis.results.map((r) => {
          const width = Math.abs(r.delta) / span * 50;
          const color = r.isOurs ? palette.orange : palette.textMuted;
          return <li key={r.id} className={highlightId === r.id ? "rounded-md bg-[var(--accent-warm)]/10 p-2 -mx-2" : ""}>
            <div className="flex justify-between gap-2 text-xs leading-snug text-[var(--foreground-dim)]" style={{ fontWeight: highlightId === r.id ? 600 : 400 }}>
              <span>{r.method}</span>
              <span className="font-mono tabular-nums shrink-0">{r.delta > 0 ? "+" : ""}{r.delta.toLocaleString(locale, { minimumFractionDigits: 2 })}</span>
            </div>
            <div className="relative mt-1 h-3 bg-[var(--surface-raised)] rounded-sm" aria-hidden>
              <span className="absolute left-1/2 inset-y-0 w-px bg-[var(--foreground-muted)]" />
              <span className="absolute top-0.5 h-2 rounded-sm" style={{ width: `${width}%`, left: r.delta >= 0 ? "50%" : `${50-width}%`, background: color }} />
            </div>
          </li>;
        })}
      </ul>
      <div aria-hidden className="flex justify-between mt-2 text-xs text-[var(--foreground-muted)]"><span>−</span><span>0</span><span>+</span></div>
    </div>
  );
}
