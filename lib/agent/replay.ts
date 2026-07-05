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
      tx(
        "At Doctor911, Benjamin built the AI products end to end: multi-agent chatbots on LangGraph with RAG and context management, on WhatsApp Business and the web. He integrated native WhatsApp payments and catalogs, so a user receives an exam recommendation and completes payment without leaving the chat. Since January 2026 he is CTO — technical strategy, engineering standards, CI/CD, and operating the agents in production on Cloud Run and Vertex AI. Site traffic grew 10× and the company became profitable.",
      ),
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
      tx(
        "His MSc thesis studies LLM-based data augmentation for few-shot text classification. LLMs can generate thousands of synthetic samples, but not all of them help — so each candidate is scored by its position in embedding space, and only those close to the real data distribution are kept. Across a 3,675-configuration benchmark this beat SMOTE by +2.25 pp macro-F1 (p < 0.0001, Cohen's d = 0.74, win-rate 83.8 %). Defended in April 2026 with Maximum Distinction, advised by Prof. Gonzalo Ruz.",
      ),
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
      tx(
        "On EPE, a workplace emotional well-being platform, behavior changes ship against measurements: prompts are versioned with deterministic per-user A/B allocation, evaluated with LLM-as-judge and drift monitoring on Langfuse. Crisis detection and PII redaction run as guardrails in front of the model. The same discipline shows in his thesis — a 3,675-configuration benchmark with significance testing rather than a handful of cherry-picked runs.",
      ),
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
      tx(
        "Two production systems at Doctor911 run on LangGraph: a web orchestrator with two agents, and a WhatsApp orchestrator with four — welcome, commerce, support, and async orders — with payments, Meta Flows forms, and RAG wired in as tools. On the client side, MiAutoCheck runs a VLM inspection agent plus five parallel research agents consolidated by a supervisor into PDF valuation reports, using Anthropic prompt caching to contain latency and cost.",
      ),
    ],
  },
  {
    id: "match",
    match: ["[job description]"],
    steps: [
      guard(),
      tr("info", "replay mode", "matching needs the live model — it is switched off", 200),
      tx(
        `Matching a job description runs against the live model, which is switched off right now, so I can't analyze your posting in replay mode. Reach Benjamin at ${profileStatic.email} or on LinkedIn and he'll gladly walk through fit directly.`,
      ),
    ],
  },
  {
    id: "fallback",
    match: [],
    steps: [
      guard(),
      tr("info", "replay mode", "live model disabled — serving recorded sessions", 200),
      tx(
        `I'm in replay mode right now — the live model behind this demo is switched off, so I can only replay a few recorded conversations. Try one of the suggested questions below, or reach Benjamin directly at ${profileStatic.email} or on LinkedIn.`,
      ),
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
      tx(
        "En Doctor911, Benjamin construyó los productos de IA de punta a punta: chatbots multi-agente sobre LangGraph con RAG y manejo de contexto, en WhatsApp Business y web. Integró pagos y catálogos nativos de WhatsApp: el usuario recibe una recomendación de examen y completa el pago sin salir del chat. Desde enero de 2026 es CTO — estrategia técnica, estándares de ingeniería, CI/CD y la operación de los agentes en producción sobre Cloud Run y Vertex AI. El tráfico del sitio creció 10× y la empresa alcanzó la rentabilidad.",
      ),
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
      tx(
        "Su tesis de magíster estudia data augmentation con LLMs para clasificación de texto few-shot. Los LLMs pueden generar miles de muestras sintéticas, pero no todas ayudan: cada candidata se evalúa según su posición en el espacio de embeddings y se conservan solo las cercanas a la distribución real. En un benchmark de 3.675 configuraciones superó a SMOTE por +2,25 pp de macro-F1 (p < 0,0001, d de Cohen = 0,74, tasa de éxito 83,8 %). Defendida en abril de 2026 con Distinción Máxima, guiada por el Prof. Gonzalo Ruz.",
      ),
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
      tx(
        "En EPE, una plataforma de bienestar emocional laboral, los cambios de comportamiento se despliegan contra mediciones: prompts versionados con asignación A/B determinística por usuario, evaluados con LLM-as-judge y monitoreo de drift sobre Langfuse. La detección de crisis y la redacción de PII corren como guardrails antes del modelo. La misma disciplina aparece en su tesis: un benchmark de 3.675 configuraciones con pruebas de significancia.",
      ),
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
      tx(
        "Dos sistemas productivos en Doctor911 corren sobre LangGraph: un orquestador web con dos agentes y uno de WhatsApp con cuatro — welcome, commerce, support y pedidos asíncronos — con pagos, formularios de Meta Flows y RAG integrados como herramientas. Del lado de clientes, MiAutoCheck ejecuta un agente de inspección VLM más cinco agentes de research en paralelo consolidados por un supervisor en reportes PDF de tasación, usando prompt caching de Anthropic para contener latencia y costo.",
      ),
    ],
  },
  {
    id: "match",
    match: ["[job description]"],
    steps: [
      guard(),
      tr("info", "replay mode", "matching needs the live model — it is switched off", 200),
      tx(
        `Evaluar una oferta laboral requiere el modelo en vivo, que está apagado ahora, así que no puedo analizar tu descripción en modo replay. Escríbele a Benjamin a ${profileStatic.email} o por LinkedIn y él revisará el fit contigo directamente.`,
      ),
    ],
  },
  {
    id: "fallback",
    match: [],
    steps: [
      guard(),
      tr("info", "replay mode", "live model disabled — serving recorded sessions", 200),
      tx(
        `Estoy en modo replay — el modelo en vivo detrás de esta demo está apagado, así que solo puedo reproducir algunas conversaciones grabadas. Prueba una de las preguntas sugeridas abajo, o escríbele a Benjamin a ${profileStatic.email} o por LinkedIn.`,
      ),
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
    {
      section: "experience",
      text: "Quick tour. This is the experience section: Doctor911, where Benjamin is CTO and built multi-agent chatbots on LangGraph; WiseConn, time-series forecasting on millions of sensor rows; and Unitti, an NL-to-SQL app.",
    },
    {
      section: "thesis",
      text: " His MSc thesis: LLM data augmentation filtered in embedding space, +2.25 pp macro-F1 over SMOTE across 3,675 configurations.",
    },
    {
      section: "practice",
      text: " The practice section describes how he works with models — harnesses, prompts, evals. This chat runs on exactly that practice.",
    },
    {
      section: "projects",
      text: " Selected client work: MiAutoCheck, a VLM inspection agent plus parallel research agents, and EPE, where prompts ship versioned behind evals and guardrails.",
    },
    {
      section: "contact",
      text: " And contact, if you want to talk to the human behind the data. Ask me anything about what you saw.",
    },
  ],
  es: [
    {
      section: "experience",
      text: "Tour rápido. Esta es la sección de experiencia: Doctor911, donde Benjamin es CTO y construyó chatbots multi-agente sobre LangGraph; WiseConn, forecasting de series de tiempo sobre millones de filas de sensores; y Unitti, una app de lenguaje natural a SQL.",
    },
    {
      section: "thesis",
      text: " Su tesis de magíster: data augmentation con LLMs filtrada en el espacio de embeddings, +2,25 pp de macro-F1 sobre SMOTE en 3.675 configuraciones.",
    },
    {
      section: "practice",
      text: " La sección de práctica describe cómo trabaja con modelos — harnesses, prompts, evals. Este chat corre sobre exactamente esa práctica.",
    },
    {
      section: "projects",
      text: " Trabajo con clientes: MiAutoCheck, un agente de inspección VLM más agentes de research en paralelo, y EPE, donde los prompts se despliegan versionados detrás de evals y guardrails.",
    },
    {
      section: "contact",
      text: " Y contacto, si quieres hablar con el humano detrás de los datos. Pregúntame lo que quieras sobre lo que viste.",
    },
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
