"use client";
import { useData } from "@/lib/data";
import { useT } from "@/lib/i18n";

export function Footer() {
  const { profile } = useData();
  const t = useT();

  return (
    <footer className="border-t border-[var(--border)] py-10 px-6 sm:px-8 mt-20">
      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:justify-between text-xs text-[var(--foreground-muted)]">
        <span>
          © {new Date().getFullYear()} Benjamin Schindler · {t.footer.copyrightSuffix}
        </span>
        <div className="flex items-center gap-3">
          <a
            href={`mailto:${profile.email}`}
            className="hover:text-[var(--foreground)] transition-colors"
          >
            {t.footer.email}
          </a>
          <span aria-hidden>·</span>
          <a
            href={profile.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[var(--foreground)] transition-colors"
          >
            {t.footer.linkedin}
          </a>
        </div>
      </div>
    </footer>
  );
}
