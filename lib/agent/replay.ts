import { profileStatic } from "../cvData";
import { AGENT_MODEL, type SiteView } from "./prompt";
import { TECHNICAL_ONLY_SECTIONS } from "./tools";

// Recorded conversations for replay mode — served when the endpoint has no
// API key, is rate-limited, or the daily budget is spent, so the demo never
// looks broken. Trace steps mirror the live event shape but carry no token
// counts: replay is labeled as replay in the UI, and we don't fabricate
// telemetry. Every answer below is drawn verbatim-or-tighter from cvData.

export type TraceKind = "guard" | "llm" | "tool" | "result" | "info" | "error";

export type ReplayStep =
  | { kind: "trace"; ev: TraceKind; label: string; detail?: string; delay: number }
  | { kind: "text"; text: string; delay: number }
  | { kind: "ui"; target: string; delay: number };

export type ReplayScript = { id: string; match: string[]; steps: ReplayStep[] };

const tr = (
  ev: TraceKind,
  label: string,
  detail: string | undefined,
  delay: number,
): ReplayStep => ({ kind: "trace", ev, label, detail, delay });

const tx = (text: string, delay = 120): ReplayStep => ({ kind: "text", text, delay });

// show_section as it appears in a live trace: tool call → page scroll → result.
// preDelay is the pause before the tool call fires — tours raise it so the
// page dwells on the current stop before the next scroll.
const scroll = (target: string, preDelay = 240): ReplayStep[] => [
  tr("tool", "show_section", `{"section":"${target}"}`, preDelay),
  { kind: "ui", target, delay: 60 },
  tr("result", "show_section", `→ scrolled to #${target}`, 80),
];

const guard = () => tr("guard", "input guard", "length ok · scope ok · turn accepted", 60);
const llm = (d: number) => tr("llm", AGENT_MODEL, "recorded turn — no live telemetry", d);

