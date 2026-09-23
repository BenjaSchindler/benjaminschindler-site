"use client";

import { useId, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowDown, ArrowRight, Check, FileText, Fingerprint, GitBranch, LockKeyhole, ScanLine, ShieldCheck, ShoppingCart, Stethoscope, X } from "lucide-react";
import { useLanguage } from "@/lib/Language";
import { DemoControls, useDemoPlayback } from "./primitives/DemoPlayback";

export function HarnessDiagram() {
  const { lang } = useLanguage();
  const es = lang === "es";
  const [ref, demo] = useDemoPlayback(4, 1100);
  const [choice, setChoice] = useState(0);
  const examples = es ? [
    { label: "Pago", query: "Quiero pagar mi pedido", route: "Comercio", tool: "Transbank", result: "Enlace de pago preparado", icon: ShoppingCart },
    { label: "Soporte", query: "¿Dónde veo mi pedido?", route: "Soporte", tool: "Supabase", result: "Consulta del estado del pedido", icon: FileText },
    { label: "Aprobación", query: "Necesito una aprobación clínica", route: "Revisión médica", tool: "Profesional de salud", result: "Derivación a revisión humana", icon: Stethoscope },
  ] : [
    { label: "Payment", query: "I'd like to pay for my order", route: "Commerce", tool: "Transbank", result: "Payment link prepared", icon: ShoppingCart },
    { label: "Support", query: "Where can I find my order?", route: "Support", tool: "Supabase", result: "Order status lookup", icon: FileText },
    { label: "Approval", query: "I need a clinical approval", route: "Medical review", tool: "Health professional", result: "Routed to human review", icon: Stethoscope },
  ];
  const selected = examples[choice];
  const Icon = selected.icon;
  return <div ref={ref} className="demo-surface">
    <div className="p-4 sm:p-5">
      <div role="group" aria-label={es ? "Tipo de solicitud" : "Request type"} className="flex flex-wrap gap-2">
        {examples.map((item, i) => <button key={i} className="demo-choice" aria-pressed={choice === i} onClick={() => { setChoice(i); demo.replay(); }}>{item.label}</button>)}
      </div>
      <div className="mt-5 min-h-14 rounded-xl rounded-bl-sm border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-sm leading-relaxed">{selected.query}</div>
      <div className="relative flex h-28 items-center justify-center">
        <div aria-hidden className="absolute inset-y-0 left-1/2 w-px bg-[var(--border-strong)]" />
        <motion.div animate={{ scale: demo.step === 1 ? 1.08 : 1 }} transition={{ type: "spring", stiffness: 180, damping: 22, duration: demo.reduced ? 0 : undefined }} className="relative flex size-20 items-center justify-center rounded-full border border-[var(--accent-cyan)]/50 bg-[var(--background)]">
          <svg aria-hidden viewBox="0 0 80 80" className="absolute inset-0 size-full -rotate-90"><circle cx="40" cy="40" r="37" fill="none" stroke="var(--border)" /><motion.circle cx="40" cy="40" r="37" fill="none" stroke="var(--accent-cyan)" strokeWidth="2" initial={false} animate={{ pathLength: demo.step >= 1 ? 1 : 0 }} transition={{ duration: demo.reduced ? 0 : .8 }} /></svg>
          <div className="text-center"><GitBranch aria-hidden className="mx-auto size-5 text-[var(--accent-cyan)]" /><span className="mt-1 block text-[11px]">LangGraph</span></div>
        </motion.div>
      </div>
      <motion.div initial={false} animate={{ opacity: demo.step >= 2 ? 1 : .65, y: demo.step >= 2 || demo.reduced ? 0 : 6 }} transition={{ duration: demo.reduced ? 0 : .35 }} className="demo-paper flex items-center gap-3 p-4">
        <Icon aria-hidden className="size-5 shrink-0 text-[var(--accent-cyan)]" /><div className="min-w-0"><p className="text-sm font-medium">{selected.route}</p><p className="mt-1 text-xs text-[var(--foreground-dim)]">{selected.tool}</p></div><ArrowRight aria-hidden className="ml-auto size-4 shrink-0 text-[var(--foreground-muted)]" />
      </motion.div>
      <div className="demo-status mt-3"><ShieldCheck aria-hidden className="size-4 shrink-0 text-[var(--accent-cyan)]" /><span>{demo.step >= 3 ? selected.result : es ? "Enrutamiento sujeto a reglas de negocio" : "Routing follows business rules"}</span></div>
    </div>
    <DemoControls playback={demo} />
  </div>;
}

