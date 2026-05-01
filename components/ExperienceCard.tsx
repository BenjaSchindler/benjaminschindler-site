"use client";
import dynamic from "next/dynamic";
import type { Experience } from "@/lib/data";
import { motion } from "framer-motion";
import { useViewMode } from "@/lib/ViewMode";

const ForecastingChart = dynamic(
  () => import("./viz/ForecastingChart").then((m) => m.ForecastingChart),
  { ssr: false, loading: () => <VizSkeleton label="loading forecast..." /> },
);
const AgentGraph = dynamic(
  () => import("./viz/AgentGraph").then((m) => m.AgentGraph),
  { ssr: false, loading: () => <VizSkeleton label="loading agent graph..." /> },
);
const NL2SQLPipeline = dynamic(
  () => import("./viz/NL2SQLPipeline").then((m) => m.NL2SQLPipeline),
  { ssr: false, loading: () => <VizSkeleton label="loading pipeline..." /> },
);

function VizSkeleton({ label }: { label: string }) {
  return (
    <div className="aspect-[5/3] rounded border border-[var(--border)] bg-[var(--surface)] flex items-center justify-center font-mono text-xs text-[var(--foreground-muted)]">
      {label}
    </div>
  );
}

export function ExperienceCard({ exp }: { exp: Experience }) {
  const { detailed } = useViewMode();

  if (!detailed) {
    return <ExperienceCardConcise exp={exp} />;
  }

  return <ExperienceCardDetailed exp={exp} />;
}

function ExperienceCardConcise({ exp }: { exp: Experience }) {
  const roleSummary = exp.roles
    .map((r) => r.title.replace(/\s*\([^)]*\)/g, ""))
    .join(" · ");

  return (
    <article className="grid sm:grid-cols-[170px_1fr] gap-3 sm:gap-10">
      <div className="text-sm font-medium text-[var(--foreground-muted)] sm:pt-2 flex items-center gap-2">
        <span
          aria-hidden
          className="hidden sm:inline-block h-px w-3 bg-[var(--accent-gold)]"
        />
        <span>{exp.period}</span>
      </div>
      <div>
        <h3 className="font-serif text-2xl sm:text-3xl text-[var(--foreground)] tracking-tight">
          {exp.company}
        </h3>
        <p className="mt-1.5 text-sm sm:text-base text-[var(--foreground-dim)] font-medium">
          {roleSummary}
        </p>
        <p className="mt-5 text-base sm:text-lg leading-relaxed text-[var(--foreground)] font-normal max-w-2xl border-l-[3px] border-[var(--accent-gold)] pl-4">
          {exp.impact}
        </p>
        <ul className="mt-5 flex flex-wrap gap-x-3 gap-y-1 text-xs font-medium text-[var(--foreground-muted)]">
          {exp.stack.map((s, i) => (
            <li key={s} className="flex items-center gap-3">
              {i > 0 && (
                <span aria-hidden className="text-[var(--border-strong)]">·</span>
              )}
              <span>{s}</span>
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}

function ExperienceCardDetailed({ exp }: { exp: Experience }) {
  const Viz =
    exp.viz === "forecasting"
      ? ForecastingChart
      : exp.viz === "agent-graph"
        ? AgentGraph
        : exp.viz === "nl2sql"
          ? NL2SQLPipeline
          : null;

  return (
    <motion.article
      initial={{ y: 16 }}
      whileInView={{ y: 0 }}
      viewport={{ once: true, margin: "-80px", amount: 0.05 }}
      transition={{ duration: 0.45 }}
      className="rounded border border-[var(--border)] bg-[var(--surface)] overflow-hidden"
    >
      <div className="p-4 sm:p-6 border-b border-[var(--border)]">
        <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
          <h3 className="text-lg sm:text-xl font-semibold text-[var(--foreground)]">
            {exp.company}
          </h3>
          <span className="font-mono text-[11px] sm:text-xs text-[var(--foreground-muted)]">
            {exp.period}
          </span>
        </div>
        {exp.impact && (
          <p className="mt-3 flex gap-2.5 text-[13px] sm:text-sm leading-relaxed text-[var(--foreground)] border-l-2 border-[var(--accent)] pl-3">
            <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--accent)] shrink-0 pt-1">
              impact
            </span>
            <span>{exp.impact}</span>
          </p>
        )}
        <ul className="mt-3 flex flex-wrap gap-1.5">
          {exp.stack.map((s) => (
            <li
              key={s}
              className="font-mono text-[10px] px-1.5 py-0.5 rounded border border-[var(--border-strong)] text-[var(--foreground-muted)]"
            >
              {s}
            </li>
          ))}
        </ul>
      </div>

      <div className="grid lg:grid-cols-5">
        <div className="p-4 sm:p-6 lg:col-span-3 space-y-5 border-b lg:border-b-0 lg:border-r border-[var(--border)] min-w-0">
          {exp.roles.map((r) => (
            <div key={r.title}>
              <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                <h4 className="text-sm sm:text-base text-[var(--foreground)]">
                  <span className="text-[var(--accent)]">›</span> {r.title}
                </h4>
                <span className="font-mono text-[10px] sm:text-[11px] text-[var(--foreground-muted)]">
                  {r.period}
                </span>
              </div>
              <ul className="mt-2.5 space-y-1.5 text-[13px] sm:text-sm text-[var(--foreground-dim)] leading-relaxed">
                {r.bullets.map((b, i) => (
                  <li key={i} className="flex gap-2">
                    <span className="mt-1.5 size-1 rounded-full bg-[var(--foreground-muted)] shrink-0" />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="lg:col-span-2 p-3 sm:p-6 bg-[var(--surface-raised)] min-w-0">
          {Viz ? <Viz /> : null}
        </div>
      </div>
    </motion.article>
  );
}
