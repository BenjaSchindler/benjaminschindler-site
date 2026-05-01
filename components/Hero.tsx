"use client";
import { TerminalLine } from "./viz/primitives/TerminalLine";
import { profile } from "@/lib/data";
import { ChevronDown, Mail, Download } from "lucide-react";
import { LinkedinIcon } from "./icons/Brands";
import { useViewMode } from "@/lib/ViewMode";

const SPEEDS = { prompt: 28, name: 45, detail: 60 } as const;

const LINES = [
  { text: "whoami", speed: SPEEDS.prompt },
  { text: profile.name.toLowerCase(), speed: SPEEDS.name },
  {
    text: `${profile.title.toLowerCase()} · ${profile.subtitle.toLowerCase()}`,
    speed: SPEEDS.detail,
  },
  {
    text: `based in ${profile.location.toLowerCase()} · building agentic systems · production-first`,
    speed: SPEEDS.detail,
  },
];

const GAP = 200;
const delays: number[] = (() => {
  const acc: number[] = [];
  let t = 0;
  for (const l of LINES) {
    acc.push(t);
    t += (l.text.length / l.speed) * 1000 + GAP;
  }
  return acc;
})();

export function Hero() {
  const { detailed } = useViewMode();
  return detailed ? <HeroDetailed /> : <HeroConcise />;
}

