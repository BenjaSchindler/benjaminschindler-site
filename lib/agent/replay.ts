import { profileStatic } from "../cvData";
import { AGENT_MODEL } from "./prompt";
import { targetForView, type PageTarget, type SiteView } from "./targets";

// Recorded conversations for replay mode — served when the endpoint has no
// API key, is rate-limited, or the daily budget is spent, so the demo never
// looks broken. Trace steps mirror the live event shape but carry no token
// counts: replay is labeled as replay in the UI, and we don't fabricate
// telemetry. Every answer below is drawn verbatim-or-tighter from cvData.

export type TraceKind = "guard" | "llm" | "tool" | "result" | "info" | "error";

export type ReplayStep =
  | { kind: "trace"; ev: TraceKind; label: string; detail?: string; delay: number }
  | { kind: "text"; text: string; delay: number }
  | { kind: "ui"; target: PageTarget; delay: number }
  | { kind: "email"; draft: { subject: string; body: string }; delay: number }
  | { kind: "sources"; targets: PageTarget[]; delay: number };

export type ReplayScript = { id: string; match: string[]; steps: ReplayStep[] };

const tr = (
  ev: TraceKind,
  label: string,
  detail: string | undefined,
  delay: number,
): ReplayStep => ({ kind: "trace", ev, label, detail, delay });

const tx = (text: string, delay = 120): ReplayStep => ({ kind: "text", text, delay });
const src = (...targets: PageTarget[]): ReplayStep => ({ kind: "sources", targets, delay: 80 });

// show_section as it appears in a live trace: tool call → page scroll → result.
// preDelay is the pause before the tool call fires — tours raise it so the
// page dwells on the current stop before the next scroll.
const scroll = (target: PageTarget, preDelay = 240): ReplayStep[] => [
  tr("tool", "show_section", `{"section":"${target}"}`, preDelay),
  { kind: "ui", target, delay: 60 },
  tr("result", "show_section", `→ scrolled to #${target}`, 80),
];

const guard = () => tr("guard", "input guard", "length ok · scope ok · turn accepted", 60);
const llm = (d: number) => tr("llm", AGENT_MODEL, "recorded turn — no live telemetry", d);
const call = (name: string, args: string, result: string): ReplayStep[] => [
  tr("tool", name, "function_call requested", 380),
  tr("result", name, `${args} → ${result}`, 200),
];

// ── English ──────────────────────────────────────────────────────────────────
const enScripts: ReplayScript[] = [
  {
    id: "doctor911",
    match: ["doctor911", "doctor 911", "cto", "build at doctor", "built at doctor"],
    steps: [
      guard(),
      llm(160),
      ...call("get_experience", '{"company":"Doctor911"}', "1 company"),
      llm(200),
      tx(`CTO since January 2026, leading a team of three. He built four WhatsApp and two web agents with LangGraph, plus voice triage and an internal RAG assistant.`),
      src("experience-doctor911", "doctor911-whatsapp"),
    ],
  },
  {
    id: "thesis",
    match: ["thesis", "tesis", "augmentation", "smote", "research", "master", "paper"],
    steps: [
      guard(),
      llm(160),
      ...call("get_thesis", "{}", "stats · 5 method deltas · paper"),
      llm(200),
      tx(`+2.25 percentage points of macro-F1 over SMOTE across 3,675 configurations (p < 0.0001), defended with Maximum Distinction. The follow-up paper is to appear at IEEE LACCI 2026.`),
      src("thesis", "thesis-paper"),
    ],
  },
  {
    id: "evals",
    match: ["eval", "evals", "judge", "drift", "measure", "benchmark", "production"],
    steps: [
      guard(),
      llm(160),
      ...call("search_cv", '{"query":"llm evaluation monitoring"}', "6 facts"),
      llm(200),
      tx(`With LLM-as-judge scores in Langfuse: at EPE he compares prompt versions assigned per user and monitors quality drift over time.`),
      src("project-epe", "practice"),
    ],
  },
  {
    id: "multiagent",
    match: ["multi-agent", "multiagent", "multi agent", "agents", "langgraph", "agentic", "orchestr", "whatsapp"],
    steps: [
      guard(),
      llm(160),
      ...call("search_cv", '{"query":"agents langgraph whatsapp"}', "6 facts"),
      ...scroll("doctor911-whatsapp"),
      llm(200),
      tx(`Yes: at Doctor911 a LangGraph orchestrator routes WhatsApp messages to four agents with shared tools. MiAutoCheck adds a supervisor over five research agents.`),
      src("experience-doctor911", "project-miautocheck"),
    ],
  },
  {
    id: "contact",
    match: ["contact", "reach", "email", "hire", "interview", "write to", "get in touch"],
    steps: [
      guard(),
      llm(160),
      tr("tool", "draft_email", "function_call requested", 420),
      { kind: "email", delay: 60, draft: {
        subject: "AI Engineer role: quick chat?",
        body: "Hi Benjamin,\n\nI'm [Your name] from [Company]. We're hiring for [role] and your work on multi-agent systems at Doctor911 stood out.\n\nWould you be open to a 20-minute call this week?\n\nBest,\n[Your name]",
      } },
      tr("result", "draft_email", `→ draft to ${profileStatic.email}`, 80),
    ],
  },
  {
    id: "match",
    match: ["[job description]"],
    steps: [
      guard(),
      tr("info", "replay mode", "matching needs the live model — it is switched off", 200),
      tx(`Matching needs the live model, which is unavailable right now. Contact Benjamin at ${profileStatic.email}.`),
    ],
  },
  {
    id: "fallback",
    match: [],
    steps: [
      guard(),
      tr("info", "replay mode", "live model disabled — serving recorded sessions", 200),
      tx(`The live model is unavailable. Try a suggested question for a recorded example, or email ${profileStatic.email}.`),
    ],
  },
];

