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
    agentSubtitle: "the practice above, running live",
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
      "What did Benjamin build at Doctor911?",
      "Summarize the thesis results.",
      "How does he run evals in production?",
      "What multi-agent systems has he shipped?",
    ],
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
    agentSubtitle: "la práctica de arriba, corriendo en vivo",
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
      "¿Qué construyó Benjamin en Doctor911?",
      "Resume los resultados de la tesis.",
      "¿Cómo corre evals en producción?",
      "¿Qué sistemas multi-agente ha desplegado?",
    ],
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