// ── English ──────────────────────────────────────────────────────────────────
const enScripts: ReplayScript[] = [
  {
    id: "doctor911",
    match: ["doctor911", "doctor 911", "cto", "build at doctor", "built at doctor"],
    steps: [
      guard(),
      llm(160),
      tr("tool", "get_experience", '{"company":"Doctor911"}', 420),
      tr("result", "get_experience", "1 company · 2 roles · impact + stack", 220),
      ...scroll("experience"),
      llm(200),
      tx(`CTO since January 2026, leading three people. Built WhatsApp and web agents with LangGraph, RAG recommendations, and payment tools. Added voice triage and lab-report OCR.`),
    ],
  },
  {
    id: "thesis",
    match: ["thesis", "tesis", "augmentation", "smote", "research", "master"],
    steps: [
      guard(),
      llm(160),
      tr("tool", "get_thesis", "{}", 420),
      tr("result", "get_thesis", "abstract · stats · 5 method deltas", 220),
      ...scroll("thesis"),
      llm(200),
      tx(`His thesis improved macro-F1 by 2.25 percentage points over SMOTE across 3,675 configurations (p < 0.0001). Defended in April 2026 with Maximum Distinction.`),
    ],
  },
  {
    id: "evals",
    match: ["eval", "evals", "judge", "drift", "measure", "benchmark", "production"],
    steps: [
      guard(),
      llm(160),
      tr("tool", "get_projects", '{"name":"EPE"}', 420),
      tr("result", "get_projects", "1 project · highlights + stack", 200),
      tr("tool", "get_thesis", "{}", 260),
      tr("result", "get_thesis", "stats · significance tests", 200),
      ...scroll("practice"),
      llm(200),
      tx(`At EPE: versioned prompts, per-user A/B assignment, LLM-as-judge evaluations, and drift monitoring in Langfuse. Crisis detection and personal-data redaction protect the inputs.`),
    ],
  },
  {
    id: "multiagent",
    match: ["multi-agent", "multiagent", "multi agent", "agents", "langgraph", "agentic", "orchestr"],
    steps: [
      guard(),
      llm(160),
      tr("tool", "get_experience", '{"company":"Doctor911"}', 420),
      tr("result", "get_experience", "1 company · 2 roles", 200),
      tr("tool", "get_projects", '{"name":"MiAutoCheck"}', 260),
      tr("result", "get_projects", "1 project · highlights + stack", 200),
      ...scroll("experience"),
      llm(200),
      tx(`Doctor911: four WhatsApp agents and two web agents, with shared RAG and payment tools. MiAutoCheck: photo inspection plus five research agents, consolidated into a valuation report.`),
    ],
  },
  {
    id: "match",
    match: ["[job description]"],
    steps: [
      guard(),
      tr("info", "replay mode", "matching needs the live model — it is switched off", 200),
      tx(`Matching needs the live model, which is unavailable. Contact Benjamin at ${profileStatic.email}.`),
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
      tr("tool", "get_experience", '{"company":"Doctor911"}', 420),
      tr("result", "get_experience", "1 company · 2 roles · impact + stack", 220),
      ...scroll("experience"),
      llm(200),
      tx(`CTO desde enero de 2026; lidera tres personas. Desarrolló agentes para WhatsApp y web con LangGraph, recomendaciones RAG y pagos. Incorporó triaje por voz y lectura de exámenes con OCR.`),
    ],
  },
  {
    id: "thesis",
    match: ["tesis", "thesis", "augmentation", "smote", "magíster", "magister"],
    steps: [
      guard(),
      llm(160),
      tr("tool", "get_thesis", "{}", 420),
      tr("result", "get_thesis", "abstract · stats · 5 method deltas", 220),
      ...scroll("thesis"),
      llm(200),
      tx(`Su tesis mejoró el macro-F1 en 2,25 puntos porcentuales frente a SMOTE: 3.675 configuraciones, p < 0,0001. Defendida en abril de 2026 con Distinción Máxima.`),
    ],
  },
  {
    id: "evals",
    match: ["eval", "evals", "judge", "drift", "mide", "medir", "benchmark", "producción", "produccion"],
    steps: [
      guard(),
      llm(160),
      tr("tool", "get_projects", '{"name":"EPE"}', 420),
      tr("result", "get_projects", "1 project · highlights + stack", 200),
      tr("tool", "get_thesis", "{}", 260),
      tr("result", "get_thesis", "stats · significance tests", 200),
      ...scroll("practice"),
      llm(200),
      tx(`En EPE: prompts versionados, asignación A/B por usuario, evaluaciones con LLM-as-judge y monitoreo en Langfuse. Incluye detección de crisis y ocultamiento de datos personales.`),
    ],
  },
  {
    id: "multiagent",
    match: ["multi-agente", "multiagente", "multi agente", "agentes", "langgraph", "agéntic", "agentic", "orquest"],
    steps: [
      guard(),
      llm(160),
      tr("tool", "get_experience", '{"company":"Doctor911"}', 420),
      tr("result", "get_experience", "1 company · 2 roles", 200),
      tr("tool", "get_projects", '{"name":"MiAutoCheck"}', 260),
      tr("result", "get_projects", "1 project · highlights + stack", 200),
      ...scroll("experience"),
      llm(200),
      tx(`Doctor911: cuatro agentes de WhatsApp y dos web, con herramientas compartidas de RAG y pagos. MiAutoCheck: inspección de fotos y cinco agentes de investigación para generar tasaciones.`),
    ],
  },
  {
    id: "match",
    match: ["[job description]"],
    steps: [
      guard(),
      tr("info", "replay mode", "matching needs the live model — it is switched off", 200),
      tx(`La comparación requiere el modelo en vivo, que no está disponible. Contacta a Benjamin en ${profileStatic.email}.`),
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

type TourStop = { section: string; text: string };

const TOUR_STOPS: Record<"en" | "es", TourStop[]> = {
  en: [
    { section: "experience", text: "• Experience: CTO and OneClinik video consultations at Doctor911; forecasting at WiseConn; automation at Unitti." },
    { section: "thesis", text: "\n• Thesis: +2.25 percentage points in macro-F1 over SMOTE." },
    { section: "practice", text: "\n• Practices: EPE prompt experiments and evaluations; Doctor911 agents and RAG." },
    { section: "projects", text: "\n• Projects: vehicle valuations with MiAutoCheck; workplace well-being with EPE." },
    { section: "contact", text: "\n• Contact: email and LinkedIn." },
  ],
  es: [
    { section: "experience", text: "• Experiencia: CTO y videoconsultas OneClinik en Doctor911; predicción en WiseConn; automatización en Unitti." },
    { section: "thesis", text: "\n• Tesis: +2,25 puntos porcentuales de macro-F1 frente a SMOTE." },
    { section: "practice", text: "\n• Prácticas: experimentos y evaluaciones en EPE; agentes y RAG en Doctor911." },
    { section: "projects", text: "\n• Proyectos: tasación de vehículos con MiAutoCheck; bienestar laboral con EPE." },
    { section: "contact", text: "\n• Contacto: correo y LinkedIn." },
  ],
};

const TOUR_MATCH: Record<"en" | "es", string[]> = {
  en: ["tour", "overview", "walk me", "show me around", "guide me"],
  es: ["tour", "recorrido", "muéstrame", "muestrame", "guíame", "guiame"],
};

function tourScript(lang: "en" | "es", view: SiteView): ReplayScript {
  const stops = TOUR_STOPS[lang].filter(
    (s) => view === "technical" || !TECHNICAL_ONLY_SECTIONS.includes(s.section),
  );
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