// ── Spanish ──────────────────────────────────────────────────────────────────
const esScripts: ReplayScript[] = [
  {
    id: "doctor911",
    match: ["doctor911", "doctor 911", "cto", "construyó en doctor", "hizo en doctor"],
    steps: [
      guard(),
      llm(160),
      ...call("get_experience", '{"company":"Doctor911"}', "1 company"),
      llm(200),
      tx(`Es CTO desde enero de 2026 y lidera a tres personas. Construyó cuatro agentes de WhatsApp y dos web con LangGraph, además de triaje por voz y un asistente RAG interno.`),
      src("experience-doctor911", "doctor911-whatsapp"),
    ],
  },
  {
    id: "thesis",
    match: ["tesis", "thesis", "augmentation", "smote", "magíster", "magister", "paper"],
    steps: [
      guard(),
      llm(160),
      ...call("get_thesis", "{}", "stats · 5 method deltas · paper"),
      llm(200),
      tx(`+2,25 puntos porcentuales de macro-F1 frente a SMOTE en 3.675 configuraciones (p < 0,0001), con Distinción Máxima. El paper derivado se publicará en IEEE LACCI 2026.`),
      src("thesis", "thesis-paper"),
    ],
  },
  {
    id: "evals",
    match: ["eval", "evals", "judge", "drift", "mide", "medir", "benchmark", "producción", "produccion"],
    steps: [
      guard(),
      llm(160),
      ...call("search_cv", '{"query":"llm evaluation monitoring"}', "6 facts"),
      llm(200),
      tx(`Con puntajes de LLM-as-judge en Langfuse: en EPE compara versiones de prompts asignadas por usuario y vigila cambios de calidad en el tiempo.`),
      src("project-epe", "practice"),
    ],
  },
  {
    id: "multiagent",
    match: ["multi-agente", "multiagente", "multi agente", "agentes", "langgraph", "agéntic", "agentic", "orquest", "whatsapp"],
    steps: [
      guard(),
      llm(160),
      ...call("search_cv", '{"query":"agents langgraph whatsapp"}', "6 facts"),
      ...scroll("doctor911-whatsapp"),
      llm(200),
      tx(`Sí: en Doctor911 un orquestador de LangGraph deriva los mensajes de WhatsApp a cuatro agentes con herramientas compartidas. En MiAutoCheck, un supervisor coordina cinco agentes de investigación.`),
      src("experience-doctor911", "project-miautocheck"),
    ],
  },
  {
    id: "contact",
    match: ["contact", "escrib", "correo", "email", "entrevista", "contratar", "reunión", "reunion"],
    steps: [
      guard(),
      llm(160),
      tr("tool", "draft_email", "function_call requested", 420),
      { kind: "email", delay: 60, draft: {
        subject: "Cargo de AI Engineer: ¿conversamos?",
        body: "Hola Benjamin:\n\nSoy [Tu nombre], de [Empresa]. Estamos buscando [cargo] y me interesó tu trabajo con sistemas multiagente en Doctor911.\n\n¿Tienes 20 minutos esta semana para conversar?\n\nSaludos,\n[Tu nombre]",
      } },
      tr("result", "draft_email", `→ draft to ${profileStatic.email}`, 80),
    ],
  },
  {
    id: "match",
    match: ["[job description]"],
    steps: [
      guard(),
      tr("info", "replay mode", "matching needs the live model — it is switched off", 200),
      tx(`La comparación requiere el modelo en vivo, que no está disponible ahora. Contacta a Benjamin en ${profileStatic.email}.`),
    ],
  },
  {
    id: "fallback",
    match: [],
    steps: [
      guard(),
      tr("info", "replay mode", "live model disabled — serving recorded sessions", 200),
      tx(`El modelo en vivo no está disponible. Prueba una pregunta sugerida para ver un ejemplo grabado, o escribe a ${profileStatic.email}.`),
    ],
  },
];

