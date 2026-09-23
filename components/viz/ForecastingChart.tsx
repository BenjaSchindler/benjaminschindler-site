"use client";

import { useId, useMemo } from "react";
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
import { buildForecastSeries } from "@/lib/synthetic";
import { palette } from "./primitives/colors";
import { useLanguage } from "@/lib/Language";
const HISTORY_DAYS = 60;
const FORECAST_DAYS = 14;

export function ForecastingChart() {
  const { lang } = useLanguage();
  const es = lang === "es";
  const gradientId = useId();
  const data = useMemo(() => buildForecastSeries({ days: HISTORY_DAYS, forecastDays: FORECAST_DAYS, model: "cnn" }), []);
  const accent = "var(--accent)";
  const number = new Intl.NumberFormat(es ? "es-CL" : "en-US", { maximumFractionDigits: 1 });

  return (
    <figure className="space-y-4">
      <figcaption>
        <p className="text-base font-medium">{es ? "Predicción de humedad del suelo" : "Soil moisture forecast"}</p>
        <p className="mt-1 text-xs leading-relaxed text-[var(--foreground-dim)]">{es ? "60 días de historial · 14 días de predicción" : "60 days of history · 14-day forecast"}</p>
      </figcaption>
      <div className="aspect-[5/3] w-full bg-[var(--surface)] border border-[var(--border)] rounded p-1">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} margin={{ top: 8, right: 8, bottom: 4, left: 0 }}>
            <defs>
              <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={accent} stopOpacity={0.35} />
                <stop offset="100%" stopColor={accent} stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke={palette.border} strokeDasharray="2 4" />
            <XAxis
              dataKey="day"
              type="number"
              domain={[0, HISTORY_DAYS + FORECAST_DAYS - 1]}
              ticks={[0, 29, 59, 73]}
              tickFormatter={(value: number) => value === 59 ? (es ? "Hoy" : "Today") : `${value > 59 ? "+" : ""}${value - 59}`}
              stroke={palette.textMuted}
              tick={{ fontSize: 12, fontFamily: "var(--font-mono)" }}
              tickLine={false}
              axisLine={{ stroke: palette.border }}
            />
            <YAxis
              stroke={palette.textMuted}
              tick={{ fontSize: 12, fontFamily: "var(--font-mono)" }}
              tickLine={false}
              axisLine={{ stroke: palette.border }}
              width={42}
              domain={[20, 60]}
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
                  return [`${number.format(lo)}–${number.format(hi)}%`, label];
                }
                return [`${number.format(value as number)}%`, label];
              }}
              labelFormatter={(label) => `${es ? "Día" : "Day"} ${Number(label) - 59}`}
            />
            <ReferenceLine
              x={HISTORY_DAYS - 1}
              stroke={palette.textMuted}
              strokeDasharray="3 3"
            />
            <Area
              type="monotone"
              dataKey="ciRange"
              stroke="none"
              fill={`url(#${gradientId})`}
              isAnimationActive={false}
              connectNulls={false}
              name={es ? "Banda ilustrativa" : "Illustrative band"}
            />
            <Line
              type="monotone"
              dataKey="actual"
              stroke={palette.text}
              strokeWidth={1.5}
              dot={false}
              isAnimationActive={false}
              connectNulls={false}
              name={es ? "Histórico" : "Historical"}
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
              name={es ? "Predicción" : "Forecast"}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-[var(--foreground-dim)]">
        <span className="inline-flex items-center gap-1.5">
          <span className="block w-3 h-px bg-[var(--foreground)]" /> {es ? "Histórico" : "Historical"}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span
            className="block w-3 h-px"
            style={{
              backgroundImage: `repeating-linear-gradient(90deg, ${accent} 0 4px, transparent 4px 8px)`,
              height: 2,
            }}
          />
          {es ? "Predicción" : "Forecast"}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span
            className="block w-3 h-2 rounded-sm"
            style={{ background: `color-mix(in srgb, ${accent} 30%, transparent)` }}
          />
          {es ? "Banda ilustrativa" : "Illustrative band"}
        </span>
      </div>
      <p className="text-xs leading-relaxed text-[var(--foreground-dim)]">{es ? "Eje horizontal: días respecto de hoy. Datos y banda simulados; no representan resultados de WiseConn." : "Horizontal axis: days relative to today. Simulated data and band; not WiseConn measurements."}</p>
    </figure>
  );
}
