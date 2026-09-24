"use client";
import { useLanguage, type Lang } from "./Language";
import type { PageTarget } from "./agent/targets";
import type { MatchFit } from "./agent/match";

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
    traceEmpty: string;
    toolsTitle: string;
    toolsList: { name: string; desc: string }[];
    live: string;
    replay: string;
    disclaimer: string;
    limitReached: string;
    errorLine: string;
    suggested: string[];
    askLabel: string;
    capabilities: Record<"match" | "tour" | "email", { title: string; desc: string }>;
    tourQuestion: string;
    emailQuestion: string;
    sourcesLabel: string;
    targets: Record<PageTarget, string>;
    actions: { paper: string; cv: string; email: string; demo: string; matchEmail: string };
    emailCard: { title: string; to: string; open: string; copy: string; copied: string };
    fit: Record<MatchFit, string>;
    openChat: string;
    closeChat: string;
    expandChat: string;
    shrinkChat: string;
    chatTab: string;
    traceTab: string;
    matchButton: string;
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
    statusLocation: "Santiago, Chile",
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
    experienceSubtitle: "systems and results",
    thesisTitle: "Master's thesis",
    thesisSubtitle: "defense",
    projectsTitle: "Projects",
    projectsSubtitle: "selected projects",
    practiceTitle: "Practices in projects",
    practiceSubtitle: "workflows, experiments, and evaluations",
    agentTitle: "Ask the Agent",
    agentSubtitle: "check a role, tour the site, or ask about his work",
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
    configs: "Configurations",
    pValue: "P-value",
    cohenD: "Cohen's d",
    winRate: "Win rate vs. SMOTE",
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
    traceEmpty: "send a question to watch the harness work",
    toolsTitle: "available tools",
    toolsList: [
      { name: "search_cv", desc: "keyword search over every CV fact, with its source" },
      { name: "get_experience", desc: "roles, impact, stack, systems" },
      { name: "get_projects", desc: "client work: MiAutoCheck, EPE" },
      { name: "get_thesis", desc: "results, stats, paper" },
      { name: "get_practice", desc: "how he works, with evidence" },
      { name: "get_education_and_skills", desc: "degrees, skills, languages" },
      { name: "get_profile", desc: "role, availability, contact, CV" },
      { name: "show_section", desc: "scrolls this page to a section, card, or demo" },
      { name: "report_match", desc: "renders a job-match table" },
      { name: "draft_email", desc: "prepares an email to Benjamin" },
    ],
    live: "live",
    replay: "replay",
    disclaimer:
      "An agent with read-only tools over this CV's data. Rate-limited; conversations are not stored.",
    limitReached: "Session limit reached — use the contact section below.",
    errorLine: "The connection dropped. Try again in a moment.",
    suggested: [
      "What did Benjamin build at Doctor911?",
      "Does he have multi-agent experience?",
      "Summarize the thesis results.",
    ],
    askLabel: "or ask",
    capabilities: {
      match: { title: "Check a role", desc: "Paste a job description; see what matches" },
      tour: { title: "30-second tour", desc: "I walk you through the page" },
      email: { title: "Write to Benjamin", desc: "A ready-to-send email draft" },
    },
    tourQuestion: "Give me the 30-second tour of this site.",
    emailQuestion: "Help me write to Benjamin.",
    sourcesLabel: "sources",
    targets: {
      experience: "Experience",
      thesis: "Thesis",
      education: "Education",
      projects: "Projects",
      practice: "Practices",
      skills: "Skills",
      contact: "Contact",
      "experience-doctor911": "Doctor911",
      "experience-wiseconn": "WiseConn",
      "experience-unitti": "Unitti",
      "doctor911-oneclinik": "OneClinik demo",
      "doctor911-whatsapp": "WhatsApp agents demo",
      "doctor911-web": "PrexX Web demo",
      "doctor911-internal": "Internal agent demo",
      "project-miautocheck": "MiAutoCheck",
      "project-epe": "EPE",
      "thesis-paper": "Paper",
    },
    actions: {
      paper: "arXiv paper",
      cv: "Download CV",
      email: "Write to him",
      demo: "See the agents live",
      matchEmail: "Email about this role",
    },
    emailCard: { title: "email draft", to: "to", open: "Open in my email", copy: "Copy", copied: "Copied" },
    fit: { strong: "Strong fit", partial: "Partial fit", weak: "Weak fit" },
    openChat: "Ask the agent",
    closeChat: "Close chat",
    expandChat: "Expand chat",
    shrinkChat: "Shrink chat",
    chatTab: "chat",
    traceTab: "trace",
    matchButton: "Match a job description",
    matchPlaceholder: "Paste the job description here…",
    matchRun: "Match",
    matchCancel: "Cancel",
    matchHint:
      "Each requirement is checked against the CV: met, partial, or not in the CV.",
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
  contactPrompt: "Have an AI project in mind?",
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
    statusLocation: "Santiago, Chile",
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
    experienceSubtitle: "sistemas y resultados",
    thesisTitle: "Tesis de Magíster",
    thesisSubtitle: "defensa",
    projectsTitle: "Proyectos",
    projectsSubtitle: "proyectos destacados",
    practiceTitle: "Prácticas en proyectos",
    practiceSubtitle: "flujos, experimentos y evaluaciones",
    agentTitle: "Pregúntale al Agente",
    agentSubtitle: "evalúa una vacante, recorre el sitio o pregunta por su trabajo",
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
    advisedBy: "Profesor guía:",
    configs: "Configuraciones",
    pValue: "Valor p",
    cohenD: "d de Cohen",
    winRate: "Tasa de victoria vs. SMOTE",
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
    loadingForecast: "cargando predicción...",
    loadingAgentGraph: "cargando grafo de agentes...",
    loadingPipeline: "cargando pipeline...",
    loadingScatter: "cargando dispersión...",
  },
  agent: {
    inputPlaceholder: "Pregunta sobre el trabajo de arriba…",
    send: "Enviar",
    you: "tú",
    agentLabel: "agente",
    traceEmpty: "envía una pregunta para ver el harness trabajar",
    toolsTitle: "herramientas disponibles",
    toolsList: [
      { name: "search_cv", desc: "búsqueda en todo el CV, con la fuente de cada dato" },
      { name: "get_experience", desc: "roles, impacto, stack, sistemas" },
      { name: "get_projects", desc: "proyectos para clientes: MiAutoCheck, EPE" },
      { name: "get_thesis", desc: "resultados, estadísticas, paper" },
      { name: "get_practice", desc: "cómo trabaja, con evidencia" },
      { name: "get_education_and_skills", desc: "títulos, habilidades, idiomas" },
      { name: "get_profile", desc: "cargo, disponibilidad, contacto, CV" },
      { name: "show_section", desc: "lleva la página a una sección, tarjeta o demo" },
      { name: "report_match", desc: "dibuja la tabla de match con una vacante" },
      { name: "draft_email", desc: "prepara un correo para Benjamin" },
    ],
    live: "en vivo",
    replay: "replay",
    disclaimer:
      "Un agente con herramientas de solo lectura sobre los datos de este CV. Con límite de uso; las conversaciones no se almacenan.",
    limitReached: "Límite de la sesión alcanzado — usa la sección de contacto más abajo.",
    errorLine: "Se cortó la conexión. Intenta de nuevo en un momento.",
    suggested: [
      "¿Qué construyó Benjamin en Doctor911?",
      "¿Tiene experiencia con sistemas multiagente?",
      "Resume los resultados de la tesis.",
    ],
    askLabel: "o pregunta",
    capabilities: {
      match: { title: "Evalúa una vacante", desc: "Pega la descripción y ve qué cumple" },
      tour: { title: "Recorrido de 30 s", desc: "Te muestro la página por partes" },
      email: { title: "Escríbele a Benjamin", desc: "Un correo listo para enviar" },
    },
    tourQuestion: "Dame el tour de 30 segundos por este sitio.",
    emailQuestion: "Ayúdame a escribirle a Benjamin.",
    sourcesLabel: "fuentes",
    targets: {
      experience: "Experiencia",
      thesis: "Tesis",
      education: "Educación",
      projects: "Proyectos",
      practice: "Prácticas",
      skills: "Habilidades",
      contact: "Contacto",
      "experience-doctor911": "Doctor911",
      "experience-wiseconn": "WiseConn",
      "experience-unitti": "Unitti",
      "doctor911-oneclinik": "Demo OneClinik",
      "doctor911-whatsapp": "Demo agentes WhatsApp",
      "doctor911-web": "Demo PrexX Web",
      "doctor911-internal": "Demo agente interno",
      "project-miautocheck": "MiAutoCheck",
      "project-epe": "EPE",
      "thesis-paper": "Paper",
    },
    actions: {
      paper: "Paper en arXiv",
      cv: "Descargar CV",
      email: "Escribirle",
      demo: "Ver agentes en vivo",
      matchEmail: "Escribirle por este cargo",
    },
    emailCard: { title: "borrador de correo", to: "para", open: "Abrir en mi correo", copy: "Copiar", copied: "Copiado" },
    fit: { strong: "Encaje alto", partial: "Encaje parcial", weak: "Encaje bajo" },
    openChat: "Pregúntale al agente",
    closeChat: "Cerrar chat",
    expandChat: "Agrandar chat",
    shrinkChat: "Reducir chat",
    chatTab: "chat",
    traceTab: "trace",
    matchButton: "Evalúa una oferta laboral",
    matchPlaceholder: "Pega aquí la descripción del cargo…",
    matchRun: "Evaluar",
    matchCancel: "Cancelar",
    matchHint:
      "Reviso cada requisito contra el CV: cumple, parcial o no aparece.",
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
  contactPrompt: "¿Tienes un proyecto de IA en mente?",
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
