import { Redis } from "@upstash/redis";
import { unstable_noStore as noStore } from "next/cache";
import { readFileSync, writeFileSync, existsSync, mkdirSync } from "fs";
import path from "path";

// --- Site Settings ---

export interface SiteSettings {
  schoolName: string;
  pageTitle: string;
  subtitle: string;
  sourceUrl: string;
  sourceLabel: string;
  primaryColor: string;
  footerText: string;
  emptyStateMessage: string;
  downloadButtonText: string;
  // SEO
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string;
  ogImageUrl: string;
  siteUrl: string;
  language: string;
  authorText: string;
}

export const defaultSettings: SiteSettings = {
  schoolName: "Collège Robert Schuman — Amilly",
  pageTitle: "Menus de la Cantine",
  subtitle:
    "Retrouvez les menus de la semaine au format PDF, mis à jour automatiquement depuis le site du collège.",
  sourceUrl:
    "https://clg-rschuman-amilly.tice.ac-orleans-tours.fr/eva/spip.php?article709",
  sourceLabel: "clg-rschuman-amilly.tice.ac-orleans-tours.fr",
  primaryColor: "warm",
  footerText: "Données récupérées en temps réel",
  emptyStateMessage: "Aucun menu disponible pour le moment.",
  downloadButtonText: "Télécharger",
  metaTitle: "Menus Cantine — Collège Robert Schuman Amilly",
  metaDescription:
    "Consultez les menus de la cantine du Collège Robert Schuman d'Amilly. Menus de la semaine en PDF, mis à jour automatiquement.",
  metaKeywords:
    "menu cantine, collège Robert Schuman, Amilly, menus semaine, cantine scolaire, restauration scolaire",
  ogImageUrl: "",
  siteUrl: "",
  language: "fr",
  authorText: "Fait par DECAMP Ilhan 6G",
};

// --- Color Themes ---

export interface ColorTheme {
  key: string;
  label: string;
  preview: string;
  vars: Record<string, string>;
}

