"use client";
import { motion } from "framer-motion";
import { useData } from "@/lib/data";
import { useT } from "@/lib/i18n";
import { ChevronDown, Mail, Download, ArrowRight } from "lucide-react";
import { LinkedinIcon } from "./icons/Brands";
import { useViewMode } from "@/lib/ViewMode";
import { BioAttention } from "./viz/BioAttention";
import { useLanguage } from "@/lib/Language";

const BIO_TOKENS_EN = [
  "AI",
  "agentic",
  "RAG",
  "production",
  "design",
  "rollout",
  "iteration",
  "CTO",
];
const BIO_TOKENS_ES = [
  "IA",
  "Ingeniero",
  "agénticos",
  "RAG",
  "producción",
  "diseño",
  "despliegue",
  "CTO",
];

export function Hero() {
  const { detailed } = useViewMode();
  return detailed ? <HeroDetailed /> : <HeroConcise />;
}

function HeroConcise() {
  const { profile } = useData();
  const t = useT();
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
          {t.hero.openToOpportunities} · {profile.location}
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
            href={t.resumeHref}
            download="Benjamin_Schindler_CV.pdf"
            className="group inline-flex items-center gap-2 text-[var(--foreground)] underline underline-offset-[6px] decoration-[var(--border-strong)] hover:decoration-[var(--accent-gold)] transition-colors"
          >
            <Download className="size-4 text-[var(--foreground-muted)] group-hover:text-[var(--accent-gold)] transition-colors" />
            {t.quickLinks.resume}
          </a>
        </div>
      </div>

      <a
        href="#experience"
        aria-label={t.hero.scrollToExperience}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 text-[var(--foreground-muted)] hover:text-[var(--accent-gold)] transition-colors"
      >
        <ChevronDown className="size-5" strokeWidth={1.5} />
      </a>
    </section>
  );
}

const STAGGER = 0.08;
const fadeIn = (delay: number) => ({
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] as const },
});

function HeroDetailed() {
  const { profile } = useData();
  const t = useT();
  const { lang } = useLanguage();
  const bioTokens = lang === "es" ? BIO_TOKENS_ES : BIO_TOKENS_EN;
  return (
    <section
      id="top"
      className="relative min-h-screen flex items-center overflow-hidden"
    >
      <div className="relative w-full max-w-5xl mx-auto px-6 sm:px-8 pt-20 pb-28">
        <motion.div
          {...fadeIn(0)}
          className="mb-6 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-[11px] uppercase tracking-[0.18em] text-[var(--foreground-muted)]"
        >
          <span className="inline-flex items-center gap-1.5 text-[var(--foreground-dim)]">
            <span className="size-1.5 rounded-full bg-[var(--accent-warm)] pulse-dot" />
            <span>{t.hero.available}</span>
          </span>
          <span aria-hidden>·</span>
          <span>{t.hero.statusLocation}</span>
        </motion.div>

        <motion.h1
          {...fadeIn(STAGGER * 1)}
          className="text-4xl sm:text-5xl md:text-6xl font-semibold tracking-tight text-[var(--foreground)] leading-[1.05]"
        >
          {profile.name}
        </motion.h1>

        <motion.p
          {...fadeIn(STAGGER * 2)}
          className="mt-3 text-base sm:text-lg text-[var(--foreground-dim)] leading-relaxed"
        >
          {profile.title} · {profile.subtitle}
        </motion.p>

        <div className="mt-7 grid md:grid-cols-3 gap-6">
          <motion.div {...fadeIn(STAGGER * 3)} className="md:col-span-2">
            <BioAttention
              text={profile.bio}
              tokens={bioTokens}
              className="text-base sm:text-lg leading-relaxed text-[var(--foreground)]"
            />
            <div className="mt-4 flex flex-wrap gap-1.5 font-mono text-[10px]">
              {profile.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-0.5 rounded-full border border-[var(--border)] text-[var(--foreground-dim)] bg-[var(--surface)]"
                >
                  {tag}
                </span>
              ))}
            </div>
          </motion.div>

          <motion.div {...fadeIn(STAGGER * 4)} className="space-y-2">
            <QuickLink
              icon={<Mail className="size-3.5" />}
              label={t.quickLinks.email}
              value={profile.email}
              href={`mailto:${profile.email}`}
            />
            <QuickLink
              icon={<LinkedinIcon className="size-3.5" />}
              label={t.quickLinks.linkedin}
              value="benjamin-schindler"
              href={profile.linkedin}
              external
            />
            <QuickLink
              icon={<Download className="size-3.5" />}
              label={t.quickLinks.resume}
              value="cv.pdf"
              href={t.resumeHref}
              download
            />
          </motion.div>
        </div>

        <motion.div
          {...fadeIn(STAGGER * 5)}
          className="mt-8 flex flex-wrap gap-2 text-sm"
        >
          <a
            href="#experience"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-[var(--accent)] text-white hover:bg-[var(--accent-dim)] transition-colors font-medium"
          >
            {t.hero.exploreExperience} <ArrowRight className="size-3.5" />
          </a>
          <a
            href="#thesis"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-md border border-[var(--accent-warm)]/50 text-[var(--accent-warm)] hover:bg-[var(--accent-warm)]/10 transition-colors font-medium"
          >
            {t.hero.readThesis} <ArrowRight className="size-3.5" />
          </a>
          <a
            href="#contact"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-md border border-[var(--border-strong)] hover:border-[var(--foreground-dim)] text-[var(--foreground-dim)] hover:text-[var(--foreground)] transition-colors font-medium"
          >
            {t.hero.getInTouch} <ArrowRight className="size-3.5" />
          </a>
        </motion.div>
      </div>

      <a
        href="#experience"
        aria-label={t.hero.scrollToExperience}
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
      className="group flex items-center gap-2.5 p-2 rounded-md border border-[var(--border)] bg-[var(--surface)] hover:border-[var(--accent)]/40 hover:bg-[var(--surface-raised)] transition-colors"
    >
      <span className="text-[var(--foreground-muted)] group-hover:text-[var(--accent)]">{icon}</span>
      <span className="text-[10px] uppercase tracking-[0.14em] text-[var(--foreground-muted)] shrink-0">
        {label}
      </span>
      <span className="font-mono text-xs text-[var(--foreground)] truncate">{value}</span>
    </a>
  );
}
