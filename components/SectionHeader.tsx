"use client";
import { useViewMode } from "@/lib/ViewMode";

type Props = {
  index: string;
  title: string;
  subtitle?: string;
  accent?: "green" | "warm";
};

export function SectionHeader({ index, title, subtitle, accent = "green" }: Props) {
  const { detailed } = useViewMode();
  const color = accent === "warm" ? "var(--accent-warm)" : "var(--accent)";

  if (!detailed) {
    return (
      <header className="flex items-center gap-3 border-b border-[var(--border)] pb-4">
        <span
          aria-hidden
          className="text-xs font-semibold tracking-[0.22em] text-[var(--accent-gold-soft)]"
        >
          {String(parseInt(index, 10)).padStart(2, "0")}
        </span>
        <span aria-hidden className="h-px w-6 bg-[var(--accent-gold)]" />
        <h2 className="font-serif text-3xl sm:text-4xl tracking-tight text-[var(--foreground)] capitalize">
          {title}
        </h2>
      </header>
    );
  }

  return (
    <header className="flex items-end gap-4 border-b border-[var(--border)] pb-3">
      <span className="font-mono text-xs" style={{ color }}>
        [{index}]
      </span>
      <h2 className="font-mono text-2xl sm:text-3xl tracking-tight text-[var(--foreground)]">
        {title}
      </h2>
      {subtitle && (
        <span className="font-mono text-xs text-[var(--foreground-muted)] hidden sm:inline ml-auto">
          {subtitle}
        </span>
      )}
    </header>
  );
}
