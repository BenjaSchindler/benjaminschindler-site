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
    experienceSubtitle: "hover the visualizations · scroll to play",
    thesisTitle: "Master's thesis",
    thesisSubtitle: "defense",
    projectsTitle: "Projects",
    projectsSubtitle: "selected client work",
    educationTitle: "Education",
    educationSubtitle: "Universidad Adolfo Ibáñez",
    skillsTitle: "Skills",
    skillsSubtitle: "tools / frameworks / languages",
    contactTitle: "Contact",
    contactSubtitle: "open to interesting problems",
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
  footer: {
    copyrightSuffix: "Built with Next.js · Deployed on Vercel",
    email: "Email",
    linkedin: "LinkedIn",
  },
  contactPrompt: "Building production AI that pays back —",
  contactPromptHighlight: "let's talk.",
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
    experienceSubtitle: "pasa el cursor por las visualizaciones · desplaza para reproducir",
    thesisTitle: "Tesis de Magíster",
    thesisSubtitle: "defensa",
    projectsTitle: "Proyectos",
    projectsSubtitle: "trabajo de cliente seleccionado",
    educationTitle: "Educación",
    educationSubtitle: "Universidad Adolfo Ibáñez",
    skillsTitle: "Habilidades",
    skillsSubtitle: "herramientas / frameworks / lenguajes",
    contactTitle: "Contacto",
    contactSubtitle: "abierto a problemas interesantes",
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
  footer: {
    copyrightSuffix: "Construido con Next.js · Desplegado en Vercel",
    email: "Correo",
    linkedin: "LinkedIn",
  },
  contactPrompt: "IA en producción que paga el retorno —",
  contactPromptHighlight: "hablemos.",
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
