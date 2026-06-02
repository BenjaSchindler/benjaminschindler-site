"use client";
import { useData } from "@/lib/data";
import { useT } from "@/lib/i18n";
import { SectionHeader } from "./SectionHeader";
import { motion } from "framer-motion";
import { useViewMode } from "@/lib/ViewMode";

export function ProjectsSection() {
  const { detailed } = useViewMode();
  const { projects } = useData();
  const t = useT();

  return (
    <section id="projects" className="py-20 sm:py-28 px-6 sm:px-8">
      <div className="max-w-5xl mx-auto">
        <SectionHeader
          index="04"
          title={t.section.projectsTitle}
          subtitle={t.section.projectsSubtitle}
        />

        {detailed ? (
          <div className="mt-8 grid md:grid-cols-2 gap-4">
            {projects.map((p, idx) => (
              <motion.article
                key={p.name}
                initial={{ y: 12 }}
                whileInView={{ y: 0 }}
                viewport={{ once: true, margin: "-60px", amount: 0.05 }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
                className="flex flex-col p-5 rounded border border-[var(--border)] bg-[var(--surface)] hover:border-[var(--accent)]/30 transition-colors"
              >
                <div className="flex items-baseline justify-between gap-3">
                  <h3 className="text-lg font-semibold text-[var(--foreground)]">
                    {p.name}
                  </h3>
                  <span className="font-mono text-[10px] uppercase tracking-[0.14em] px-1.5 py-0.5 rounded border border-[var(--border)] bg-[var(--surface-raised)] text-[var(--accent)] shrink-0">
                    {p.context}
                  </span>
                </div>
                <p className="mt-1 text-sm text-[var(--foreground-dim)]">
                  {p.tagline}
                </p>
                <p className="mt-3 text-[13px] leading-relaxed text-[var(--foreground-dim)]">
                  {p.description}
                </p>
                <ul className="mt-3 space-y-1.5 text-[13px] text-[var(--foreground-dim)] leading-relaxed">
                  {p.highlights.map((h, i) => (
                    <li key={i} className="flex gap-2">
                      <span className="mt-2 size-1 rounded-full bg-[var(--accent)] shrink-0" />
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
                <ul className="mt-4 flex flex-wrap gap-1.5">
                  {p.stack.map((s) => (
                    <li
                      key={s}
                      className="font-mono text-[10px] px-1.5 py-0.5 rounded border border-[var(--border)] bg-[var(--surface-raised)] text-[var(--foreground-dim)]"
                    >
                      {s}
                    </li>
                  ))}
                </ul>
              </motion.article>
            ))}
          </div>
        ) : (
          <ul className="mt-8 divide-y divide-[var(--border)]">
            {projects.map((p) => (
              <li
                key={p.name}
                className="py-6 grid sm:grid-cols-[170px_1fr] gap-2 sm:gap-10"
              >
                <div className="text-sm font-medium text-[var(--foreground-muted)] flex items-center gap-2 sm:pt-1.5">
                  <span
                    aria-hidden
                    className="hidden sm:inline-block h-px w-3 bg-[var(--accent-gold)]"
                  />
                  <span>{p.context}</span>
                </div>
                <div>
                  <h3 className="font-serif text-xl sm:text-2xl text-[var(--foreground)] tracking-tight">
                    {p.name}
                  </h3>
                  <p className="mt-1.5 text-sm text-[var(--foreground-dim)] font-medium">
                    {p.tagline}
                  </p>
                  <p className="mt-2 text-sm text-[var(--foreground-muted)] leading-relaxed max-w-2xl">
                    {p.description}
                  </p>
                  <ul className="mt-3 flex flex-wrap gap-x-3 gap-y-1 text-xs font-medium text-[var(--foreground-muted)]">
                    {p.stack.map((s, i) => (
                      <li key={s} className="flex items-center gap-3">
                        {i > 0 && (
                          <span aria-hidden className="text-[var(--border-strong)]">
                            ·
                          </span>
                        )}
                        <span>{s}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
