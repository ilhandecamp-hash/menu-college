import { NextRequest, NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import {
  getSettings,
  saveSettings,
  colorThemes,
  SiteSettings,
} from "@/lib/settings";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!isAuthenticated()) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const settings = getSettings();
  const themes = Object.values(colorThemes).map((t) => ({
    key: t.key,
    label: t.label,
    preview: t.preview,
  }));

  return NextResponse.json({ settings, themes });
}

export async function PUT(request: NextRequest) {
  if (!isAuthenticated()) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const body = await request.json();

  if (body.primaryColor && !colorThemes[body.primaryColor]) {
    return NextResponse.json({ error: "Thème invalide" }, { status: 400 });
  }

  if (body.sourceUrl) {
    try {
      new URL(body.sourceUrl);
    } catch {
      return NextResponse.json(
        { error: "URL source invalide" },
        { status: 400 }
      );
    }
  }

  const current = getSettings();
  const updated: SiteSettings = { ...current, ...body };
  saveSettings(updated);

  return NextResponse.json({ settings: updated });
}
