"use client";
import { useData } from "@/lib/data";
import { useT } from "@/lib/i18n";
import { SectionHeader } from "./SectionHeader";
import { ExperienceCard } from "./ExperienceCard";
import { useViewMode } from "@/lib/ViewMode";

export function ExperienceTimeline() {
  const { detailed } = useViewMode();
  const { experience } = useData();
  const t = useT();

  return (
    <section id="experience" className="py-20 sm:py-28 px-6 sm:px-8">
      <div className="max-w-5xl mx-auto">
        <SectionHeader
          index="01"
          title={t.section.experienceTitle}
          subtitle={t.section.experienceSubtitle}
        />

        {detailed ? (
          <ol className="mt-10 relative space-y-10">
            <div
              aria-hidden
              className="absolute left-[6px] top-2 bottom-2 w-px bg-gradient-to-b from-[var(--border-strong)] via-[var(--border)] to-transparent"
            />
            {experience.map((exp, idx) => (
              <li key={exp.company} className="relative pl-8">
                <span
                  aria-hidden
                  className={`absolute left-0 top-2 size-[13px] rounded-full border-2 ${
                    idx === 0
                      ? "border-[var(--accent-warm)] bg-[var(--accent-warm)]"
                      : "border-[var(--accent)] bg-[var(--background)]"
                  }`}
                />
                <ExperienceCard exp={exp} />
              </li>
            ))}
          </ol>
        ) : (
          <ol className="mt-10 divide-y divide-[var(--border)]">
            {experience.map((exp) => (
              <li key={exp.company} className="py-8 first:pt-2">
                <ExperienceCard exp={exp} />
              </li>
            ))}
          </ol>
        )}
      </div>
    </section>
  );
}
