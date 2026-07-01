"use client";
import { useViewMode } from "@/lib/ViewMode";

type Props = {
  index: string;
  /** Concise view number, when it differs (sections hidden in concise mode shift the count). */
  conciseIndex?: string;
  title: string;
  subtitle?: string;
  accent?: "green" | "warm";
};

export function SectionHeader({ index, conciseIndex, title, subtitle, accent = "green" }: Props) {
  const { detailed } = useViewMode();
  const color = accent === "warm" ? "var(--accent-warm)" : "var(--accent)";

  if (!detailed) {
    return (
      <header className="flex items-center gap-3 border-b border-[var(--border)] pb-4">
        <span
          aria-hidden
          className="text-xs font-semibold tracking-[0.22em] text-[var(--accent-gold-soft)]"
        >
          {String(parseInt(conciseIndex ?? index, 10)).padStart(2, "0")}
        </span>
        <span aria-hidden className="h-px w-6 bg-[var(--accent-gold)]" />
        <h2 className="font-serif text-3xl sm:text-4xl tracking-tight text-[var(--foreground)]">
          {title}
        </h2>
      </header>
    );
  }

  return (
    <header className="flex items-end gap-4 border-b border-[var(--border)] pb-3">
      <span
        className="text-[11px] font-semibold uppercase tracking-[0.18em]"
        style={{ color }}
      >
        {index}
      </span>
      <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-[var(--foreground)]">
        {title}
      </h2>
      {subtitle && (
        <span className="text-xs text-[var(--foreground-muted)] hidden sm:inline ml-auto">
          {subtitle}
        </span>
      )}
    </header>
  );
}
