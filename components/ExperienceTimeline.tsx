"use client";
import { experience } from "@/lib/data";
import { SectionHeader } from "./SectionHeader";
import { ExperienceCard } from "./ExperienceCard";
import { useViewMode } from "@/lib/ViewMode";

export function ExperienceTimeline() {
  const { detailed } = useViewMode();

  return (
    <section id="experience" className="py-20 sm:py-28 px-6 sm:px-8">
      <div className="max-w-5xl mx-auto">
        <SectionHeader
          index="01"
          title="experience"
          subtitle="hover the visualizations · scroll to play"
        />

        {detailed ? (
          <ol className="mt-10 relative space-y-10">
            <div
              aria-hidden
              className="absolute left-[7px] top-2 bottom-2 w-px bg-gradient-to-b from-[var(--border-strong)] via-[var(--border)] to-transparent"
            />
            {experience.map((exp, idx) => (
              <li key={exp.company} className="relative pl-8">
                <span
                  aria-hidden
                  className="absolute left-0 top-2 size-[15px] rounded-full bg-[var(--background)] border-2 border-[var(--accent)]"
                  style={{
                    boxShadow:
                      idx === 0 ? "0 0 12px rgba(16, 255, 165, 0.6)" : undefined,
                  }}
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
