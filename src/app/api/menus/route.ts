import { NextResponse } from "next/server";
import { scrapeMenus } from "@/lib/scraper";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const menus = await scrapeMenus();
    return NextResponse.json({ menus, fetchedAt: new Date().toISOString() });
  } catch (error) {
    console.error("Scraping error:", error);
    return NextResponse.json(
      { error: "Impossible de récupérer les menus.", menus: [] },
      { status: 500 }
    );
  }
}
