"use client";

import { motion } from "framer-motion";
import { CarFront, Check, FileCheck2, FileText, Fingerprint, Layers, ScanLine, ShieldCheck } from "lucide-react";
import { useLanguage } from "@/lib/Language";
import { DemoControls, useDemoPlayback } from "./primitives/DemoPlayback";

export function VehicleScene() {
  const { lang } = useLanguage();
  const es = lang === "es";
  const [ref, demo] = useDemoPlayback(5, 1100);
  const research = es ? ["Precios", "Fiabilidad", "Alertas", "Costos", "Competencia"] : ["Pricing", "Reliability", "Alerts", "Costs", "Competition"];
  return <div ref={ref} className="demo-surface">
    <div className="p-4 sm:p-5">
      <div className="grid grid-cols-2 items-center gap-4">
        <div className="relative flex h-36 items-center justify-center overflow-hidden rounded-lg border border-[var(--border-strong)] bg-[var(--surface)]">
          <span className="absolute left-3 top-3 text-xs text-[var(--foreground-muted)]">{es ? "Fotos" : "Photos"}</span>
          <CarFront aria-hidden strokeWidth={1} className="size-20 text-[var(--foreground-dim)]" />
          {!demo.reduced && <motion.div aria-hidden initial={false} animate={{ x: demo.step >= 1 ? 160 : -10, opacity: demo.step === 1 ? 1 : 0 }} transition={{ x: { duration: 1 }, opacity: { duration: .15 } }} className="absolute inset-y-0 left-0 w-px bg-[var(--accent-cyan)] shadow-[0_0_18px_var(--accent-cyan)]" />}
          <motion.span initial={false} animate={{ opacity: demo.step >= 1 ? 1 : 0 }} className="absolute bottom-3 right-3 rounded-full bg-[var(--background)] p-1.5"><ScanLine aria-hidden className="size-4 text-[var(--accent-cyan)]" /></motion.span>
        </div>
        <div className="relative flex h-36 items-center justify-center">
          <motion.div aria-hidden initial={false} animate={{ rotate: demo.step >= 4 ? -4 : -10, x: demo.step >= 4 ? -4 : -8 }} transition={{ duration: demo.reduced ? 0 : .6 }} className="absolute inset-x-3 inset-y-2 rounded-lg border border-[var(--border)] bg-[var(--surface)]" />
          <motion.div initial={false} animate={{ y: demo.step >= 4 ? 0 : 8, rotate: demo.step >= 4 ? 2 : 8, opacity: demo.step >= 3 ? 1 : .65 }} transition={{ duration: demo.reduced ? 0 : .55 }} className="demo-paper relative w-full p-3">
            <FileCheck2 aria-hidden className="size-6 text-[var(--accent-cyan)]" /><p className="mt-3 text-sm font-medium">{es ? "Tasación" : "Valuation"}</p>
            <div aria-hidden className="mt-3 space-y-2"><div className="h-1 w-full rounded bg-[var(--border-strong)]" /><div className="h-1 w-3/4 rounded bg-[var(--border-strong)]" /><div className="h-1 w-1/2 rounded bg-[var(--accent-cyan)]/50" /></div>
            <p className="mt-3 text-xs text-[var(--foreground-muted)]">{demo.step >= 4 ? "PDF" : es ? "En preparación" : "Preparing"}</p>
          </motion.div>
        </div>
      </div>
      <p className="mt-5 flex items-center gap-2 text-xs text-[var(--foreground-dim)]"><Layers aria-hidden className="size-4 text-[var(--accent-cyan)]" />{es ? "Cinco agentes investigan en paralelo" : "Five agents research in parallel"}</p>
      <div className="mt-3 flex flex-wrap gap-2">{research.map((label, i) => <motion.span key={label} initial={false} animate={{ opacity: demo.step >= 2 ? 1 : .65, y: demo.step >= 2 || demo.reduced ? 0 : 5 }} transition={{ duration: demo.reduced ? 0 : .3, delay: demo.reduced ? 0 : i * .09 }} className="flex items-center gap-1.5 rounded-full border border-[var(--border-strong)] bg-[var(--surface)] px-2.5 py-1.5 text-xs"><Check aria-hidden className={`size-3 ${demo.step >= 2 ? "text-[var(--accent-cyan)]" : "text-[var(--foreground-muted)]"}`} />{label}</motion.span>)}</div>
      <div className="demo-status mt-4 border-t border-[var(--border)] pt-3"><span className="size-1.5 shrink-0 rounded-full bg-[var(--accent-cyan)]" />{[es ? "Fotografías del vehículo" : "Vehicle photographs", es ? "El agente visual inspecciona las imágenes" : "The vision agent inspects the images", es ? "Investigación de mercado" : "Market research", es ? "El supervisor reúne los resultados" : "The supervisor combines the findings", es ? "Informe consolidado de tasación" : "Consolidated valuation report"][demo.step]}</div>
    </div>
    <DemoControls playback={demo} label={es ? "Flujo ilustrativo · sin tasación real" : "Illustrative flow · no real valuation"} />
  </div>;
}

