import { Redis } from "@upstash/redis";
import { unstable_noStore as noStore } from "next/cache";
import { readFileSync, writeFileSync, existsSync, mkdirSync } from "fs";
import path from "path";

export interface PageView {
  date: string; // YYYY-MM-DD
  count: number;
}

export interface AnalyticsData {
  totalViews: number;
  pageViews: PageView[];
  lastVisit: string;
}

const ANALYTICS_KEY = "site-analytics";
const ANALYTICS_PATH = path.join(process.cwd(), "data", "analytics.json");

const defaultAnalytics: AnalyticsData = {
  totalViews: 0,
  pageViews: [],
  lastVisit: "",
};

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

export async function getAnalytics(): Promise<AnalyticsData> {
  const redis = getRedis();
  if (redis) {
    noStore();
    try {
      const data = await redis.get<AnalyticsData>(ANALYTICS_KEY);
      if (data) return { ...defaultAnalytics, ...data };
    } catch {
      // Expected during build — silently fall back to defaults
    }
    return { ...defaultAnalytics, pageViews: [] };
  }

  // Fallback: file system (local dev)
  if (!existsSync(ANALYTICS_PATH)) {
    return { ...defaultAnalytics, pageViews: [] };
  }
  try {
    const raw = readFileSync(ANALYTICS_PATH, "utf-8");
    return { ...defaultAnalytics, ...JSON.parse(raw) };
  } catch {
    return { ...defaultAnalytics, pageViews: [] };
  }
}

export async function trackPageView(): Promise<void> {
  const redis = getRedis();
  if (redis) {
    noStore();
    try {
      const data = await getAnalytics();
      const today = new Date().toISOString().split("T")[0];

      data.totalViews += 1;
      data.lastVisit = new Date().toISOString();

      const existing = data.pageViews.find((pv) => pv.date === today);
      if (existing) {
        existing.count += 1;
      } else {
        data.pageViews.push({ date: today, count: 1 });
      }

      if (data.pageViews.length > 90) {
        data.pageViews = data.pageViews.slice(-90);
      }

      await redis.set(ANALYTICS_KEY, data);
    } catch {
      // Expected during build — silently ignore
    }
    return;
  }

  // Fallback: file system (local dev)
  try {
    const data = await getAnalytics();
    const today = new Date().toISOString().split("T")[0];

    data.totalViews += 1;
    data.lastVisit = new Date().toISOString();

    const existing = data.pageViews.find((pv) => pv.date === today);
    if (existing) {
      existing.count += 1;
    } else {
      data.pageViews.push({ date: today, count: 1 });
    }

    if (data.pageViews.length > 90) {
      data.pageViews = data.pageViews.slice(-90);
    }

    const dir = path.dirname(ANALYTICS_PATH);
    if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
    writeFileSync(ANALYTICS_PATH, JSON.stringify(data, null, 2), "utf-8");
  } catch {
    // Read-only filesystem — silently ignore
  }
}