function HeroConcise() {
  return (
    <section
      id="top"
      className="relative min-h-[88vh] flex items-center px-6 sm:px-8"
    >
      <div className="relative w-full max-w-3xl mx-auto pt-24 pb-20">
        <p className="text-[11px] uppercase tracking-[0.22em] text-[var(--foreground-muted)] flex items-center gap-2.5">
          <span
            aria-hidden
            className="size-1.5 rounded-full bg-[var(--accent-gold)]"
          />
          Open to opportunities · {profile.location}
        </p>

        <h1 className="mt-7 font-serif text-5xl sm:text-6xl md:text-7xl tracking-tight leading-[1.02] text-[var(--foreground)]">
          {profile.name}.
        </h1>

        <p className="mt-5 text-lg sm:text-xl text-[var(--foreground-dim)] leading-relaxed font-medium">
          {profile.title} ·{" "}
          <span className="font-serif italic text-[var(--accent-gold-soft)]">
            {profile.subtitle}
          </span>
          .
        </p>

        <p className="mt-8 text-base sm:text-lg text-[var(--foreground)] leading-relaxed max-w-2xl font-normal">
          {profile.bio}
        </p>

        <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm">
          <a
            href={`mailto:${profile.email}`}
            className="group inline-flex items-center gap-2 text-[var(--foreground)] underline underline-offset-[6px] decoration-[var(--border-strong)] hover:decoration-[var(--accent-gold)] transition-colors"
          >
            <Mail className="size-4 text-[var(--foreground-muted)] group-hover:text-[var(--accent-gold)] transition-colors" />
            {profile.email}
          </a>
          <a
            href={profile.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-2 text-[var(--foreground)] underline underline-offset-[6px] decoration-[var(--border-strong)] hover:decoration-[var(--accent-gold)] transition-colors"
          >
            <LinkedinIcon className="size-4 text-[var(--foreground-muted)] group-hover:text-[var(--accent-gold)] transition-colors" />
            LinkedIn
          </a>
          <a
            href="/cv.pdf"
            download="Benjamin_Schindler_CV.pdf"
            className="group inline-flex items-center gap-2 text-[var(--foreground)] underline underline-offset-[6px] decoration-[var(--border-strong)] hover:decoration-[var(--accent-gold)] transition-colors"
          >
            <Download className="size-4 text-[var(--foreground-muted)] group-hover:text-[var(--accent-gold)] transition-colors" />
            Resume
          </a>
        </div>
      </div>

      <a
        href="#experience"
        aria-label="Scroll to experience"
        className="absolute bottom-6 left-1/2 -translate-x-1/2 text-[var(--foreground-muted)] hover:text-[var(--accent-gold)] transition-colors"
      >
        <ChevronDown className="size-5" strokeWidth={1.5} />
      </a>
    </section>
  );
}

function HeroDetailed() {
  return (
    <section
      id="top"
      className="relative min-h-screen flex items-center overflow-hidden grid-bg crt-vignette scanlines"
    >
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent via-transparent to-[var(--background)]" />

      <div className="relative w-full max-w-5xl mx-auto px-6 sm:px-8 pt-20 pb-28">
        <div className="mb-6 flex items-center gap-3 text-xs font-mono text-[var(--foreground-dim)]">
          <span className="inline-flex items-center gap-1.5">
            <span className="size-1.5 rounded-full bg-[var(--accent)] pulse-dot" />
            <span>online</span>
          </span>
          <span className="text-[var(--foreground-muted)]">·</span>
          <span>chile · gmt-3</span>
          <span className="text-[var(--foreground-muted)]">·</span>
          <span>v 2026.05</span>
        </div>

        <div className="font-mono leading-7 sm:leading-8 text-[var(--foreground)] space-y-1.5">
          <div className="text-sm sm:text-base">
            <TerminalLine
              text={LINES[0].text}
              prompt="$ "
              speed={LINES[0].speed}
              delay={delays[0]}
            />
          </div>

          <div className="text-2xl sm:text-4xl md:text-5xl font-bold tracking-tight pt-1">
            <TerminalLine
              text={LINES[1].text}
              speed={LINES[1].speed}
              delay={delays[1]}
              showCaret={false}
            />
          </div>

          <div className="text-sm sm:text-lg text-[var(--foreground-dim)] pt-1">
            <TerminalLine
              text={LINES[2].text}
              prompt="> "
              promptColor="var(--accent)"
              speed={LINES[2].speed}
              delay={delays[2]}
              showCaret={false}
            />
          </div>

          <div className="text-sm sm:text-lg text-[var(--foreground-dim)]">
            <TerminalLine
              text={LINES[3].text}
              prompt="> "
              promptColor="var(--accent)"
              speed={LINES[3].speed}
              delay={delays[3]}
              showCaret={false}
            />
          </div>
        </div>

        <div className="mt-7 grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <p className="text-base sm:text-lg leading-relaxed text-[var(--foreground)]">
              {profile.bio}
            </p>
            <div className="mt-3 flex flex-wrap gap-1.5 font-mono text-[10px]">
              {profile.tags.map((t) => (
                <span
                  key={t}
                  className="px-2 py-0.5 rounded-full border border-[var(--border-strong)] text-[var(--foreground-dim)] bg-[var(--surface)]/60"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <QuickLink
              icon={<Mail className="size-3.5" />}
              label="email"
              value={profile.email}
              href={`mailto:${profile.email}`}
            />
            <QuickLink
              icon={<LinkedinIcon className="size-3.5" />}
              label="linkedin"
              value="benjamin-schindler"
              href={profile.linkedin}
              external
            />
            <QuickLink
              icon={<Download className="size-3.5" />}
              label="cv"
              value="cv.pdf"
              href="/cv.pdf"
              download
            />
          </div>
        </div>

        <div className="mt-7 flex flex-wrap gap-2 text-sm font-mono">
          <a
            href="#experience"
            className="inline-flex items-center gap-2 px-4 py-2 rounded border border-[var(--accent)]/40 bg-[var(--accent)]/10 text-[var(--accent)] hover:bg-[var(--accent)]/20 transition-colors"
          >
            ./explore_experience
          </a>
          <a
            href="#thesis"
            className="inline-flex items-center gap-2 px-4 py-2 rounded border border-[var(--accent-warm)]/40 text-[var(--accent-warm)] hover:bg-[var(--accent-warm)]/10 transition-colors"
          >
            ./thesis
          </a>
          <a
            href="#contact"
            className="inline-flex items-center gap-2 px-4 py-2 rounded border border-[var(--border-strong)] hover:border-[var(--foreground-dim)] text-[var(--foreground-dim)] hover:text-[var(--foreground)] transition-colors"
          >
            ./contact
          </a>
        </div>
      </div>

      <a
        href="#experience"
        aria-label="Scroll to experience"
        className="absolute bottom-5 left-1/2 -translate-x-1/2 text-[var(--foreground-muted)] hover:text-[var(--accent)] transition-colors"
      >
        <ChevronDown className="size-6 animate-bounce" strokeWidth={1.5} />
      </a>
    </section>
  );
}

function QuickLink({
  icon,
  label,
  value,
  href,
  external,
  download,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  href: string;
  external?: boolean;
  download?: boolean;
}) {
  return (
    <a
      href={href}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      {...(download ? { download: "Benjamin_Schindler_CV.pdf" } : {})}
      className="group flex items-center gap-2.5 p-2 rounded border border-[var(--border)] bg-[var(--surface)]/70 backdrop-blur-sm hover:border-[var(--accent)]/40 hover:bg-[var(--surface-raised)] transition-colors"
    >
      <span className="text-[var(--foreground-muted)] group-hover:text-[var(--accent)]">{icon}</span>
      <span className="font-mono text-[10px] text-[var(--foreground-muted)]">{label}/</span>
      <span className="font-mono text-xs text-[var(--foreground)] truncate">{value}</span>
    </a>
  );
}
