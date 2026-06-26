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
    bio: "AI engineer. I build agentic systems and RAG and take them to production: design, rollout, and the messy iteration that comes after. Currently CTO at Doctor911.",
    tags: ["Agentic systems", "RAG", "Production AI", "Multi-agent", "LangGraph", "ML", "Data Science"],
  },
  experience: [
    {
      company: "Doctor911",
      period: "Mar 2025 – Present",
      impact:
        "10× more site visits, real adoption of the chat and AI tools, and the company turned profitable.",
      viz: "agent-graph",
      stack: ["LangGraph", "RAG", "Vertex AI", "Cloud Run", "WhatsApp Business", "TypeScript"],
      roles: [
        {
          company: "Doctor911",
          title: "Chief Technology Officer (CTO)",
          period: "Jan 2026 – Present",
          bullets: [
            "Own technical strategy and the roadmap, and lead the engineering team.",
            "Set the engineering standards and the CI/CD pipeline.",
            "Design and build the AI products (agents and RAG) and keep them running in production.",
            "Wire the clinical and business flows across WhatsApp and web into one system.",
            "Cut purchase friction and improve how the product recommends exams.",
          ],
        },
        {
          company: "Doctor911",
          title: "AI Engineer",
          period: "Mar 2025 – Jan 2026",
          bullets: [
            "Built multi-agent chatbots (LangGraph) with RAG and context management on WhatsApp Business and web.",
            "Added native payments and catalogs in WhatsApp, so users get an exam recommendation and pay without leaving the chat.",
            "Built data pipelines and production services, and tuned them on real user feedback.",
            "Deployed cloud infrastructure on Cloud Run and Vertex AI, with monitoring to keep it up.",
          ],
        },
      ],
    },
    {
      company: "WiseConn Latam",
      period: "Sep 2024 – Mar 2025",
      impact:
        "Streamlined the company's data system and put forecasting models into production, where they flag risk and lower operating costs.",
      viz: "forecasting",
      stack: ["Transformers", "LSTM", "CNN", "AWS SageMaker", "S3", "PyTorch"],
      roles: [
        {
          company: "WiseConn Latam",
          title: "Data Science Intern",
          period: "Sep 2024 – Mar 2025",
          bullets: [
            "Time series forecasting with deep models (Transformers / CNN / LSTM): cleaning, training, evaluation.",
            "Reproducible training pipelines to compare model approaches and track results.",
            "Deployed the models on AWS (SageMaker, S3).",
          ],
        },
      ],
    },
    {
      company: "Unitti",
      period: "Jul 2022 – Jul 2024",
      impact:
        "Sped up internal development by 20 % and let non-technical staff query the database in plain language.",
      viz: "nl2sql",
      stack: ["Python", "Flask", "PostgreSQL", "LLMs", "Azure", "GCP"],
      roles: [
        {
          company: "Unitti",
          title: "Jr AI Engineer",
          period: "Jul 2022 – Jul 2024",
          bullets: [
            "Built Python APIs over PostgreSQL with automated tests, which made the backend more stable and faster.",
            'Built a "Natural Language → SQL" app (Flask, LLMs, Azure / GCP) so the team could query data in plain language.',
            "Tuned it with real users until queries came back accurate and clear.",
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
        "An LLM pipeline that classifies emotions, analyzes thoughts, and generates personalized exercises, in a domain where safety and privacy come first.",
      stack: ["FastAPI", "React Native", "React", "OpenAI", "Langfuse", "PostgreSQL"],
      highlights: [
        "Crisis detection and PII redaction as safety guardrails.",
        "Versioned prompts with deterministic per-user A/B allocation; LLM-as-judge evals + drift monitoring.",
        "Langfuse observability and privacy-first k-anonymous analytics for HR dashboards.",
      ],
    },
  ],
  education: [
    {
      institution: "Universidad Adolfo Ibáñez",
      degree: "Master of Science in Data Science",
      period: "2024 – 2026",
      progress: 1,
      grade: "GPA 3.6 / 4.0",
      note: "Thesis defended with Maximum Distinction · Thesis: geometric filtering for LLM-based data augmentation",
    },
    {
      institution: "Universidad Adolfo Ibáñez",
      degree: "Computer Engineering",
      period: "2020 – Jul 2025",
      progress: 1,
      grade: "GPA 3.5 / 4.0",
    },
    {
      institution: "Universidad Adolfo Ibáñez",
      degree: "Industrial Engineering",
      period: "2020 – Jul 2025",
      progress: 1,
      grade: "GPA 3.4 / 4.0",
    },
  ],
  thesis: {
    title: "Data Augmentation with LLMs",
    subtitle: "Geometric Filtering for Few-shot Text Classification",
    advisor: "Prof. Gonzalo Ruz",
    institution: "Master of Science in Data Science · UAI",
    date: "April 2026",
    abstract:
      "LLMs can generate thousands of synthetic training samples, but not all of them help. This thesis scores each candidate by where it lands in embedding space and keeps only the ones near the real data. Result: +2.25 pp macro-F1 over SMOTE across 3,675 configurations (p < 0.0001, d = 0.74, win-rate 83.8 %).",
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
    bio: "Ingeniero de IA. Construyo sistemas agénticos y RAG, y los llevo a producción: diseño, despliegue y todo el ajuste tedioso que viene después. Hoy soy CTO en Doctor911.",
    tags: ["Sistemas agénticos", "RAG", "IA en producción", "Multi-agente", "LangGraph", "ML", "Ciencia de datos"],
  },
  experience: [
    {
      company: "Doctor911",
      period: "Mar 2025 – Presente",
      impact:
        "10× más visitas al sitio, adopción real del chat y las herramientas de IA, y la empresa pasó a ser rentable.",
      viz: "agent-graph",
      stack: ["LangGraph", "RAG", "Vertex AI", "Cloud Run", "WhatsApp Business", "TypeScript"],
      roles: [
        {
          company: "Doctor911",
          title: "Chief Technology Officer (CTO)",
          period: "Ene 2026 – Presente",
          bullets: [
            "Defino la estrategia técnica y el roadmap, y lidero al equipo de ingeniería.",
            "Establezco los estándares de ingeniería y el pipeline de CI/CD.",
            "Diseño y construyo los productos de IA (agentes y RAG) y los mantengo corriendo en producción.",
            "Conecto los flujos clínicos y de negocio de WhatsApp y la web en un solo sistema.",
            "Reduzco la fricción de compra y mejoro cómo el producto recomienda exámenes.",
          ],
        },
        {
          company: "Doctor911",
          title: "Ingeniero IA",
          period: "Mar 2025 – Ene 2026",
          bullets: [
            "Construí chatbots multi-agente (LangGraph) con RAG y manejo de contexto en WhatsApp Business y web.",
            "Sumé pagos y catálogos nativos en WhatsApp: el usuario recibe la recomendación de examen y paga sin salir del chat.",
            "Construí los pipelines de datos y los servicios productivos, y los ajusté con feedback real de usuarios.",
            "Desplegué la infraestructura en Cloud Run y Vertex AI, con el monitoreo para mantenerla en pie.",
          ],
        },
      ],
    },
    {
      company: "WiseConn Latam",
      period: "Sep 2024 – Mar 2025",
      impact:
        "Optimicé el sistema de datos de la empresa y puse modelos de forecasting en producción, que anticipan el riesgo y reducen los costos operativos.",
      viz: "forecasting",
      stack: ["Transformers", "LSTM", "CNN", "AWS SageMaker", "S3", "PyTorch"],
      roles: [
        {
          company: "WiseConn Latam",
          title: "Practicante de Ciencia de Datos",
          period: "Sep 2024 – Mar 2025",
          bullets: [
            "Forecasting de series de tiempo con modelos profundos (Transformers / CNN / LSTM): limpieza, entrenamiento, evaluación.",
            "Pipelines de entrenamiento reproducibles para comparar enfoques y registrar resultados.",
            "Desplegué los modelos en AWS (SageMaker, S3).",
          ],
        },
      ],
    },
    {
      company: "Unitti",
      period: "Jul 2022 – Jul 2024",
      impact:
        "Aceleré el desarrollo interno en un 20 % y permití que usuarios no técnicos consultaran la base de datos en lenguaje natural.",
      viz: "nl2sql",
      stack: ["Python", "Flask", "PostgreSQL", "LLMs", "Azure", "GCP"],
      roles: [
        {
          company: "Unitti",
          title: "Ingeniero IA Jr.",
          period: "Jul 2022 – Jul 2024",
          bullets: [
            "Construí APIs en Python sobre PostgreSQL con tests automatizados que estabilizaron el backend y aceleraron las respuestas.",
            'Construí una app de "Lenguaje Natural → SQL" (Flask, LLMs, Azure / GCP) para que el equipo consultara los datos en lenguaje natural.',
            "La ajusté con usuarios reales hasta que las consultas volvían precisas y claras.",
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
        "Un pipeline LLM que clasifica emociones, analiza pensamientos y genera ejercicios personalizados, en un dominio donde la seguridad y la privacidad van primero.",
      stack: ["FastAPI", "React Native", "React", "OpenAI", "Langfuse", "PostgreSQL"],
      highlights: [
        "Detección de crisis y redacción de PII como guardrails de seguridad.",
        "Prompts versionados con A/B determinístico por usuario; evals con LLM-as-judge + detección de drift.",
        "Observabilidad con Langfuse y analítica k-anónima para los dashboards de RRHH.",
      ],
    },
  ],
  education: [
    {
      institution: "Universidad Adolfo Ibáñez",
      degree: "Magíster en Ciencia de Datos",
      period: "2024 – 2026",
      progress: 1,
      grade: "6,23 / 7,0",
      note: "Tesis defendida con Distinción Máxima · Tesis: filtrado geométrico para data augmentation con LLMs",
    },
    {
      institution: "Universidad Adolfo Ibáñez",
      degree: "Ingeniería Civil Informática",
      period: "2020 – Jul 2025",
      progress: 1,
      grade: "6,20 / 7,0",
    },
    {
      institution: "Universidad Adolfo Ibáñez",
      degree: "Ingeniería Civil Industrial",
      period: "2020 – Jul 2025",
      progress: 1,
      grade: "6,01 / 7,0",
    },
  ],
  thesis: {
    title: "Data Augmentation con LLMs",
    subtitle: "Filtrado Geométrico para Clasificación de Texto Few-shot",
    advisor: "Prof. Gonzalo Ruz",
    institution: "Magíster en Ciencia de Datos · UAI",
    date: "Abril 2026",
    abstract:
      "Los LLMs pueden generar miles de muestras sintéticas de entrenamiento, pero no todas ayudan. Esta tesis evalúa cada candidata según dónde cae en el espacio de embeddings y conserva solo las que quedan cerca de los datos reales. Resultado: +2,25 pp macro-F1 sobre SMOTE en 3.675 configuraciones (p < 0,0001, d = 0,74, tasa de éxito 83,8 %).",
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
