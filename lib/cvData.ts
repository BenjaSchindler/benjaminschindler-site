// Pure data module: no "use client" directive, so it can be imported from
// server code (the agent API route) and from client components alike.
export type Lang = "en" | "es";

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

export type PracticeArea = {
  id: "harness" | "prompts" | "coevolution" | "evals";
  title: string;
  definition: string;
  evidence: string[];
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
  practice: PracticeArea[];
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
    bio: "AI engineer. I build agentic systems and RAG and take them to production: design, rollout, and the iteration that follows. Currently CTO at Doctor911.",
    tags: ["Agentic systems", "RAG", "Production AI", "Multi-agent", "LangGraph", "ML", "Data Science"],
  },
  experience: [
    {
      company: "Doctor911",
      period: "Mar 2025 – Present",
      impact:
        "Site traffic grew 10×, the chat and AI tools reached sustained adoption, and the company became profitable.",
      viz: "agent-graph",
      stack: ["LangGraph", "RAG", "Vertex AI", "Cloud Run", "WhatsApp Business", "TypeScript"],
      roles: [
        {
          company: "Doctor911",
          title: "Chief Technology Officer (CTO)",
          period: "Jan 2026 – Present",
          bullets: [
            "Define the technical strategy and roadmap; lead the engineering team.",
            "Establish engineering standards and the CI/CD pipeline.",
            "Design and build the AI products (agents, RAG) and operate them in production.",
            "Integrate the clinical and business flows across WhatsApp and web into a single system.",
            "Reduce purchase friction and improve the product's exam recommendations.",
          ],
        },
        {
          company: "Doctor911",
          title: "AI Engineer",
          period: "Mar 2025 – Jan 2026",
          bullets: [
            "Built multi-agent chatbots (LangGraph) with RAG and context management on WhatsApp Business and web.",
            "Integrated native WhatsApp payments and catalogs: users receive an exam recommendation and complete payment without leaving the chat.",
            "Built data pipelines and production services, and refined them against real user feedback.",
            "Deployed cloud infrastructure on Cloud Run and Vertex AI, with production monitoring.",
          ],
        },
      ],
    },
    {
      company: "WiseConn Latam",
      period: "Sep 2024 – Mar 2025",
      impact:
        "Consolidated the company's data system and deployed forecasting models to production, where they anticipate risk and reduce operating costs.",
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
        "Accelerated internal development by 20 % and enabled non-technical staff to query the database in natural language.",
      viz: "nl2sql",
      stack: ["Python", "Flask", "PostgreSQL", "LLMs", "Azure", "GCP"],
      roles: [
        {
          company: "Unitti",
          title: "Jr AI Engineer",
          period: "Jul 2022 – Jul 2024",
          bullets: [
            "Built Python APIs over PostgreSQL with automated tests, improving backend stability and response times.",
            'Built a "Natural Language → SQL" application (Flask, LLMs, Azure / GCP) enabling the team to query data in natural language.',
            "Refined it with real users until results were consistently accurate.",
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
  practice: [
    {
      id: "harness",
      title: "Harness Engineering",
      definition:
        "The scaffolding that turns a model into a product: orchestration, tool interfaces, guardrails, and state.",
      evidence: [
        "LangGraph orchestrators in production at Doctor911 — two agents on web, four on WhatsApp — with the clinical and business flows exposed as tools.",
        "Guardrails as components, not prompt clauses: crisis detection and PII redaction run in front of the model (EPE).",
        "Payments (Transbank, MercadoPago), Meta Flows forms, and PDF generation integrated as tools inside the agent graph.",
      ],
    },
    {
      id: "prompts",
      title: "Prompt Engineering",
      definition:
        "Prompts as versioned, measured artifacts — reviewed, tested, and rolled out like code.",
      evidence: [
        "Versioned prompts with deterministic per-user A/B allocation in production (EPE).",
        "Anthropic prompt caching across MiAutoCheck's five parallel research agents to contain latency and cost.",
        "NL→SQL prompts refined against real user queries until results were consistently accurate (Unitti).",
      ],
    },
    {
      id: "coevolution",
      title: "Model–Harness Co-Evolution",
      definition:
        "Models and scaffolding evolve together: each model upgrade is an opportunity to remove harness code, and each workaround marks what the next model should absorb.",
      evidence: [
        "Migrated Doctor911's production agents from Gemini to OpenAI behind stable tool interfaces.",
        "Exam recommendation implemented as a tool call rather than a fifth agent — capability sits at the simplest layer that holds it reliably.",
        "Each model generation triggers a harness review: scaffolding the new model absorbs is deleted, not maintained.",
      ],
    },
    {
      id: "evals",
      title: "Evaluation Benchmarks",
      definition:
        "Behavior changes are measured before they ship: prompts, harness, and model swaps land against defined baselines.",
      evidence: [
        "LLM-as-judge evaluation with drift monitoring in production, on Langfuse (EPE).",
        "Deterministic A/B assignment ties each metric shift to the prompt version that caused it (EPE).",
        "Thesis: a 3,675-configuration benchmark with significance testing — p < 0.0001, Cohen's d = 0.74, win-rate 83.8 %.",
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
      "LLMs can generate thousands of synthetic training samples, but not all of them improve the classifier. This thesis scores each candidate by its position in embedding space and retains only those close to the real data distribution. Result: +2.25 pp macro-F1 over SMOTE across 3,675 configurations (p < 0.0001, d = 0.74, win-rate 83.8 %).",
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
    bio: "Ingeniero de IA. Construyo sistemas agénticos y RAG, y los llevo a producción: diseño, despliegue y la iteración que viene después. Actualmente CTO en Doctor911.",
    tags: ["Sistemas agénticos", "RAG", "IA en producción", "Multi-agente", "LangGraph", "ML", "Ciencia de datos"],
  },
  experience: [
    {
      company: "Doctor911",
      period: "Mar 2025 – Presente",
      impact:
        "El tráfico del sitio creció 10×, el chat y las herramientas de IA lograron adopción sostenida, y la empresa alcanzó la rentabilidad.",
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
            "Diseño y construyo los productos de IA (agentes, RAG) y los opero en producción.",
            "Integro los flujos clínicos y de negocio de WhatsApp y la web en un solo sistema.",
            "Reduzco la fricción de compra y mejoro las recomendaciones de exámenes del producto.",
          ],
        },
        {
          company: "Doctor911",
          title: "Ingeniero IA",
          period: "Mar 2025 – Ene 2026",
          bullets: [
            "Construí chatbots multi-agente (LangGraph) con RAG y manejo de contexto en WhatsApp Business y web.",
            "Integré pagos y catálogos nativos en WhatsApp: el usuario recibe la recomendación de examen y completa el pago sin salir del chat.",
            "Construí los pipelines de datos y los servicios productivos, y los refiné con feedback real de usuarios.",
            "Desplegué la infraestructura en Cloud Run y Vertex AI, con monitoreo de producción.",
          ],
        },
      ],
    },
    {
      company: "WiseConn Latam",
      period: "Sep 2024 – Mar 2025",
      impact:
        "Consolidé el sistema de datos de la empresa y desplegué modelos de forecasting a producción, donde anticipan riesgo y reducen costos operativos.",
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
            "Construí APIs en Python sobre PostgreSQL con tests automatizados, mejorando la estabilidad y los tiempos de respuesta del backend.",
            'Construí una aplicación de "Lenguaje Natural → SQL" (Flask, LLMs, Azure / GCP) para que el equipo consultara los datos en lenguaje natural.',
            "La refiné con usuarios reales hasta obtener resultados consistentemente precisos.",
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
  practice: [
    {
      id: "harness",
      title: "Ingeniería de harness",
      definition:
        "El andamiaje que convierte un modelo en producto: orquestación, interfaces de herramientas, guardrails y estado.",
      evidence: [
        "Orquestadores LangGraph en producción en Doctor911 — dos agentes en web, cuatro en WhatsApp — con los flujos clínicos y de negocio expuestos como herramientas.",
        "Guardrails como componentes, no como cláusulas del prompt: detección de crisis y redacción de PII corren antes del modelo (EPE).",
        "Pagos (Transbank, MercadoPago), formularios de Meta Flows y generación de PDF integrados como herramientas dentro del grafo de agentes.",
      ],
    },
    {
      id: "prompts",
      title: "Ingeniería de prompts",
      definition:
        "Prompts como artefactos versionados y medidos: se revisan, se prueban y se despliegan como código.",
      evidence: [
        "Prompts versionados con asignación A/B determinística por usuario en producción (EPE).",
        "Prompt caching de Anthropic en los cinco agentes de research paralelos de MiAutoCheck para contener latencia y costo.",
        "Prompts de NL→SQL refinados con consultas reales de usuarios hasta lograr resultados consistentemente precisos (Unitti).",
      ],
    },
    {
      id: "coevolution",
      title: "Coevolución modelo–harness",
      definition:
        "Modelo y andamiaje evolucionan juntos: cada mejora del modelo permite eliminar código del harness, y cada workaround señala lo que el próximo modelo debería absorber.",
      evidence: [
        "Migración de los agentes productivos de Doctor911 de Gemini a OpenAI detrás de interfaces de herramientas estables.",
        "La recomendación de exámenes es un tool call y no un quinto agente: la capacidad vive en la capa más simple que la sostiene con fiabilidad.",
        "Cada generación de modelos gatilla una revisión del harness: el andamiaje que el modelo absorbe se elimina, no se mantiene.",
      ],
    },
    {
      id: "evals",
      title: "Benchmarks de evaluación",
      definition:
        "Los cambios de comportamiento se miden antes de desplegarse: prompts, harness y cambios de modelo se contrastan con líneas base definidas.",
      evidence: [
        "Evaluación LLM-as-judge con monitoreo de drift en producción, sobre Langfuse (EPE).",
        "La asignación A/B determinística liga cada movimiento de métrica a la versión de prompt que lo causó (EPE).",
        "Tesis: benchmark de 3.675 configuraciones con pruebas de significancia — p < 0,0001, d de Cohen = 0,74, tasa de éxito 83,8 %.",
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
      "Los LLMs pueden generar miles de muestras sintéticas de entrenamiento, pero no todas mejoran el clasificador. Esta tesis evalúa cada candidata según su posición en el espacio de embeddings y conserva solo las cercanas a la distribución de los datos reales. Resultado: +2,25 pp macro-F1 sobre SMOTE en 3.675 configuraciones (p < 0,0001, d = 0,74, tasa de éxito 83,8 %).",
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

// Stable, language-agnostic profile fields (URLs, contact, identity)
export const profileStatic = {
  name: dataEn.profile.name,
  email: dataEn.profile.email,
  phone: dataEn.profile.phone,
  linkedin: dataEn.profile.linkedin,
  github: dataEn.profile.github,
} as const;
