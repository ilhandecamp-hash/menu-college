import {
  CalendarDays,
  RefreshCw,
  UtensilsCrossed,
  Settings,
} from "lucide-react";
import MenuList from "@/components/MenuList";
import ScrollReveal from "@/components/ScrollReveal";
import DarkModeToggle from "@/components/DarkModeToggle";
import PageViewTracker from "@/components/PageViewTracker";
import { getSettings } from "@/lib/settings";
import { scrapeMenus, MenuItem } from "@/lib/scraper";

export const dynamic = "force-dynamic";

const MOIS: Record<string, number> = {
  janvier: 0, fevrier: 1, février: 1, mars: 2, avril: 3, mai: 4, juin: 5,
  juillet: 6, aout: 7, août: 7, septembre: 8, octobre: 9, novembre: 10,
  decembre: 11, décembre: 11,
};

function parseDateRange(title: string): { start: Date; end: Date } | null {
  const match = title
    .toLowerCase()
    .match(/(\d{1,2})\s*au\s*(\d{1,2})\s+([a-zéûô]+)\s+(\d{4})/);
  if (!match) return null;
  const [, startDay, endDay, month, year] = match;
  const m = MOIS[month];
  if (m === undefined) return null;
  return {
    start: new Date(+year, m, +startDay),
    end: new Date(+year, m, +endDay, 23, 59, 59),
  };
}

function sortMenusByCurrentWeek(menus: MenuItem[]): MenuItem[] {
  const today = new Date();
  today.setHours(12, 0, 0, 0);

  return [...menus].sort((a, b) => {
    const rangeA = parseDateRange(a.title);
    const rangeB = parseDateRange(b.title);
    if (!rangeA && !rangeB) return 0;
    if (!rangeA) return 1;
    if (!rangeB) return -1;

    const aContains = today >= rangeA.start && today <= rangeA.end;
    const bContains = today >= rangeB.start && today <= rangeB.end;
    if (aContains && !bContains) return -1;
    if (!aContains && bContains) return 1;

    const distA = Math.abs(rangeA.start.getTime() - today.getTime());
    const distB = Math.abs(rangeB.start.getTime() - today.getTime());
    return distA - distB;
  });
}

export default async function Home() {
  const settings = getSettings();
  let menus: MenuItem[] = [];
  try {
    menus = await scrapeMenus();
  } catch (e) {
    console.error("Failed to scrape menus:", e);
  }
  const sortedMenus = sortMenusByCurrentWeek(menus);

  return (
    <div className="relative min-h-screen overflow-hidden text-slate-800">
      <PageViewTracker />

      {/* Dark mode toggle - fixed top right */}
      <div className="fixed right-4 top-4 z-50">
        <DarkModeToggle />
      </div>

      {/* Background decorations */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className="absolute -left-32 -top-32 h-[500px] w-[500px] animate-float rounded-full blur-3xl"
          style={{ backgroundColor: "var(--blob-1)" }}
        />
        <div
          className="absolute -bottom-24 -right-24 h-96 w-96 animate-float rounded-full blur-3xl [animation-delay:3s]"
          style={{ backgroundColor: "var(--blob-2)" }}
        />
        <div
          className="absolute left-1/2 top-1/4 h-72 w-72 animate-float rounded-full blur-3xl [animation-delay:1.5s]"
          style={{ backgroundColor: "var(--blob-3)" }}
        />
        <div
          className="absolute right-1/4 top-2/3 h-56 w-56 animate-float rounded-full blur-3xl [animation-delay:4s]"
          style={{ backgroundColor: "var(--blob-4)" }}
        />
      </div>

      {/* Subtle dot pattern */}
      <div
        className="pointer-events-none absolute inset-0 opacity-30 dark:opacity-10"
        style={{
          backgroundImage:
            "radial-gradient(circle, #cbd5e1 0.8px, transparent 0.8px)",
          backgroundSize: "28px 28px",
        }}
      />

      <div className="relative z-10 mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Header */}
        <header className="mb-12 text-center">
          <ScrollReveal direction="scale" delay={0}>
            <div
              className="mb-5 inline-flex items-center gap-2 rounded-full bg-white/80 px-5 py-2 text-sm font-semibold shadow-sm backdrop-blur-sm transition-transform duration-300 hover:scale-105"
              style={{
                borderWidth: "1px",
                borderColor:
                  "color-mix(in srgb, var(--primary-light) 40%, transparent)",
                color: "var(--primary-dark)",
              }}
            >
              <UtensilsCrossed size={15} className="animate-bounce-in" />
              {settings.schoolName}
            </div>
          </ScrollReveal>

          <ScrollReveal delay={100}>
            <h1 className="mb-3 text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
              <span className="text-gradient-primary">{settings.pageTitle}</span>
            </h1>
          </ScrollReveal>

          <ScrollReveal delay={200}>
            <p className="mx-auto max-w-2xl text-base text-slate-500 sm:text-lg">
              {settings.subtitle}
            </p>
          </ScrollReveal>
        </header>

        {/* ===== MENUS ===== */}
        <ScrollReveal delay={300}>
          <section className="mb-12">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl text-white shadow-sm bg-primary-gradient transition-transform duration-300 hover:scale-110 hover:rotate-3">
                <CalendarDays size={20} />
              </div>
              <h2 className="text-xl font-bold text-slate-800">
                Menu de la semaine
              </h2>
            </div>

            <MenuList
              menus={sortedMenus}
              downloadText={settings.downloadButtonText}
              emptyMessage={settings.emptyStateMessage}
            />
          </section>
        </ScrollReveal>

        {/* Footer */}
        <ScrollReveal>
          <footer className="pb-6 text-center text-sm text-slate-400">
            <div className="mb-3 flex items-center justify-center gap-4">
              <div className="flex items-center gap-1.5">
                <RefreshCw size={12} className="animate-pulse-soft" style={{ color: "var(--primary)" }} />
                <span>{settings.footerText}</span>
              </div>
              <span className="text-slate-300">|</span>
              <a
                href="/admin"
                className="flex items-center gap-1 text-slate-400 transition-all duration-300 hover:text-slate-600 hover:scale-105"
              >
                <Settings size={12} />
                Admin
              </a>
            </div>
            <p>
              Source :{" "}
              <a
                href={settings.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="underline transition-colors hover:text-slate-600"
                style={{ color: "var(--primary)" }}
              >
                {settings.sourceLabel}
              </a>
            </p>
          </footer>
        </ScrollReveal>
      </div>
    </div>
  );
}
