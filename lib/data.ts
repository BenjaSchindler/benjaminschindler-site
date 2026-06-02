"use client";
import { useLanguage, type Lang } from "./Language";

export type Role = {
  company: string;
  title: string;
  period: string;
  bullets: string[];
  viz?: "forecasting" | "agent-graph" | "nl2sql";
  stack?: string[];
};

export type Experience = {
  company: string;
  period: string;
  impact: string;
  roles: Role[];
  viz?: "forecasting" | "agent-graph" | "nl2sql";
  stack: string[];
  link?: string;
};

export type Profile = {
  name: string;
  title: string;
  subtitle: string;
  location: string;
  email: string;
  phone: string;
  linkedin: string;
  github: string;
  bio: string;
  tags: string[];
};

export type Education = {
  institution: string;
  degree: string;
  period: string;
  progress: number;
  note?: string;
  grade?: string;
};

export type Project = {
  name: string;
  context: string; // e.g. "Client work"
  tagline: string;
  description: string;
  stack: string[];
  highlights: string[];
};

export type ThesisResultId =
  | "soft-weighting"
  | "binary-filter"
  | "smote"
  | "eda"
  | "inverse-trans";

export type ThesisResult = {
  id: ThesisResultId;
  method: string;
  delta: number;
  isOurs: boolean;
};

export type Thesis = {
  title: string;
  subtitle: string;
  advisor: string;
  institution: string;
  date: string;
  abstract: string;
  results: ThesisResult[];
  stats: {
    configs: number;
    pValue: string;
    cohenD: number;
    winRate: string;
    macroF1: { ours: number; smote: number };
  };
};

export type Skills = Record<string, string[]>;
export type LanguagesList = Array<{ name: string; level: string }>;

export type DataSet = {
  profile: Profile;
  experience: Experience[];
  projects: Project[];
  education: Education[];
  thesis: Thesis;
  skills: Skills;
  languages: LanguagesList;
};

