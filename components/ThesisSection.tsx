"use client";
import dynamic from "next/dynamic";
import { ArrowUpRight, FileText } from "lucide-react";
import { useData } from "@/lib/data";
import { useT } from "@/lib/i18n";
import { SectionHeader } from "./SectionHeader";
import { useLanguage } from "@/lib/Language";
import { useViewMode } from "@/lib/ViewMode";

const ThesisScatter = dynamic(
  () => import("./viz/ThesisScatter").then((m) => m.ThesisScatter),
  {
    ssr: false,
    loading: () => <ScatterSkeleton />,
  },
);

function ScatterSkeleton() {
  const t = useT();
  return (
    <div className="aspect-square rounded border border-[var(--border)] bg-[var(--surface)] flex items-center justify-center text-xs text-[var(--foreground-muted)]">
      {t.viz.loadingScatter}
    </div>
  );
}

export function ThesisSection() {
  const { detailed } = useViewMode();
  const { thesis } = useData();
  const t = useT();

  return (
    <section id="thesis" className="py-20 sm:py-28 px-6 sm:px-8">
      <div className="max-w-5xl mx-auto">
        <SectionHeader
          index="02"
          title={t.section.thesisTitle}
          subtitle={`${t.section.thesisSubtitle} · ${thesis.date}`}
          accent="warm"
        />

        <ThesisPaper />
        {detailed ? <ThesisDetailed /> : <ThesisConcise />}
      </div>
    </section>
  );
}

function ThesisPaper() {
  const { thesis: { paper } } = useData();
  const { lang } = useLanguage();
  const es = lang === "es";
  const date = new Intl.DateTimeFormat(es ? "es-CL" : "en-US", {
    month: "long", year: "numeric", timeZone: "UTC",
  }).format(new Date(paper.date));

  return (
    <article aria-label={es ? "Artículo de investigación" : "Research paper"} className="mt-8 border-l-2 border-[var(--accent-warm)] bg-[var(--surface)] p-5 sm:p-6">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[var(--foreground-muted)]">
        <span className="font-medium text-[var(--foreground-dim)]">Paper · arXiv</span>
        <time dateTime={paper.date}>{date}</time>
      </div>
      <h3 className="mt-3 max-w-3xl text-lg font-semibold leading-snug text-[var(--foreground)] sm:text-xl">{paper.title}</h3>
      <p className="mt-2 text-xs text-[var(--foreground-dim)]">{paper.authors.join(" · ")}</p>
      <p className="mt-3 max-w-3xl text-sm leading-relaxed text-[var(--foreground-dim)]">{paper.summary}</p>
      <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2">
        <a href={paper.url} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-10 items-center gap-2 text-sm font-medium text-[var(--foreground)] underline underline-offset-4 hover:decoration-2">
          {es ? "Ver en arXiv" : "Read on arXiv"}<ArrowUpRight aria-hidden className="size-4" />
        </a>
        <a href={paper.pdfUrl} target="_blank" rel="noopener noreferrer" aria-label={es ? "Leer el paper en PDF" : "Read the paper as PDF"} className="inline-flex min-h-10 items-center gap-2 text-sm text-[var(--foreground-dim)] underline underline-offset-4 hover:text-[var(--foreground)]">
          <FileText aria-hidden className="size-4" />PDF
        </a>
      </div>
    </article>
  );
}

function ThesisConcise() {
  const { thesis } = useData();
  const t = useT();
  return (
    <div className="mt-8 grid sm:grid-cols-[170px_1fr] gap-3 sm:gap-10">
      <div className="text-sm font-medium text-[var(--foreground-muted)] sm:pt-2 flex items-center gap-2">
        <span
          aria-hidden
          className="hidden sm:inline-block h-px w-3 bg-[var(--accent-gold)]"
        />
        <span>{thesis.date}</span>
      </div>
      <div>
        <h3 className="font-serif text-2xl sm:text-3xl text-[var(--foreground)] tracking-tight">
          {thesis.title}
        </h3>
        <p className="mt-1.5 text-sm sm:text-base text-[var(--foreground-dim)] font-medium">
          <span className="font-serif italic text-[var(--accent-gold-soft)]">
            {thesis.subtitle}
          </span>{" "}
          · {thesis.institution}
        </p>
        <p className="mt-4 text-sm text-[var(--foreground-muted)] font-medium">
          {t.thesis.advisedBy} {thesis.advisor}.
        </p>
      </div>
    </div>
  );
}

function ThesisDetailed() {
  const { lang } = useLanguage();
  const locale = lang === "es" ? "es-CL" : "en-US";
  const { thesis } = useData();
  const t = useT();
  return (
    <div className="mt-8 space-y-8">
      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <h3 className="text-2xl font-semibold text-[var(--foreground)]">
            {thesis.title}
          </h3>
          <p className="mt-1 text-base text-[var(--foreground-dim)]">{thesis.subtitle}</p>
        </div>

        <p className="text-sm leading-relaxed text-[var(--foreground-dim)]">
          {thesis.abstract}
        </p>

        <dl className="grid grid-cols-2 gap-3 md:col-span-2 sm:grid-cols-4">
          <DetailedStat label={t.thesis.configs} value={thesis.stats.configs.toLocaleString(locale)} />
          <DetailedStat label={t.thesis.pValue} value={thesis.stats.pValue} />
          <DetailedStat label={t.thesis.cohenD} value={thesis.stats.cohenD.toLocaleString(locale, { minimumFractionDigits: 2 })} />
          <DetailedStat label={t.thesis.winRate} value={thesis.stats.winRate} />
        </dl>

        <div className="md:col-span-2 flex flex-wrap items-center gap-3 text-xs">
          <span className="inline-flex items-center gap-1.5 text-[var(--foreground-muted)]">
            {t.thesis.advisedBy} {thesis.advisor}
          </span>
        </div>
      </div>

      <div className="min-w-0">
        <ThesisScatter />
      </div>
    </div>
  );
}

function DetailedStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="p-3 rounded border border-[var(--border)] bg-[var(--surface)]">
      <dt className="text-[10px] font-semibold uppercase tracking-wide sm:tracking-[0.14em] text-[var(--foreground-muted)]">
        {label}
      </dt>
      <dd className="mt-1 font-mono text-base text-[var(--accent-warm)]">{value}</dd>
    </div>
  );
}
