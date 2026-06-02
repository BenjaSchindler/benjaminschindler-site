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
          background: "#0f172a",
          backgroundImage:
            "radial-gradient(ellipse at top right, rgba(52, 153, 205, 0.18) 0%, transparent 55%), linear-gradient(to bottom, #0f172a 0%, #0a0f1c 100%)",
          color: "#f1f5f9",
          padding: 80,
          fontFamily: "ui-sans-serif, system-ui, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            fontSize: 18,
            color: "#cbd5e1",
            textTransform: "uppercase",
            letterSpacing: "0.18em",
          }}
        >
          <div
            style={{
              width: 10,
              height: 10,
              borderRadius: 999,
              background: "#3499cd",
            }}
          />
          Benjamin Schindler
        </div>

        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              fontSize: 96,
              fontWeight: 600,
              lineHeight: 1.05,
              letterSpacing: "-0.02em",
              display: "flex",
            }}
          >
            Benjamin Schindler
          </div>
          <div
            style={{
              fontSize: 34,
              color: "#cbd5e1",
              marginTop: 18,
              display: "flex",
            }}
          >
            CTO · AI Engineer · MSc Data Science
          </div>
          <div
            style={{
              fontSize: 24,
              color: "#94a3b8",
              marginTop: 10,
              display: "flex",
            }}
          >
            Agentic systems · RAG · Production AI
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            fontSize: 18,
            color: "#94a3b8",
            textTransform: "uppercase",
            letterSpacing: "0.16em",
          }}
        >
          <div style={{ display: "flex" }}>
            Santiago, Chile · GMT−3 · v2026.06
          </div>
          <div style={{ display: "flex", color: "#5db5e0" }}>
            benjaminschindler.vercel.app
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
