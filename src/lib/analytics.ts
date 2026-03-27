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

const ANALYTICS_PATH = path.join(process.cwd(), "data", "analytics.json");

const defaultAnalytics: AnalyticsData = {
  totalViews: 0,
  pageViews: [],
  lastVisit: "",
};

export function getAnalytics(): AnalyticsData {
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

export function trackPageView(): void {
  const data = getAnalytics();
  const today = new Date().toISOString().split("T")[0];

  data.totalViews += 1;
  data.lastVisit = new Date().toISOString();

  const existing = data.pageViews.find((pv) => pv.date === today);
  if (existing) {
    existing.count += 1;
  } else {
    data.pageViews.push({ date: today, count: 1 });
  }

  // Keep only the last 90 days
  if (data.pageViews.length > 90) {
    data.pageViews = data.pageViews.slice(-90);
  }

  const dir = path.dirname(ANALYTICS_PATH);
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }
  writeFileSync(ANALYTICS_PATH, JSON.stringify(data, null, 2), "utf-8");
}
