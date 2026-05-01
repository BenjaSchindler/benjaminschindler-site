"use client";
import { useEffect, useState } from "react";
import { Download, Menu, X } from "lucide-react";
import { useViewMode } from "@/lib/ViewMode";
import { ViewModeToggle } from "./ViewModeToggle";

const links = [
  { href: "#experience", label: "experience" },
  { href: "#thesis", label: "thesis" },
  { href: "#education", label: "education" },
  { href: "#skills", label: "skills" },
  { href: "#contact", label: "contact" },
];

export function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { detailed } = useViewMode();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const brand = detailed ? (
    <>
      <span className="text-[var(--accent)]">~/</span>benjamin
      <span className="caret align-baseline">&nbsp;</span>
    </>
  ) : (
    <span className="tracking-tight">Benjamin Schindler</span>
  );

  return (
    <nav
      className={`fixed top-0 inset-x-0 z-40 transition-all duration-300 ${
        scrolled
          ? "backdrop-blur bg-[var(--background)]/75 border-b border-[var(--border)]"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-5xl mx-auto px-6 sm:px-8 h-14 flex items-center justify-between gap-4">
        <a
          href="#top"
          className={`text-sm transition-colors ${
            detailed
              ? "font-mono text-[var(--foreground)] hover:text-[var(--accent)]"
              : "font-medium text-[var(--foreground)] hover:text-[var(--foreground-dim)]"
          }`}
        >
          {brand}
        </a>

        <div className="hidden md:flex items-center gap-1 text-xs">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className={`px-2.5 py-1.5 rounded transition-colors ${
                detailed
                  ? "font-mono text-[var(--foreground-dim)] hover:text-[var(--accent)]"
                  : "text-[var(--foreground-dim)] hover:text-[var(--foreground)]"
              }`}
            >
              {detailed ? l.label : capitalize(l.label)}
            </a>
          ))}
          <span aria-hidden className="mx-2 h-4 w-px bg-[var(--border-strong)]" />
          <ViewModeToggle />
          <a
            href="/cv.pdf"
            download="Benjamin_Schindler_CV.pdf"
            className={`ml-2 inline-flex items-center gap-1.5 px-3 py-1.5 rounded transition-colors ${
              detailed
                ? "border border-[var(--accent)]/40 text-[var(--accent)] hover:bg-[var(--accent)]/10"
                : "border border-[var(--border-strong)] text-[var(--foreground)] hover:border-[var(--foreground-dim)]"
            }`}
          >
            <Download className="size-3" /> {detailed ? "cv.pdf" : "Resume"}
          </a>
        </div>

        <div className="md:hidden flex items-center gap-2">
          <ViewModeToggle compact />
          <button
            aria-label="Open menu"
            onClick={() => setOpen((v) => !v)}
            className="p-2 text-[var(--foreground-dim)]"
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden border-t border-[var(--border)] bg-[var(--background)]/95 backdrop-blur">
          <div
            className={`max-w-5xl mx-auto px-6 py-4 flex flex-col gap-1 text-sm ${
              detailed ? "font-mono" : ""
            }`}
          >
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="py-2 text-[var(--foreground-dim)] hover:text-[var(--foreground)]"
              >
                {detailed ? l.label : capitalize(l.label)}
              </a>
            ))}
            <a
              href="/cv.pdf"
              download="Benjamin_Schindler_CV.pdf"
              className={`mt-2 inline-flex items-center gap-1.5 py-2 ${
                detailed ? "text-[var(--accent)]" : "text-[var(--foreground)]"
              }`}
            >
              <Download className="size-3.5" /> {detailed ? "download cv.pdf" : "Download resume"}
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
