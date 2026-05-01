"use client";
import dynamic from "next/dynamic";
import { thesis } from "@/lib/data";
import { SectionHeader } from "./SectionHeader";
import { FileText, ExternalLink } from "lucide-react";
import { useViewMode } from "@/lib/ViewMode";

const ThesisScatter = dynamic(
  () => import("./viz/ThesisScatter").then((m) => m.ThesisScatter),
  {
    ssr: false,
    loading: () => (
      <div className="aspect-square rounded border border-[var(--border)] bg-[var(--surface)] flex items-center justify-center font-mono text-xs text-[var(--foreground-muted)]">
        loading scatter...
      </div>
    ),
  },
);

export function ThesisSection() {
  const { detailed } = useViewMode();

  return (
    <section id="thesis" className="py-20 sm:py-28 px-6 sm:px-8">
      <div className="max-w-5xl mx-auto">
        <SectionHeader
          index="02"
          title={detailed ? "master's thesis" : "Master's thesis"}
          subtitle={`defense · ${thesis.date}`}
          accent="warm"
        />

        {detailed ? <ThesisDetailed /> : <ThesisConcise />}
      </div>
    </section>
  );
}

function ThesisConcise() {
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
          Advised by {thesis.advisor}.
        </p>
      </div>
    </div>
  );
}

function ThesisDetailed() {
  return (
    <div className="mt-8 grid lg:grid-cols-5 gap-6">
      <div className="lg:col-span-2 space-y-4">
        <div>
          <h3 className="text-2xl font-semibold text-[var(--foreground)]">
            {thesis.title}
          </h3>
          <p className="mt-1 text-base text-[var(--foreground-dim)]">{thesis.subtitle}</p>
        </div>

        <p className="text-sm leading-relaxed text-[var(--foreground-dim)]">
          {thesis.abstract}
        </p>

        <dl className="grid grid-cols-2 gap-3 font-mono text-xs">
          <DetailedStat label="configs" value={thesis.stats.configs.toLocaleString()} />
          <DetailedStat label="p-value" value={thesis.stats.pValue} />
          <DetailedStat label="cohen d" value={thesis.stats.cohenD.toFixed(2)} />
          <DetailedStat label="win-rate" value={thesis.stats.winRate} />
        </dl>

        <div className="pt-2 flex flex-wrap gap-2">
          <a
            href="/cv.pdf"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded border border-[var(--accent-warm)]/40 text-[var(--accent-warm)] hover:bg-[var(--accent-warm)]/10 font-mono text-xs transition-colors"
          >
            <FileText className="size-3.5" /> defense slides
          </a>
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 font-mono text-xs text-[var(--foreground-muted)]">
            <ExternalLink className="size-3.5" /> advised by {thesis.advisor}
          </span>
        </div>
      </div>

      <div className="lg:col-span-3">
        <ThesisScatter />
      </div>
    </div>
  );
}

function DetailedStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="p-3 rounded border border-[var(--border)] bg-[var(--surface)]">
      <dt className="text-[10px] uppercase tracking-wider text-[var(--foreground-muted)]">
        {label}
      </dt>
      <dd className="mt-0.5 text-base text-[var(--accent-warm)]">{value}</dd>
    </div>
  );
}