export function WellbeingScene() {
  const { lang } = useLanguage();
  const es = lang === "es";
  const [ref, demo] = useDemoPlayback(5, 1150);
  return <div ref={ref} className="demo-surface">
    <div className="p-4 sm:p-5">
      <div className="rounded-xl rounded-br-sm border border-[var(--border-strong)] bg-[var(--surface)] px-4 py-3">
        <p className="text-xs text-[var(--foreground-muted)]">{es ? "Mensaje ficticio" : "Fictional message"}</p>
        <p className="mt-2 text-sm leading-relaxed">{es ? "Hoy me siento sobrepasado." : "I'm feeling overwhelmed today."}</p>
        <p className="mt-2 break-words font-mono text-xs text-[var(--foreground-muted)]"><motion.span key={demo.step >= 1 ? "hidden" : "raw"} initial={demo.reduced ? false : { opacity: 0 }} animate={{ opacity: 1 }}>{demo.step >= 1 ? "[EMAIL]" : "persona@example.com"}</motion.span></p>
      </div>
      <div className="relative my-4 space-y-3 border-l border-[var(--border-strong)] pl-4">
        {[{ icon: ShieldCheck, label: es ? "Datos personales y detección de crisis" : "Personal data and crisis detection" }, { icon: Fingerprint, label: es ? "Versión del prompt por usuario" : "Prompt version assigned per user" }, { icon: FileText, label: es ? "Respuesta y evaluación en Langfuse" : "Response and evaluation in Langfuse" }].map(({ icon: Icon, label }, i) => <motion.div key={i} initial={false} animate={{ opacity: demo.step > i ? 1 : .65, x: demo.step > i || demo.reduced ? 0 : 4 }} transition={{ duration: demo.reduced ? 0 : .3 }} className="flex items-center gap-2 text-xs leading-relaxed"><Icon aria-hidden className="size-4 shrink-0 text-[var(--accent-cyan)]" /><span>{label}</span></motion.div>)}
      </div>
      <motion.div initial={false} animate={{ opacity: demo.step >= 4 ? 1 : .65, y: demo.step >= 4 || demo.reduced ? 0 : 6 }} transition={{ duration: demo.reduced ? 0 : .4 }} className="min-h-24 rounded-xl rounded-bl-sm border border-[var(--accent-cyan)]/30 bg-[var(--accent-cyan)]/5 px-4 py-3">
        <p className="text-xs text-[var(--accent-cyan)]">{es ? "Ejemplo de respuesta" : "Example response"}</p><p className="mt-2 text-sm leading-relaxed">{es ? "Suena agotador. ¿Qué parte del día ha sido más difícil?" : "That sounds exhausting. What has been the hardest part of your day?"}</p>
      </motion.div>
    </div>
    <DemoControls playback={demo} label={es ? "Conversación ficticia · no es un caso real" : "Fictional conversation · not a real case"} />
  </div>;
}
