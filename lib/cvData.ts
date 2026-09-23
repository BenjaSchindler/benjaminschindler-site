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
  systems?: Project[];
  company: string;
  period: string;
  impact: string;
  highlights?: string[];
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
  id: "harness" | "prompts" | "retrieval" | "evals";
  title: string;
  project: string;
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

// English
const dataEn: DataSet = {
  "profile": {
    "name": "Benjamin Schindler",
    "title": "AI Engineer",
    "subtitle": "Master of Science in Data Science",
    "location": "Santiago, Chile",
    "email": "benjamin.schindlerv@gmail.com",
    "phone": "+56 9 5627 9434",
    "linkedin": "https://www.linkedin.com/in/benjamin-schindler-92881a2b2/",
    "github": "https://github.com/BenjaSchindler",
    "bio": "I'm an AI engineer and CTO at Doctor911, where I lead a three-person product team. I build AI assistants, RAG search systems, and tools that automate business tasks.",
    "tags": [
      "Agentic systems",
      "RAG",
      "Production AI",
      "Multi-agent",
      "LangGraph",
      "ML",
      "Data Science"
    ]
  },
  "experience": [
    {
      "company": "Doctor911",
      "period": "Mar 2025 – Present",
      "impact": "Built the AI products that contributed to 10× web traffic growth and company profitability.",
      "highlights": [
        "OneClinik: recorded-video consultations, PrexX-assisted medical review, and video replies in the patient portal.",
        "Internal RAG assistant with permission-aware search across company knowledge.",
        "Internal agent for team coordination and recurring operational tasks; MCP tools for Asana ticket management."
      ],
      "systems": [
        {
          "name": "OneClinik",
          "context": "Doctor911",
          "tagline": "Asynchronous video consultations on the web",
          "description": "Patients record their questions. A doctor reviews the case with PrexX support and replies with a video and notes in the patient portal.",
          "stack": ["Next.js", "React", "Supabase", "PrexX"],
          "highlights": [
            "Video recording, case review, and replies in one workflow.",
            "PrexX prepares a summary for the doctor to review.",
            "WhatsApp and email notifications connect each stage."
          ]
        },
        {
          "name": "PrexX Web",
          "context": "Doctor911",
          "tagline": "From a question to an action on the site",
          "description": "Two agents handle catalog search and support. A separate service turns health profiles into explained test recommendations.",
          "stack": [
            "LangGraph",
            "FastAPI",
            "Gemini",
            "Supabase",
            "BM25",
            "Vertex AI Evaluation"
          ],
          "highlights": [
            "Hybrid catalog search combines embeddings and BM25 with reciprocal rank fusion (RRF).",
            "A form-based service recommends packs using the health profile and catalog, with structured LLM output.",
            "Authenticated support retrieves the user’s order status, payments, medical order PDFs, and exam reviews.",
            "An evaluation harness records tool use and checks service scope, safety, and response style."
          ]
        }
      ],
      "viz": "agent-graph",
      "stack": [
        "LangGraph",
        "FastAPI",
        "Vertex AI",
        "Cloud Run",
        "Gemini Live",
        "MCP"
      ],
      "roles": [
        {
          "company": "Doctor911",
          "title": "Chief Technology Officer (CTO)",
          "period": "Jan 2026 – Present",
          "bullets": [
            "Lead a three-person product team: two engineers and one UX/UI designer.",
            "Built voice triage with Gemini Live and lab-report processing with Cloud Vision OCR.",
            "Built an internal RAG assistant with Vertex AI Search across Drive, Gmail, and Jira, respecting each user's access permissions.",
            "Added Vector Search over curated manuals, code, and policies, with a shared retrieval endpoint for agents.",
            "Built an internal agent for team coordination and recurring operational tasks.",
            "Developed an MCP server connecting agents to RAG and internal tools, including Asana ticket management.",
            "Lead AI strategy at Doctor911, selected for ChileMass Emprende 2026."
          ]
        },
        {
          "company": "Doctor911",
          "title": "AI Engineer",
          "period": "Mar 2025 – Jan 2026",
          "bullets": [
            "Built four WhatsApp agents and two web agents with LangGraph and FastAPI.",
            "Built RAG and XGBoost exam recommenders as shared tools for the agents.",
            "Integrated Meta Flows, catalogs, and Transbank payments.",
            "Combined AI agents with business rules and medical review for clinical approvals.",
            "Deployed the platform on GCP Cloud Run with production monitoring."
          ]
        }
      ]
    },
    {
      "company": "WiseConn Latam",
      "period": "Sep 2024 – Mar 2025",
      "impact": "Deployed irrigation forecasting models on AWS and consolidated data across departments.",
      "viz": "forecasting",
      "stack": [
        "Transformers",
        "LSTM",
        "CNN",
        "AWS SageMaker",
        "S3",
        "PyTorch"
      ],
      "roles": [
        {
          "company": "WiseConn Latam",
          "title": "Data Science Intern",
          "period": "Sep 2024 – Mar 2025",
          "bullets": [
            "Built CNN forecasting models for irrigation and classifiers for solar installations.",
            "Deployed models on SageMaker and S3 with validation and metric tracking.",
            "Led a cross-department data governance initiative."
          ]
        }
      ]
    },
    {
      "company": "Unitti",
      "period": "Jul 2022 – Jul 2024",
      "impact": "Automated invoice processing: 85% without manual intervention; monthly close shortened from eight days to three.",
      "viz": "nl2sql",
      "stack": [
        "Python",
        "Flask",
        "PostgreSQL",
        "LLMs",
        "Azure",
        "GCP"
      ],
      "roles": [
        {
          "company": "Unitti",
          "title": "Jr AI Engineer",
          "period": "Jul 2022 – Jul 2024",
          "bullets": [
            "Automated extraction and reconciliation of about 800 PDF invoices per month.",
            "Reduced processing time from ten minutes to under one minute per document.",
            "Built an NL-to-SQL app and improved queries using feedback from users.",
            "Developed Python APIs over PostgreSQL with automated tests."
          ]
        }
      ]
    }
  ],
  "projects": [
    {
      "name": "MiAutoCheck",
      "context": "Client work",
      "tagline": "Multimodal, multi-agent used-vehicle valuation API",
      "description": "An API that combines vehicle photos and market research into a PDF valuation report.",
      "stack": [
        "LangGraph",
        "FastAPI",
        "GPT-5-mini",
        "Anthropic",
        "Tavily",
        "Railway"
      ],
      "highlights": [
        "A vision agent inspects the vehicle from photos.",
        "Five research agents compare prices, reliability, recalls, costs, and competitors.",
        "A supervisor consolidates the findings into a report."
      ]
    },
    {
      "name": "EPE",
      "context": "Client work",
      "tagline": "Workplace emotional well-being platform",
      "description": "AI features for workplace well-being: emotion analysis and personalized exercises, with crisis detection and personal-data redaction.",
      "stack": [
        "FastAPI",
        "React Native",
        "React",
        "OpenAI",
        "Langfuse",
        "PostgreSQL"
      ],
      "highlights": [
        "Crisis detection and personal-data redaction.",
        "Versioned prompts with per-user A/B assignment.",
        "LLM-as-judge evaluations and drift monitoring in Langfuse."
      ]
    }
  ],
  "practice": [
    {
      "id": "harness",
      "title": "Agents and business rules",
      "project": "Doctor911",
      "definition": "Four WhatsApp agents share tools for sales, support, and orders.",
      "evidence": [
        "Payments and booking follow explicit business rules.",
        "Clinical approvals require medical review."
      ]
    },
    {
      "id": "prompts",
      "title": "Prompt experiments",
      "project": "EPE",
      "definition": "Each user is assigned to a versioned prompt for A/B comparison.",
      "evidence": [
        "Versioning identifies the prompt behind each response.",
        "Langfuse records responses for evaluation."
      ]
    },
    {
      "id": "retrieval",
      "title": "Search with access controls",
      "project": "Doctor911",
      "definition": "Two retrieval paths serve the same RAG endpoint.",
      "evidence": [
        "Vertex AI Search respects each user’s access permissions.",
        "Vector Search retrieves from a curated document corpus."
      ]
    },
    {
      "id": "evals",
      "title": "Response evaluation",
      "project": "EPE",
      "definition": "LLM-as-judge evaluations track response quality in Langfuse.",
      "evidence": [
        "Compare results across prompt versions.",
        "Monitor changes in quality over time."
      ]
    }
  ],
  "education": [
    {
      "institution": "Universidad Adolfo Ibáñez",
      "degree": "Master of Science in Data Science",
      "period": "2024 – 2026",
      "progress": 1,
      "grade": "GPA 3.6 / 4.0",
      "note": "Thesis defended with Maximum Distinction: LLM-based data augmentation."
    },
    {
      "institution": "Universidad Adolfo Ibáñez",
      "degree": "Software Engineering",
      "period": "2020 – Jul 2025",
      "progress": 1,
      "grade": "GPA 3.5 / 4.0"
    },
    {
      "institution": "Universidad Adolfo Ibáñez",
      "degree": "Industrial Engineering",
      "period": "2020 – Jul 2025",
      "progress": 1,
      "grade": "GPA 3.4 / 4.0"
    }
  ],
  "thesis": {
    "title": "Data Augmentation with LLMs",
    "subtitle": "Geometric Filtering for Few-shot Text Classification",
    "advisor": "Prof. Gonzalo Ruz",
    "institution": "Master of Science in Data Science · UAI",
    "date": "April 2026",
    "abstract": "I evaluated synthetic training examples by their position in embedding space. Soft weighting improved macro-F1 by 2.25 percentage points over SMOTE across 3,675 configurations.",
    "results": [
      {
        "id": "soft-weighting",
        "method": "Soft weighting",
        "delta": 2.25,
        "isOurs": true
      },
      {
        "id": "binary-filter",
        "method": "Binary filter",
        "delta": 2.11,
        "isOurs": true
      },
      {
        "id": "smote",
        "method": "SMOTE (ref.)",
        "delta": 0,
        "isOurs": false
      },
      {
        "id": "eda",
        "method": "EDA",
        "delta": -0.22,
        "isOurs": false
      },
      {
        "id": "inverse-trans",
        "method": "Inverse trans.",
        "delta": -0.19,
        "isOurs": false
      }
    ],
    "stats": {
      "configs": 3675,
      "pValue": "< 0.0001",
      "cohenD": 0.74,
      "winRate": "83.8 %",
      "macroF1": {
        "ours": 73.49,
        "smote": 71.24
      }
    }
  },
  "skills": {
    "Programming": [
      "Python",
      "TypeScript",
      "SQL"
    ],
    "ML & AI": [
      "PyTorch",
      "XGBoost",
      "LangGraph",
      "LangChain",
      "RAG"
    ],
    "Cloud": [
      "GCP (Vertex AI, Cloud Run)",
      "AWS (SageMaker, S3)",
      "Azure"
    ],
    "Web": [
      "FastAPI",
      "React",
      "Next.js",
      "Flask"
    ],
    "Data": [
      "PostgreSQL",
      "NoSQL",
      "Vector DBs"
    ],
    "DevOps": [
      "Linux",
      "CI/CD",
      "Monitoring",
      "Docker"
    ],
    "Evaluation": [
      "Langfuse",
      "LLM-as-judge",
      "A/B testing"
    ]
  },
  "languages": [
    {
      "name": "Spanish",
      "level": "Native"
    },
    {
      "name": "English",
      "level": "Advanced"
    },
    {
      "name": "German",
      "level": "Basic"
    }
  ]
};

