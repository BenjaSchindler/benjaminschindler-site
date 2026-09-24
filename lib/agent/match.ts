// Shared contracts for the agent's UI tools: the job-description match table
// and the email draft. Kept free of server-only imports: the client renders
// both cards and the API route validates them, so both sides import from here.

// A user turn starting with this prefix is a job posting to evaluate.
// guards.ts allows these turns a larger length cap than normal messages.
export const JD_PREFIX = "[JOB DESCRIPTION]";

export type MatchVerdict = "met" | "partial" | "missing";
export type MatchFit = "strong" | "partial" | "weak";

export type MatchRow = {
  requirement: string;
  verdict: MatchVerdict;
  evidence: string;
};

export type MatchReport = {
  role: string;
  fit: MatchFit;
  summary: string;
  rows: MatchRow[];
};

const VERDICTS: MatchVerdict[] = ["met", "partial", "missing"];

/** Fit follows from the table itself, so the label can never contradict the rows. */
export function fitFromRows(rows: MatchRow[]): MatchFit {
  const score = rows.reduce((s, r) => s + (r.verdict === "met" ? 1 : r.verdict === "partial" ? 0.5 : 0), 0) / rows.length;
  return score >= 0.75 ? "strong" : score >= 0.4 ? "partial" : "weak";
}

const clamp = (v: unknown, max: number): string | null =>
  typeof v === "string" && v.trim().length > 0 ? v.trim().slice(0, max) : null;

/** Validate a report_match tool payload from the model. Null when malformed. */
export function validateMatchReport(input: unknown): MatchReport | null {
  if (typeof input !== "object" || input === null) return null;
  const { role, summary, rows } = input as Record<string, unknown>;
  const roleStr = clamp(role, 120);
  const summaryStr = clamp(summary, 500);
  if (!roleStr || !summaryStr || !Array.isArray(rows) || rows.length === 0) return null;
  const outRows: MatchRow[] = [];
  for (const r of rows.slice(0, 10)) {
    if (typeof r !== "object" || r === null) return null;
    const { requirement, verdict, evidence } = r as Record<string, unknown>;
    const req = clamp(requirement, 200);
    const ev = clamp(evidence, 260);
    if (!req || !ev || !VERDICTS.includes(verdict as MatchVerdict)) return null;
    outRows.push({ requirement: req, verdict: verdict as MatchVerdict, evidence: ev });
  }
  return { role: roleStr, fit: fitFromRows(outRows), summary: summaryStr, rows: outRows };
}

// ── Email draft ──────────────────────────────────────────────────────────────
// The recipient is never model-controlled: drafts always go to Benjamin.

export type EmailDraft = { to: string; subject: string; body: string };

export function validateEmailDraft(input: unknown, to: string): EmailDraft | null {
  if (typeof input !== "object" || input === null) return null;
  const { subject, body } = input as Record<string, unknown>;
  const s = clamp(subject, 120);
  const b = clamp(body, 1200);
  if (!s || !b) return null;
  return { to, subject: s.replace(/[\r\n]+/g, " "), body: b };
}

export const mailtoHref = (d: EmailDraft) =>
  `mailto:${d.to}?subject=${encodeURIComponent(d.subject)}&body=${encodeURIComponent(d.body)}`;

/** A ready-to-send note about a matched role, built from the table itself (no model call). */
export function matchEmailDraft(report: MatchReport, to: string, lang: "en" | "es"): EmailDraft {
  const met = report.rows.filter((r) => r.verdict === "met").map((r) => r.requirement).slice(0, 3);
  if (lang === "es") {
    return {
      to,
      subject: `${report.role}: conversemos`,
      body: [
        "Hola Benjamin:",
        "",
        `Busco a alguien para el cargo de ${report.role} y tu perfil calza con varios requisitos${met.length ? `: ${met.join("; ")}` : ""}.`,
        "¿Tienes disponibilidad para conversar esta semana?",
        "",
        "Saludos,",
        "[Tu nombre]",
      ].join("\n"),
    };
  }
  return {
    to,
    subject: `${report.role}: let's talk`,
    body: [
      "Hi Benjamin,",
      "",
      `I'm hiring for a ${report.role} role and your profile matches several requirements${met.length ? `: ${met.join("; ")}` : ""}.`,
      "Are you available for a call this week?",
      "",
      "Best,",
      "[Your name]",
    ].join("\n"),
  };
}
