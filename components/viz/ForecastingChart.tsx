"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  Area,
  CartesianGrid,
  ComposedChart,
  Line,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { motion } from "framer-motion";
import { buildForecastSeries, type ModelKind } from "@/lib/synthetic";
import { palette, modelColors } from "./primitives/colors";
import { useInView } from "./primitives/useInView";

const MODELS: Array<{ id: ModelKind; label: string; rmse: number }> = [
  { id: "transformer", label: "transformer", rmse: 1.42 },
  { id: "lstm", label: "lstm", rmse: 1.78 },
  { id: "cnn", label: "cnn", rmse: 2.23 },
];

const HISTORY_DAYS = 60;
const FORECAST_DAYS = 14;

export function ForecastingChart() {
  const [model, setModel] = useState<ModelKind>("transformer");
  const [containerRef, inView] = useInView<HTMLDivElement>({ threshold: 0.3 });
  const [progress, setProgress] = useState(0); // 0 → HISTORY_DAYS+FORECAST_DAYS
  const rafRef = useRef<number | null>(null);

  // Animate the chart drawing once when in view; restart on model change.
  useEffect(() => {
    if (!inView) return;
    cancelAnimationFrame(rafRef.current ?? 0);
    setProgress(0);
    let start: number | null = null;
    const total = HISTORY_DAYS + FORECAST_DAYS;
    const duration = 2200; // ms
    function tick(t: number) {
      if (start == null) start = t;
      const k = Math.min(1, (t - start) / duration);
      // Slight ease-out
      const eased = 1 - Math.pow(1 - k, 2.4);
      setProgress(Math.floor(eased * total));
      if (k < 1) rafRef.current = requestAnimationFrame(tick);
    }
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [inView, model]);

  const fullSeries = useMemo(
    () => buildForecastSeries({ days: HISTORY_DAYS, forecastDays: FORECAST_DAYS, model }),
    [model],
  );

  // Reveal points up to `progress`; null out the rest so Recharts skips them.
  const data = useMemo(
    () =>
      fullSeries.map((p, i) => {
        if (i <= progress) return p;
        return { day: p.day, actual: null, forecast: null, ciRange: null };
      }),
    [fullSeries, progress],
  );

  const accent = modelColors[model];

  return (
    <div ref={containerRef} className="space-y-3">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-3">
        <div className="min-w-0">
          <div className="font-mono text-[11px] uppercase tracking-wider text-[var(--foreground-muted)]">
            soil moisture · t+{FORECAST_DAYS} forecast
          </div>
          <div className="font-mono text-[11px] text-[var(--foreground-dim)]">
            <span style={{ color: accent }}>● {model}</span>
            <span className="mx-2 text-[var(--foreground-muted)]">·</span>
            rmse {MODELS.find((m) => m.id === model)?.rmse.toFixed(2)}
          </div>
        </div>
        <div className="flex flex-wrap gap-1">
          {MODELS.map((m) => (
            <button
              key={m.id}
              onClick={() => setModel(m.id)}
              className={`font-mono text-[10px] px-2 py-1 rounded border transition-colors ${
                model === m.id
                  ? "border-[var(--accent)] text-[var(--accent)] bg-[var(--accent)]/10"
                  : "border-[var(--border-strong)] text-[var(--foreground-muted)] hover:text-[var(--foreground-dim)]"
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>
      </div>

      <div className="aspect-[5/3] w-full bg-[var(--surface)] border border-[var(--border)] rounded p-1">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} margin={{ top: 8, right: 8, bottom: 4, left: 0 }}>
            <defs>
              <linearGradient id="ciGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={accent} stopOpacity={0.35} />
                <stop offset="100%" stopColor={accent} stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke={palette.border} strokeDasharray="2 4" />
            <XAxis
              dataKey="day"
              stroke={palette.textMuted}
              tick={{ fontSize: 10, fontFamily: "var(--font-mono)" }}
              tickLine={false}
              axisLine={{ stroke: palette.border }}
            />
            <YAxis
              stroke={palette.textMuted}
              tick={{ fontSize: 10, fontFamily: "var(--font-mono)" }}
              tickLine={false}
              axisLine={{ stroke: palette.border }}
              width={42}
              domain={["dataMin - 2", "dataMax + 2"]}
              tickFormatter={(v: number) => `${Math.round(v)}%`}
            />
            <Tooltip
              contentStyle={{
                background: palette.surface,
                border: `1px solid ${palette.borderStrong}`,
                borderRadius: 4,
                fontFamily: "var(--font-mono)",
                fontSize: 11,
                color: palette.text,
              }}
              labelStyle={{ color: palette.textDim }}
              cursor={{ stroke: palette.borderStrong, strokeDasharray: "2 3" }}
              formatter={(value, name) => {
                const label = String(name ?? "");
                if (value == null) return ["–", label];
                if (Array.isArray(value)) {
                  const [lo, hi] = value as [number, number];
                  return [`${lo.toFixed(1)}–${hi.toFixed(1)}%`, label];
                }
                return [`${(value as number).toFixed(1)}%`, label];
              }}
              labelFormatter={(label) => `day ${label}`}
            />
            <ReferenceLine
              x={HISTORY_DAYS - 1}
              stroke={palette.textMuted}
              strokeDasharray="3 3"
              label={{
                value: "now",
                position: "top",
                fill: palette.textMuted,
                fontSize: 10,
                fontFamily: "var(--font-mono)",
              }}
            />
            <Area
              type="monotone"
              dataKey="ciRange"
              stroke="none"
              fill="url(#ciGradient)"
              isAnimationActive={false}
              connectNulls={false}
              name="95% ci"
            />
            <Line
              type="monotone"
              dataKey="actual"
              stroke={palette.text}
              strokeWidth={1.5}
              dot={false}
              isAnimationActive={false}
              connectNulls={false}
              name="actual"
            />
            <Line
              type="monotone"
              dataKey="forecast"
              stroke={accent}
              strokeWidth={2}
              strokeDasharray="4 4"
              dot={false}
              isAnimationActive={false}
              connectNulls={false}
              name="forecast"
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      <motion.div
        key={model}
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="flex flex-wrap items-center gap-x-4 gap-y-1 font-mono text-[10px] text-[var(--foreground-muted)]"
      >
        <span className="inline-flex items-center gap-1.5">
          <span className="block w-3 h-px bg-[var(--foreground)]" /> historical
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span
            className="block w-3 h-px"
            style={{
              backgroundImage: `repeating-linear-gradient(90deg, ${accent} 0 4px, transparent 4px 8px)`,
              height: 2,
            }}
          />
          forecast
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span
            className="block w-3 h-2 rounded-sm"
            style={{ background: `linear-gradient(180deg, ${accent}55, ${accent}05)` }}
          />
          95 % CI
        </span>
        <span className="ml-auto">irrigation sensor · n={HISTORY_DAYS}</span>
      </motion.div>
    </div>
  );
}
