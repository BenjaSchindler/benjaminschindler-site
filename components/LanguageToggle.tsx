"use client";
import { useLanguage } from "@/lib/Language";
import { useT } from "@/lib/i18n";
import { FlagUS, FlagES } from "./icons/Flags";

export function LanguageToggle({ compact = false }: { compact?: boolean }) {
  const { lang, setLang } = useLanguage();
  const t = useT();
  const targetLabel = lang === "en" ? t.language.spanish : t.language.english;

  return (
    <div
      role="group"
      aria-label={`${t.language.switchTo} ${targetLabel}`}
      className={`inline-flex items-center gap-0.5 rounded-md border border-[var(--border-strong)] p-0.5 bg-[var(--surface)]/60 ${
        compact ? "" : ""
      }`}
    >
      <button
        type="button"
        aria-pressed={lang === "en"}
        onClick={() => setLang("en")}
        className={`inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[10px] font-semibold tracking-wider uppercase transition-colors ${
          lang === "en"
            ? "bg-[var(--surface-raised)] text-[var(--foreground)]"
            : "text-[var(--foreground-muted)] hover:text-[var(--foreground-dim)]"
        }`}
      >
        <FlagUS className="h-2.5 w-[15px] rounded-[1px] shrink-0" />
        <span>EN</span>
      </button>
      <button
        type="button"
        aria-pressed={lang === "es"}
        onClick={() => setLang("es")}
        className={`inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[10px] font-semibold tracking-wider uppercase transition-colors ${
          lang === "es"
            ? "bg-[var(--surface-raised)] text-[var(--foreground)]"
            : "text-[var(--foreground-muted)] hover:text-[var(--foreground-dim)]"
        }`}
      >
        <FlagES className="h-2.5 w-[15px] rounded-[1px] shrink-0" />
        <span>ES</span>
      </button>
    </div>
  );
}
