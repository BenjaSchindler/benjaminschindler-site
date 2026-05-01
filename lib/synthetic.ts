// Deterministic seeded data generators for visualizations.
// We use mulberry32 — a small, fast PRNG with good statistical properties
// for visualization purposes.

export function mulberry32(seed: number): () => number {
  let t = seed >>> 0;
  return function () {
    t = (t + 0x6d2b79f5) >>> 0;
    let r = t;
    r = Math.imul(r ^ (r >>> 15), r | 1);
    r ^= r + Math.imul(r ^ (r >>> 7), r | 61);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

function gaussian(rand: () => number): number {
  // Box-Muller transform — returns a sample from N(0,1).
  const u1 = Math.max(rand(), 1e-9);
  const u2 = rand();
  return Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
}

// ── Forecasting (WiseConn) ────────────────────────────────────────────────────
//
// Soil moisture % over `days` days. Looks like real ag-tech sensor data:
// slow seasonal cycle + diurnal-ish wobble + irrigation events (sharp jumps)
// + measurement noise. Forecast diverges from ground truth as a function of
// model variance.

export type ForecastPoint = {
  day: number;
  actual: number | null;
  forecast: number | null;
  /** Confidence interval as [low, high] tuple — Recharts renders this as a band. */
  ciRange: [number, number] | null;
};

export type ModelKind = "transformer" | "lstm" | "cnn";

const MODEL_PROFILE: Record<ModelKind, { biasScale: number; bandWidth: number; smoothness: number }> = {
  transformer: { biasScale: 0.6, bandWidth: 4.0, smoothness: 0.85 },
  lstm: { biasScale: 1.0, bandWidth: 5.5, smoothness: 0.7 },
  cnn: { biasScale: 1.4, bandWidth: 7.5, smoothness: 0.55 },
};

export function buildForecastSeries(opts: {
  days?: number;
  forecastDays?: number;
  model?: ModelKind;
  seed?: number;
}): ForecastPoint[] {
  const days = opts.days ?? 60;
  const forecastDays = opts.forecastDays ?? 14;
  const model = opts.model ?? "transformer";
  const seed = opts.seed ?? 42;

  const rng = mulberry32(seed);
  const profile = MODEL_PROFILE[model];

  const series: ForecastPoint[] = [];

  // Ground truth: seasonal baseline + irrigation jumps
  const baseline = 38; // % moisture
  const seasonAmp = 6;
  const truth: number[] = [];
  for (let i = 0; i < days + forecastDays; i++) {
    const season = Math.sin((i / 18) * Math.PI * 2) * seasonAmp;
    const slow = Math.sin((i / 7) * Math.PI * 2) * 1.6;
    const noise = gaussian(rng) * 1.1;
    // Irrigation events: every ~10 days, +6 to +9 jump that decays
    const irrigationPhase = (i + seed) % 11;
    const irrigation = irrigationPhase < 3 ? (3 - irrigationPhase) * 2.4 : 0;
    truth.push(baseline + season + slow + noise + irrigation);
  }

  // Forecast: starts as a slightly drifted version of truth at day=days,
  // diverges over the forecast horizon according to model variance
  const forecastRng = mulberry32(seed + (model === "transformer" ? 7 : model === "lstm" ? 13 : 19));
  let forecastBias = gaussian(forecastRng) * profile.biasScale * 0.8;

  for (let i = 0; i < days + forecastDays; i++) {
    const isHistorical = i < days;
    const isForecast = i >= days - 1; // overlap one for line continuity
    let forecast: number | null = null;
    let ciLow: number | null = null;
    let ciHigh: number | null = null;

    if (isForecast) {
      const horizon = i - (days - 1); // 0..forecastDays
      // Drift: the further out, the more the forecast wanders
      forecastBias += gaussian(forecastRng) * profile.biasScale * 0.18;
      const drift = forecastBias * Math.min(horizon / 3, 1);
      forecast = profile.smoothness * truth[i] + (1 - profile.smoothness) * (truth[i - 1] ?? truth[i]) + drift;

      const widthGrowth = 1 + horizon / Math.max(forecastDays - 1, 1);
      const w = profile.bandWidth * widthGrowth * 0.5;
      ciLow = forecast - w;
      ciHigh = forecast + w;
    }

    series.push({
      day: i,
      actual: isHistorical ? round1(truth[i]) : null,
      forecast: forecast == null ? null : round1(forecast),
      ciRange: ciLow == null || ciHigh == null ? null : [round1(ciLow), round1(ciHigh)],
    });
  }

  return series;
}

function round1(x: number) {
  return Math.round(x * 10) / 10;
}

// ── Thesis scatter (slides 4 + 17) ───────────────────────────────────────────
//
// 6 class clusters in 2D embedding space, one of which is a sparse minority
// (10 anchors only). LLM candidates are sampled around the minority cluster
// with ~25 % noise that lands inside neighbor classes (hard negatives).

export type Point = {
  id: string;
  x: number;
  y: number;
  cls: number; // class index
  kind: "anchor" | "cluster" | "smote" | "llm";
  // For LLM candidates: distance score from the minority centroid (lower = more central / safer)
  score?: number;
  // For LLM candidates: kept by geometric filter?
  kept?: boolean;
};

export type ScatterDataset = {
  points: Point[];
  smotePairs: Array<[string, string]>; // anchor id pairs producing smote midpoints
  classCount: number;
  minorityClass: number;
  minorityCentroid: { x: number; y: number };
  filterRadius: number;
};

export function buildThesisScatter(seed = 17): ScatterDataset {
  const rng = mulberry32(seed);
  const classCount = 6;
  const minorityClass = 2;
  // Cluster centers placed roughly around the canvas (square-ish, [-1, 1] coords)
  const centers: Array<{ x: number; y: number }> = [
    { x: -0.62, y: 0.55 },
    { x: 0.05, y: 0.7 },
    { x: 0.55, y: 0.18 }, // minority — placed where it has neighbors on both sides
    { x: 0.6, y: -0.55 },
    { x: -0.05, y: -0.65 },
    { x: -0.7, y: -0.05 },
  ];

  const points: Point[] = [];

  // Non-minority clusters: 22-30 points each, Gaussian around center
  centers.forEach((c, i) => {
    if (i === minorityClass) return;
    const n = 24 + Math.floor(rng() * 7);
    const sigma = 0.13;
    for (let k = 0; k < n; k++) {
      points.push({
        id: `c${i}_${k}`,
        x: c.x + gaussian(rng) * sigma,
        y: c.y + gaussian(rng) * sigma,
        cls: i,
        kind: "cluster",
      });
    }
  });

  // Minority anchors: 10 points only, tighter cluster
  const minorityCenter = centers[minorityClass];
  const anchorSigma = 0.09;
  for (let k = 0; k < 10; k++) {
    points.push({
      id: `a${k}`,
      x: minorityCenter.x + gaussian(rng) * anchorSigma,
      y: minorityCenter.y + gaussian(rng) * anchorSigma,
      cls: minorityClass,
      kind: "anchor",
    });
  }

  // SMOTE midpoints: random pairs of anchors → midpoints with slight jitter
  const anchorIds = points.filter((p) => p.kind === "anchor").map((p) => p.id);
  const anchorById = new Map(points.filter((p) => p.kind === "anchor").map((p) => [p.id, p]));
  const smotePairs: Array<[string, string]> = [];
  const smoteCount = 18;
  for (let k = 0; k < smoteCount; k++) {
    const a = anchorIds[Math.floor(rng() * anchorIds.length)];
    let b = anchorIds[Math.floor(rng() * anchorIds.length)];
    while (b === a) b = anchorIds[Math.floor(rng() * anchorIds.length)];
    smotePairs.push([a, b]);
    const pa = anchorById.get(a)!;
    const pb = anchorById.get(b)!;
    const t = 0.3 + rng() * 0.4;
    const jitter = 0.018;
    points.push({
      id: `s${k}`,
      x: pa.x + (pb.x - pa.x) * t + gaussian(rng) * jitter,
      y: pa.y + (pb.y - pa.y) * t + gaussian(rng) * jitter,
      cls: minorityClass,
      kind: "smote",
    });
  }

  // LLM candidates: ~75 % near minority centroid (good), ~25 % drifted into neighbor space (noise)
  const llmTotal = 38;
  const llmSafe = Math.round(llmTotal * 0.74);
  const filterRadius = 0.22;
  for (let k = 0; k < llmTotal; k++) {
    let x: number, y: number;
    if (k < llmSafe) {
      // Stay near minority cluster, but slightly more spread than anchors
      x = minorityCenter.x + gaussian(rng) * 0.13;
      y = minorityCenter.y + gaussian(rng) * 0.13;
    } else {
      // Drift toward a random non-minority cluster center → noise / hard negative
      const target = centers[Math.floor(rng() * classCount)];
      const tt = 0.55 + rng() * 0.4;
      x = minorityCenter.x * (1 - tt) + target.x * tt + gaussian(rng) * 0.08;
      y = minorityCenter.y * (1 - tt) + target.y * tt + gaussian(rng) * 0.08;
    }
    const dx = x - minorityCenter.x;
    const dy = y - minorityCenter.y;
    const score = Math.sqrt(dx * dx + dy * dy);
    const kept = score < filterRadius;
    points.push({
      id: `l${k}`,
      x,
      y,
      cls: minorityClass,
      kind: "llm",
      score: round3(score),
      kept,
    });
  }

  return {
    points,
    smotePairs,
    classCount,
    minorityClass,
    minorityCentroid: minorityCenter,
    filterRadius,
  };
}

function round3(x: number) {
  return Math.round(x * 1000) / 1000;
}
