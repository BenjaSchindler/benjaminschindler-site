# Benjamin Schindler — CV site

Single-page portfolio with animated, interactive visualizations for each
role and the master's thesis. Built with Next.js 16 and deployed on Vercel.

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
| Hero | Terminal-style typewriter (`whoami` → identity lines) |
| Doctor911 | Multi-agent graph with animated edges and traveling tokens; hover a node to highlight its subtree |
| WiseConn | Soil-moisture forecasting — animated draw, switch between Transformer / LSTM / CNN |
| Unitti | NL → LLM → SQL → Result pipeline with looping data flow (hover to pause) |
| Master's thesis | Embedding-space scatter with 4 modes (Anchors / SMOTE / LLM raw / LLM + filter) — recreates slides 4 & 17 of the defense |

All visualizations honor `prefers-reduced-motion`.

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

No env vars required. The site is fully static (no backend, no database).

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

Everything visible flows from `lib/data.ts` (profile, experience, education,
thesis stats, skills). Edit there and content propagates everywhere on the
site. The PDF in `public/cv.pdf` is downloaded as-is.

## Updating the thesis numbers

The ΔF1 bars and stats panel use `thesis.results` and `thesis.stats` in
`lib/data.ts`. They mirror the defense slide deck values — update both if
your final paper diverges.
