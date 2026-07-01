"use client";
import { useData, type PracticeArea } from "@/lib/data";
import { useT } from "@/lib/i18n";
import { SectionHeader } from "./SectionHeader";
import { motion } from "framer-motion";
import { useViewMode } from "@/lib/ViewMode";
import {
  HarnessDiagram,
  PromptDiffDiagram,
  CoEvolutionDiagram,
  EvalGateDiagram,
} from "./viz/PracticeDiagrams";

const DIAGRAMS: Record<PracticeArea["id"], React.ComponentType> = {
  harness: HarnessDiagram,
  prompts: PromptDiffDiagram,
  coevolution: CoEvolutionDiagram,
  evals: EvalGateDiagram,
};

// Technical view only — the concise résumé keeps its shorter section list.
export function PracticeSection() {
  const { detailed } = useViewMode();
  const { practice } = useData();
  const t = useT();

  if (!detailed) return null;

  return (
    <section id="practice" className="py-20 sm:py-28 px-6 sm:px-8">
      <div className="max-w-5xl mx-auto">
        <SectionHeader
          index="05"
          title={t.section.practiceTitle}
          subtitle={t.section.practiceSubtitle}
        />

        <div className="mt-8 grid md:grid-cols-2 gap-4">
          {practice.map((p, idx) => {
            const Diagram = DIAGRAMS[p.id];
            return (
              <motion.article
                key={p.id}
                initial={{ y: 12 }}
                whileInView={{ y: 0 }}
                viewport={{ once: true, margin: "-60px", amount: 0.05 }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
                className="flex flex-col p-5 rounded border border-[var(--border)] bg-[var(--surface)] hover:border-[var(--accent)]/30 transition-colors"
              >
                <h3 className="text-lg font-semibold text-[var(--foreground)]">
                  {p.title}
                </h3>
                <p className="mt-1.5 text-[13px] leading-relaxed text-[var(--foreground-dim)]">
                  {p.definition}
                </p>
                <div className="mt-4">
                  <Diagram />
                </div>
                <ul className="mt-4 space-y-1.5 text-[13px] text-[var(--foreground-dim)] leading-relaxed">
                  {p.evidence.map((e, i) => (
                    <li key={i} className="flex gap-2">
                      <span className="mt-2 size-1 rounded-full bg-[var(--accent)] shrink-0" />
                      <span>{e}</span>
                    </li>
                  ))}
                </ul>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
