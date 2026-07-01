import { profileStatic } from "../cvData";
import { AGENT_MODEL } from "./prompt";

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
const scroll = (target: string): ReplayStep[] => [
  tr("tool", "show_section", `{"section":"${target}"}`, 240),
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

const SCRIPTS: Record<"en" | "es", ReplayScript[]> = { en: enScripts, es: esScripts };

export function pickReplay(lang: "en" | "es", lastUserMessage: string): ReplayScript {
  const scripts = SCRIPTS[lang];
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
  return best ?? scripts[scripts.length - 1];
}
