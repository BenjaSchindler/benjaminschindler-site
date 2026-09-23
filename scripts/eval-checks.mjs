// Broad experience questions may reasonably focus on any documented system.
// Framework-specific recall is evaluated by a separate, explicit question.
export function mentionsDoctor911System(text) {
  return /\b(?:langgraph|whatsapp|oneclinik|prexx|rag)\b|\bvoice triage\b/i.test(text);
}

export const responseHealthChecks = [
  {
    name: "visible answer",
    fn: (r) => r.text.trim().length > 0 || (r.ui ?? []).some(event =>
      event.action === "match_report" && Array.isArray(event.report?.rows) && event.report.rows.length > 0),
  },
  { name: "no agent errors", fn: (r) => !r.traces.some((tr) => tr.kind === "error") },
];
