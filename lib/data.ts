export const profile = {
  name: "Benjamin Schindler",
  title: "Software Engineer · AI Engineer",
  subtitle: "Master of Science in Data Science",
  location: "Chile",
  email: "benjamin.schindlerv@gmail.com",
  phone: "+(56 9) 56279434",
  linkedin: "https://www.linkedin.com/in/benjamin-schindler-92881a2b2/",
  github: "https://github.com/",
  bio: "Product-oriented AI Engineer focused on agentic systems, RAG, and production deployment. I build end-to-end solutions: from architectural design and integration with clinical/business stakeholders to rollout with observability and metrics, continuously iterating to maximize impact on end users.",
  tags: ["Agentic systems", "RAG", "Production AI", "Multi-agent", "LangGraph", "ML", "Data Science"],
};

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

export const experience: Experience[] = [
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
    period: "Dec 2024 — Mar 2025",
    impact:
      "Streamlined the company's entire data system and deployed forecasting models in production — predicting risk and reducing operational costs.",
    viz: "forecasting",
    stack: ["Transformers", "LSTM", "CNN", "AWS SageMaker", "S3", "PyTorch"],
    roles: [
      {
        company: "WiseConn Latam",
        title: "Data Science Intern",
        period: "Dec 2024 — Mar 2025",
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
    period: "Sep 2023 — Jul 2024",
    impact:
      "Accelerated internal development by 20 % and opened the data layer to non-technical users via a natural-language query tool.",
    viz: "nl2sql",
    stack: ["Python", "Flask", "PostgreSQL", "LLMs", "Azure", "GCP"],
    roles: [
      {
        company: "Unitti",
        title: "Intern · Software Engineer → AI",
        period: "Sep 2023 — Jul 2024",
        bullets: [
          "Developed Python APIs on PostgreSQL with automated testing — improved backend stability and response times.",
          'Built a "Natural Language → SQL" app (Flask, LLMs, Azure / GCP) for business queries in plain language.',
          "Iterated the product with real users to improve query accuracy and response clarity.",
        ],
      },
    ],
  },
];

export const education = [
  {
    institution: "Universidad Adolfo Ibáñez",
    degree: "Master of Science in Data Science",
    period: "2024 — Present",
    progress: 0.85,
    note: "Thesis: Geometric filtering for LLM-based data augmentation",
  },
  {
    institution: "Universidad Adolfo Ibáñez",
    degree: "Computer Engineering",
    period: "2020 — Jul 2025",
    progress: 1,
  },
  {
    institution: "Universidad Adolfo Ibáñez",
    degree: "Industrial Engineering",
    period: "2020 — Jul 2025",
    progress: 1,
  },
];

export const thesis = {
  title: "Data Augmentation with LLMs",
  subtitle: "Geometric Filtering for Few-shot Text Classification",
  advisor: "Prof. Gonzalo Ruz",
  institution: "Master of Science in Data Science · UAI",
  date: "April 2026",
  abstract:
    "LLMs can generate thousands of synthetic training samples — but not all are useful. This thesis filters LLM candidates by their geometry in the embedding space, keeping only those that fall in the right region. Result: +2.25 pp macro-F1 over SMOTE across 3,675 configurations (p < 0.0001, d = 0.74, win-rate 83.8 %).",
  results: [
    { method: "Soft weighting", delta: 2.25, isOurs: true },
    { method: "Binary filter", delta: 2.11, isOurs: true },
    { method: "SMOTE (ref.)", delta: 0, isOurs: false },
    { method: "EDA", delta: -0.22, isOurs: false },
    { method: "Inverse trans.", delta: -0.19, isOurs: false },
  ],
  stats: {
    configs: 3675,
    pValue: "< 0.0001",
    cohenD: 0.74,
    winRate: "83.8 %",
    macroF1: { ours: 73.49, smote: 71.24 },
  },
};

export const skills = {
  Languages: ["Python", "TypeScript", "SQL"],
  "ML & AI": ["TensorFlow", "PyTorch", "LangChain", "LangGraph", "RAG", "Pandas"],
  Cloud: ["GCP (Vertex AI, Cloud Run)", "AWS (SageMaker, S3)", "Azure"],
  Web: ["React", "Next.js", "Node.js", "Flask"],
  Data: ["PostgreSQL", "NoSQL", "Vector DBs"],
  DevOps: ["Linux", "CI/CD", "Monitoring", "Docker"],
};

export const languages = [
  { name: "Spanish", level: "Native" },
  { name: "English", level: "Advanced" },
  { name: "German", level: "Basic" },
];
