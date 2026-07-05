"use client";
import { useLanguage, type Lang } from "./Language";

type Strings = {
  nav: {
    experience: string;
    thesis: string;
    projects: string;
    education: string;
    skills: string;
    contact: string;
    resume: string;
    downloadResume: string;
    openMenu: string;
  };
  hero: {
    available: string;
    statusLocation: string;
    openToOpportunities: string;
    exploreExperience: string;
    readThesis: string;
    getInTouch: string;
    scrollToExperience: string;
  };
  quickLinks: {
    email: string;
    linkedin: string;
    resume: string;
  };
  section: {
    experienceTitle: string;
    experienceSubtitle: string;
    thesisTitle: string;
    thesisSubtitle: string; // suffixed with date externally
    projectsTitle: string;
    projectsSubtitle: string;
    practiceTitle: string;
    practiceSubtitle: string;
    agentTitle: string;
    agentSubtitle: string;
    educationTitle: string;
    educationSubtitle: string;
    skillsTitle: string;
    skillsSubtitle: string;
    contactTitle: string;
    contactSubtitle: string;
  };
  experienceCard: {
    impact: string;
  };
  education: {
    inProgress: string;
    completed: string;
    languagesGroup: string;
  };
  thesis: {
    defenseSlides: string;
    advisedBy: string;
    configs: string;
    pValue: string;
    cohenD: string;
    winRate: string;
  };
  contact: {
    email: string;
    linkedin: string;
    phone: string;
    basedIn: string;
  };
  viewMode: {
    concise: string;
    technical: string;
    switchToConcise: string;
    switchToTechnical: string;
  };
  language: {
    switchTo: string; // takes target language name
    english: string;
    spanish: string;
  };
  viz: {
    loadingForecast: string;
    loadingAgentGraph: string;
    loadingPipeline: string;
    loadingScatter: string;
  };
  agent: {
    inputPlaceholder: string;
    send: string;
    you: string;
    agentLabel: string;
    traceTitle: string;
    traceEmpty: string;
    toolsTitle: string;
    toolsList: { name: string; desc: string }[];
    live: string;
    replay: string;
    disclaimer: string;
    limitReached: string;
    errorLine: string;
    suggested: string[];
    openChat: string;
    closeChat: string;
    expandChat: string;
    shrinkChat: string;
    chatTab: string;
    traceTab: string;
    teaserCta: string;
    teaserDismiss: string;
    teasers: Record<string, { text: string; question: string }>;
    matchButton: string;
    recruiterPitch: string;
    matchPlaceholder: string;
    matchRun: string;
    matchCancel: string;
    matchHint: string;
    jdLabel: string;
    jdExpand: string;
    jdCollapse: string;
    verdicts: { met: string; partial: string; missing: string };
    evalsTab: string;
    evalsIntro: string;
    evalsEmpty: string;
    evalsLastRun: string;
  };
  footer: {
    copyrightSuffix: string;
    email: string;
    linkedin: string;
  };
  contactPrompt: string;
  contactPromptHighlight: string;
  resumeHref: string;
};

