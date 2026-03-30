import * as cheerio from "cheerio";
import { getSettings } from "@/lib/settings";

export interface MenuItem {
  title: string;
  url: string;
  filename: string;
}

export interface ArticleImage {
  thumbnail: string;
  fullSize: string;
  alt: string;
}

export interface ArticleItem {
  title: string;
  url: string;
  date: string;
  images: ArticleImage[];
}

async function fetchHtml(url: string): Promise<string> {
  const response = await fetch(url, {
    next: { revalidate: 0 },
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    },
  });
  if (!response.ok) throw new Error(`Failed to fetch: ${response.status}`);
  return response.text();
}

export async function scrapeMenus(): Promise<MenuItem[]> {
  const settings = await getSettings();
  const TARGET_URL = settings.sourceUrl;
  const BASE_URL = new URL("./", TARGET_URL).toString();

  const html = await fetchHtml(TARGET_URL);
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

function extractArticlesFromHtml(
  $: cheerio.CheerioAPI,
  baseUrl: string
): { title: string; url: string; date: string }[] {
  const articles: { title: string; url: string; date: string }[] = [];

  $(".titre-article-cadre").each((_, element) => {
    const link = $(element).find("a");
    const href = link.attr("href");
    const title = link.text().trim();
    if (!href || !title) return;

    const absoluteUrl = href.startsWith("http")
      ? href
      : new URL(href, baseUrl).toString();

    const dateDiv = $(element).next(".date-auteur-cadre");
    const dateText = dateDiv
      .text()
      .trim()
      .replace(/^le\s+/i, "")
      .replace(/\s+/g, " ")
      .trim();

    articles.push({ title, url: absoluteUrl, date: dateText });
  });

  return articles;
}

async function scrapeArticleImages(
  articleUrl: string,
  baseUrl: string
): Promise<ArticleImage[]> {
  try {
    const html = await fetchHtml(articleUrl);
    const $ = cheerio.load(html);
    const images: ArticleImage[] = [];

    // Images are in #documents_portfolio or in links with type="image/jpeg"
    $('a[type="image/jpeg"], #documents_portfolio a').each((_, element) => {
      const fullHref = $(element).attr("href");
      const img = $(element).find("img");
      const thumbSrc = img.attr("src");
      const alt = img.attr("alt") || "";

      if (!fullHref) return;

      const fullSize = fullHref.startsWith("http")
        ? fullHref
        : new URL(fullHref, baseUrl).toString();

      const thumbnail = thumbSrc
        ? thumbSrc.startsWith("http")
          ? thumbSrc
          : new URL(thumbSrc, baseUrl).toString()
        : fullSize;

      // Avoid duplicates
      if (!images.some((i) => i.fullSize === fullSize)) {
        images.push({ thumbnail, fullSize, alt });
      }
    });

    return images;
  } catch {
    return [];
  }
}

export async function scrapeArticles(): Promise<ArticleItem[]> {
  const settings = await getSettings();
  const TARGET_URL = settings.sourceUrl;
  const BASE_URL = new URL("./", TARGET_URL).toString();

  // Fetch both pagination pages in parallel
  const page1Url = TARGET_URL;
  const page2Url = `${TARGET_URL}&debut_meme_rubrique=5`;

  const [html1, html2] = await Promise.all([
    fetchHtml(page1Url),
    fetchHtml(page2Url).catch(() => ""),
  ]);

  const $1 = cheerio.load(html1);
  const articles1 = extractArticlesFromHtml($1, BASE_URL);

  let articles2: { title: string; url: string; date: string }[] = [];
  if (html2) {
    const $2 = cheerio.load(html2);
    articles2 = extractArticlesFromHtml($2, BASE_URL);
  }

  const allArticles = [...articles1, ...articles2];

  // Fetch images for all articles in parallel
  const articlesWithImages = await Promise.all(
    allArticles.map(async (article) => {
      const images = await scrapeArticleImages(article.url, BASE_URL);
      return { ...article, images };
    })
  );

  return articlesWithImages;
}
