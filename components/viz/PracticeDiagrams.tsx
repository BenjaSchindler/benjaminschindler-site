"use client";

import { useId, useState } from "react";
import { motion } from "framer-motion";
import { ArrowDown, ArrowRight, Check, FileText, Fingerprint, GitBranch, LockKeyhole, ShieldCheck, ShoppingCart, Stethoscope, TriangleAlert } from "lucide-react";
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

// Fictional weekly LLM-as-judge averages (1–5). A dips in week 6: the kind of drift the monitor should surface.
const JUDGE_WEEKS = { A: [3.9, 4.0, 3.9, 4.1, 4.0, 3.3, 3.9, 4.0], B: [4.2, 4.3, 4.4, 4.3, 4.4, 4.3, 4.5, 4.4] };
const JUDGE_THRESHOLD = 3.6;
const DRIFT_WEEK = 5;
const chartX = (week: number) => 14 + week * (252 / 7);
const chartY = (score: number) => 88 - ((score - 3) / 2) * 76;
const chartPath = (series: number[]) => series.map((v, i) => `${i ? "L" : "M"}${chartX(i)} ${chartY(v)}`).join(" ");

export function EvalGateDiagram() {
  const { lang } = useLanguage();
  const es = lang === "es";
  const locale = es ? "es-CL" : "en-US";
  const [ref, demo] = useDemoPlayback(4, 1300);
  const [version, setVersion] = useState<"A" | "B">("A");
  const criteria = es ? ["Empatía", "Seguridad", "Paso concreto"] : ["Empathy", "Safety", "Concrete step"];
  const samples = {
    A: { response: es ? "Suena agotador. ¿Qué parte del día ha sido más difícil?" : "That sounds exhausting. What has been the hardest part of your day?", scores: [5, 5, 2] },
    B: { response: es ? "Suena agotador. Prueba una pausa de dos minutos para respirar. ¿Qué parte del día ha sido más difícil?" : "That sounds exhausting. Try a two-minute breathing pause. What has been the hardest part of your day?", scores: [5, 5, 4] },
  };
  const sample = samples[version];
  const average = sample.scores.reduce((a, b) => a + b, 0) / sample.scores.length;
  const fmt = (n: number) => n.toLocaleString(locale, { minimumFractionDigits: 1, maximumFractionDigits: 1 });
  const flagged = demo.step >= 3;
  const lineColor = (v: "A" | "B") => version === v ? "var(--accent-cyan)" : "var(--foreground-muted)";

  return <div ref={ref} className="demo-surface">
    <div className="p-4 sm:p-5">
      <div role="group" aria-label={es ? "Versión del prompt" : "Prompt version"} className="grid grid-cols-2 gap-2">
        {(["A", "B"] as const).map(v => <button key={v} type="button" className="demo-choice" aria-pressed={version === v} onClick={() => { setVersion(v); demo.replay(); }}>Prompt {v}</button>)}
      </div>

      <div className="demo-paper mt-4 p-3">
        <p className="text-[11px] text-[var(--foreground-muted)]">{es ? `Respuesta registrada en Langfuse · Prompt ${version}` : `Response traced in Langfuse · Prompt ${version}`}</p>
        <p className="mt-2 min-h-10 text-sm leading-relaxed">{sample.response}</p>
      </div>

      <div className="mt-4">
        <p className="text-xs font-medium text-[var(--foreground-dim)]">{es ? "El juez LLM aplica la rúbrica" : "The LLM judge applies the rubric"}</p>
        <ul className="mt-2 space-y-2">
          {criteria.map((label, i) => {
            const score = sample.scores[i];
            return <li key={i} className="grid grid-cols-[6.5rem_1fr_1.25rem] items-center gap-2 text-xs">
              <span className="text-[var(--foreground-dim)]">{label}</span>
              <span aria-hidden className="h-1.5 rounded-full bg-[var(--border)]">
                <motion.span initial={false} animate={{ scaleX: demo.step >= 1 ? score / 5 : 0 }} transition={{ duration: demo.reduced ? 0 : .5, delay: demo.reduced ? 0 : i * .12 }}
                  className={`block h-full origin-left rounded-full ${score >= 4 ? "bg-[var(--accent-cyan)]" : "bg-[var(--accent-warm)]"}`} />
              </span>
              <span className="text-right font-mono tabular-nums">{demo.step >= 1 ? score : "·"}</span>
            </li>;
          })}
        </ul>
        <p className="mt-2 text-right text-xs text-[var(--foreground-dim)]">{es ? "Puntaje" : "Score"} <span className="font-mono tabular-nums text-[var(--foreground)]">{demo.step >= 1 ? fmt(average) : "–"}</span> / 5</p>
      </div>

      <div className="mt-4 border-t border-[var(--border)] pt-4">
        <p className="text-xs font-medium text-[var(--foreground-dim)]">{es ? "Promedio semanal del juez" : "Weekly judge average"}</p>
        <svg viewBox="0 0 280 96" className="mt-2 h-auto w-full" role="img" aria-label={es ? "Puntajes semanales ficticios: B supera a A todas las semanas; A cae bajo el umbral en la semana 6." : "Fictional weekly scores: B beats A every week; A drops below the threshold in week 6."}>
          <line x1={chartX(0)} x2={chartX(7)} y1={chartY(JUDGE_THRESHOLD)} y2={chartY(JUDGE_THRESHOLD)} stroke="var(--accent-warm)" strokeOpacity={.6} strokeDasharray="3 3" />
          {(["A", "B"] as const).map(v => <motion.path key={`${v}-${version}`} d={chartPath(JUDGE_WEEKS[v])} fill="none" stroke={lineColor(v)} strokeWidth={version === v ? 2 : 1.25} strokeLinejoin="round"
            initial={demo.reduced ? false : { pathLength: 0 }} animate={{ pathLength: demo.step >= 2 ? 1 : 0 }} transition={{ duration: demo.reduced ? 0 : .9, ease: "easeOut" }} />)}
          {(["A", "B"] as const).map(v => <motion.text key={v} x={chartX(7) + 5} y={chartY(JUDGE_WEEKS[v][7]) + 3} fontSize={9} fill={lineColor(v)} initial={false} animate={{ opacity: demo.step >= 2 ? 1 : 0 }} transition={{ duration: demo.reduced ? 0 : .3 }}>{v}</motion.text>)}
          <motion.circle cx={chartX(DRIFT_WEEK)} cy={chartY(JUDGE_WEEKS.A[DRIFT_WEEK])} r={7} fill="none" stroke="var(--accent-warm)" strokeWidth={1.5}
            initial={false} animate={{ opacity: flagged ? 1 : 0, scale: flagged || demo.reduced ? 1 : .4 }} transition={{ duration: demo.reduced ? 0 : .35 }} style={{ transformBox: "fill-box", transformOrigin: "center" }} />
        </svg>
        <div aria-hidden className="flex justify-between px-1 font-mono text-[10px] text-[var(--foreground-muted)]"><span>{es ? "sem 1" : "wk 1"}</span><span>{es ? "sem 8" : "wk 8"}</span></div>
        <p className="mt-2 flex items-center gap-2 text-[11px] text-[var(--foreground-muted)]"><span aria-hidden className="w-4 border-t border-dashed border-[var(--accent-warm)]" />{es ? `Umbral de revisión (${fmt(JUDGE_THRESHOLD)})` : `Review threshold (${fmt(JUDGE_THRESHOLD)})`}</p>
      </div>

      <div className="demo-status mt-2" aria-live="polite">
        {flagged ? <TriangleAlert aria-hidden className="size-4 shrink-0 text-[var(--accent-warm)]" /> : <Check aria-hidden className={`size-4 shrink-0 ${demo.step >= 2 ? "text-[var(--accent-cyan)]" : "text-[var(--foreground-muted)]"}`} />}
        <span className={flagged ? "text-[var(--accent-warm)]" : undefined}>{flagged ? (es ? "Semana 6: Prompt A cae bajo el umbral → revisar" : "Week 6: Prompt A drops below the threshold → review") : demo.step >= 2 ? (es ? "B supera a A en las 8 semanas" : "B beats A in all 8 weeks") : (es ? "Cada respuesta evaluada alimenta el promedio semanal" : "Each judged response feeds the weekly average")}</span>
      </div>
    </div>
    <DemoControls playback={demo} label={es ? "Datos ficticios · puntajes ilustrativos" : "Fictional data · illustrative scores"} />
  </div>;
}
