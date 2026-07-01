// Input guards for the public agent endpoint. In-memory state is
// per-serverless-instance on Vercel — an accepted limitation for a demo:
// each instance still enforces the caps, which bounds worst-case spend.

const WINDOW_MS = 5 * 60_000;
const MAX_PER_WINDOW = 10;
const MAX_TRACKED_IPS = 2_000;
const DAILY_TOKEN_BUDGET = 2_000_000; // a few $/day/instance worst case at mini-tier pricing

export const LIMITS = {
  maxUserMessageChars: 500,
  maxUserTurns: 9,
  maxBodyBytes: 16_384,
} as const;

const hits = new Map<string, number[]>();

export type GuardVerdict = { ok: true } | { ok: false; reason: "rate" | "budget" };

export function checkRate(ip: string): GuardVerdict {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  if (recent.length >= MAX_PER_WINDOW) {
    hits.set(ip, recent);
    return { ok: false, reason: "rate" };
  }
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > MAX_TRACKED_IPS) {
    for (const key of hits.keys()) {
      if (hits.size <= MAX_TRACKED_IPS) break;
      hits.delete(key);
    }
  }
  return { ok: true };
}

let dayKey = "";
let dayTokens = 0;

export function checkBudget(): GuardVerdict {
  const today = new Date().toISOString().slice(0, 10);
  if (today !== dayKey) {
    dayKey = today;
    dayTokens = 0;
  }
  return dayTokens < DAILY_TOKEN_BUDGET ? { ok: true } : { ok: false, reason: "budget" };
}

export function recordTokens(n: number) {
  dayTokens += n;
}

export type ChatTurn = { role: "user" | "assistant"; content: string };

/** Validate and normalize the client-supplied history. Returns null when malformed. */
export function sanitizeMessages(raw: unknown): ChatTurn[] | null {
  if (!Array.isArray(raw) || raw.length === 0 || raw.length > LIMITS.maxUserTurns * 2) {
    return null;
  }
  const turns: ChatTurn[] = [];
  for (const m of raw) {
    if (typeof m !== "object" || m === null) return null;
    const { role, content } = m as { role?: unknown; content?: unknown };
    if (role !== "user" && role !== "assistant") return null;
    if (typeof content !== "string" || content.trim().length === 0) return null;
    const max = role === "user" ? LIMITS.maxUserMessageChars : 2_000;
    turns.push({ role, content: content.slice(0, max) });
  }
  if (turns[0].role !== "user" || turns[turns.length - 1].role !== "user") return null;
  for (let i = 1; i < turns.length; i++) {
    if (turns[i].role === turns[i - 1].role) return null;
  }
  if (turns.filter((t) => t.role === "user").length > LIMITS.maxUserTurns) return null;
  return turns;
}
