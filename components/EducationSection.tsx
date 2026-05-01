"use client";
import { education } from "@/lib/data";
import { SectionHeader } from "./SectionHeader";
import { GraduationCap } from "lucide-react";
import { useViewMode } from "@/lib/ViewMode";

export function EducationSection() {
  const { detailed } = useViewMode();

  return (
    <section id="education" className="py-20 sm:py-28 px-6 sm:px-8">
      <div className="max-w-5xl mx-auto">
        <SectionHeader index="03" title="education" subtitle="universidad adolfo ibáñez" />

        {detailed ? (
          <ul className="mt-8 space-y-3">
            {education.map((e) => (
              <li
                key={e.degree}
                className="group p-4 sm:p-5 rounded border border-[var(--border)] bg-[var(--surface)] hover:border-[var(--accent)]/30 transition-colors"
              >
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6">
                  <GraduationCap className="size-5 text-[var(--foreground-muted)] group-hover:text-[var(--accent)] transition-colors shrink-0" />
                  <div className="flex-1">
                    <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                      <h3 className="text-base sm:text-lg text-[var(--foreground)]">{e.degree}</h3>
                      <span className="font-mono text-xs text-[var(--foreground-muted)]">{e.period}</span>
                    </div>
                    {e.note && (
                      <p className="mt-1 text-sm text-[var(--foreground-dim)]">{e.note}</p>
                    )}
                  </div>
                  <div className="w-full sm:w-32 shrink-0">
                    <div className="h-1 bg-[var(--border)] rounded overflow-hidden">
                      <div
                        className={`h-full ${e.progress >= 1 ? "bg-[var(--foreground-muted)]" : "bg-[var(--accent)]"}`}
                        style={{ width: `${e.progress * 100}%` }}
                      />
                    </div>
                    <div className="mt-1 font-mono text-[10px] text-[var(--foreground-muted)] text-right">
                      {e.progress >= 1 ? "completed" : `${Math.round(e.progress * 100)}% · in progress`}
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <ul className="mt-8 divide-y divide-[var(--border)]">
            {education.map((e) => (
              <li
                key={e.degree}
                className="py-6 grid sm:grid-cols-[170px_1fr] gap-2 sm:gap-10"
              >
                <div className="text-sm font-medium text-[var(--foreground-muted)] flex items-center gap-2 sm:pt-1.5">
                  <span
                    aria-hidden
                    className="hidden sm:inline-block h-px w-3 bg-[var(--accent-gold)]"
                  />
                  <span>{e.period}</span>
                </div>
                <div>
                  <h3 className="font-serif text-xl sm:text-2xl text-[var(--foreground)] tracking-tight">
                    {e.degree}
                  </h3>
                  {e.note && (
                    <p className="mt-1.5 text-sm text-[var(--foreground-dim)] font-medium">
                      {e.note}
                    </p>
                  )}
                  <p className="mt-1 text-xs text-[var(--foreground-muted)] font-medium">
                    Universidad Adolfo Ibáñez ·{" "}
                    {e.progress >= 1 ? (
                      "Completed"
                    ) : (
                      <span className="font-semibold text-[var(--accent-gold-soft)]">
                        {Math.round(e.progress * 100)}% · in progress
                      </span>
                    )}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
