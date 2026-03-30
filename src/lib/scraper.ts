import * as cheerio from "cheerio";
import { getSettings } from "@/lib/settings";

export interface MenuItem {
  title: string;
  url: string;
  filename: string;
}

export interface ArticleItem {
  title: string;
  url: string;
  date: string;
}

export async function scrapeMenus(): Promise<MenuItem[]> {
  const settings = await getSettings();
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

  return menus;
}

export async function scrapeArticles(): Promise<ArticleItem[]> {
  const settings = await getSettings();
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
    throw new Error(`Failed to fetch articles: ${response.status}`);
  }

  const html = await response.text();
  const $ = cheerio.load(html);

  const articles: ArticleItem[] = [];

  $(".titre-article-cadre").each((_, element) => {
    const link = $(element).find("a");
    const href = link.attr("href");
    const title = link.text().trim();
    if (!href || !title) return;

    const absoluteUrl = href.startsWith("http")
      ? href
      : new URL(href, BASE_URL).toString();

    // Get date from the next sibling .date-auteur-cadre
    const dateDiv = $(element).next(".date-auteur-cadre");
    const dateText = dateDiv.text().trim().replace(/^le\s+/i, "").replace(/\s+/g, " ").trim();

    articles.push({ title, url: absoluteUrl, date: dateText });
  });

  return articles;
}
