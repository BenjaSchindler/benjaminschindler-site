import type OpenAI from "openai";
import { getData } from "../cvData";
import { PAGE_TARGETS, type PageTarget } from "./targets";

// Read-only tools over the structured CV data, plus UI tools that act on the
// visitor's page. For a corpus this small, typed lookups and a keyword index
// beat embedding retrieval: every answer traces to a specific call and a
// specific place on the page, with no infrastructure to keep alive.

const en = getData("en");
const es = getData("es");

export { SECTION_IDS, PAGE_TARGETS, targetForView } from "./targets";

const COMPANY_TARGET: Record<string, PageTarget> = {
  Doctor911: "experience-doctor911",
  "WiseConn Latam": "experience-wiseconn",
  Unitti: "experience-unitti",
};
const PROJECT_TARGET: Record<string, PageTarget> = {
  MiAutoCheck: "project-miautocheck",
  EPE: "project-epe",
};
const SYSTEM_TARGET: Record<string, PageTarget> = {
  OneClinik: "doctor911-oneclinik",
  "PrexX Web": "doctor911-web",
};

// ── search_cv index ──────────────────────────────────────────────────────────
// One fact per bullet/highlight/stat, each tagged with where it lives on the
// page. Built once from the English data; the model queries in English.

type Fact = { text: string; source: string; target: PageTarget };

function buildFacts(): Fact[] {
  const facts: Fact[] = [];
  const add = (text: string, source: string, target: PageTarget) => facts.push({ text, source, target });
  const p = en.profile;
  add(`Current role: ${en.experience[0].roles[0].title} at Doctor911. Based in ${p.location} (GMT−3). Open to opportunities.`, "Profile", "contact");
  add(`Spoken languages: ${en.languages.map((l) => `${l.name} (${l.level})`).join(", ")}.`, "Languages", "skills");

  for (const exp of en.experience) {
    const target = COMPANY_TARGET[exp.company] ?? "experience";
    add(`${exp.company} (${exp.period}): ${exp.impact}`, exp.company, target);
    add(`Stack at ${exp.company}: ${exp.stack.join(", ")}.`, exp.company, target);
    for (const role of exp.roles) {
      for (const b of role.bullets) add(b, `${exp.company} · ${role.title} (${role.period})`, target);
    }
    for (const sys of exp.systems ?? []) {
      const sysTarget = SYSTEM_TARGET[sys.name] ?? target;
      const source = `${exp.company} · ${sys.name}`;
      add(`${sys.name}: ${sys.tagline}. ${sys.description} Stack: ${sys.stack.join(", ")}.`, source, sysTarget);
      for (const h of sys.highlights) add(h, source, sysTarget);
    }
  }
  for (const proj of en.projects) {
    const target = PROJECT_TARGET[proj.name] ?? "projects";
    const source = `${proj.name} (${proj.context})`;
    add(`${proj.name}: ${proj.tagline}. ${proj.description} Stack: ${proj.stack.join(", ")}.`, source, target);
    for (const h of proj.highlights) add(h, source, target);
  }
  for (const pr of en.practice) {
    add(`${pr.title}: ${pr.definition} ${pr.evidence.join(" ")}`, `${pr.project} · ${pr.title}`, "practice");
  }
  const t = en.thesis;
  add(`MSc thesis "${t.title}: ${t.subtitle}", ${t.institution}, ${t.date}, advised by ${t.advisor}, Maximum Distinction. ${t.abstract}`, "MSc thesis", "thesis");
  add(
    `Thesis statistics: ${t.stats.configs} configurations, p ${t.stats.pValue}, Cohen's d ${t.stats.cohenD}, win rate vs SMOTE ${t.stats.winRate}. Macro-F1 change vs SMOTE: ${t.results.map((r) => `${r.method} ${r.delta > 0 ? "+" : ""}${r.delta} pp`).join("; ")}.`,
    "MSc thesis",
    "thesis",
  );
  add(`Paper "${t.paper.title}" (${t.paper.authors.join(", ")}; arXiv, ${t.paper.date}; ${t.paper.venue}): ${t.paper.summary}`, "arXiv paper", "thesis-paper");
  for (const ed of en.education) {
    add(`${ed.degree}, ${ed.institution}, ${ed.period}, ${ed.grade ?? ""}. ${ed.note ?? ""}`.trim(), ed.degree, "education");
  }
  for (const [category, items] of Object.entries(en.skills)) {
    add(`${category} skills: ${items.join(", ")}.`, "Skills", "skills");
  }
  return facts;
}