export function PromptDiffDiagram() {
  const { lang } = useLanguage();
  const es = lang === "es";
  const [ref, demo] = useDemoPlayback(4, 1200);
  const [user, setUser] = useState(0);
  const layoutId = useId();
  const variant = user % 2;
  return <div ref={ref} className="demo-surface">
    <div className="p-4 sm:p-5">
      <div className="flex items-center justify-between gap-3"><p className="text-xs text-[var(--foreground-dim)]">{es ? "Elige un usuario de ejemplo" : "Choose an example user"}</p><Fingerprint aria-hidden className="size-5 text-[var(--accent-cyan)]" /></div>
      <div role="group" aria-label={es ? "Usuario de ejemplo" : "Example user"} className="mt-3 grid grid-cols-4 gap-2">
        {[0, 1, 2, 3].map(i => <button key={i} className="demo-choice relative" aria-pressed={user === i} onClick={() => { setUser(i); demo.replay(); }}>
          {user === i && <motion.span layoutId={demo.reduced ? undefined : layoutId} className="absolute inset-0 rounded-md bg-[var(--accent-cyan)]/10" transition={{ type: "spring", stiffness: 350, damping: 32, duration: demo.reduced ? 0 : undefined }} />}
          <span className="relative font-mono">U0{i + 1}</span>
        </button>)}
      </div>
      <svg aria-hidden viewBox="0 0 320 54" className="h-14 w-full" preserveAspectRatio="none">
        {[0, 1].map(i => <g key={i}><path d={`M160 0 V16 Q160 28 ${i === 0 ? 80 : 240} 28 V54`} fill="none" stroke="var(--border-strong)" /><motion.path d={`M160 0 V16 Q160 28 ${i === 0 ? 80 : 240} 28 V54`} fill="none" stroke="var(--accent-cyan)" strokeWidth="2" initial={false} animate={{ pathLength: demo.step >= 1 && variant === i ? 1 : 0 }} transition={{ duration: demo.reduced ? 0 : .6 }} /></g>)}
      </svg>
      <div className="grid grid-cols-2 gap-3">
        {["A", "B"].map((v, i) => <motion.div key={v} initial={false} animate={{ y: demo.step >= 1 && variant === i ? -4 : 0, rotate: demo.step >= 1 && variant === i ? 0 : i === 0 ? -2 : 2, opacity: demo.step >= 1 && variant !== i ? .5 : 1 }} transition={{ duration: demo.reduced ? 0 : .35 }} className="demo-paper min-w-0 p-3">
          <div className="flex items-center justify-between gap-2"><span className="text-sm font-medium">Prompt {v}</span><span className={`size-2 shrink-0 rounded-full ${variant === i && demo.step >= 1 ? "bg-[var(--accent-cyan)]" : "bg-[var(--border-strong)]"}`} /></div>
          <p className="mt-3 text-xs leading-relaxed text-[var(--foreground-dim)]">{es ? "Responde con empatía." : "Respond with empathy."}</p>
          <div className="mt-3 min-h-14 border-t border-[var(--border)] pt-2 text-xs leading-relaxed">{i === 1 ? <span className="text-[var(--accent-cyan)]">+ {es ? "Propón un paso concreto." : "Suggest one concrete step."}</span> : <span className="text-[var(--foreground-muted)]">{es ? "Versión de referencia" : "Reference version"}</span>}</div>
        </motion.div>)}
      </div>
      <div className="mt-5 demo-rail"><motion.div className="demo-rail-fill" initial={false} animate={{ scaleX: demo.step >= 2 ? 1 : 0 }} transition={{ duration: demo.reduced ? 0 : .7 }} /></div>
      <div className="demo-status mt-2"><Check aria-hidden className={`size-4 shrink-0 ${demo.step >= 3 ? "text-[var(--accent-cyan)]" : "text-[var(--foreground-muted)]"}`} /><span>{demo.step >= 3 ? `U0${user + 1} → Prompt ${variant === 0 ? "A" : "B"} → Langfuse` : es ? "Mismo usuario, misma versión" : "Same user, same version"}</span></div>
    </div>
    <DemoControls playback={demo} label={es ? "Prompts ilustrativos" : "Illustrative prompts"} />
  </div>;
}

