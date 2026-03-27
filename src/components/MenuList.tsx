"use client";

import { useState } from "react";
import { Search, X } from "lucide-react";
import MenuCard from "./MenuCard";

interface MenuItem {
  title: string;
  url: string;
  filename: string;
}

const MOIS: Record<string, number> = {
  janvier: 0, fevrier: 1, février: 1, mars: 2, avril: 3, mai: 4, juin: 5,
  juillet: 6, aout: 7, août: 7, septembre: 8, octobre: 9, novembre: 10,
  decembre: 11, décembre: 11,
};

const MOIS_REVERSE: Record<number, string[]> = {
  0: ["janvier", "jan"],
  1: ["février", "fevrier", "fev", "fév"],
  2: ["mars", "mar"],
  3: ["avril", "avr"],
  4: ["mai"],
  5: ["juin"],
  6: ["juillet", "juil"],
  7: ["août", "aout"],
  8: ["septembre", "sep", "sept"],
  9: ["octobre", "oct"],
  10: ["novembre", "nov"],
  11: ["décembre", "decembre", "dec", "déc"],
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

function parseSearchDate(query: string): Date | null {
  const q = query.toLowerCase().trim();

  // "24 mars" ou "24 mars 2026"
  const match = q.match(/(\d{1,2})\s+([a-zéûô]+)(?:\s+(\d{4}))?/);
  if (match) {
    const [, day, monthStr, yearStr] = match;
    const m = MOIS[monthStr];
    if (m !== undefined) {
      const year = yearStr ? +yearStr : new Date().getFullYear();
      return new Date(year, m, +day);
    }
  }

  // "24/03" ou "24/03/2026"
  const slashMatch = q.match(/(\d{1,2})\/(\d{1,2})(?:\/(\d{2,4}))?/);
  if (slashMatch) {
    const [, day, month, yearStr] = slashMatch;
    let year = yearStr ? +yearStr : new Date().getFullYear();
    if (year < 100) year += 2000;
    return new Date(year, +month - 1, +day);
  }

  return null;
}

function menuMatchesQuery(menu: MenuItem, query: string): boolean {
  const q = query.toLowerCase().trim();
  if (!q) return true;

  const titleLower = menu.title.toLowerCase();
  const range = parseDateRange(menu.title);

  // "24 mars" ou "24/03" → date exacte dans la plage
  const searchDate = parseSearchDate(q);
  if (searchDate && range) {
    return searchDate >= range.start && searchDate <= range.end;
  }

  // Juste un nombre → vérifier si ce jour est dans la plage
  const justNumber = q.match(/^(\d{1,2})$/);
  if (justNumber && range) {
    const day = +justNumber[1];
    const startDay = range.start.getDate();
    const endDay = range.end.getDate();
    return day >= startDay && day <= endDay;
  }

  // Juste un mois (ex: "mars", "avr", "avril") → vérifier si le mois correspond
  const monthNum = findMonth(q);
  if (monthNum !== null && range) {
    return range.start.getMonth() === monthNum;
  }

  // Recherche textuelle dans le titre
  return titleLower.includes(q);
}

function findMonth(q: string): number | null {
  for (const [num, names] of Object.entries(MOIS_REVERSE)) {
    if (names.some((n) => n === q || n.startsWith(q) || q.startsWith(n))) {
      return +num;
    }
  }
  return null;
}

interface MenuListProps {
  menus: MenuItem[];
  downloadText: string;
  emptyMessage: string;
}

export default function MenuList({ menus, downloadText, emptyMessage }: MenuListProps) {
  const [query, setQuery] = useState("");

  const filtered = menus.filter((m) => menuMatchesQuery(m, query));

  return (
    <div>
      {/* Barre de recherche */}
      <div className="relative mb-6 group">
        <Search
          size={18}
          className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 transition-all duration-300 group-focus-within:text-primary group-focus-within:scale-110"
          style={{ color: undefined }}
        />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Rechercher... (ex: 24 mars, mars, 15, 10/04)"
          className="w-full rounded-xl border border-white/60 bg-white/70 py-3 pl-11 pr-10 text-sm text-slate-800 shadow-sm backdrop-blur-sm placeholder:text-slate-400 transition-all duration-300 focus:border-slate-300 focus:bg-white/90 focus:outline-none focus:ring-2 focus:ring-slate-200 focus:shadow-lg focus:scale-[1.01]"
        />
        {query && (
          <button
            onClick={() => setQuery("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-slate-400 transition-all duration-300 hover:text-slate-600 hover:rotate-90 hover:scale-110"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {/* Résultats */}
      {filtered.length > 0 ? (
        <div className="space-y-8">
          {filtered.map((menu, i) => (
            <MenuCard
              key={menu.url}
              title={menu.title}
              url={menu.url}
              index={i}
              downloadText={downloadText}
            />
          ))}
        </div>
      ) : (
        <div className="animate-scale-in rounded-2xl border border-white/60 bg-white/60 p-10 text-center shadow-sm backdrop-blur-md">
          <Search size={44} className="mx-auto mb-3 text-slate-300 animate-pulse-soft" />
          <p className="text-base text-slate-500">
            {query
              ? `Aucun menu trouvé pour "${query}"`
              : emptyMessage}
          </p>
        </div>
      )}
    </div>
  );
}
