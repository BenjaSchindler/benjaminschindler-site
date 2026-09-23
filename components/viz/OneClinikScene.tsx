"use client";

import { motion } from "framer-motion";
import { Check, FileText, Play, Stethoscope, UserRound } from "lucide-react";
import { useLanguage } from "@/lib/Language";
import { DemoControls, useDemoPlayback } from "./primitives/DemoPlayback";

/** A compressed illustration of the recorded-video workflow, with no patient data. */
export function OneClinikScene() {
  const { lang } = useLanguage();
  const es = lang === "es";
  const [ref, demo] = useDemoPlayback(4, 1500);
  const duration = demo.reduced ? 0 : 0.55;
  const stages = es
    ? ["Grabar la consulta", "Revisión médica", "Recibir la respuesta"]
    : ["Record a question", "Doctor reviews", "Receive the reply"];
  const captions = es
    ? ["Video del paciente", "Resumen PrexX + criterio médico", "Video y notas en el portal"]
    : ["Patient video", "PrexX summary + medical judgment", "Video and notes in the portal"];

  return (
    <div ref={ref} className="demo-surface">
      <ol className="grid gap-6 p-4 sm:p-6 md:grid-cols-3 md:gap-8">
        {stages.map((title, index) => (
          <li key={title} className="min-w-0">
            <div className="mb-3 flex items-center gap-2.5 text-sm font-medium">
              <span className={`font-mono text-xs ${demo.step >= index ? "text-[var(--accent-cyan)]" : "text-[var(--foreground-muted)]"}`}>
                0{index + 1}
              </span>
              {title}
            </div>
            <div className="grid grid-cols-[1fr_1fr] items-center gap-4 md:block">
              <div className="relative flex h-28 min-w-0 items-center justify-center md:h-40">
                {index === 0 && (
                  <div className="relative h-full w-full overflow-hidden rounded-xl border border-[var(--border-strong)] bg-[var(--surface)]">
                    <div aria-hidden className="absolute inset-0 flex items-center justify-center">
                      <div className="flex size-20 items-center justify-center rounded-full border border-[var(--accent-cyan)]/20 bg-[var(--accent-cyan)]/5 md:size-24">
                        <UserRound strokeWidth={1} className="size-12 text-[var(--foreground-dim)]" />
                      </div>
                    </div>
                    <span className="absolute left-2.5 top-2.5 flex items-center gap-1.5 rounded bg-[var(--background)] px-2 py-1 text-[10px] font-medium">
                      <span aria-hidden className={`size-1.5 rounded-full ${demo.step > 0 ? "bg-[var(--accent-cyan)]" : "bg-[var(--accent-gold)]"}`} />
                      {demo.step > 0 ? (es ? "Enviado" : "Sent") : (es ? "Grabando" : "Recording")}
                    </span>
                    <div aria-hidden className="absolute inset-x-3 bottom-3 flex h-5 items-center justify-center gap-1">
                      {[3, 7, 12, 6, 17, 10, 5, 14, 8, 4, 11, 6].map((height, i) => (
                        <motion.span key={i} initial={false}
                          animate={{ scaleY: demo.step > 0 ? 0.3 : 1, opacity: demo.step > 0 ? 0.5 : 1 }}
                          transition={{ duration, delay: demo.reduced ? 0 : i * 0.025 }}
                          style={{ height }} className="w-1 rounded-full bg-[var(--accent-cyan)]" />
                      ))}
                    </div>
                  </div>
                )}
                {index === 1 && (
                  <div className="relative w-full px-1 md:px-3">
                    <motion.div aria-hidden initial={false}
                      animate={{ rotate: demo.step >= 1 ? -5 : -9, y: demo.step >= 1 ? -4 : 0 }}
                      transition={{ duration }}
                      className="absolute inset-x-2 inset-y-0 rounded-lg border border-[var(--border-strong)] bg-[var(--surface)]" />
                    <motion.div initial={false}
                      animate={{ rotate: demo.step >= 1 ? 0 : 3, y: demo.step >= 1 ? 0 : 5 }}
                      transition={{ duration }} className="demo-paper relative p-3 md:p-4">
                      <p className="flex items-center gap-2 text-xs font-medium text-[var(--accent-cyan)]"><FileText aria-hidden className="size-4" />PrexX</p>
                      <div aria-hidden className="my-3 space-y-2">
                        {["w-full", "w-4/5", "w-3/5"].map((width, i) => (
                          <motion.div key={width} initial={false}
                            animate={{ scaleX: demo.step >= 1 ? 1 : 0.35 }}
                            transition={{ duration, delay: demo.reduced ? 0 : i * 0.1 }}
                            className={`h-1 origin-left rounded bg-[var(--border-strong)] ${width}`} />
                        ))}
                      </div>
                      <motion.div initial={false} animate={{ opacity: demo.step >= 2 ? 1 : 0.6 }} transition={{ duration }}
                        className="flex items-center gap-1.5 border-t border-[var(--border)] pt-2 text-[11px] text-[var(--foreground-dim)]">
                        <Stethoscope aria-hidden className="size-3.5 shrink-0 text-[var(--accent-gold)]" />
                        {demo.step >= 2 ? (es ? "Revisado" : "Reviewed") : (es ? "Por revisar" : "To review")}
                      </motion.div>
                    </motion.div>
                  </div>
                )}
                {index === 2 && (
                  <motion.div initial={false}
                    animate={{ y: demo.step >= 3 ? 0 : 6, opacity: demo.step >= 3 ? 1 : 0.65 }}
                    transition={{ duration }}
                    className="demo-paper w-full overflow-hidden">
                    <div aria-hidden className="relative flex h-16 items-center justify-center bg-[var(--accent-cyan)]/5 md:h-24">
                      <Stethoscope strokeWidth={1} className="size-10 text-[var(--accent-cyan)] md:size-12" />
                      <span className="absolute bottom-2 left-2 rounded-full border border-[var(--border-strong)] bg-[var(--surface)] p-1"><Play className="size-3" /></span>
                    </div>
                    <div className="flex items-center gap-2 border-t border-[var(--border)] p-2.5 text-xs text-[var(--foreground-dim)]">
                      <FileText aria-hidden className="size-3.5 shrink-0" />{es ? "Notas médicas" : "Doctor’s notes"}
                      {demo.step >= 3 && <Check aria-hidden className="ml-auto size-3.5 shrink-0 text-[var(--accent-cyan)]" />}
                    </div>
                  </motion.div>
                )}
              </div>
              <p className="text-xs leading-relaxed text-[var(--foreground-dim)] md:mt-4">{captions[index]}</p>
            </div>
            <div aria-hidden className="demo-rail mt-3">
              <motion.div initial={false} animate={{ scaleX: demo.step > index ? 1 : 0 }} transition={{ duration }} className="demo-rail-fill" />
            </div>
          </li>
        ))}
      </ol>
      <DemoControls playback={demo} label={es ? "Recorrido ilustrativo · videos grabados" : "Illustrative flow · recorded videos"} />
    </div>
  );
}
