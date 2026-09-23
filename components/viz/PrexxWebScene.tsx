"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, Check, FileText, ListFilter, LockKeyhole, Search, SlidersHorizontal } from "lucide-react";
import { useLanguage } from "@/lib/Language";
import { useData } from "@/lib/data";
import { DemoControls, useDemoPlayback } from "./primitives/DemoPlayback";

type Route = "search" | "profile" | "support";

export function PrexxWebScene() {
  const { lang } = useLanguage();
  const es = lang === "es";
  const { experience } = useData();
  const system = experience.find(exp => exp.company === "Doctor911")?.systems?.find(item => item.name === "PrexX Web");
  const [route, setRoute] = useState<Route>("search");
  const choices = [
    { id: "search" as const, label: es ? "Buscar exámenes" : "Find tests", icon: Search },
    { id: "profile" as const, label: es ? "Recomendaciones" : "Recommendations", icon: SlidersHorizontal },
    { id: "support" as const, label: es ? "Mis pedidos" : "My orders", icon: FileText },
  ];
  return <div className="space-y-4">
    <div>
      <p className="text-sm font-medium">{system?.tagline}</p>
      <p className="mt-2 max-w-3xl text-[13px] leading-relaxed text-[var(--foreground-dim)]">{system?.description}</p>
    </div>
    <div role="group" aria-label={es ? "Explorar PrexX Web" : "Explore PrexX Web"} className="flex flex-wrap gap-2">
      {choices.map(({ id, label, icon: Icon }) => <button key={id} type="button" aria-pressed={route === id} onClick={() => setRoute(id)} className="demo-choice flex items-center gap-2"><Icon aria-hidden className="size-3.5" />{label}</button>)}
    </div>
    <WebFlow key={route} route={route} es={es} />
    <details className="text-xs text-[var(--foreground-dim)]">
      <summary className="w-fit cursor-pointer py-2 font-medium text-[var(--foreground)]">{es ? "Cómo se evalúa" : "How it is evaluated"}</summary>
      <p className="mt-1 max-w-3xl leading-relaxed">{es ? "El harness registra qué herramientas usa el agente. Vertex AI evalúa las rutas y las respuestas: alcance del servicio, seguridad y claridad." : "The harness records which tools the agent uses. Vertex AI evaluates tool paths and responses for service scope, safety, and clarity."}</p>
    </details>
  </div>;
}

