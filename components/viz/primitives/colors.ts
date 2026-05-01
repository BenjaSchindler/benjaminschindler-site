export const palette = {
  bg: "#0a0a0a",
  surface: "#111111",
  surfaceRaised: "#161616",
  border: "#1f1f1f",
  borderStrong: "#2a2a2a",
  text: "#ededed",
  textDim: "#9aa0a6",
  textMuted: "#6b7280",
  green: "#10ffa5", // terminal green — interactive highlight
  greenDim: "#10b981",
  orange: "#ff6b35", // UAI orange — thesis accent
  orangeDim: "#c45227",
  cyan: "#22d3ee",
  magenta: "#f472b6",
  lime: "#a3e635",
  amber: "#fb923c",
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
