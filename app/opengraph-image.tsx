import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Benjamin Schindler · CTO & AI Engineer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background: "#0a0a0a",
          backgroundImage:
            "radial-gradient(ellipse at top left, rgba(16, 255, 165, 0.12) 0%, transparent 50%), linear-gradient(to bottom, #0a0a0a 0%, #050505 100%)",
          color: "#ededed",
          padding: 80,
          fontFamily: "ui-monospace, monospace",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            fontSize: 22,
            color: "#10ffa5",
          }}
        >
          <div
            style={{
              width: 12,
              height: 12,
              borderRadius: 999,
              background: "#10ffa5",
            }}
          />
          ~/benja
        </div>

        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <div style={{ fontSize: 28, color: "#9aa0a6", display: "flex" }}>$ whoami</div>
          <div style={{ fontSize: 96, fontWeight: 700, lineHeight: 1.05, marginTop: 12, display: "flex" }}>
            benjamin schindler
          </div>
          <div style={{ fontSize: 32, color: "#9aa0a6", marginTop: 16, display: "flex" }}>
            <span style={{ color: "#10ffa5", marginRight: 12 }}>&gt;</span>
            cto · ai engineer · msc data science
          </div>
          <div style={{ fontSize: 24, color: "#6b7280", marginTop: 8, display: "flex" }}>
            <span style={{ color: "#10ffa5", marginRight: 12 }}>&gt;</span>
            agentic systems · rag · production ai
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            fontSize: 20,
            color: "#6b7280",
          }}
        >
          <div style={{ display: "flex" }}>chile · gmt-3 · v 2026.05</div>
          <div style={{ display: "flex" }}>benjaminschindler.vercel.app</div>
        </div>
      </div>
    ),
    { ...size },
  );
}