// ── English ──────────────────────────────────────────────────────────────────
const dataEn: DataSet = {
  profile: {
    name: "Benjamin Schindler",
    title: "AI Engineer",
    subtitle: "Master of Science in Data Science",
    location: "Chile",
    email: "benjamin.schindlerv@gmail.com",
    phone: "+(56 9) 56279434",
    linkedin: "https://www.linkedin.com/in/benjamin-schindler-92881a2b2/",
    github: "https://github.com/",
    bio: "Product-oriented AI Engineer focused on agentic systems, RAG, and production deployment. I build end-to-end solutions: from architectural design and integration with clinical/business stakeholders to rollout with observability and metrics, continuously iterating to maximize impact on end users.",
    tags: ["Agentic systems", "RAG", "Production AI", "Multi-agent", "LangGraph", "ML", "Data Science"],
  },
  experience: [
    {
      company: "Doctor911",
      period: "Mar 2025 — Present",
      impact:
        "Increased website visits 10× and drove adoption of chat and AI tools — turning the company profitable.",
      viz: "agent-graph",
      stack: ["LangGraph", "RAG", "Vertex AI", "Cloud Run", "WhatsApp Business", "TypeScript"],
      roles: [
        {
          company: "Doctor911",
          title: "Chief Technology Officer (CTO)",
          period: "Jan 2026 — Present",
          bullets: [
            "Lead technical strategy, roadmap, and execution; prioritize architectural design and team coordination.",
            "Define engineering standards (quality, security, observability) and optimize the delivery process (CI/CD).",
            "Design and develop AI / Data Science products (Agents, RAG), ensuring reliability and scalability.",
            "Integrate end-to-end clinical and business workflows (WhatsApp / web) with traceability and clear metrics.",
            "Reduce purchase friction; improve recommendation experience for end users.",
          ],
        },
        {
          company: "Doctor911",
          title: "AI Engineer",
          period: "Mar 2025 — Jan 2026",
          bullets: [
            "Built multi-agent chatbots (LangGraph) with RAG and context management on WhatsApp Business and web.",
            "Implemented native payments and catalogs in WhatsApp for automated exam recommendations and purchasing.",
            "Developed data pipelines and production services; iterated with real user feedback.",
            "Deployed cloud infrastructure (Cloud Run, Vertex AI) with advanced monitoring for high availability.",
          ],
        },
      ],
    },
    {
      company: "WiseConn Latam",
      period: "Sep 2024 — Mar 2025",
      impact:
        "Streamlined the company's entire data system and deployed forecasting models in production — predicting risk and reducing operational costs.",
      viz: "forecasting",
      stack: ["Transformers", "LSTM", "CNN", "AWS SageMaker", "S3", "PyTorch"],
      roles: [
        {
          company: "WiseConn Latam",
          title: "Data Science Intern",
          period: "Sep 2024 — Mar 2025",
          bullets: [
            "Time series forecasting with deep models (Transformers / CNN / LSTM): cleaning, training, evaluation.",
            "Reproducible pipelines and experimentation comparing approaches (metrics, validation, tracking).",
            "Integrated models into AWS (SageMaker, S3) for efficient consumption and pipeline traceability.",
          ],
        },
      ],
    },
    {
      company: "Unitti",
      period: "Jul 2022 — Jul 2024",
      impact:
        "Accelerated internal development by 20 % and opened the data layer to non-technical users via a natural-language query tool.",
      viz: "nl2sql",
      stack: ["Python", "Flask", "PostgreSQL", "LLMs", "Azure", "GCP"],
      roles: [
        {
          company: "Unitti",
          title: "Jr AI Engineer",
          period: "Jul 2022 — Jul 2024",
          bullets: [
            "Developed Python APIs on PostgreSQL with automated testing — improved backend stability and response times.",
            'Built a "Natural Language → SQL" app (Flask, LLMs, Azure / GCP) for business queries in plain language.',
            "Iterated the product with real users to improve query accuracy and response clarity.",
          ],
        },
      ],
    },
  ],
  projects: [
    {
      name: "MiAutoCheck",
      context: "Client work",
      tagline: "Multimodal, multi-agent used-vehicle valuation API",
      description:
        "A VLM inspection agent plus five parallel research agents (pricing, reliability, recalls, ownership cost, competitors) consolidated by a supervisor into PDF valuation reports.",
      stack: ["LangGraph", "FastAPI", "GPT-5-mini", "Anthropic", "Tavily", "Railway"],
      highlights: [
        "VLM inspection from photos: identification, condition, damages, odometer, dashboard.",
        "Five specialized research agents run in parallel; a supervisor cross-validates and consolidates.",
        "Anthropic prompt caching + Tavily deep research; MercadoPago payments and S3 report storage.",
      ],
    },
    {
      name: "EPE",
      context: "Client work",
      tagline: "Workplace emotional well-being platform",
      description:
        "LLM pipeline for emotion classification, thought analysis and personalized exercises — built with safety guardrails, prompt A/B versioning, evals and observability.",
      stack: ["FastAPI", "React Native", "React", "OpenAI", "Langfuse", "PostgreSQL"],
      highlights: [
        "Crisis-detection and PII-redaction safety guardrails for a sensitive domain.",
        "Versioned prompts with deterministic per-user A/B allocation; LLM-as-judge evals + drift monitoring.",
        "Langfuse observability and privacy-first k-anonymous analytics for HR dashboards.",
      ],
    },
  ],
  education: [
    {
      institution: "Universidad Adolfo Ibáñez",
      degree: "Master of Science in Data Science",
      period: "2024 — 2026",
      progress: 1,
      grade: "GPA 4.0 / 4.0",
      note: "Graduated with Maximum Distinction · Thesis: geometric filtering for LLM-based data augmentation",
    },
    {
      institution: "Universidad Adolfo Ibáñez",
      degree: "Computer Engineering",
      period: "2020 — Jul 2025",
      progress: 1,
      grade: "GPA 3.7 / 4.0",
    },
    {
      institution: "Universidad Adolfo Ibáñez",
      degree: "Industrial Engineering",
      period: "2020 — Jul 2025",
      progress: 1,
      grade: "GPA 3.7 / 4.0",
    },
  ],
  thesis: {
    title: "Data Augmentation with LLMs",
    subtitle: "Geometric Filtering for Few-shot Text Classification",
    advisor: "Prof. Gonzalo Ruz",
    institution: "Master of Science in Data Science · UAI",
    date: "April 2026",
    abstract:
      "LLMs can generate thousands of synthetic training samples — but not all are useful. This thesis filters LLM candidates by their geometry in the embedding space, keeping only those that fall in the right region. Result: +2.25 pp macro-F1 over SMOTE across 3,675 configurations (p < 0.0001, d = 0.74, win-rate 83.8 %).",
    results: [
      { id: "soft-weighting", method: "Soft weighting", delta: 2.25, isOurs: true },
      { id: "binary-filter", method: "Binary filter", delta: 2.11, isOurs: true },
      { id: "smote", method: "SMOTE (ref.)", delta: 0, isOurs: false },
      { id: "eda", method: "EDA", delta: -0.22, isOurs: false },
      { id: "inverse-trans", method: "Inverse trans.", delta: -0.19, isOurs: false },
    ],
    stats: {
      configs: 3675,
      pValue: "< 0.0001",
      cohenD: 0.74,
      winRate: "83.8 %",
      macroF1: { ours: 73.49, smote: 71.24 },
    },
  },
  skills: {
    Languages: ["Python", "TypeScript", "SQL"],
    "ML & AI": ["TensorFlow", "PyTorch", "LangChain", "LangGraph", "RAG", "Pandas"],
    Cloud: ["GCP (Vertex AI, Cloud Run)", "AWS (SageMaker, S3)", "Azure"],
    Web: ["React", "Next.js", "Node.js", "Flask"],
    Data: ["PostgreSQL", "NoSQL", "Vector DBs"],
    DevOps: ["Linux", "CI/CD", "Monitoring", "Docker"],
  },
  languages: [
    { name: "Spanish", level: "Native" },
    { name: "English", level: "Advanced" },
    { name: "German", level: "Basic" },
  ],
};

