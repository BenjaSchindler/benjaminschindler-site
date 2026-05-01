"use client";
import { profile } from "@/lib/data";
import { useViewMode } from "@/lib/ViewMode";

export function Footer() {
  const { detailed } = useViewMode();

  return (
    <footer className="border-t border-[var(--border)] py-10 px-6 sm:px-8 mt-20">
      <div
        className={`max-w-5xl mx-auto flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:justify-between text-xs text-[var(--foreground-muted)] ${
          detailed ? "font-mono" : ""
        }`}
      >
        <div className="flex items-center gap-2">
          {detailed ? (
            <>
              <span className="text-[var(--accent)]">$</span>
              <span>echo &quot;built with next.js · deployed on vercel&quot;</span>
            </>
          ) : (
            <span>© {new Date().getFullYear()} Benjamin Schindler</span>
          )}
        </div>
        <div className="flex items-center gap-3">
          <a
            href={`mailto:${profile.email}`}
            className={`hover:text-[var(--foreground)] transition-colors ${
              detailed ? "hover:text-[var(--accent)]" : ""
            }`}
          >
            {detailed ? "mail" : "Email"}
          </a>
          <span>·</span>
          <a
            href={profile.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className={`transition-colors ${
              detailed
                ? "hover:text-[var(--accent)]"
                : "hover:text-[var(--foreground)]"
            }`}
          >
            {detailed ? "linkedin" : "LinkedIn"}
          </a>
          {detailed && (
            <>
              <span>·</span>
              <span>© {new Date().getFullYear()}</span>
            </>
          )}
        </div>
      </div>
    </footer>
  );
}
