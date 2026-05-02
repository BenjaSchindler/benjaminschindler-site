export const palette = {
  bg: "#0f172a",
  surface: "#1e293b",
  surfaceRaised: "#243049",
  border: "#334155",
  borderStrong: "#475569",
  text: "#f1f5f9",
  textDim: "#cbd5e1",
  textMuted: "#94a3b8",
  green: "#3499cd", // primary highlight (scikit-learn blue) — keeps key for compat
  greenDim: "#2c80ad",
  orange: "#f7931e", // scikit-learn orange — thesis accent
  orangeDim: "#c97000",
  cyan: "#38bdf8",
  magenta: "#f472b6",
  lime: "#a3e635",
  amber: "#fbbf24",
  red: "#f87171",
  blue: "#60a5fa",
  violet: "#a78bfa",
} as const;

// 6-class palette for the thesis scatter (matches defense slide aesthetic)
export const classColors = [
  palette.cyan, // 0
  palette.lime, // 1
  palette.orange, // 2 — minority (target class)
  palette.magenta, // 3
  palette.violet, // 4
  palette.amber, // 5
] as const;

export const modelColors: Record<string, string> = {
  transformer: palette.cyan,
  lstm: palette.magenta,
  cnn: palette.lime,
};