export const colorThemes: Record<string, ColorTheme> = {
  warm: {
    key: "warm",
    label: "Chaud (Orange)",
    preview: "#ff9f1c",
    vars: {
      "--primary": "#ff9f1c",
      "--primary-light": "#ffb347",
      "--primary-dark": "#e8890a",
      "--primary-50": "#fffbf5",
      "--primary-100": "#fff4e6",
      "--primary-200": "#ffe8cc",
      "--gradient-from": "#ffb347",
      "--gradient-to": "#f97316",
      "--gradient-text-from": "#ff9f1c",
      "--gradient-text-via": "#f97316",
      "--gradient-text-to": "#f59e0b",
      "--blob-1": "rgba(255, 214, 165, 0.4)",
      "--blob-2": "rgba(187, 247, 208, 0.5)",
      "--blob-3": "rgba(186, 230, 253, 0.4)",
      "--blob-4": "rgba(255, 232, 204, 0.3)",
      "--selection-bg": "rgba(255, 159, 28, 0.25)",
      "--body-gradient":
        "linear-gradient(135deg, #fffbf5 0%, #f0f9ff 50%, #f0fdf4 100%)",
    },
  },
  ocean: {
    key: "ocean",
    label: "Océan (Bleu)",
    preview: "#0ea5e9",
    vars: {
      "--primary": "#0ea5e9",
      "--primary-light": "#38bdf8",
      "--primary-dark": "#0284c7",
      "--primary-50": "#f0f9ff",
      "--primary-100": "#e0f2fe",
      "--primary-200": "#bae6fd",
      "--gradient-from": "#38bdf8",
      "--gradient-to": "#3b82f6",
      "--gradient-text-from": "#0ea5e9",
      "--gradient-text-via": "#3b82f6",
      "--gradient-text-to": "#6366f1",
      "--blob-1": "rgba(125, 211, 252, 0.4)",
      "--blob-2": "rgba(147, 197, 253, 0.5)",
      "--blob-3": "rgba(187, 247, 208, 0.4)",
      "--blob-4": "rgba(186, 230, 253, 0.3)",
      "--selection-bg": "rgba(14, 165, 233, 0.25)",
      "--body-gradient":
        "linear-gradient(135deg, #f0f9ff 0%, #eff6ff 50%, #f0fdf4 100%)",
    },
  },
  forest: {
    key: "forest",
    label: "Forêt (Vert)",
    preview: "#22c55e",
    vars: {
      "--primary": "#22c55e",
      "--primary-light": "#4ade80",
      "--primary-dark": "#16a34a",
      "--primary-50": "#f0fdf4",
      "--primary-100": "#dcfce7",
      "--primary-200": "#bbf7d0",
      "--gradient-from": "#4ade80",
      "--gradient-to": "#10b981",
      "--gradient-text-from": "#22c55e",
      "--gradient-text-via": "#10b981",
      "--gradient-text-to": "#14b8a6",
      "--blob-1": "rgba(134, 239, 172, 0.4)",
      "--blob-2": "rgba(167, 243, 208, 0.5)",
      "--blob-3": "rgba(186, 230, 253, 0.4)",
      "--blob-4": "rgba(187, 247, 208, 0.3)",
      "--selection-bg": "rgba(34, 197, 94, 0.25)",
      "--body-gradient":
        "linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 50%, #f0f9ff 100%)",
    },
  },
  violet: {
    key: "violet",
    label: "Violet",
    preview: "#8b5cf6",
    vars: {
      "--primary": "#8b5cf6",
      "--primary-light": "#a78bfa",
      "--primary-dark": "#7c3aed",
      "--primary-50": "#faf5ff",
      "--primary-100": "#f3e8ff",
      "--primary-200": "#e9d5ff",
      "--gradient-from": "#a78bfa",
      "--gradient-to": "#8b5cf6",
      "--gradient-text-from": "#8b5cf6",
      "--gradient-text-via": "#a855f7",
      "--gradient-text-to": "#d946ef",
      "--blob-1": "rgba(196, 181, 253, 0.4)",
      "--blob-2": "rgba(233, 213, 255, 0.5)",
      "--blob-3": "rgba(245, 208, 254, 0.4)",
      "--blob-4": "rgba(221, 214, 254, 0.3)",
      "--selection-bg": "rgba(139, 92, 246, 0.25)",
      "--body-gradient":
        "linear-gradient(135deg, #faf5ff 0%, #f5f3ff 50%, #fdf2f8 100%)",
    },
  },
  rose: {
    key: "rose",
    label: "Rose",
    preview: "#f43f5e",
    vars: {
      "--primary": "#f43f5e",
      "--primary-light": "#fb7185",
      "--primary-dark": "#e11d48",
      "--primary-50": "#fff1f2",
      "--primary-100": "#ffe4e6",
      "--primary-200": "#fecdd3",
      "--gradient-from": "#fb7185",
      "--gradient-to": "#f43f5e",
      "--gradient-text-from": "#f43f5e",
      "--gradient-text-via": "#ec4899",
      "--gradient-text-to": "#d946ef",
      "--blob-1": "rgba(253, 164, 175, 0.4)",
      "--blob-2": "rgba(251, 207, 232, 0.5)",
      "--blob-3": "rgba(245, 208, 254, 0.4)",
      "--blob-4": "rgba(254, 205, 211, 0.3)",
      "--selection-bg": "rgba(244, 63, 94, 0.25)",
      "--body-gradient":
        "linear-gradient(135deg, #fff1f2 0%, #fdf2f8 50%, #faf5ff 100%)",
    },
  },
};

// --- Redis / File I/O ---

const SETTINGS_KEY = "site-settings";
const SETTINGS_PATH = path.join(process.cwd(), "data", "settings.json");

function getRedis(): Redis | null {
  if (
    !process.env.UPSTASH_REDIS_REST_URL ||
    !process.env.UPSTASH_REDIS_REST_TOKEN
  ) {
    return null;
  }
  return new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
  });
}

export async function getSettings(): Promise<SiteSettings> {
  // Try Redis first (Vercel)
  const redis = getRedis();
  if (redis) {
    noStore(); // Tell Next.js this is dynamic before the fetch
    try {
      const data = await redis.get<SiteSettings>(SETTINGS_KEY);
      if (data) return { ...defaultSettings, ...data };
    } catch {
      // Expected during build — silently fall back to defaults
    }
    return { ...defaultSettings };
  }

  // Fallback: file system (local dev)
  try {
    if (!existsSync(SETTINGS_PATH)) {
      try {
        const dir = path.dirname(SETTINGS_PATH);
        if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
        writeFileSync(
          SETTINGS_PATH,
          JSON.stringify(defaultSettings, null, 2),
          "utf-8"
        );
      } catch {
        // Read-only filesystem
      }
      return { ...defaultSettings };
    }
    const raw = readFileSync(SETTINGS_PATH, "utf-8");
    return { ...defaultSettings, ...JSON.parse(raw) };
  } catch {
    return { ...defaultSettings };
  }
}

export async function saveSettings(settings: SiteSettings): Promise<void> {
  // Try Redis first (Vercel)
  const redis = getRedis();
  if (redis) {
    noStore();
    await redis.set(SETTINGS_KEY, settings);
    return;
  }

  // Fallback: file system (local dev)
  const dir = path.dirname(SETTINGS_PATH);
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
  writeFileSync(SETTINGS_PATH, JSON.stringify(settings, null, 2), "utf-8");
}
