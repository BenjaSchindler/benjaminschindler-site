"use client";

import { useState } from "react";
import { ArrowDown, Check, GitBranch, MessageSquare } from "lucide-react";
import { motion } from "framer-motion";
import { DemoControls, useDemoPlayback } from "./primitives/DemoPlayback";
import { useLanguage } from "@/lib/Language";
import { useData } from "@/lib/data";
import { OneClinikScene } from "./OneClinikScene";
import { PrexxWebScene } from "./PrexxWebScene";

type Channel = "oneclinik" | "web" | "whatsapp" | "internal";

export function AgentGraph() {
  const { lang } = useLanguage();
  const es = lang === "es";
  const { experience } = useData();
  const oneclinik = experience.find(exp => exp.company === "Doctor911")?.systems?.find(system => system.name === "OneClinik");
  const [channel, setChannel] = useState<Channel>("oneclinik");
  const channels: { id: Channel; label: string }[] = [
    { id: "oneclinik", label: "OneClinik" },
    { id: "whatsapp", label: "WhatsApp · 4" },
    { id: "web", label: "PrexX Web" },
    { id: "internal", label: es ? "Agente interno" : "Internal agent" },
  ];
  const agents = [
    { name: es ? "Bienvenida" : "Welcome", task: es ? "Búsqueda y recomendaciones" : "Search and recommendations", tool: "RAG" },
    { name: es ? "Comercio" : "Commerce", task: es ? "Carrito y pagos" : "Cart and payments", tool: "Transbank · Meta Flows · Supabase" },
    { name: es ? "Soporte" : "Support", task: es ? "Pedidos y documentos" : "Orders and documents", tool: "Supabase" },
    { name: es ? "Pedido asíncrono" : "Async order", task: es ? "Coordinación de atención" : "Care coordination", tool: "Meta Flows · Supabase" },
  ];
  return (
    <figure className="min-w-0 space-y-5">
      <figcaption className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-base font-medium text-[var(--foreground)]">{es ? "Sistemas de Doctor911" : "Doctor911 systems"}</p>
          <p className="mt-1 text-xs text-[var(--foreground-dim)]">{es ? "Videoconsultas, agentes y búsqueda" : "Video consultations, agents and retrieval"}</p>
        </div>
        <div role="group" aria-label={es ? "Sistema" : "System"} className="flex flex-wrap gap-1 rounded-lg bg-[var(--surface)] p-1">
          {channels.map(({ id, label }) => <button key={id} onClick={() => setChannel(id)} aria-pressed={channel === id} className={`min-h-10 rounded-md px-3 text-xs font-medium transition-colors ${channel === id ? "bg-[var(--accent)]/15 text-[var(--foreground)] ring-1 ring-inset ring-[var(--accent)]/50" : "text-[var(--foreground-dim)] hover:bg-[var(--surface-raised)]"}`}>{label}</button>)}
        </div>
      </figcaption>
      {channel === "oneclinik" ? oneclinik && (
        <div className="space-y-4">
          <div>
            <p className="text-sm font-medium">{oneclinik.tagline}</p>
            <p className="mt-2 max-w-3xl text-[13px] leading-relaxed text-[var(--foreground-dim)]">{oneclinik.description}</p>
          </div>
          <OneClinikScene />
          <p className="text-xs text-[var(--foreground-dim)]">{oneclinik.highlights[2]}</p>
          <ul className="flex flex-wrap gap-2 text-xs text-[var(--foreground-muted)]">
            {oneclinik.stack.map(tech => <li key={tech} className="rounded border border-[var(--border)] px-2 py-1">{tech}</li>)}
          </ul>
        </div>
      ) : channel === "web" ? <PrexxWebScene /> : channel === "internal" ? <InternalFlow es={es} /> : <RoutingScene es={es} agents={agents} />}

    </figure>
  );
}

