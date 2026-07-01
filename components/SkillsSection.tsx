"use client";
import { useData } from "@/lib/data";
import { useT } from "@/lib/i18n";
import { SectionHeader } from "./SectionHeader";
import { motion } from "framer-motion";
import { useViewMode } from "@/lib/ViewMode";

export function SkillsSection() {
  const { detailed } = useViewMode();
  const { skills, languages } = useData();
  const t = useT();

  return (
    <section id="skills" className="py-20 sm:py-28 px-6 sm:px-8">
      <div className="max-w-5xl mx-auto">
        <SectionHeader
          index="07"
          conciseIndex="05"
          title={t.section.skillsTitle}
          subtitle={t.section.skillsSubtitle}
        />

        {detailed ? (
          <>
            <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(skills).map(([group, items], idx) => (
                <motion.div
                  key={group}
                  initial={{ y: 8 }}
                  whileInView={{ y: 0 }}
                  viewport={{ once: true, margin: "-50px", amount: 0.05 }}
                  transition={{ duration: 0.4, delay: idx * 0.05 }}
                  className="p-4 rounded border border-[var(--border)] bg-[var(--surface)]"
                >
                  <h3 className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">
                    {group}
                  </h3>
                  <ul className="mt-3 flex flex-wrap gap-2">
                    {items.map((it) => (
                      <li
                        key={it}
                        className="font-mono text-xs px-2 py-1 rounded bg-[var(--surface-raised)] border border-[var(--border)] text-[var(--foreground-dim)] hover:text-[var(--foreground)] hover:border-[var(--accent)]/40 transition-colors"
                      >
                        {it}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>

            <div className="mt-8 p-4 rounded border border-[var(--border)] bg-[var(--surface)]">
              <h3 className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">
                {t.education.languagesGroup}
              </h3>
              <ul className="mt-3 flex flex-wrap gap-x-6 gap-y-2">
                {languages.map((l) => (
                  <li key={l.name} className="flex items-baseline gap-2">
                    <span className="text-sm text-[var(--foreground)]">{l.name}</span>
                    <span className="text-xs text-[var(--foreground-muted)]">{l.level}</span>
                  </li>
                ))}
              </ul>
            </div>
          </>
        ) : (
          <dl className="mt-8 divide-y divide-[var(--border)]">
            {Object.entries(skills).map(([group, items]) => (
              <div
                key={group}
                className="py-5 grid sm:grid-cols-[170px_1fr] gap-2 sm:gap-10"
              >
                <dt className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--accent-gold-soft)] sm:pt-1">
                  {group}
                </dt>
                <dd className="text-sm sm:text-base text-[var(--foreground)] font-normal leading-relaxed">
                  {items.join(" · ")}
                </dd>
              </div>
            ))}
            <div className="py-5 grid sm:grid-cols-[170px_1fr] gap-2 sm:gap-10">
              <dt className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--accent-gold-soft)] sm:pt-1">
                {t.education.languagesGroup}
              </dt>
              <dd className="text-sm sm:text-base text-[var(--foreground)] font-normal leading-relaxed">
                {languages
                  .map((l) => `${l.name} (${l.level.toLowerCase()})`)
                  .join(" · ")}
              </dd>
            </div>
          </dl>
        )}
      </div>
    </section>
  );
}
