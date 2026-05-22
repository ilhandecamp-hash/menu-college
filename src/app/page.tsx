import {
  CalendarDays,
  HelpCircle,
  Newspaper,
  RefreshCw,
  UtensilsCrossed,
  Settings,
} from "lucide-react";
import MenuList from "@/components/MenuList";
import ArticleCard from "@/components/ArticleCard";
import FAQ from "@/components/FAQ";
import TabSwitcher from "@/components/TabSwitcher";
import ScrollReveal from "@/components/ScrollReveal";
import DarkModeToggle from "@/components/DarkModeToggle";
import PageViewTracker from "@/components/PageViewTracker";
import { getSettings } from "@/lib/settings";
import { scrapeMenus, scrapeArticles, MenuItem, ArticleItem } from "@/lib/scraper";

export const dynamic = "force-dynamic";

const MOIS: Record<string, number> = {
  janvier: 0, fevrier: 1, février: 1, mars: 2, avril: 3, mai: 4, juin: 5,
  juillet: 6, aout: 7, août: 7, septembre: 8, octobre: 9, novembre: 10,
  decembre: 11, décembre: 11,
};

function parseDateRange(title: string): { start: Date; end: Date } | null {
  const lower = title.toLowerCase();

  // Format: "30 mars au 03 avril 2026" (cross-month)
  const cross = lower.match(
    /(\d{1,2})\s+([a-zéûô]+)\s+au\s+(\d{1,2})\s+([a-zéûô]+)\s+(\d{4})/
  );
  if (cross) {
    const [, startDay, startMonth, endDay, endMonth, year] = cross;
    const sm = MOIS[startMonth];
    const em = MOIS[endMonth];
    if (sm !== undefined && em !== undefined) {
      return {
        start: new Date(+year, sm, +startDay),
        end: new Date(+year, em, +endDay, 23, 59, 59),
      };
    }
  }

  // Format: "23 au 27 mars 2026" (same month)
  const same = lower.match(
    /(\d{1,2})\s*au\s*(\d{1,2})\s+([a-zéûô]+)\s+(\d{4})/
  );
  if (same) {
    const [, startDay, endDay, month, year] = same;
    const m = MOIS[month];
    if (m !== undefined) {
      return {
        start: new Date(+year, m, +startDay),
        end: new Date(+year, m, +endDay, 23, 59, 59),
      };
    }
  }

  return null;
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
  const settings = await getSettings();
  let menus: MenuItem[] = [];
  let articles: ArticleItem[] = [];

  try {
    const [m, a] = await Promise.all([scrapeMenus(), scrapeArticles()]);
    menus = m;
    articles = a;
  } catch (e) {
    console.error("Failed to scrape:", e);
  }

  const sortedMenus = sortMenusByCurrentWeek(menus);

  const tabs = [
    {
      id: "menus",
      label: "Menus de la semaine",
      icon: <CalendarDays size={18} />,
      count: sortedMenus.length,
    },
    {
      id: "actus",
      label: "Actualités Cantine",
      icon: <Newspaper size={18} />,
      count: articles.length,
    },
    {
      id: "faq",
      label: "Infos Pratiques",
      icon: <HelpCircle size={18} />,
    },
  ];

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
            <img
              src="/logo.jpg"
              alt={`Logo ${settings.schoolName}`}
              className="mx-auto mb-5 h-24 w-auto drop-shadow-md transition-transform duration-300 hover:scale-105 sm:h-28"
            />
          </ScrollReveal>

          <ScrollReveal direction="scale" delay={50}>
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

        {/* ===== TABS ===== */}
        <ScrollReveal delay={300}>
          <section className="mb-12">
            <TabSwitcher tabs={tabs}>
              {/* Tab 1: Menus */}
              <div>
                <MenuList
                  menus={sortedMenus}
                  downloadText={settings.downloadButtonText}
                  emptyMessage={settings.emptyStateMessage}
                />
              </div>

              {/* Tab 2: Actualités */}
              <div>
                {articles.length === 0 ? (
                  <div className="py-16 text-center">
                    <Newspaper size={48} className="mx-auto mb-4 text-slate-300 animate-pulse-soft" />
                    <p className="text-sm text-slate-400">
                      Aucune actualité pour le moment.
                    </p>
                  </div>
                ) : (
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {articles.map((article, i) => (
                      <ArticleCard
                        key={article.url}
                        title={article.title}
                        url={article.url}
                        date={article.date}
                        images={article.images}
                        index={i}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Tab 3: FAQ */}
              <div>
                <FAQ items={settings.faqItems ?? []} />
              </div>
            </TabSwitcher>
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
            {settings.authorText && (
              <p className="mt-2 font-medium text-slate-500">
                {settings.authorText}
              </p>
            )}
          </footer>
        </ScrollReveal>
      </div>
    </div>
  );
}
