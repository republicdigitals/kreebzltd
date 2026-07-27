import { ImageResponse } from "next/og";
import { readFileSync } from "fs";
import { join } from "path";

export const dynamic = "force-static";

export const alt = "Kreebz Ltd | Official Marketing & Facility Management";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  const logo = readFileSync(join(process.cwd(), "public", "kreebz-logo.png"));
  const logoSrc = `data:image/png;base64,${logo.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#EDE9E0",
          padding: 60,
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={logoSrc} width={220} height={220} alt="Kreebz" />
        <div
          style={{
            marginTop: 40,
            fontFamily: "Georgia, serif",
            fontSize: 52,
            fontWeight: 400,
            color: "#1a1a1a",
            textAlign: "center",
            lineHeight: 1.2,
            maxWidth: 900,
          }}
        >
          Kreebz Ltd
        </div>
        <div
          style={{
            marginTop: 16,
            fontFamily: "Helvetica, Arial, sans-serif",
            fontSize: 24,
            fontWeight: 400,
            color: "#5a5550",
            textAlign: "center",
            lineHeight: 1.4,
            maxWidth: 900,
            letterSpacing: 0.5,
          }}
        >
          Official marketing & facility management for Folio Properties and IBJ Property Development Company
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
