import { ImageResponse } from "next/og";
import { getSettings, colorThemes } from "@/lib/settings";

export const dynamic = "force-dynamic";

export async function GET() {
  const settings = await getSettings();
  const theme = colorThemes[settings.primaryColor] || colorThemes.warm;
  const primary = theme.vars["--primary"];
  const gradientFrom = theme.vars["--gradient-from"];
  const gradientTo = theme.vars["--gradient-to"];

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          background: `linear-gradient(135deg, #fafafa 0%, #f5f5f5 50%, #fafafa 100%)`,
          fontFamily: "sans-serif",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Decorative circles */}
        <div
          style={{
            position: "absolute",
            top: "-80px",
            right: "-80px",
            width: "350px",
            height: "350px",
            borderRadius: "50%",
            background: `${gradientFrom}30`,
            display: "flex",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "-60px",
            left: "-60px",
            width: "280px",
            height: "280px",
            borderRadius: "50%",
            background: `${gradientTo}25`,
            display: "flex",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: "40%",
            left: "15%",
            width: "150px",
            height: "150px",
            borderRadius: "50%",
            background: `${primary}15`,
            display: "flex",
          }}
        />

        {/* Top gradient bar */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "6px",
            background: `linear-gradient(90deg, ${gradientFrom}, ${gradientTo})`,
            display: "flex",
          }}
        />

        {/* Content */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "60px",
            textAlign: "center",
            zIndex: 1,
          }}
        >
          {/* Icon */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "80px",
              height: "80px",
              borderRadius: "20px",
              background: `linear-gradient(135deg, ${gradientFrom}, ${gradientTo})`,
              marginBottom: "30px",
              fontSize: "40px",
            }}
          >
            🍽️
          </div>

          {/* School name badge */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              padding: "8px 24px",
              borderRadius: "50px",
              background: `${primary}15`,
              border: `2px solid ${primary}30`,
              color: primary,
              fontSize: "22px",
              fontWeight: 600,
              marginBottom: "24px",
            }}
          >
            {settings.schoolName}
          </div>

          {/* Title */}
          <div
            style={{
              display: "flex",
              fontSize: "56px",
              fontWeight: 800,
              background: `linear-gradient(135deg, ${gradientFrom}, ${gradientTo})`,
              backgroundClip: "text",
              color: "transparent",
              marginBottom: "16px",
              lineHeight: 1.1,
            }}
          >
            {settings.pageTitle}
          </div>

          {/* Subtitle */}
          <div
            style={{
              display: "flex",
              fontSize: "24px",
              color: "#64748b",
              maxWidth: "800px",
              lineHeight: 1.4,
            }}
          >
            {settings.subtitle}
          </div>
        </div>

        {/* Bottom bar */}
        <div
          style={{
            position: "absolute",
            bottom: "30px",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            fontSize: "18px",
            color: "#94a3b8",
          }}
        >
          <span>menu-college.vercel.app</span>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
