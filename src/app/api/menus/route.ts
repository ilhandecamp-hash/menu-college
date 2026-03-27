import { NextResponse } from "next/server";
import * as cheerio from "cheerio";
import { getSettings } from "@/lib/settings";

export interface MenuItem {
  title: string;
  url: string;
  filename: string;
}

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const settings = getSettings();
    const TARGET_URL = settings.sourceUrl;
    const BASE_URL = new URL("./", TARGET_URL).toString();

    const response = await fetch(TARGET_URL, {
      next: { revalidate: 0 },
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch: ${response.status}`);
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    const menus: MenuItem[] = [];
    const seen = new Set<string>();

    $('a[href$=".pdf"]').each((_, element) => {
      const href = $(element).attr("href");
      if (!href) return;

      const absoluteUrl = href.startsWith("http")
        ? href
        : new URL(href, BASE_URL).toString();

      if (seen.has(absoluteUrl)) return;
      seen.add(absoluteUrl);

      const filename = decodeURIComponent(
        absoluteUrl.split("/").pop() || "menu.pdf"
      );

      const title = filename
        .replace(/\.pdf$/i, "")
        .replace(/_/g, " ")
        .replace(/\b\w/g, (c) => c.toUpperCase());

      menus.push({ title, url: absoluteUrl, filename });
    });

    return NextResponse.json({ menus, fetchedAt: new Date().toISOString() });
  } catch (error) {
    console.error("Scraping error:", error);
    return NextResponse.json(
      { error: "Impossible de récupérer les menus.", menus: [] },
      { status: 500 }
    );
  }
}
