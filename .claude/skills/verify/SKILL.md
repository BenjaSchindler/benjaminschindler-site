---
name: verify
description: Verify CV portfolio site changes by driving the running app in a headless browser
---

# Verifying changes to the CV portfolio site

## Launch

The user usually already has `next dev` running on **port 3000** (check with
`ss -tlnp | grep 3000`). Next 16 refuses to start a second dev server for the
same directory — do NOT kill the user's server; Turbopack hot-reloads your
edits, so just drive port 3000.

## Drive

No Playwright in this repo; borrow it from the sibling project via a symlink
in the scratchpad (system Chrome as the executable — no browser download):

```bash
cd <scratchpad> && ln -sfn /home/benja/Desktop/amplify-auth-app/node_modules ./node_modules
# script: chromium.launch({ executablePath: "/usr/bin/google-chrome", headless: true })
node verify.mjs
```

## Gotchas

- The site boots in **concise** mode. Technical-only features (trace/evals
  tabs, vizzes, teasers, rocket) need `page.getByRole("switch").first().click()`
  or `localStorage.setItem("cv-view-mode", "detailed")` + reload. The agent
  widget renders in BOTH modes: concise shows a briefcase FAB and a chat-only
  panel (no trace/evals tabs).
- Never `pkill -f "next"` or similar — the pattern matches your own shell's
  command line (exit 144) AND the user's own dev server. Kill by PID from
  `ss -tlnp | grep <port>`.
- The floating agent FAB is `button[aria-expanded]` (label "Ask the agent" /
  "Close chat"). Clicking it twice in quick succession closes the panel again —
  check `[role=dialog]` before clicking.
- Text selectors collide with CV content (company names appear in cards AND
  in agent teasers/answers) — scope with `button:has-text(...)` or roles.
  Same for the match flow: `has-text("Match")` hits "Match a job description"
  before the submit button — use `button:text-is("Match")`.
- The eval suite (`npm run evals`, BASE_URL + EVAL_KEY env; set
  `EVALS_OUT=<scratchpad>/evals.json` locally so `public/evals.json`, which CI
  publishes, stays untouched) needs EVAL_KEY in
  the server's env to bypass the 10-req/5-min per-IP guard; a running dev
  server does NOT hot-reload `.env`, so start a fresh `next start -p <port>`
  after env changes. Kill it via the real `next-server` PID (killing the npm
  wrapper orphans it and the stale rate-limit state keeps serving replay).
- `.env` may lack a trailing newline — `echo >> .env` can concatenate onto
  the API key line. Append with care.
- The agent chat may run **live** against the OpenAI API if a key is in
  `.env` (mode indicator shows "live" + model in the panel). Each send costs
  real tokens; keep it to one or two.

## Flows worth driving

- Concise ↔ technical toggle (view transition, palette swap).
- Agent widget: empty state shows three capability cards (check a role,
  tour, write to Benjamin) plus question chips; answers carry source chips and
  next-step actions; "write to Benjamin" renders an email-draft card (mailto,
  recipient pinned); `show_section` can open a Doctor911 demo tab
  (`doctor911-whatsapp` etc.); trace + evals tabs; Escape to close.
- Match flow: clipboard button → JD textarea (16k-char cap with live counter)
  → submit → table with fit badge (computed from the verdicts), counts,
  verdict pills, and "email about this role" / CV buttons. A card-only answer
  must not break the next turn (history sends a text rendering of the card).
- Panel expand toggle (Maximize2 icon in header): 24rem→44rem; worst case
  (expanded + JD open on a short viewport) must stay inside the viewport.
- Tour: "30-second tour" chip → page scrolls through ≥3 sections while the
  answer streams.
- Reduced motion: `page.emulateMedia({ reducedMotion: "reduce" })` must
  freeze FAB drift and viz animations.
- Mobile 390px viewport: panel must fit the viewport width.