// ── Spanish ──────────────────────────────────────────────────────────────────
const dataEs: DataSet = {
  profile: {
    name: "Benjamin Schindler",
    title: "Ingeniero IA",
    subtitle: "Magíster en Ciencia de Datos",
    location: "Chile",
    email: "benjamin.schindlerv@gmail.com",
    phone: "+(56 9) 56279434",
    linkedin: "https://www.linkedin.com/in/benjamin-schindler-92881a2b2/",
    github: "https://github.com/",
    bio: "Ingeniero de IA orientado al producto, enfocado en sistemas agénticos, RAG y despliegue en producción. Construyo soluciones de extremo a extremo: desde el diseño arquitectónico y la integración con stakeholders clínicos y de negocio, hasta el rollout con observabilidad y métricas, iterando continuamente para maximizar el impacto en los usuarios finales.",
    tags: ["Sistemas agénticos", "RAG", "IA en producción", "Multi-agente", "LangGraph", "ML", "Ciencia de datos"],
  },
  experience: [
    {
      company: "Doctor911",
      period: "Mar 2025 — Presente",
      impact:
        "Aumenté las visitas al sitio web 10× e impulsé la adopción del chat y herramientas de IA — convirtiendo a la empresa en rentable.",
      viz: "agent-graph",
      stack: ["LangGraph", "RAG", "Vertex AI", "Cloud Run", "WhatsApp Business", "TypeScript"],
      roles: [
        {
          company: "Doctor911",
          title: "Chief Technology Officer (CTO)",
          period: "Ene 2026 — Presente",
          bullets: [
            "Lidero la estrategia técnica, roadmap y ejecución; priorizo el diseño arquitectónico y la coordinación del equipo.",
            "Defino estándares de ingeniería (calidad, seguridad, observabilidad) y optimizo el proceso de entrega (CI/CD).",
            "Diseño y desarrollo productos de IA y Ciencia de Datos (Agentes, RAG), garantizando confiabilidad y escalabilidad.",
            "Integro flujos clínicos y de negocio de extremo a extremo (WhatsApp / web) con trazabilidad y métricas claras.",
            "Reduzco la fricción de compra; mejoro la experiencia de recomendación para los usuarios finales.",
          ],
        },
        {
          company: "Doctor911",
          title: "Ingeniero IA",
          period: "Mar 2025 — Ene 2026",
          bullets: [
            "Construí chatbots multi-agente (LangGraph) con RAG y manejo de contexto en WhatsApp Business y web.",
            "Implementé pagos nativos y catálogos en WhatsApp para recomendación y compra automatizada de exámenes.",
            "Desarrollé pipelines de datos y servicios productivos; iteré con feedback real de usuarios.",
            "Desplegué infraestructura cloud (Cloud Run, Vertex AI) con monitoreo avanzado para alta disponibilidad.",
          ],
        },
      ],
    },
    {
      company: "WiseConn Latam",
      period: "Sep 2024 — Mar 2025",
      impact:
        "Optimicé todo el sistema de datos de la empresa y desplegué modelos de forecasting en producción — prediciendo riesgo y reduciendo costos operacionales.",
      viz: "forecasting",
      stack: ["Transformers", "LSTM", "CNN", "AWS SageMaker", "S3", "PyTorch"],
      roles: [
        {
          company: "WiseConn Latam",
          title: "Practicante de Ciencia de Datos",
          period: "Sep 2024 — Mar 2025",
          bullets: [
            "Forecasting de series de tiempo con modelos profundos (Transformers / CNN / LSTM): limpieza, entrenamiento, evaluación.",
            "Pipelines reproducibles y experimentación comparando enfoques (métricas, validación, tracking).",
            "Integré modelos en AWS (SageMaker, S3) para consumo eficiente y trazabilidad del pipeline.",
          ],
        },
      ],
    },
    {
      company: "Unitti",
      period: "Jul 2022 — Jul 2024",
      impact:
        "Aceleré el desarrollo interno en un 20 % y abrí la capa de datos a usuarios no técnicos mediante una herramienta de consulta en lenguaje natural.",
      viz: "nl2sql",
      stack: ["Python", "Flask", "PostgreSQL", "LLMs", "Azure", "GCP"],
      roles: [
        {
          company: "Unitti",
          title: "Ingeniero IA Jr.",
          period: "Jul 2022 — Jul 2024",
          bullets: [
            "Desarrollé APIs en Python sobre PostgreSQL con testing automatizado — mejoré la estabilidad y los tiempos de respuesta del backend.",
            'Construí una app de "Lenguaje Natural → SQL" (Flask, LLMs, Azure / GCP) para consultas de negocio en lenguaje sencillo.',
            "Iteré el producto con usuarios reales para mejorar la precisión de las consultas y la claridad de las respuestas.",
          ],
        },
      ],
    },
  ],
  projects: [
    {
      name: "MiAutoCheck",
      context: "Trabajo de cliente",
      tagline: "API multimodal y multiagente de tasación de autos usados",
      description:
        "Un agente de inspección VLM más cinco agentes de research en paralelo (precio, fiabilidad, recalls, costo de propiedad, competencia) consolidados por un supervisor en reportes PDF de tasación.",
      stack: ["LangGraph", "FastAPI", "GPT-5-mini", "Anthropic", "Tavily", "Railway"],
      highlights: [
        "Inspección VLM desde fotos: identificación, estado, daños, odómetro, tablero.",
        "Cinco agentes de research especializados en paralelo; un supervisor cruza y consolida.",
        "Prompt caching de Anthropic + deep research con Tavily; pagos MercadoPago y almacenamiento S3.",
      ],
    },
    {
      name: "EPE",
      context: "Trabajo de cliente",
      tagline: "Plataforma de bienestar emocional laboral",
      description:
        "Pipeline LLM para clasificación de emociones, análisis de pensamientos y ejercicios personalizados — con guardrails de seguridad, versionado A/B de prompts, evals y observabilidad.",
      stack: ["FastAPI", "React Native", "React", "OpenAI", "Langfuse", "PostgreSQL"],
      highlights: [
        "Guardrails de seguridad: detección de crisis y redacción de PII para un dominio sensible.",
        "Prompts versionados con A/B determinístico por usuario; evals con LLM-as-judge + detección de drift.",
        "Observabilidad con Langfuse y analítica k-anónima para los dashboards de RRHH.",
      ],
    },
  ],
  education: [
    {
      institution: "Universidad Adolfo Ibáñez",
      degree: "Magíster en Ciencia de Datos",
      period: "2024 — 2026",
      progress: 1,
      grade: "7,0 / 7,0",
      note: "Aprobado con Distinción Máxima · Tesis: filtrado geométrico para data augmentation con LLMs",
    },
    {
      institution: "Universidad Adolfo Ibáñez",
      degree: "Ingeniería Civil Informática",
      period: "2020 — Jul 2025",
      progress: 1,
      grade: "6,5 / 7,0",
    },
    {
      institution: "Universidad Adolfo Ibáñez",
      degree: "Ingeniería Civil Industrial",
      period: "2020 — Jul 2025",
      progress: 1,
      grade: "6,5 / 7,0",
    },
  ],
  thesis: {
    title: "Data Augmentation con LLMs",
    subtitle: "Filtrado Geométrico para Clasificación de Texto Few-shot",
    advisor: "Prof. Gonzalo Ruz",
    institution: "Magíster en Ciencia de Datos · UAI",
    date: "Abril 2026",
    abstract:
      "Los LLMs pueden generar miles de muestras sintéticas de entrenamiento — pero no todas son útiles. Esta tesis filtra los candidatos del LLM por su geometría en el espacio de embeddings, conservando solo aquellos que caen en la región correcta. Resultado: +2,25 pp macro-F1 sobre SMOTE en 3.675 configuraciones (p < 0,0001, d = 0,74, tasa de éxito 83,8 %).",
    results: [
      { id: "soft-weighting", method: "Ponderación suave", delta: 2.25, isOurs: true },
      { id: "binary-filter", method: "Filtro binario", delta: 2.11, isOurs: true },
      { id: "smote", method: "SMOTE (ref.)", delta: 0, isOurs: false },
      { id: "eda", method: "EDA", delta: -0.22, isOurs: false },
      { id: "inverse-trans", method: "Trans. inversa", delta: -0.19, isOurs: false },
    ],
    stats: {
      configs: 3675,
      pValue: "< 0,0001",
      cohenD: 0.74,
      winRate: "83,8 %",
      macroF1: { ours: 73.49, smote: 71.24 },
    },
  },
  skills: {
    Lenguajes: ["Python", "TypeScript", "SQL"],
    "ML & IA": ["TensorFlow", "PyTorch", "LangChain", "LangGraph", "RAG", "Pandas"],
    Cloud: ["GCP (Vertex AI, Cloud Run)", "AWS (SageMaker, S3)", "Azure"],
    Web: ["React", "Next.js", "Node.js", "Flask"],
    Datos: ["PostgreSQL", "NoSQL", "Vector DBs"],
    DevOps: ["Linux", "CI/CD", "Monitoreo", "Docker"],
  },
  languages: [
    { name: "Español", level: "Nativo" },
    { name: "Inglés", level: "Avanzado" },
    { name: "Alemán", level: "Básico" },
  ],
};

const DATA: Record<Lang, DataSet> = { en: dataEn, es: dataEs };

export function getData(lang: Lang): DataSet {
  return DATA[lang];
}

export function useData(): DataSet {
  const { lang } = useLanguage();
  return DATA[lang];
}

// Stable, language-agnostic profile fields (URLs, contact, identity)
export const profileStatic = {
  name: dataEn.profile.name,
  email: dataEn.profile.email,
  phone: dataEn.profile.phone,
  linkedin: dataEn.profile.linkedin,
  github: dataEn.profile.github,
} as const;