export function RetrievalDiagram() {
  const { lang } = useLanguage();
  const es = lang === "es";
  const [ref, demo] = useDemoPlayback(4, 1300);
  const [source, setSource] = useState(0);
  const docs = source === 0 ? ["Drive", "Jira", "Gmail"] : [es ? "Manuales" : "Manuals", es ? "Código" : "Code", es ? "Políticas" : "Policies"];
  return <div ref={ref} className="demo-surface">
    <div className="p-4 sm:p-5">
      <div role="group" aria-label={es ? "Ruta de búsqueda" : "Retrieval path"} className="grid grid-cols-2 gap-2"><button className="demo-choice" aria-pressed={source === 0} onClick={() => { setSource(0); demo.replay(); }}>Vertex AI Search</button><button className="demo-choice" aria-pressed={source === 1} onClick={() => { setSource(1); demo.replay(); }}>Vector Search</button></div>
      <div className="relative mt-6 h-40">
        {docs.map((doc, i) => {
          const excluded = source === 0 && i === 2 && demo.step >= 1;
          return <motion.div key={`${source}-${doc}`} className="demo-paper absolute inset-x-2 flex items-center gap-3 px-3 py-3" initial={false} animate={{ y: i * 43, x: excluded ? 8 : demo.step >= 2 ? 0 : (i - 1) * 4, rotate: demo.step >= 2 ? 0 : (i - 1) * 2, opacity: excluded ? .6 : 1 }} transition={{ duration: demo.reduced ? 0 : .5 }}>
            {excluded ? <LockKeyhole aria-hidden className="size-4 shrink-0" /> : <FileText aria-hidden className="size-4 shrink-0 text-[var(--accent-cyan)]" />}
            <span className="text-sm">{doc}</span><span className="ml-auto text-xs text-[var(--foreground-dim)]">{demo.step >= 1 ? excluded ? (es ? "Sin acceso" : "No access") : source === 0 ? (es ? "Permitido" : "Allowed") : (es ? "Seleccionado" : "Curated") : "···"}</span>
          </motion.div>;
        })}
      </div>
      <div className="flex items-center justify-center gap-2 py-2 text-xs text-[var(--foreground-dim)]"><ArrowDown aria-hidden className="size-4 text-[var(--accent-cyan)]" />{source === 0 ? (es ? "Solo información autorizada" : "Authorized knowledge only") : (es ? "Colección seleccionada" : "Curated collection")}</div>
      <motion.div initial={false} animate={{ opacity: demo.step >= 2 ? 1 : .65, y: demo.step >= 2 ? 0 : 4 }} transition={{ duration: demo.reduced ? 0 : .35 }} className="rounded-lg border border-[var(--accent-cyan)]/30 bg-[var(--accent-cyan)]/5 p-4">
        <p className="text-sm font-medium">{es ? "Contexto para el agente" : "Context for the agent"}</p>
        <div className="mt-3 flex flex-wrap gap-2">{docs.slice(0, source === 0 ? 2 : 3).map((d, i) => <motion.span key={d} initial={false} animate={{ opacity: demo.step >= 3 ? 1 : .25, y: demo.step >= 3 || demo.reduced ? 0 : 6 }} transition={{ duration: demo.reduced ? 0 : .3, delay: demo.reduced ? 0 : i * .1 }} className="rounded border border-[var(--border-strong)] px-2 py-1 text-xs text-[var(--foreground-dim)]">[{i + 1}] {d}</motion.span>)}</div>
      </motion.div>
    </div>
    <DemoControls playback={demo} label={es ? "Accesos ilustrativos" : "Illustrative permissions"} />
  </div>;
}

