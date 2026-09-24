"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowDown, Check, GitBranch } from "lucide-react";
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
  // The site agent's show_section can open a specific demo tab (see lib/agent/targets.ts).
  useEffect(() => {
    const onFocus = (e: Event) => {
      const tab = (e as CustomEvent<{ tab?: string }>).detail?.tab;
      if (tab === "oneclinik" || tab === "whatsapp" || tab === "web" || tab === "internal") setChannel(tab);
    };
    window.addEventListener("agent:focus", onFocus);
    return () => window.removeEventListener("agent:focus", onFocus);
  }, []);
  const channels: { id: Channel; label: string }[] = [
    { id: "oneclinik", label: "OneClinik" },
    { id: "whatsapp", label: "WhatsApp" },
    { id: "web", label: "PrexX Web" },
    { id: "internal", label: es ? "Agente interno" : "Internal agent" },
  ];
  return (
    <figure id="doctor911-systems" data-agent-target className="min-w-0 space-y-5">
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
      ) : channel === "web" ? <PrexxWebScene /> : channel === "internal" ? <InternalFlow es={es} /> : <RoutingScene es={es} />}

    </figure>
  );
}

type Point = { x: number; y: number };
type RouteGeometry = { width: number; height: number; messages: Point[]; agents: Point[]; orchestratorIn: Point; orchestratorOut: Point };

