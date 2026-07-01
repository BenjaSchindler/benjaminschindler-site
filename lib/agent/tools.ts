import type OpenAI from "openai";
import { getData } from "../cvData";

// Read-only tools over the structured CV data. For a corpus this small,
// typed lookups over the data model beat fuzzy retrieval: every answer is
// traceable to a specific call, and there is no embedding infrastructure
// to keep alive. The agent is instructed to fetch before it claims.

const en = getData("en");
const es = getData("es");

// strict:false — the two lookup tools take an optional enum filter, which
// strict mode would force into required+nullable for no practical gain here.
export const CV_TOOLS: OpenAI.Responses.FunctionTool[] = [
  {
    type: "function",
    name: "get_profile",
    description:
      "Benjamin's profile: title, bio, location, contact links, and headline tags. Call this for who-is / how-to-reach questions.",
    strict: false,
    parameters: { type: "object", properties: {}, additionalProperties: false },
  },
  {
    type: "function",
    name: "get_experience",
    description:
      "Work experience with impact, per-role bullets, and stack. Call this before answering anything about his jobs or what he built at work.",
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
    description:
      "Selected client projects (MiAutoCheck, EPE) with description, highlights, and stack. Call this for questions about client work, guardrails, prompt versioning, or evals in production.",
    strict: false,
    parameters: {
      type: "object",
      properties: {
        name: {
          type: "string",
          enum: ["MiAutoCheck", "EPE"],
          description: "Restrict to one project. Omit for both.",
        },
      },
      additionalProperties: false,
    },
  },
  {
    type: "function",
    name: "get_thesis",
    description:
      "MSc thesis: abstract, advisor, and the benchmark results (configurations, macro-F1 deltas, significance stats). Call this before quoting any thesis number.",
    strict: false,
    parameters: { type: "object", properties: {}, additionalProperties: false },
  },
  {
    type: "function",
    name: "get_education_and_skills",
    description:
      "Degrees with grades, the skills matrix, and spoken languages.",
    strict: false,
    parameters: { type: "object", properties: {}, additionalProperties: false },
  },
];

type ToolInput = Record<string, unknown>;

export function runCvTool(name: string, input: ToolInput): string {
  switch (name) {
    case "get_profile": {
      const p = en.profile;
      return JSON.stringify({
        name: p.name,
        title: p.title,
        subtitle: p.subtitle,
        location: "Santiago, Chile",
        email: p.email,
        linkedin: p.linkedin,
        bio: p.bio,
        tags: p.tags,
      });
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
          roles: e.roles.map((r) => ({
            title: r.title,
            period: r.period,
            bullets: r.bullets,
          })),
        }));
      return JSON.stringify(list.length ? list : { error: "unknown company" });
    }
    case "get_projects": {
      const name_ = typeof input.name === "string" ? input.name : null;
      const list = en.projects
        .filter((p) => !name_ || p.name === name_)
        .map((p) => ({
          name: p.name,
          context: p.context,
          tagline: p.tagline,
          description: p.description,
          highlights: p.highlights,
          stack: p.stack,
        }));
      return JSON.stringify(list.length ? list : { error: "unknown project" });
    }
    case "get_thesis": {
      const t = en.thesis;
      return JSON.stringify({
        title: t.title,
        subtitle: t.subtitle,
        advisor: t.advisor,
        institution: t.institution,
        defended: `${t.date} · Maximum Distinction`,
        abstract: t.abstract,
        stats: t.stats,
        results_delta_pp_macro_f1_vs_smote: t.results.map((r) => ({
          method: r.method,
          delta: r.delta,
          ours: r.isOurs,
        })),
      });
    }
    case "get_education_and_skills": {
      return JSON.stringify({
        education: en.education.map((e, i) => ({
          degree: e.degree,
          period: e.period,
          grade_us_scale: e.grade,
          grade_chilean_scale: es.education[i]?.grade,
          note: e.note,
        })),
        skills: en.skills,
        spoken_languages: en.languages,
      });
    }
    default:
      return JSON.stringify({ error: `unknown tool: ${name}` });
  }
}