// Español
const dataEs: DataSet = {
  "profile": {
    "name": "Benjamin Schindler",
    "title": "Ingeniero de IA",
    "subtitle": "Magíster en Ciencia de Datos",
    "location": "Santiago, Chile",
    "email": "benjamin.schindlerv@gmail.com",
    "phone": "+56 9 5627 9434",
    "linkedin": "https://www.linkedin.com/in/benjamin-schindler-92881a2b2/",
    "github": "https://github.com/BenjaSchindler",
    "bio": "Soy ingeniero de IA y CTO en Doctor911, donde lidero un equipo de producto de tres personas. Desarrollo asistentes de IA, sistemas de búsqueda con RAG y herramientas para automatizar tareas del negocio.",
    "tags": [
      "Sistemas agénticos",
      "RAG",
      "IA en producción",
      "Multi-agente",
      "LangGraph",
      "ML",
      "Ciencia de datos"
    ]
  },
  "experience": [
    {
      "company": "Doctor911",
      "period": "Mar 2025 – Presente",
      "impact": "Desarrollé los productos de IA que contribuyeron al crecimiento de 10× del tráfico web y a la rentabilidad de la empresa.",
      "highlights": [
        "OneClinik: consultas por video grabado, revisión médica con PrexX y respuesta en el portal del paciente.",
        "Asistente RAG interno para consultar información de la empresa respetando los permisos de cada usuario.",
        "Agente interno para coordinar al equipo y automatizar tareas operativas; herramientas MCP para gestionar tickets en Asana."
      ],
      "systems": [
        {
          "name": "OneClinik",
          "context": "Doctor911",
          "tagline": "Videoconsultas asíncronas en la web",
          "description": "El paciente graba su consulta. Un médico revisa el caso con apoyo de PrexX y responde con un video y notas en el portal del paciente.",
          "stack": ["Next.js", "React", "Supabase", "PrexX"],
          "highlights": [
            "Grabación, revisión del caso y respuesta en un mismo flujo.",
            "PrexX prepara un resumen para la revisión del médico.",
            "Avisos por WhatsApp y correo conectan las etapas."
          ]
        },
        {
          "name": "PrexX Web",
          "context": "Doctor911",
          "tagline": "De una pregunta a una acción en el sitio",
          "description": "Dos agentes resuelven búsquedas y soporte. Un servicio aparte convierte el perfil de salud en recomendaciones de exámenes con una explicación.",
          "stack": [
            "LangGraph",
            "FastAPI",
            "Gemini",
            "Supabase",
            "BM25",
            "Vertex AI Evaluation"
          ],
          "highlights": [
            "Búsqueda híbrida de catálogo: embeddings y BM25, combinados con reciprocal rank fusion (RRF).",
            "Un servicio recibe el formulario y recomienda packs según el perfil y el catálogo, con salida estructurada del LLM.",
            "Soporte autenticado consulta pedidos, pagos, órdenes PDF y revisiones de exámenes del propio usuario.",
            "Un harness registra herramientas utilizadas y evalúa alcance del servicio, seguridad y estilo de respuesta."
          ]
        }
      ],
      "viz": "agent-graph",
      "stack": [
        "LangGraph",
        "FastAPI",
        "Vertex AI",
        "Cloud Run",
        "Gemini Live",
        "MCP"
      ],
      "roles": [
        {
          "company": "Doctor911",
          "title": "Chief Technology Officer (CTO)",
          "period": "Ene 2026 – Presente",
          "bullets": [
            "Lidero un equipo de producto de tres personas: dos ingenieros y un diseñador UX/UI.",
            "Desarrollé triaje por voz con Gemini Live y lectura de exámenes con Cloud Vision OCR.",
            "Desarrollé un asistente RAG interno con Vertex AI Search sobre Drive, Gmail y Jira, respetando los permisos de cada usuario.",
            "Incorporé Vector Search para consultar manuales, código y políticas seleccionadas, con un endpoint de búsqueda compartido entre agentes.",
            "Construí un agente interno para coordinar al equipo y automatizar tareas operativas recurrentes.",
            "Desarrollé un servidor MCP que conecta agentes con RAG y herramientas internas, incluida la gestión de tickets en Asana.",
            "Lidero la estrategia de IA de Doctor911, seleccionada para ChileMass Emprende 2026."
          ]
        },
        {
          "company": "Doctor911",
          "title": "Ingeniero de IA",
          "period": "Mar 2025 – Ene 2026",
          "bullets": [
            "Construí cuatro agentes de WhatsApp y dos agentes web con LangGraph y FastAPI.",
            "Construí recomendadores de exámenes con RAG y XGBoost como herramientas compartidas entre agentes.",
            "Integré Meta Flows, catálogos y pagos con Transbank.",
            "Combiné agentes con reglas de negocio y revisión médica para las aprobaciones clínicas.",
            "Desplegué la plataforma en GCP Cloud Run con monitoreo de producción."
          ]
        }
      ]
    },
    {
      "company": "WiseConn Latam",
      "period": "Sep 2024 – Mar 2025",
      "impact": "Desplegué modelos de predicción de riego en AWS y consolidé datos entre departamentos.",
      "viz": "forecasting",
      "stack": [
        "Transformers",
        "LSTM",
        "CNN",
        "AWS SageMaker",
        "S3",
        "PyTorch"
      ],
      "roles": [
        {
          "company": "WiseConn Latam",
          "title": "Practicante de Ciencia de Datos",
          "period": "Sep 2024 – Mar 2025",
          "bullets": [
            "Desarrollé predicciones de riego con CNN y clasificadores para instalaciones solares.",
            "Desplegué modelos en SageMaker y S3 con validación y seguimiento de métricas.",
            "Lideré una iniciativa de gobierno de datos entre departamentos."
          ]
        }
      ]
    },
    {
      "company": "Unitti",
      "period": "Jul 2022 – Jul 2024",
      "impact": "Automaticé el procesamiento de facturas: 85% sin intervención manual y cierre mensual de ocho a tres días.",
      "viz": "nl2sql",
      "stack": [
        "Python",
        "Flask",
        "PostgreSQL",
        "LLMs",
        "Azure",
        "GCP"
      ],
      "roles": [
        {
          "company": "Unitti",
          "title": "Ingeniero de IA Jr.",
          "period": "Jul 2022 – Jul 2024",
          "bullets": [
            "Automaticé la extracción y conciliación de unas 800 facturas PDF al mes.",
            "Reduje el procesamiento de diez minutos a menos de uno por documento.",
            "Desarrollé una aplicación de lenguaje natural a SQL y ajusté las consultas con comentarios de usuarios.",
            "Desarrollé APIs en Python sobre PostgreSQL con pruebas automatizadas."
          ]
        }
      ]
    }
  ],
  "projects": [
    {
      "name": "MiAutoCheck",
      "context": "Proyecto para cliente",
      "tagline": "API multimodal y multiagente de tasación de autos usados",
      "description": "Una API que combina fotografías del vehículo e información de mercado en un informe PDF de tasación.",
      "stack": [
        "LangGraph",
        "FastAPI",
        "GPT-5-mini",
        "Anthropic",
        "Tavily",
        "Railway"
      ],
      "highlights": [
        "Un agente visual inspecciona el vehículo a partir de fotos.",
        "Cinco agentes investigan precios, fiabilidad, alertas, costos y competencia.",
        "Un supervisor reúne los resultados en el informe."
      ]
    },
    {
      "name": "EPE",
      "context": "Proyecto para cliente",
      "tagline": "Plataforma de bienestar emocional laboral",
      "description": "Funciones de IA para bienestar laboral: análisis de emociones y ejercicios personalizados, con detección de crisis y ocultamiento de datos personales.",
      "stack": [
        "FastAPI",
        "React Native",
        "React",
        "OpenAI",
        "Langfuse",
        "PostgreSQL"
      ],
      "highlights": [
        "Detección de crisis y ocultamiento de datos personales.",
        "Prompts versionados con asignación A/B por usuario.",
        "Evaluaciones con LLM-as-judge y monitoreo de cambios en Langfuse."
      ]
    }
  ],
  "practice": [
    {
      "id": "harness",
      "title": "Agentes y reglas de negocio",
      "project": "Doctor911",
      "definition": "Cuatro agentes de WhatsApp comparten herramientas para ventas, soporte y pedidos.",
      "evidence": [
        "Los pagos y las reservas siguen reglas de negocio.",
        "Las aprobaciones clínicas requieren revisión médica."
      ]
    },
    {
      "id": "prompts",
      "title": "Experimentos con prompts",
      "project": "EPE",
      "definition": "Cada usuario recibe una versión del prompt para comparar resultados A/B.",
      "evidence": [
        "El versionado identifica el prompt de cada respuesta.",
        "Langfuse registra las respuestas para evaluarlas."
      ]
    },
    {
      "id": "retrieval",
      "title": "Búsqueda con permisos",
      "project": "Doctor911",
      "definition": "Dos rutas de búsqueda alimentan el mismo servicio RAG.",
      "evidence": [
        "Vertex AI Search respeta los permisos de cada usuario.",
        "Vector Search consulta una colección de documentos seleccionados."
      ]
    },
    {
      "id": "evals",
      "title": "Evaluación de respuestas",
      "project": "EPE",
      "definition": "Evaluaciones con LLM-as-judge registran la calidad de las respuestas en Langfuse.",
      "evidence": [
        "Comparación de resultados entre versiones de prompts.",
        "Monitoreo de cambios en la calidad a lo largo del tiempo."
      ]
    }
  ],
  "education": [
    {
      "institution": "Universidad Adolfo Ibáñez",
      "degree": "Magíster en Ciencia de Datos",
      "period": "2024 – 2026",
      "progress": 1,
      "grade": "6,23 / 7,0",
      "note": "Tesis defendida con Distinción Máxima: aumento de datos con LLMs."
    },
    {
      "institution": "Universidad Adolfo Ibáñez",
      "degree": "Ingeniería Civil Informática",
      "period": "2020 – Jul 2025",
      "progress": 1,
      "grade": "6,20 / 7,0"
    },
    {
      "institution": "Universidad Adolfo Ibáñez",
      "degree": "Ingeniería Civil Industrial",
      "period": "2020 – Jul 2025",
      "progress": 1,
      "grade": "6,01 / 7,0"
    }
  ],
  "thesis": {
    "title": "Aumento de datos con LLMs",
    "subtitle": "Filtrado geométrico para clasificación con pocos ejemplos",
    "advisor": "Prof. Gonzalo Ruz",
    "institution": "Magíster en Ciencia de Datos · UAI",
    "date": "Abril 2026",
    "abstract": "Evalué ejemplos sintéticos según su posición en el espacio de embeddings. La ponderación suave mejoró el macro-F1 en 2,25 puntos porcentuales frente a SMOTE en 3.675 configuraciones.",
    "results": [
      {
        "id": "soft-weighting",
        "method": "Ponderación suave",
        "delta": 2.25,
        "isOurs": true
      },
      {
        "id": "binary-filter",
        "method": "Filtro binario",
        "delta": 2.11,
        "isOurs": true
      },
      {
        "id": "smote",
        "method": "SMOTE (ref.)",
        "delta": 0,
        "isOurs": false
      },
      {
        "id": "eda",
        "method": "EDA",
        "delta": -0.22,
        "isOurs": false
      },
      {
        "id": "inverse-trans",
        "method": "Trans. inversa",
        "delta": -0.19,
        "isOurs": false
      }
    ],
    "stats": {
      "configs": 3675,
      "pValue": "< 0,0001",
      "cohenD": 0.74,
      "winRate": "83,8 %",
      "macroF1": {
        "ours": 73.49,
        "smote": 71.24
      }
    }
  },
  "skills": {
    "Lenguajes": [
      "Python",
      "TypeScript",
      "SQL"
    ],
    "ML & IA": [
      "PyTorch",
      "XGBoost",
      "LangGraph",
      "LangChain",
      "RAG"
    ],
    "Cloud": [
      "GCP (Vertex AI, Cloud Run)",
      "AWS (SageMaker, S3)",
      "Azure"
    ],
    "Web": [
      "FastAPI",
      "React",
      "Next.js",
      "Flask"
    ],
    "Datos": [
      "PostgreSQL",
      "NoSQL",
      "Vector DBs"
    ],
    "DevOps": [
      "Linux",
      "CI/CD",
      "Monitoreo",
      "Docker"
    ],
    "Evaluación": [
      "Langfuse",
      "LLM-as-judge",
      "A/B testing"
    ]
  },
  "languages": [
    {
      "name": "Español",
      "level": "Nativo"
    },
    {
      "name": "Inglés",
      "level": "Avanzado"
    },
    {
      "name": "Alemán",
      "level": "Básico"
    }
  ]
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