/** Measures where each message, the orchestrator and each agent sit, so the SVG edges connect the real boxes at any width. */
function useRouteGeometry() {
  const gridRef = useRef<HTMLDivElement>(null);
  const orchestratorRef = useRef<HTMLDivElement>(null);
  const messageRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const agentRefs = useRef<(HTMLLIElement | null)[]>([]);
  const [geometry, setGeometry] = useState<RouteGeometry | null>(null);

  useEffect(() => {
    const grid = gridRef.current;
    const orchestrator = orchestratorRef.current;
    if (!grid || !orchestrator) return;
    const measure = () => {
      const box = grid.getBoundingClientRect();
      const edge = (el: Element | null, side: "left" | "right"): Point => {
        const r = el?.getBoundingClientRect() ?? box;
        return { x: (side === "left" ? r.left : r.right) - box.left, y: r.top + r.height / 2 - box.top };
      };
      setGeometry({
        width: box.width,
        height: box.height,
        messages: messageRefs.current.map(el => edge(el, "right")),
        agents: agentRefs.current.map(el => edge(el, "left")),
        orchestratorIn: edge(orchestrator, "left"),
        orchestratorOut: edge(orchestrator, "right"),
      });
    };
    const observer = new ResizeObserver(measure);
    [grid, orchestrator, ...messageRefs.current, ...agentRefs.current].forEach(el => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return { gridRef, orchestratorRef, messageRefs, agentRefs, geometry };
}

const curve = (a: Point, b: Point) => {
  const mid = (a.x + b.x) / 2;
  return `M${a.x} ${a.y} C${mid} ${a.y} ${mid} ${b.y} ${b.x} ${b.y}`;
};

function RoutingScene({ es }: { es: boolean }) {
  const [ref, demo] = useDemoPlayback(4, 1100);
  const [choice, setChoice] = useState(0);
  const { gridRef, orchestratorRef, messageRefs, agentRefs, geometry } = useRouteGeometry();
  const agents = es ? [
    { name: "Bienvenida", task: "Búsqueda y recomendaciones", tools: ["RAG", "Recomendador"] },
    { name: "Comercio", task: "Carrito y pagos", tools: ["Transbank", "Meta Flows", "Supabase"] },
    { name: "Soporte", task: "Pedidos y documentos", tools: ["Supabase"] },
    { name: "Pedido asíncrono", task: "Coordinación de atención", tools: ["Meta Flows", "Supabase"] },
  ] : [
    { name: "Welcome", task: "Search and recommendations", tools: ["RAG", "Recommender"] },
    { name: "Commerce", task: "Cart and payments", tools: ["Transbank", "Meta Flows", "Supabase"] },
    { name: "Support", task: "Orders and documents", tools: ["Supabase"] },
    { name: "Async order", task: "Care coordination", tools: ["Meta Flows", "Supabase"] },
  ];
  // Listed in a different order from the agents, so each route has to be worked out rather than read across.
  const routes = es ? [
    { message: "Quiero pagar mi pedido", intent: "pago", agent: 1, outcome: "Enlace de pago con Transbank" },
    { message: "Busco un examen de tiroides", intent: "búsqueda", agent: 0, outcome: "Opciones del catálogo y recomendaciones" },
    { message: "¿En qué va mi pedido?", intent: "estado del pedido", agent: 2, outcome: "Estado del pedido y sus documentos" },
    { message: "Necesito coordinar mi atención", intent: "coordinación", agent: 3, outcome: "Formulario de Meta Flows para coordinar" },
  ] : [
    { message: "I'd like to pay for my order", intent: "payment", agent: 1, outcome: "Transbank payment link" },
    { message: "I'm looking for a thyroid test", intent: "search", agent: 0, outcome: "Catalog options and recommendations" },
    { message: "What's the status of my order?", intent: "order status", agent: 2, outcome: "Order status and documents" },
    { message: "I need to arrange my appointment", intent: "coordination", agent: 3, outcome: "Meta Flows form to arrange care" },
  ];
  const route = routes[choice];
  const draw = demo.reduced ? 0 : .6;
  // On narrow screens the messages sit above the orchestrator, so only the fan-out is drawn.
  const inbound = geometry && geometry.messages.every(m => m.x < geometry.orchestratorIn.x);

  return <div className="space-y-4">
    <div>
      <p className="text-sm font-medium">{es ? "Un punto de entrada, cuatro agentes" : "One entry point, four agents"}</p>
      <p className="mt-2 max-w-3xl text-[13px] leading-relaxed text-[var(--foreground-dim)]">{es ? "LangGraph clasifica cada mensaje de WhatsApp y lo deriva al agente que corresponde. Las herramientas se comparten: tres agentes usan Supabase." : "LangGraph classifies each WhatsApp message and hands it to the right agent. Tools are shared: three agents use Supabase."}</p>
    </div>
    <div ref={ref} className="demo-surface">
      <div className="p-4 sm:p-6">
        <p className="text-xs text-[var(--foreground-dim)]">{es ? "Elige un mensaje: el orquestador decide qué agente lo atiende." : "Pick a message: the orchestrator decides which agent handles it."}</p>
        <div ref={gridRef} className="relative mt-4 grid grid-cols-[4.5rem_minmax(0,1fr)] gap-x-6 gap-y-6 md:grid-cols-[minmax(0,1fr)_7rem_minmax(0,1.1fr)] md:gap-x-16">
          {geometry && <svg aria-hidden className="pointer-events-none absolute inset-0 overflow-visible" width={geometry.width} height={geometry.height} viewBox={`0 0 ${geometry.width} ${geometry.height}`}>
            {inbound && geometry.messages.map((m, i) => <path key={`in-${i}`} d={curve(m, geometry.orchestratorIn)} fill="none" stroke="var(--border-strong)" strokeDasharray="2 4" />)}
            {geometry.agents.map((a, i) => <path key={`out-${i}`} d={curve(geometry.orchestratorOut, a)} fill="none" stroke="var(--border-strong)" strokeDasharray="2 4" />)}
            {inbound && <motion.path key={`in-active-${choice}`} d={curve(geometry.messages[choice], geometry.orchestratorIn)} fill="none" stroke="var(--accent-cyan)" strokeWidth={2} initial={demo.reduced ? false : { pathLength: 0 }} animate={{ pathLength: demo.step >= 1 ? 1 : 0 }} transition={{ duration: draw }} />}
            <motion.path key={`out-active-${choice}`} d={curve(geometry.orchestratorOut, geometry.agents[route.agent])} fill="none" stroke="var(--accent-cyan)" strokeWidth={2} initial={demo.reduced ? false : { pathLength: 0 }} animate={{ pathLength: demo.step >= 2 ? 1 : 0 }} transition={{ duration: draw }} />
          </svg>}

          <div role="group" aria-label={es ? "Mensaje de ejemplo" : "Example message"} className="col-span-2 grid grid-cols-2 gap-2 md:col-span-1 md:grid-cols-1 md:content-center md:gap-3">
            {routes.map((r, i) => <button key={i} ref={el => { messageRefs.current[i] = el; }} type="button" aria-pressed={choice === i} onClick={() => { setChoice(i); demo.replay(); }}
              className="demo-choice relative !rounded-xl !rounded-bl-sm text-left">{r.message}</button>)}
          </div>

          <div className="relative flex flex-col items-center justify-center gap-2 self-center">
            <motion.div ref={orchestratorRef} initial={false} animate={{ scale: demo.step === 1 && !demo.reduced ? 1.06 : 1 }} transition={{ duration: .3 }}
              className={`flex size-16 flex-col items-center justify-center rounded-full border bg-[var(--background)] transition-colors md:size-24 ${demo.step >= 1 ? "border-[var(--accent-cyan)]/70" : "border-[var(--border-strong)]"}`}>
              <GitBranch aria-hidden className="size-5 text-[var(--accent-cyan)]" />
              <span className="mt-1 text-[10px] font-medium md:text-[11px]">LangGraph</span>
            </motion.div>
            <p className="min-h-10 text-center text-[11px] leading-snug text-[var(--foreground-dim)]" aria-live="polite">
              {demo.step >= 1 ? <><span className="block text-[var(--foreground-muted)]">{es ? "intención" : "intent"}</span><span className="text-[var(--accent-cyan)]">{route.intent}</span></> : (es ? "leyendo…" : "reading…")}
            </p>
          </div>

          <ol className="grid grid-cols-1 gap-2" aria-label={es ? "Agentes" : "Agents"}>
            {agents.map((agent, i) => {
              const active = route.agent === i && demo.step >= 2;
              return <li key={i} ref={el => { agentRefs.current[i] = el; }} aria-current={active ? "true" : undefined}
                className={`relative min-w-0 break-words rounded-lg border bg-[var(--surface)] px-2.5 py-2.5 md:px-3 transition-[border-color,opacity] duration-300 ${active ? "border-[var(--accent-cyan)]/70" : "border-[var(--border)]"} ${demo.step >= 2 && !active ? "opacity-60" : ""}`}>
                <p className="text-sm font-medium">{agent.name}</p>
                <p className="mt-0.5 text-xs text-[var(--foreground-dim)]">{agent.task}</p>
                <ul className="mt-2 flex flex-wrap gap-1">
                  {agent.tools.map(tool => <li key={tool} className={`rounded border px-1.5 py-0.5 font-mono text-[10px] transition-colors duration-300 ${active && demo.step >= 3 ? "border-[var(--accent-cyan)]/50 text-[var(--accent-cyan)]" : "border-[var(--border)] text-[var(--foreground-muted)]"}`}>{tool}</li>)}
                </ul>
              </li>;
            })}
          </ol>
        </div>
        <div className="demo-status mt-5 border-t border-[var(--border)] pt-3">
          <Check aria-hidden className={`size-4 shrink-0 ${demo.step >= 3 ? "text-[var(--accent-cyan)]" : "text-[var(--foreground-muted)]"}`} />
          <span>{demo.step >= 3 ? `${agents[route.agent].name}: ${route.outcome}` : demo.step >= 2 ? (es ? `Derivado a ${agents[route.agent].name}` : `Handed to ${agents[route.agent].name}`) : (es ? "El orquestador clasifica el mensaje" : "The orchestrator classifies the message")}</span>
        </div>
      </div>
      <DemoControls playback={demo} label={es ? "Ruta ilustrativa · mensajes ficticios" : "Illustrative route · fictional messages"} />
    </div>
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
