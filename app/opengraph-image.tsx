import { ImageResponse } from "next/og";

export const alt = "Akhilendra Singh, full-stack engineer, frontend-first";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const dynamic = "force-static";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#100e0c",
          color: "#f6f1e8",
          padding: "72px",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: 22,
            letterSpacing: 3,
            textTransform: "uppercase",
            color: "#cfc6b8",
          }}
        >
          <span>Portfolio</span>
          <span>Bangalore</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", fontSize: 28, color: "#e24b22", marginBottom: 18 }}>Calibre</div>
          <div style={{ display: "flex", fontSize: 84, lineHeight: 0.92, letterSpacing: -2 }}>Akhilendra Singh</div>
          <div style={{ display: "flex", fontSize: 32, marginTop: 22, color: "#f6f1e8" }}>
            Full-stack engineer, frontend-first
          </div>
        </div>
        <div style={{ display: "flex", fontSize: 24, color: "#cfc6b8" }}>Design through delivery</div>
      </div>
    ),
    { ...size },
  );
}
