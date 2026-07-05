// Shared contract for the job-description matching flow. Kept free of
// server-only imports: the client renders MatchReport tables and the API
// route validates them, so both sides import from here.

// A user turn starting with this prefix is a job posting to evaluate.
// guards.ts allows these turns a larger length cap than normal messages.
export const JD_PREFIX = "[JOB DESCRIPTION]";

export type MatchVerdict = "met" | "partial" | "missing";

export type MatchRow = {
  requirement: string;
  verdict: MatchVerdict;
  evidence: string;
};

export type MatchReport = {
  role: string;
  summary: string;
  rows: MatchRow[];
};

const VERDICTS: MatchVerdict[] = ["met", "partial", "missing"];

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
  return { role: roleStr, summary: summaryStr, rows: outRows };
}
