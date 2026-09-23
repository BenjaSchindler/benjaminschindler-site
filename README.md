# Benjamin Schindler — CV site

Single-page portfolio with responsive diagrams, project examples, and thesis results. Built with Next.js 16 and deployed on Vercel.

## Stack

- **Next.js 16** (App Router, Turbopack) + **React 19** + **TypeScript**
- **Tailwind CSS v4** for styling, dark / terminal aesthetic
- **Framer Motion** for animations
- **Recharts** for line / bar charts
- **D3** + raw SVG for the bespoke thesis scatter
- **next/font** self-hosted: JetBrains Mono + Inter

## What's interactive

| Section | Visualization |
|---|---|
| Hero | Static introduction with restrained entry transitions |
| Doctor911 | OneClinik recorded-video consultations first, with tabs for WhatsApp agents, PrexX Web search/recommendations/authenticated support, and the internal RAG/MCP workflow |
| WiseConn | A clearly labeled simulated forecast, with days relative to today |
| Unitti | Animated monthly-close comparison and an expandable SQL example with fictional data |
| Master's thesis | Five methods, including illustrative soft weighting, alongside reported benchmark results |
| Practices | Explore routing, stable A/B assignment, permission filtering, and privacy evaluation through replayable scenes |
| Projects | MiAutoCheck report assembly and EPE message processing, both labeled illustrative |

The assistant opens on request from a fixed launcher; no automatic overlays cover the figures.

Project scenes play once when visible, pause offscreen, and have pause/replay controls. Reduced motion shows the final state without autoplay. Controls remain usable by keyboard and touch. Figures use illustrative examples rather than live service calls or invented performance metrics.

## Local development

```bash
npm install
npm run dev   # http://localhost:3000
```

Production build:

```bash
npm run build
npm start
```

## Deploying to Vercel

1. Push this repo to GitHub.
2. Go to [vercel.com/new](https://vercel.com/new) and import the repo.
3. Vercel detects Next.js automatically — no config needed.
4. First deploy publishes to `<repo-name>.vercel.app`.
5. Push to `main` to redeploy; PRs get preview URLs.

The portfolio renders without environment variables. The agent uses `/api/agent` and requires `OPENAI_API_KEY` for live answers; otherwise it serves labeled examples.

The default model is `gpt-6-luna` (Responses API, reasoning `none`). `AGENT_MODEL` can override it; check that deployment settings do not pin an older model. See `.env.example`.

## Project structure

```
app/                       # Next.js App Router
  layout.tsx               # Fonts, metadata
  page.tsx                 # Section composition
  globals.css              # Tailwind + theme tokens + scanline keyframes
  opengraph-image.tsx      # Generated OG card (1200×630)
  sitemap.ts / robots.ts   # SEO

components/
  Hero.tsx                 # Terminal typewriter
  Profile.tsx
  Navigation.tsx           # Sticky nav + CV download
  ExperienceTimeline.tsx
  ExperienceCard.tsx       # Mounts the right viz per role
  ThesisSection.tsx
  EducationSection.tsx
  SkillsSection.tsx
  ContactSection.tsx
  Footer.tsx
  SectionHeader.tsx
  icons/Brands.tsx         # Inline brand SVGs (Linkedin, Github)
  viz/
    ForecastingChart.tsx   # WiseConn
    AgentGraph.tsx         # Doctor911
    NL2SQLPipeline.tsx     # Unitti
    ThesisScatter.tsx      # Thesis showpiece
    ThesisResultsBars.tsx  # Companion ΔF1 bar chart
    primitives/            # TerminalLine, useInView, colors

lib/
  data.ts                  # CV content as typed object
  synthetic.ts             # Seeded RNG + chart data generators

public/
  cv.pdf                   # Downloadable CV
```

## Updating CV content

CV content for both languages lives in `lib/cvData.ts`; UI labels live in `lib/i18n.ts`. `lib/data.ts` provides the language-aware client hook. The agent reads the same CV data.

The downloads are `public/cv.pdf` (English) and `public/cv-es.pdf` (Spanish). Their editable sources are the general `.tex` files in `CV-LATEX/English` and `CV-LATEX/Espanol`. Compile with `pdflatex`, review the rendered page, then copy the PDF to `public/`. Keep these copies synchronized when updating content.

## Updating the thesis numbers

The ΔF1 bars and stats panel use `thesis.results` and `thesis.stats` in
`lib/cvData.ts`. They mirror the defense slide deck values — update both if
your final paper diverges.

## Visualizations and agent checks

Practice diagrams show project workflows without invented scores. The forecasting chart and thesis scatter use explicitly labeled simulated data; the thesis results bars use the reported benchmark values.

Run `npm run build` and `npm run evals` against a server with `EVAL_KEY` configured. The 16 agent cases check grounding, scope, language, matching, and concise tours. The suite publishes the model and test date in `public/evals.json`.