function RoutingScene({ es, agents }: { es: boolean; agents: { name: string; task: string; tool: string }[] }) {
  const [ref, demo] = useDemoPlayback(4, 1200);
  const [selected, setSelected] = useState(0);
  const current = agents[selected];
  const requests = es ? ["Busco un examen", "Quiero pagar mi pedido", "¿Dónde veo mi pedido?", "Necesito coordinar mi atención"] : ["I'm looking for a test", "I'd like to pay for my order", "Where can I find my order?", "I need to arrange my appointment"];
  return <div ref={ref} className="demo-surface">
    <div className="grid gap-6 p-5 md:grid-cols-2 sm:p-6">
      <div className="flex min-w-0 flex-col items-center justify-center">
        <div className="w-full rounded-xl rounded-bl-sm border border-[var(--border-strong)] bg-[var(--surface)] p-4">
          <p className="flex items-center gap-2 text-xs text-[var(--foreground-muted)]"><MessageSquare aria-hidden className="size-4" />WhatsApp</p>
          <p className="mt-2 text-sm">{requests[selected]}</p>
        </div>
        <div aria-hidden className="relative h-12 w-px bg-[var(--border-strong)]"><motion.span initial={false} animate={{ y: demo.step >= 1 ? 42 : 0, opacity: demo.step === 0 || demo.step === 1 ? 1 : 0 }} transition={{ duration: demo.reduced ? 0 : .7 }} className="absolute -left-1 size-2 rounded-full bg-[var(--accent-cyan)]" /></div>
        <div className="relative flex size-28 items-center justify-center rounded-full border border-[var(--accent-cyan)]/40 bg-[var(--surface)] shadow-[0_0_48px_rgba(56,189,248,0.06)]">
          <motion.div aria-hidden className="absolute -inset-3 rounded-full border border-dashed border-[var(--border-strong)]" initial={false} animate={{ rotate: demo.step * 60 }} transition={{ duration: demo.reduced ? 0 : 1.1 }} />
          <div className="text-center"><GitBranch aria-hidden className="mx-auto mb-2 size-6 text-[var(--accent-cyan)]" /><p className="text-sm">LangGraph</p><p className="mt-1 text-xs text-[var(--foreground-muted)]">{es ? "Orquestador" : "Orchestrator"}</p></div>
        </div>
        <div className="my-4 w-full demo-rail"><motion.div className="demo-rail-fill" initial={false} animate={{ scaleX: demo.step >= 2 ? 1 : 0 }} transition={{ duration: demo.reduced ? 0 : .7 }} /></div>
        <p className="text-center text-xs leading-relaxed text-[var(--foreground-dim)]">{es ? "Elige un agente para seguir su ruta" : "Choose an agent to follow its route"}</p>
      </div>
      <div className="min-w-0">
        <div role="group" aria-label={es ? "Agente de destino" : "Destination agent"} className="grid grid-cols-2 gap-2">
          {agents.map((agent, i) => <button key={agent.name} aria-pressed={selected === i} onClick={() => { setSelected(i); demo.replay(); }} className="demo-choice relative min-h-24 p-3 text-left">
            <span className="block text-sm font-medium">{agent.name}</span><span className="mt-2 block text-xs leading-relaxed text-[var(--foreground-dim)]">{agent.task}</span>
            {selected === i && <motion.span aria-hidden initial={false} animate={{ scaleY: demo.step >= 2 ? 1 : 0 }} transition={{ duration: demo.reduced ? 0 : .3 }} className="absolute inset-y-3 left-0 w-0.5 origin-top rounded bg-[var(--accent-cyan)]" />}
          </button>)}
        </div>
        <motion.div initial={false} animate={{ opacity: demo.step >= 3 ? 1 : .65, y: demo.step >= 3 || demo.reduced ? 0 : 5 }} transition={{ duration: demo.reduced ? 0 : .35 }} className="mt-4 border-t border-[var(--border-strong)] pt-4">
          <p className="flex items-center gap-2 text-xs text-[var(--accent-cyan)]"><Check aria-hidden className="size-4" />{es ? "Herramientas de esta ruta" : "Tools on this route"}</p><p className="mt-2 text-sm leading-relaxed">{current.tool}</p>
        </motion.div>
      </div>
    </div>
    <DemoControls playback={demo} label={es ? "Ruta ilustrativa · las aprobaciones clínicas requieren revisión médica" : "Illustrative route · clinical approvals require medical review"} />
  </div>;
}

function InternalFlow({ es }: { es: boolean }) {
  const [ref, demo] = useDemoPlayback(5, 1000);
  const steps = es ? [
    ["Consulta", "Equipo interno"], ["Permisos", "Acceso del usuario"], ["RAG", "Buscar información"], ["Agente", "Preparar respuesta"], ["Respuesta / acción", "Herramientas vía MCP"],
  ] : [
    ["Request", "Internal team"], ["Permissions", "User access"], ["RAG", "Retrieve knowledge"], ["Agent", "Prepare response"], ["Answer / action", "Tools via MCP"],
  ];
  return <div ref={ref} className="demo-surface">
    <div className="space-y-6 p-5 sm:p-6">
      <ol className="grid gap-3 md:grid-cols-5">
        {steps.map(([label, detail], i) => <li key={label} className="relative">
          {i > 0 && <ArrowDown aria-hidden className="mx-auto mb-3 size-4 text-[var(--accent-cyan)] md:hidden" />}
          <motion.div initial={false} animate={{ y: demo.step === i && !demo.reduced ? -4 : 0, opacity: demo.step >= i ? 1 : .65 }} transition={{ duration: demo.reduced ? 0 : .3 }} className={`demo-paper p-4 md:h-full ${demo.step === i ? "!border-[var(--accent-cyan)]/60" : ""}`}>
            <span className="flex h-5 items-center text-xs tabular-nums text-[var(--accent-cyan)]">{demo.step > i ? <Check aria-hidden className="size-4" /> : `0${i + 1}`}</span>
            <p className="mt-2 text-sm font-medium">{label}</p><p className="mt-1 text-xs leading-relaxed text-[var(--foreground-dim)]">{detail}</p>
          </motion.div>
        </li>)}
      </ol>
      <div className="demo-rail"><motion.div className="demo-rail-fill" initial={false} animate={{ scaleX: (demo.step + 1) / 5 }} transition={{ duration: demo.reduced ? 0 : .6 }} /></div>
      <div className="grid gap-4 sm:grid-cols-3 text-sm">
        <p><span className="block font-medium">Vertex AI Search</span><span className="mt-1 block text-[var(--foreground-dim)]">Drive · Gmail · Jira</span></p>
        <p><span className="block font-medium">Vector Search</span><span className="mt-1 block text-[var(--foreground-dim)]">{es ? "Manuales, código y políticas" : "Manuals, code and policies"}</span></p>
        <p><span className="block font-medium">MCP</span><span className="mt-1 block text-[var(--foreground-dim)]">{es ? "Herramientas internas y tickets en Asana" : "Internal tools and Asana tickets"}</span></p>
      </div>
    </div>
    <DemoControls playback={demo} />
  </div>;
}