const STOPWORDS = new Set(
  "a an and or of in on at for with to by from the is was were be been does did do has have had he his him it its any some what which who how when where about than that this these those there their benjamin schindler experience work worked working use used using know knows".split(" "),
);
const ALIASES: Record<string, string> = { k8s: "kubernetes", postgres: "postgresql", js: "javascript", ts: "typescript", genai: "llm", agentic: "agent" };

// Combining accents (U+0300–U+036F), stripped after NFD so "evaluación" matches "evaluacion".
const ACCENTS = new RegExp(`[${String.fromCharCode(0x300)}-${String.fromCharCode(0x36f)}]`, "g");
const normalize = (s: string) => s.toLowerCase().normalize("NFD").replace(ACCENTS, "");
const tokenize = (s: string) =>
  normalize(s)
    .split(/[^a-z0-9+#.-]+/)
    .map((w) => w.replace(/^[.-]+|[.-]+$/g, ""))
    .filter((w) => w.length > 1 && !STOPWORDS.has(w))
    .map((w) => ALIASES[w] ?? w);

// Light stemming: "forecast" finds "forecasting", "agents" finds "agent" —
// but "product" must not find "production", so only inflection suffixes count.
const SUFFIXES = ["s", "es", "ed", "ing", "er", "ers", "ly"];
const sameStem = (a: string, b: string) => {
  const [short, long] = a.length <= b.length ? [a, b] : [b, a];
  return short.length >= 3 && long.startsWith(short) && SUFFIXES.includes(long.slice(short.length));
};
const termMatches = (q: string, tokens: string[]) => tokens.some((f) => f === q || sameStem(q, f));

const FACTS = buildFacts().map((f) => ({ ...f, tokens: tokenize(`${f.text} ${f.source}`) }));

function searchFacts(query: string, limit: number) {
  const terms = [...new Set(tokenize(query))];
  if (terms.length === 0) return [];
  const idf = new Map(
    terms.map((q) => {
      const df = FACTS.filter((f) => termMatches(q, f.tokens)).length;
      return [q, Math.log(1 + FACTS.length / (1 + df))];
    }),
  );
  return FACTS.map((f) => {
    const hits = terms.filter((q) => termMatches(q, f.tokens));
    return { f, hits: hits.length, score: hits.reduce((s, q) => s + (idf.get(q) ?? 0), 0) };
  })
    .filter((r) => r.hits > 0)
    .sort((a, b) => b.score - a.score || b.hits - a.hits)
    .slice(0, limit)
    .map(({ f, score }) => ({ fact: f.text, source: f.source, page: f.target, score }));
}

// ── Tool schemas ─────────────────────────────────────────────────────────────
// strict:false — the lookup tools take optional enum filters, which strict
// mode would force into required+nullable for no practical gain here.

export const CV_TOOLS: OpenAI.Responses.FunctionTool[] = [
  {
    type: "function",
    name: "search_cv",
    description:
      "Keyword search over every fact in Benjamin's CV (roles, systems, projects, thesis, education, skills). Returns up to 6 facts, each with its source and page location; an empty list means the CV does not mention it. Best first call for specific questions such as 'has he used X?' or 'any experience with Y?'. Query in English keywords.",
    strict: false,
    parameters: {
      type: "object",
      properties: {
        query: { type: "string", description: "English keywords, e.g. 'fastapi production' or 'kubernetes certification'." },
      },
      required: ["query"],
      additionalProperties: false,
    },
  },
  {
    type: "function",
    name: "get_profile",
    description:
      "Profile: current role, bio, location and timezone, availability, spoken languages, contact links, and CV PDFs.",
    strict: false,
    parameters: { type: "object", properties: {}, additionalProperties: false },
  },
  {
    type: "function",
    name: "get_experience",
    description:
      "Full work history for overview questions: impact, per-role bullets, stack, and systems (OneClinik, PrexX Web at Doctor911).",
    strict: false,
    parameters: {
      type: "object",
      properties: {
        company: {
          type: "string",
          enum: ["Doctor911", "WiseConn Latam", "Unitti"],
          description: "Restrict to one company. Omit for all three.",
        },
      },
      additionalProperties: false,
    },
  },
  {
    type: "function",
    name: "get_projects",
    description: "Client projects (MiAutoCheck, EPE) with description, highlights, and stack.",
    strict: false,
    parameters: {
      type: "object",
      properties: {
        name: { type: "string", enum: ["MiAutoCheck", "EPE"], description: "Restrict to one project. Omit for both." },
      },
      additionalProperties: false,
    },
  },
  {
    type: "function",
    name: "get_thesis",
    description:
      "MSc thesis results and the later arXiv paper (venue, links). The paper extends the evaluation: never mix its figures with the thesis figures.",
    strict: false,
    parameters: { type: "object", properties: {}, additionalProperties: false },
  },
  {
    type: "function",
    name: "get_practice",
    description:
      "How he works, with evidence from real projects: agent workflows with business rules, prompt A/B experiments, permission-aware retrieval, LLM-as-judge evaluations.",
    strict: false,
    parameters: {
      type: "object",
      properties: {
        area: {
          type: "string",
          enum: ["harness", "prompts", "retrieval", "evals"],
          description: "Restrict to one practice area. Omit for all four.",
        },
      },
      additionalProperties: false,
    },
  },
  {
    type: "function",
    name: "get_education_and_skills",
    description: "Degrees with grades, the skills matrix, and spoken languages.",
    strict: false,
    parameters: { type: "object", properties: {}, additionalProperties: false },
  },
  {
    type: "function",
    name: "show_section",
    description:
      "Scroll the visitor's page to a section or to one specific item on it: a company card (experience-*), a Doctor911 live demo tab (doctor911-*), a project card (project-*), or the paper (thesis-paper). Use when the visitor asks to see something, and for tours.",
    strict: false,
    parameters: {
      type: "object",
      properties: {
        section: { type: "string", enum: [...PAGE_TARGETS], description: "Where to scroll." },
        note: {
          type: "string",
          description:
            "Tours only: 6-12 words, the section name then one concrete fact. Streamed to the visitor as your words.",
        },
      },
      required: ["section"],
      additionalProperties: false,
    },
  },
  {
    type: "function",
    name: "draft_email",
    description:
      "Show the visitor a ready-to-send email to Benjamin (they open it in their own mail app). Use when they want to contact, hire, interview, or meet him. Ends your turn.",
    strict: false,
    parameters: {
      type: "object",
      properties: {
        subject: { type: "string", description: "At most 8 words." },
        body: {
          type: "string",
          description:
            "From the visitor to Benjamin, in the visitor's language, at most 90 words. Use what they told you (role, company, topic); put unknowns in [brackets], e.g. [Your name].",
        },
      },
      required: ["subject", "body"],
      additionalProperties: false,
    },
  },
  {
    type: "function",
    name: "report_match",
    description:
      "Render a requirement-by-requirement match table for a job description. Call exactly once per job description, after fetching evidence for each row. Ends your turn.",
    strict: false,
    parameters: {
      type: "object",
      properties: {
        role: { type: "string", description: "The role title, e.g. 'Senior AI Engineer'." },
        summary: { type: "string", description: "One sentence, at most 20 words: the main strength and the main gap." },
        rows: {
          type: "array",
          description: "One row per key requirement, at most 6 rows.",
          items: {
            type: "object",
            properties: {
              requirement: { type: "string", description: "The requirement, condensed to a few words." },
              verdict: {
                type: "string",
                enum: ["met", "partial", "missing"],
                description: "met = direct evidence in the CV data; partial = adjacent experience; missing = nothing relevant.",
              },
              evidence: {
                type: "string",
                description: "At most 14 words: where the evidence lives and what it is. For missing: 'not in the CV data'.",
              },
            },
            required: ["requirement", "verdict", "evidence"],
            additionalProperties: false,
          },
        },
      },
      required: ["role", "summary", "rows"],
      additionalProperties: false,
    },
  },
];

// ── Execution ────────────────────────────────────────────────────────────────

type ToolInput = Record<string, unknown>;
/** output feeds the model; sources are the page locations it drew on (shown as chips); summary goes to the trace. */
export type ToolRun = { output: string; sources: PageTarget[]; summary: string };

const run = (data: unknown, sources: PageTarget[], summary: string): ToolRun => ({
  output: JSON.stringify(data),
  sources,
  summary,
});

export function runCvTool(name: string, input: ToolInput): ToolRun {
  switch (name) {
    case "search_cv": {
      const query = typeof input.query === "string" ? input.query.slice(0, 200) : "";
      const ranked = searchFacts(query, 6);
      const results = ranked.map(({ fact, source, page }) => ({ fact, source, page }));
      if (results.length === 0) {
        return run({ results: [], note: "Nothing in the CV matches. Say plainly that it is not in his CV." }, [], "no match");
      }
      // Chips point at where the strongest evidence lives, not every loose hit.
      const strong = ranked.filter((r) => r.score >= ranked[0].score * 0.6).slice(0, 3);
      return run({ results }, [...new Set(strong.map((r) => r.page))], `${results.length} facts`);
    }
    case "get_profile": {
      const p = en.profile;
      const doctor911 = en.experience[0];
      return run(
        {
          name: p.name,
          current_role: `${doctor911.roles[0].title} at Doctor911 (${doctor911.roles[0].period})`,
          title: p.title,
          subtitle: p.subtitle,
          bio: p.bio,
          location: p.location,
          timezone: "America/Santiago (GMT−3)",
          availability: "Open to opportunities",
          spoken_languages: en.languages,
          email: p.email,
          linkedin: p.linkedin,
          github: p.github,
          resume_pdf: { en: "/cv.pdf", es: "/cv-es.pdf" },
        },
        ["contact"],
        "profile · contact · availability",
      );
    }
    case "get_experience": {
      const company = typeof input.company === "string" ? input.company : null;
      const list = en.experience
        .filter((e) => !company || e.company === company)
        .map((e) => ({
          company: e.company,
          period: e.period,
          impact: e.impact,
          stack: e.stack,
          systems: e.systems,
          roles: e.roles.map((r) => ({ title: r.title, period: r.period, bullets: r.bullets })),
        }));
      if (!list.length) return run({ error: "unknown company" }, [], "unknown company");
      const sources = company ? [COMPANY_TARGET[company] ?? "experience"] : (["experience"] as PageTarget[]);
      return run(list, sources, `${list.length} ${list.length === 1 ? "company" : "companies"}`);
    }
    case "get_projects": {
      const projectName = typeof input.name === "string" ? input.name : null;
      const list = en.projects
        .filter((p) => !projectName || p.name === projectName)
        .map((p) => ({
          name: p.name,
          context: p.context,
          tagline: p.tagline,
          description: p.description,
          highlights: p.highlights,
          stack: p.stack,
        }));
      if (!list.length) return run({ error: "unknown project" }, [], "unknown project");
      const sources = projectName ? [PROJECT_TARGET[projectName] ?? "projects"] : (["projects"] as PageTarget[]);
      return run(list, sources, `${list.length} ${list.length === 1 ? "project" : "projects"}`);
    }
    case "get_thesis": {
      const t = en.thesis;
      return run(
        {
          title: t.title,
          subtitle: t.subtitle,
          advisor: t.advisor,
          institution: t.institution,
          defended: `${t.date} · Maximum Distinction`,
          abstract: t.abstract,
          stats: t.stats,
          results_delta_pp_macro_f1_vs_smote: t.results.map((r) => ({ method: r.method, delta: r.delta, ours: r.isOurs })),
          subsequent_paper: t.paper,
        },
        ["thesis"],
        "stats · 5 method deltas · paper",
      );
    }
    case "get_practice": {
      const area = typeof input.area === "string" ? input.area : null;
      const list = en.practice
        .filter((p) => !area || p.id === area)
        .map((p) => ({ area: p.id, title: p.title, project: p.project, definition: p.definition, evidence: p.evidence }));
      if (!list.length) return run({ error: "unknown practice area" }, [], "unknown area");
      return run(list, ["practice"], `${list.length} areas`);
    }
    case "get_education_and_skills": {
      return run(
        {
          education: en.education.map((e, i) => ({
            degree: e.degree,
            period: e.period,
            grade_us_scale: e.grade,
            grade_chilean_scale: es.education[i]?.grade,
            note: e.note,
          })),
          skills: en.skills,
          spoken_languages: en.languages,
        },
        ["education", "skills"],
        "degrees · skills · languages",
      );
    }
    default:
      return run({ error: `unknown tool: ${name}` }, [], "unknown tool");
  }
}
