"use client";
import { useViewMode } from "@/lib/ViewMode";
import { useT } from "@/lib/i18n";

export function ViewModeToggle({ compact = false }: { compact?: boolean }) {
  const { detailed, toggle } = useViewMode();
  const t = useT();
  const labelClass = "uppercase tracking-[0.18em]";
  const offColor = detailed
    ? "text-[var(--foreground-muted)]"
    : "text-[var(--accent-gold)]";
  const onColor = detailed
    ? "text-[var(--accent)]"
    : "text-[var(--foreground-muted)]";

  return (
    <button
      type="button"
      role="switch"
      aria-checked={detailed}
      aria-label={
        detailed ? t.viewMode.switchToConcise : t.viewMode.switchToTechnical
      }
      onClick={toggle}
      className={`group inline-flex items-center gap-2 select-none ${
        compact ? "text-[10px]" : "text-[10px] sm:text-[11px]"
      }`}
    >
      <span className={`${labelClass} transition-colors ${offColor}`}>
        {t.viewMode.concise}
      </span>
      <span
        aria-hidden
        className={`relative inline-flex h-[18px] w-[34px] items-center rounded-full border transition-colors ${
          detailed
            ? "border-[var(--accent)]/60 bg-[var(--accent)]/15"
            : "border-[var(--accent-gold)]/40 bg-[var(--surface-raised)]"
        }`}
      >
        <span
          className={`absolute top-1/2 -translate-y-1/2 size-[12px] rounded-full transition-all duration-200 ease-out ${
            detailed
              ? "left-[18px] bg-[var(--accent)]"
              : "left-[3px] bg-[var(--accent-gold)]"
          }`}
        />
      </span>
      <span className={`${labelClass} transition-colors ${onColor}`}>
        {t.viewMode.technical}
      </span>
    </button>
  );
}