const en: Strings = {
  nav: {
    experience: "Experience",
    thesis: "Thesis",
    projects: "Projects",
    education: "Education",
    skills: "Skills",
    contact: "Contact",
    resume: "Resume",
    downloadResume: "Download resume",
    openMenu: "Open menu",
  },
  hero: {
    available: "Available",
    statusLocation: "Santiago, Chile · GMT−3 · v2026.06",
    openToOpportunities: "Open to opportunities",
    exploreExperience: "Explore experience",
    readThesis: "Read thesis",
    getInTouch: "Get in touch",
    scrollToExperience: "Scroll to experience",
  },
  quickLinks: {
    email: "Email",
    linkedin: "LinkedIn",
    resume: "Resume",
  },
  section: {
    experienceTitle: "Experience",
    experienceSubtitle: "hover the visualizations to explore",
    thesisTitle: "Master's thesis",
    thesisSubtitle: "defense",
    projectsTitle: "Projects",
    projectsSubtitle: "selected client work",
    practiceTitle: "AI Engineering Practice",
    practiceSubtitle: "how I work with models",
    agentTitle: "Ask the Agent",
    agentSubtitle: "the AI practice on this site, running live",
    educationTitle: "Education",
    educationSubtitle: "Universidad Adolfo Ibáñez",
    skillsTitle: "Skills",
    skillsSubtitle: "tools / frameworks / languages",
    contactTitle: "Contact",
    contactSubtitle: "how to reach me",
  },
  experienceCard: {
    impact: "Impact",
  },
  education: {
    inProgress: "in progress",
    completed: "completed",
    languagesGroup: "Languages",
  },
  thesis: {
    defenseSlides: "Defense slides",
    advisedBy: "Advised by",
    configs: "Configs",
    pValue: "P-value",
    cohenD: "Cohen d",
    winRate: "Win-rate",
  },
  contact: {
    email: "Email",
    linkedin: "LinkedIn",
    phone: "Phone",
    basedIn: "Based in",
  },
  viewMode: {
    concise: "Concise",
    technical: "Technical",
    switchToConcise: "Switch to concise view",
    switchToTechnical: "Switch to technical view",
  },
  language: {
    switchTo: "Switch to",
    english: "English",
    spanish: "Spanish",
  },
  viz: {
    loadingForecast: "loading forecast...",
    loadingAgentGraph: "loading agent graph...",
    loadingPipeline: "loading pipeline...",
    loadingScatter: "loading scatter...",
  },
  agent: {
    inputPlaceholder: "Ask about the work above…",
    send: "Send",
    you: "you",
    agentLabel: "agent",
    traceTitle: "trace",
    traceEmpty: "send a question to watch the harness work",
    toolsTitle: "available tools",
    toolsList: [
      { name: "get_profile", desc: "identity, contact, resume" },
      { name: "get_experience", desc: "roles, impact, stack" },
      { name: "get_projects", desc: "client work: MiAutoCheck, EPE" },
      { name: "get_thesis", desc: "benchmark, stats, results" },
      { name: "get_practice", desc: "how he works with models" },
      { name: "get_education_and_skills", desc: "degrees, skills, languages" },
      { name: "show_section", desc: "scrolls this page to a section" },
    ],
    live: "live",
    replay: "replay",
    disclaimer:
      "An agent with read-only tools over this CV's data. Rate-limited; conversations are not stored.",
    limitReached: "Session limit reached — use the contact section below.",
    errorLine: "The connection dropped. Try again in a moment.",
    suggested: [
      "Give me the 30-second tour of this site.",
      "What did Benjamin build at Doctor911?",
      "Summarize the thesis results.",
      "How does he run evals in production?",
    ],
    openChat: "Ask the agent",
    closeChat: "Close chat",
    expandChat: "Expand chat",
    shrinkChat: "Shrink chat",
    chatTab: "chat",
    traceTab: "trace",
    teaserCta: "ask the agent →",
    teaserDismiss: "Dismiss suggestion",
    teasers: {
      experience: {
        text: "Machine learning on millions of sensor rows at WiseConn.",
        question: "Tell me about the machine learning work on millions of rows at WiseConn.",
      },
      thesis: {
        text: "LLM augmentation beat SMOTE by +2.25 pp macro-F1.",
        question: "How did the thesis beat SMOTE by +2.25 pp?",
      },
      projects: {
        text: "Guardrails, prompt versioning and evals in real client work.",
        question: "How does he handle guardrails and evals in client projects?",
      },
      practice: {
        text: "This chat runs on the practice described here.",
        question: "How does Benjamin work with models?",
      },
      skills: {
        text: "Python, PyTorch, LangGraph, GCP & AWS.",
        question: "What is his core stack?",
      },
    },
    matchButton: "Match a job description",
    recruiterPitch:
      "Hiring? Paste a job description and I'll check it against this CV — honest gaps included.",
    matchPlaceholder: "Paste the job description here…",
    matchRun: "Match",
    matchCancel: "Cancel",
    matchHint:
      "The agent checks each requirement against the CV data and reports honest gaps.",
    jdLabel: "job description",
    jdExpand: "show full text",
    jdCollapse: "collapse",
    verdicts: { met: "met", partial: "partial", missing: "gap" },
    evalsTab: "evals",
    evalsIntro:
      "Automated behavior checks run against this live agent — grounding, scope, injection resistance, language, tool discipline. Published as-is, failures included.",
    evalsEmpty: "No published eval results yet.",
    evalsLastRun: "last run",
  },
  footer: {
    copyrightSuffix: "Built with Next.js · Deployed on Vercel",
    email: "Email",
    linkedin: "LinkedIn",
  },
  contactPrompt: "I build AI systems that reach production and stay reliable.",
  contactPromptHighlight: "Get in touch.",
  resumeHref: "/cv.pdf",
};