export function EvalGateDiagram() {
  const { lang } = useLanguage();
  const es = lang === "es";
  const [ref, demo] = useDemoPlayback(4, 1250);
  const [redacted, setRedacted] = useState(false);
  const done = demo.step >= 3;
  return <div ref={ref} className="demo-surface">
    <div className="p-4 sm:p-5">
      <div role="group" aria-label={es ? "Respuesta a evaluar" : "Response to evaluate"} className="flex flex-wrap gap-2">
        <button className="demo-choice" aria-pressed={!redacted} onClick={() => { setRedacted(false); demo.replay(); }}>{es ? "Con dato personal" : "Personal data present"}</button>
        <button className="demo-choice" aria-pressed={redacted} onClick={() => { setRedacted(true); demo.replay(); }}>{es ? "Dato oculto" : "Data redacted"}</button>
      </div>
      <div className="mt-5 flex items-center gap-2 text-xs text-[var(--foreground-dim)]"><ScanLine aria-hidden className="size-4 text-[var(--accent-cyan)]" />{es ? "Criterio · no exponer datos personales" : "Criterion · do not expose personal data"}</div>
      <div className="demo-paper relative mt-3 overflow-hidden p-4">
        <p className="text-xs text-[var(--foreground-muted)]">{es ? "Respuesta de ejemplo" : "Example response"}</p>
        <p className="mt-4 min-h-14 break-words text-sm leading-loose">{es ? "Mi correo es " : "My email is "}<motion.span key={String(redacted)} initial={demo.reduced ? false : { opacity: 0 }} animate={{ opacity: 1 }} className={`rounded px-1 py-0.5 ${demo.step >= 2 ? redacted ? "bg-[var(--accent-cyan)]/15 text-[var(--accent-cyan)]" : "bg-[var(--accent-warm)]/15 text-[var(--accent-warm)]" : "text-[var(--foreground)]"}`}>{redacted ? "[EMAIL]" : "persona@example.com"}</motion.span></p>
        {!demo.reduced && <motion.div aria-hidden initial={false} animate={{ y: demo.step >= 1 ? 155 : 0, opacity: demo.step === 1 ? 1 : 0 }} transition={{ y: { duration: 1.1, ease: "linear" }, opacity: { duration: .2 } }} className="pointer-events-none absolute inset-x-0 top-0 h-px bg-[var(--accent-cyan)] shadow-[0_0_16px_var(--accent-cyan)]" />}
      </div>
      <div className="mt-5 space-y-3 text-xs">
        {[(es ? "Leer respuesta" : "Read response"), (es ? "Aplicar criterio" : "Apply criterion"), (es ? "Registrar evaluación" : "Record evaluation")].map((label, i) => <div key={label} className="flex items-center gap-2"><span className={`flex size-5 shrink-0 items-center justify-center rounded-full border ${demo.step > i ? "border-[var(--accent-cyan)]/50 text-[var(--accent-cyan)]" : "border-[var(--border-strong)] text-[var(--foreground-muted)]"}`}>{demo.step > i ? <Check aria-hidden className="size-3" /> : i + 1}</span><span className="text-[var(--foreground-dim)]">{label}</span></div>)}
      </div>
      <div className="mt-4 min-h-12 border-t border-[var(--border)] pt-3">
        <AnimatePresence mode="wait" initial={false}><motion.div key={`${done}-${redacted}`} initial={demo.reduced ? false : { opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: demo.reduced ? 0 : .2 }} className={`flex items-center gap-2 text-sm ${done && !redacted ? "text-[var(--accent-warm)]" : "text-[var(--accent-cyan)]"}`}>
          {done ? redacted ? <ShieldCheck aria-hidden className="size-4" /> : <X aria-hidden className="size-4" /> : <ScanLine aria-hidden className="size-4" />}
          {done ? redacted ? (es ? "Cumple este criterio" : "Meets this criterion") : (es ? "Revisar: dato personal visible" : "Review: personal data visible") : (es ? "Evaluación en curso" : "Evaluating response")}
        </motion.div></AnimatePresence>
      </div>
    </div>
    <DemoControls playback={demo} label={es ? "Caso ficticio · sin llamada a un LLM" : "Fictional case · no LLM call"} />
  </div>;
}
