// Places on the page the agent can point at. Shared by the API route (which
// validates tool arguments), replay scripts, and the widget (which scrolls).
// Kept dependency-free so the client bundle stays small.

export type SiteView = "technical" | "concise";

// Top-level <section> ids.
export const SECTION_IDS = [
  "experience",
  "thesis",
  "education",
  "projects",
  "practice",
  "skills",
  "contact",
] as const;

// Specific items inside sections: one card, the paper, or one Doctor911 demo tab.
export const FOCUS_IDS = [
  "experience-doctor911",
  "experience-wiseconn",
  "experience-unitti",
  "doctor911-oneclinik",
  "doctor911-whatsapp",
  "doctor911-web",
  "doctor911-internal",
  "project-miautocheck",
  "project-epe",
  "thesis-paper",
] as const;

export const PAGE_TARGETS = [...SECTION_IDS, ...FOCUS_IDS] as const;
export type PageTarget = (typeof PAGE_TARGETS)[number];

export const isPageTarget = (v: unknown): v is PageTarget =>
  typeof v === "string" && (PAGE_TARGETS as readonly string[]).includes(v);

export type Doctor911Tab = "oneclinik" | "whatsapp" | "web" | "internal";

/** The DOM element a target lives in, plus the Doctor911 demo tab to open, if any. */
export function resolveTarget(target: PageTarget): { elementId: string; tab?: Doctor911Tab } {
  if (target.startsWith("doctor911-")) {
    return { elementId: "doctor911-systems", tab: target.slice("doctor911-".length) as Doctor911Tab };
  }
  return { elementId: target };
}

/**
 * The concise (recruiter) view renders neither the practice section nor the
 * Doctor911 demos. Map a target to what that view actually shows, or null.
 */
export function targetForView(target: PageTarget, view: SiteView): PageTarget | null {
  if (view === "technical") return target;
  if (target === "practice") return null;
  if (target.startsWith("doctor911-")) return "experience-doctor911";
  return target;
}