const es: Strings = {
  nav: {
    experience: "Experiencia",
    thesis: "Tesis",
    projects: "Proyectos",
    education: "Educación",
    skills: "Habilidades",
    contact: "Contacto",
    resume: "CV",
    downloadResume: "Descargar CV",
    openMenu: "Abrir menú",
  },
  hero: {
    available: "Disponible",
    statusLocation: "Santiago, Chile · GMT−3 · v2026.06",
    openToOpportunities: "Abierto a oportunidades",
    exploreExperience: "Ver experiencia",
    readThesis: "Leer tesis",
    getInTouch: "Contacto",
    scrollToExperience: "Ir a experiencia",
  },
  quickLinks: {
    email: "Correo",
    linkedin: "LinkedIn",
    resume: "CV",
  },
  section: {
    experienceTitle: "Experiencia",
    experienceSubtitle: "pasa el cursor por las visualizaciones",
    thesisTitle: "Tesis de Magíster",
    thesisSubtitle: "defensa",
    projectsTitle: "Proyectos",
    projectsSubtitle: "trabajo de cliente seleccionado",
    practiceTitle: "Práctica de Ingeniería de IA",
    practiceSubtitle: "cómo trabajo con modelos",
    agentTitle: "Pregúntale al Agente",
    agentSubtitle: "la práctica de IA de este sitio, corriendo en vivo",
    educationTitle: "Educación",
    educationSubtitle: "Universidad Adolfo Ibáñez",
    skillsTitle: "Habilidades",
    skillsSubtitle: "herramientas / frameworks / lenguajes",
    contactTitle: "Contacto",
    contactSubtitle: "cómo contactarme",
  },
  experienceCard: {
    impact: "Impacto",
  },
  education: {
    inProgress: "en curso",
    completed: "completado",
    languagesGroup: "Idiomas",
  },
  thesis: {
    defenseSlides: "Diapositivas de defensa",
    advisedBy: "Asesorado por",
    configs: "Configs",
    pValue: "Valor-p",
    cohenD: "Cohen d",
    winRate: "Tasa de éxito",
  },
  contact: {
    email: "Correo",
    linkedin: "LinkedIn",
    phone: "Teléfono",
    basedIn: "Ubicado en",
  },
  viewMode: {
    concise: "Conciso",
    technical: "Técnico",
    switchToConcise: "Cambiar a vista concisa",
    switchToTechnical: "Cambiar a vista técnica",
  },
  language: {
    switchTo: "Cambiar a",
    english: "Inglés",
    spanish: "Español",
  },
  viz: {
    loadingForecast: "cargando forecast...",
    loadingAgentGraph: "cargando grafo de agentes...",
    loadingPipeline: "cargando pipeline...",
    loadingScatter: "cargando dispersión...",
  },
  agent: {
    inputPlaceholder: "Pregunta sobre el trabajo de arriba…",
    send: "Enviar",
    you: "tú",
    agentLabel: "agente",
    traceTitle: "trace",
    traceEmpty: "envía una pregunta para ver el harness trabajar",
    toolsTitle: "herramientas disponibles",
    toolsList: [
      { name: "get_profile", desc: "identidad, contacto, CV" },
      { name: "get_experience", desc: "roles, impacto, stack" },
      { name: "get_projects", desc: "trabajo de cliente: MiAutoCheck, EPE" },
      { name: "get_thesis", desc: "benchmark, estadísticas, resultados" },
      { name: "get_practice", desc: "cómo trabaja con modelos" },
      { name: "get_education_and_skills", desc: "títulos, habilidades, idiomas" },
      { name: "show_section", desc: "desplaza esta página a una sección" },
    ],
    live: "en vivo",
    replay: "replay",
    disclaimer:
      "Un agente con herramientas de solo lectura sobre los datos de este CV. Con límite de uso; las conversaciones no se almacenan.",
    limitReached: "Límite de la sesión alcanzado — usa la sección de contacto más abajo.",
    errorLine: "Se cortó la conexión. Intenta de nuevo en un momento.",
    suggested: [
      "Dame el tour de 30 segundos por este sitio.",
      "¿Qué construyó Benjamin en Doctor911?",
      "Resume los resultados de la tesis.",
      "¿Cómo corre evals en producción?",
    ],
    openChat: "Pregúntale al agente",
    closeChat: "Cerrar chat",
    expandChat: "Agrandar chat",
    shrinkChat: "Reducir chat",
    chatTab: "chat",
    traceTab: "trace",
    teaserCta: "preguntar →",
    teaserDismiss: "Ocultar sugerencia",
    teasers: {
      experience: {
        text: "Machine learning sobre millones de filas de sensores en WiseConn.",
        question: "Cuéntame del trabajo de machine learning con millones de filas en WiseConn.",
      },
      thesis: {
        text: "La augmentación con LLMs superó a SMOTE por +2.25 pp de macro-F1.",
        question: "¿Cómo superó la tesis a SMOTE por +2.25 pp?",
      },
      projects: {
        text: "Guardrails, versionado de prompts y evals en trabajo real con clientes.",
        question: "¿Cómo maneja guardrails y evals en proyectos de clientes?",
      },
      practice: {
        text: "Este chat corre sobre la práctica descrita aquí.",
        question: "¿Cómo trabaja Benjamin con los modelos?",
      },
      skills: {
        text: "Python, PyTorch, LangGraph, GCP y AWS.",
        question: "¿Cuál es su stack principal?",
      },
    },
    matchButton: "Evalúa una oferta laboral",
    recruiterPitch:
      "¿Contratando? Pega una descripción de cargo y la contrasto con este CV — brechas honestas incluidas.",
    matchPlaceholder: "Pega aquí la descripción del cargo…",
    matchRun: "Evaluar",
    matchCancel: "Cancelar",
    matchHint:
      "El agente contrasta cada requisito con los datos del CV y reporta brechas con honestidad.",
    jdLabel: "descripción del cargo",
    jdExpand: "ver texto completo",
    jdCollapse: "contraer",
    verdicts: { met: "cumple", partial: "parcial", missing: "brecha" },
    evalsTab: "evals",
    evalsIntro:
      "Checks automáticos de comportamiento contra este agente en vivo — grounding, alcance, resistencia a inyección, idioma, disciplina de herramientas. Publicados tal cual, fallas incluidas.",
    evalsEmpty: "Aún no hay resultados de evals publicados.",
    evalsLastRun: "última corrida",
  },
  footer: {
    copyrightSuffix: "Construido con Next.js · Desplegado en Vercel",
    email: "Correo",
    linkedin: "LinkedIn",
  },
  contactPrompt: "Construyo sistemas de IA que llegan a producción y se mantienen confiables.",
  contactPromptHighlight: "Hablemos.",
  resumeHref: "/cv-es.pdf",
};

const STRINGS: Record<Lang, Strings> = { en, es };

export function getStrings(lang: Lang): Strings {
  return STRINGS[lang];
}

export function useT(): Strings {
  const { lang } = useLanguage();
  return STRINGS[lang];
}