// ── Tour ─────────────────────────────────────────────────────────────────────
// Built per view: the concise view has no practice section, so that stop
// drops out, and every stop after the first waits TOUR_DWELL_MS so the page
// settles and the visitor can actually look before the next scroll.

const TOUR_DWELL_MS = 2400;

type TourStop = { section: PageTarget; text: string };

const TOUR_STOPS: Record<"en" | "es", TourStop[]> = {
  en: [
    { section: "experience", text: "• Experience: CTO at Doctor911; forecasting at WiseConn; automation at Unitti." },
    { section: "thesis", text: "\n• Thesis: +2.25 pp macro-F1 over SMOTE." },
    { section: "practice", text: "\n• Practices: prompt A/B tests, LLM-as-judge, permission-aware RAG." },
    { section: "projects", text: "\n• Projects: MiAutoCheck vehicle valuations; EPE well-being platform." },
    { section: "contact", text: "\n• Contact: email and LinkedIn." },
  ],
  es: [
    { section: "experience", text: "• Experiencia: CTO en Doctor911; predicción en WiseConn; automatización en Unitti." },
    { section: "thesis", text: "\n• Tesis: +2,25 pp de macro-F1 frente a SMOTE." },
    { section: "practice", text: "\n• Prácticas: pruebas A/B de prompts, LLM-as-judge, RAG con permisos." },
    { section: "projects", text: "\n• Proyectos: tasaciones con MiAutoCheck; bienestar laboral con EPE." },
    { section: "contact", text: "\n• Contacto: correo y LinkedIn." },
  ],
};

const TOUR_MATCH: Record<"en" | "es", string[]> = {
  en: ["tour", "overview", "walk me", "show me around", "guide me"],
  es: ["tour", "recorrido", "muéstrame", "muestrame", "guíame", "guiame"],
};

function tourScript(lang: "en" | "es", view: SiteView): ReplayScript {
  const stops = TOUR_STOPS[lang].filter((s) => targetForView(s.section, view) === s.section);
  const steps: ReplayStep[] = [guard(), llm(160)];
  stops.forEach((s, i) => {
    steps.push(...scroll(s.section, i === 0 ? 240 : TOUR_DWELL_MS), tx(s.text, 160));
  });
  return { id: "tour", match: TOUR_MATCH[lang], steps };
}

const SCRIPTS: Record<"en" | "es", ReplayScript[]> = { en: enScripts, es: esScripts };

export function pickReplay(
  lang: "en" | "es",
  lastUserMessage: string,
  view: SiteView,
): ReplayScript {
  const scripts = [...SCRIPTS[lang], tourScript(lang, view)];
  const q = lastUserMessage.toLowerCase();
  let best: ReplayScript | null = null;
  let bestScore = 0;
  for (const s of scripts) {
    const score = s.match.reduce((acc, kw) => (q.includes(kw) ? acc + 1 : acc), 0);
    if (score > bestScore) {
      best = s;
      bestScore = score;
    }
  }
  return best ?? SCRIPTS[lang][SCRIPTS[lang].length - 1];
}