function WebFlow({ route, es }: { route: Route; es: boolean }) {
  const [ref, demo] = useDemoPlayback(4, 1400);
  const duration = demo.reduced ? 0 : .45;
  const search = route === "search";
  const profile = route === "profile";
  const steps = search ? [
    [es ? "Entender la consulta" : "Understand the request", es ? "Intención → Bienvenida" : "Intent → Welcome"],
    [es ? "Buscar en el catálogo" : "Search the catalog", es ? "Embeddings + palabras clave (BM25)" : "Embeddings + keywords (BM25)"],
    [es ? "Combinar resultados" : "Combine results", es ? "RRF reúne ambas búsquedas" : "RRF merges both searches"],
    [es ? "Mostrar opciones" : "Show options", es ? "Tarjetas de packs y exámenes" : "Pack and test cards"],
  ] : profile ? [
    [es ? "Abrir el formulario" : "Open the form", es ? "Bienvenida recoge el perfil" : "Welcome collects the profile"],
    [es ? "Leer el perfil" : "Read the profile", es ? "Edad, antecedentes y dieta" : "Age, health history, and diet"],
    [es ? "Consultar el catálogo" : "Consult the catalog", es ? "Servicio de recomendación + LLM" : "Recommendation service + LLM"],
    [es ? "Explicar la selección" : "Explain the selection", es ? "Packs con motivos y próximos pasos" : "Packs with reasons and next steps"],
  ] : [
    [es ? "Pasar a soporte" : "Route to support", es ? "Intención → Soporte" : "Intent → Support"],
    [es ? "Verificar identidad" : "Verify identity", "Supabase JWT"],
    [es ? "Consultar sus pedidos" : "Look up their orders", es ? "Datos limitados al usuario" : "Data scoped to the user"],
    [es ? "Mostrar el estado" : "Show status", es ? "Pagos, órdenes y documentos" : "Payments, orders, and documents"],
  ];
  const request = search ? (es ? "Busco un pack de tiroides" : "I'm looking for a thyroid test pack") : profile ? (es ? "Quiero recomendaciones de exámenes" : "I'd like test recommendations") : (es ? "¿Dónde veo mi orden?" : "Where can I find my order?");

  return <div ref={ref} className="demo-surface">
    <div className="grid md:grid-cols-[1.15fr_1fr]">
      <div className="min-w-0 border-b border-[var(--border)] p-3 sm:p-5 md:border-b-0 md:border-r">
        <div className="overflow-hidden rounded-xl border border-[var(--border-strong)] bg-[var(--surface)] shadow-lg shadow-black/10">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[var(--border)] px-3 py-3 sm:px-4">
            <span className="text-sm font-medium">PrexX <span className="font-normal text-[var(--foreground-muted)]">/ web</span></span>
            <span className="text-[10px] uppercase tracking-wider text-[var(--foreground-muted)]">{es ? "Vista ilustrativa" : "Illustrative view"}</span>
          </div>
          <div className="space-y-5 p-3 sm:p-4">
            <div className="rounded-xl rounded-br-sm border border-[var(--accent-cyan)]/20 bg-[var(--accent-cyan)]/5 px-3 py-2.5 text-sm leading-relaxed sm:ml-5">{request}</div>
            <div className="min-h-52">
              {search ? <div>
                <div className="mb-4 flex flex-wrap gap-2 text-[11px]">
                  {[es ? "Similitud semántica" : "Semantic similarity", "BM25"].map((label, i) => <motion.span key={label} initial={false} animate={{ opacity: demo.step >= 1 ? 1 : .55, y: demo.step >= 1 ? 0 : 3 }} transition={{ duration, delay: demo.reduced ? 0 : i * .12 }} className="rounded-full border border-[var(--border-strong)] px-2.5 py-1">{label}</motion.span>)}
                </div>
                <div className="flex flex-col gap-2">
                  {(demo.step >= 2 ? [1, 0] : [0, 1]).map(i => <motion.div key={i} layout={!demo.reduced} initial={false}
                    animate={{ opacity: demo.step >= 2 && i === 0 ? .6 : 1 }}
                    transition={{ duration: demo.reduced ? 0 : .7, type: "tween" }}
                    className={`demo-paper flex min-h-14 items-center gap-2 px-3 py-2 ${i === 1 && demo.step >= 2 ? "!border-[var(--accent-cyan)]/50" : ""}`}>
                    <ListFilter aria-hidden className={`size-4 shrink-0 ${i === 1 ? "text-[var(--accent-cyan)]" : "text-[var(--foreground-muted)]"}`} />
                    <div className="min-w-0"><p className="text-xs font-medium">{i === 1 ? (es ? "Coincidencia directa" : "Direct match") : (es ? "Coincidencia parcial" : "Partial match")}</p><p className="mt-1 text-[11px] text-[var(--foreground-muted)]">{i === 1 ? (es ? "Pack de tiroides" : "Thyroid pack") : (es ? "Otra opción del catálogo" : "Another catalog option")}</p></div>
                  </motion.div>)}
                </div>
              </div> : profile ? <div className="relative px-1 pt-1">
                <motion.div aria-hidden initial={false} animate={{ rotate: demo.step >= 2 ? -4 : 0 }} transition={{ duration }} className="absolute inset-0 rounded-lg border border-[var(--border-strong)] bg-[var(--background)]" />
                <motion.div initial={false} animate={{ y: demo.step >= 2 ? -3 : 0 }} transition={{ duration }} className="demo-paper relative p-3">
                  <p className="mb-3 text-xs font-medium">{demo.step >= 3 ? (es ? "Selección explicada" : "Explained selection") : (es ? "Perfil de salud" : "Health profile")}</p>
                  {(demo.step >= 3 ? (es ? ["Pack sugerido", "Motivo de la sugerencia", "Próximo paso"] : ["Suggested pack", "Reason for the suggestion", "Next step"]) : (es ? ["Edad", "Antecedentes", "Dieta"] : ["Age", "Health history", "Diet"])).map(label => <div key={label} className="flex items-center justify-between gap-2 border-t border-[var(--border)] py-2.5 text-xs text-[var(--foreground-dim)]"><span>{label}</span>{demo.step >= 1 ? <Check aria-hidden className="size-3 text-[var(--accent-cyan)]" /> : <span aria-hidden className="h-1 w-9 rounded bg-[var(--border-strong)]" />}</div>)}
                </motion.div>
              </div> : <div>
                <p className="flex items-center gap-2 text-xs text-[var(--foreground-dim)]"><LockKeyhole aria-hidden className="size-3.5 text-[var(--accent-cyan)]" />{demo.step >= 1 ? (es ? "Identidad verificada" : "Identity verified") : (es ? "Verificando sesión" : "Checking session")}</p>
                <motion.div initial={false} animate={{ y: demo.step >= 2 ? 0 : 8, opacity: demo.step >= 2 ? 1 : .5 }} transition={{ duration }} className="demo-paper mt-4 p-4">
                  <p className="text-[11px] text-[var(--foreground-muted)]">{es ? "Pedido de ejemplo" : "Example order"}</p>
                  <p className="mt-2 flex items-center gap-2 text-sm"><span aria-hidden className="size-1.5 rounded-full bg-[var(--accent-gold)]" />{es ? "En revisión médica" : "Under medical review"}</p>
                  <div className="mt-4 flex items-center gap-2 border-t border-[var(--border)] pt-3 text-xs text-[var(--foreground-dim)]"><FileText aria-hidden className="size-4" />{es ? "Documentos de su cuenta" : "Documents from your account"}</div>
                </motion.div>
              </div>}
            </div>
            <motion.p initial={false} animate={{ opacity: demo.step >= 3 ? 1 : .5 }} transition={{ duration }} className="flex items-center gap-2 text-xs text-[var(--accent-cyan)]"><ArrowUpRight aria-hidden className="size-3.5" />{search ? (es ? "Opciones para explorar en el sitio" : "Options to explore on the site") : profile ? (es ? "Recomendaciones con contexto" : "Recommendations with context") : (es ? "Continuar en su bitácora" : "Continue in your account")}</motion.p>
          </div>
        </div>
      </div>
      <div className="p-5 sm:p-6">
        <p className="mb-5 text-[11px] font-medium uppercase tracking-[.14em] text-[var(--foreground-muted)]">{es ? "Detrás de la respuesta" : "Behind the response"}</p>
        <ol className="space-y-5">
          {steps.map(([title, detail], i) => <li key={title} className="flex gap-3">
            <motion.span initial={false} animate={{ scale: demo.step === i ? 1.08 : 1 }} transition={{ duration }} className={`flex size-7 shrink-0 items-center justify-center rounded-full border text-xs ${demo.step >= i ? "border-[var(--accent-cyan)]/40 bg-[var(--accent-cyan)]/5 text-[var(--accent-cyan)]" : "border-[var(--border-strong)] text-[var(--foreground-muted)]"}`}>{demo.step > i ? <Check aria-hidden className="size-3" /> : i + 1}</motion.span>
            <div><p className="text-sm font-medium">{title}</p><p className="mt-1 text-xs leading-relaxed text-[var(--foreground-dim)]">{detail}</p></div>
          </li>)}
        </ol>
        <div className="mt-6 border-t border-[var(--border)] pt-4 text-xs leading-relaxed text-[var(--foreground-muted)]">{profile ? (es ? "Las recomendaciones se generan en un servicio dedicado, a partir del formulario." : "A dedicated service generates recommendations from the form.") : (es ? "Dos agentes: Bienvenida y Soporte. LangGraph coordina el cambio entre ambos." : "Two agents: Welcome and Support. LangGraph coordinates the handoff.")}</div>
      </div>
    </div>
    <DemoControls playback={demo} label={es ? "Ejemplo ilustrativo · sin datos de pacientes" : "Illustrative example · no patient data"} />
  </div>;
}
