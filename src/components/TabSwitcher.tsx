"use client";

import { useState, ReactNode } from "react";

interface Tab {
  id: string;
  label: string;
  icon: ReactNode;
  count?: number;
}

interface TabSwitcherProps {
  tabs: Tab[];
  children: ReactNode[];
}

export default function TabSwitcher({ tabs, children }: TabSwitcherProps) {
  const [activeTab, setActiveTab] = useState(tabs[0]?.id || "");

  return (
    <div>
      {/* Tab buttons */}
      <div className="mb-6 flex gap-2 rounded-xl bg-white/50 p-1.5 backdrop-blur-sm border border-white/60 shadow-sm">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition-all duration-300 ${
              activeTab === tab.id
                ? "bg-primary-gradient text-white shadow-md scale-[1.02]"
                : "text-slate-500 hover:text-slate-700 hover:bg-white/80"
            }`}
          >
            <span className={`transition-transform duration-300 ${activeTab === tab.id ? "scale-110" : ""}`}>
              {tab.icon}
            </span>
            <span className="hidden sm:inline">{tab.label}</span>
            {tab.count !== undefined && tab.count > 0 && (
              <span
                className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold leading-none transition-colors duration-300 ${
                  activeTab === tab.id
                    ? "bg-white/25 text-white"
                    : "bg-slate-100 text-slate-400"
                }`}
              >
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {tabs.map((tab, i) => (
        <div
          key={tab.id}
          className={`transition-all duration-500 ${
            activeTab === tab.id
              ? "animate-slide-down opacity-100"
              : "hidden"
          }`}
        >
          {children[i]}
        </div>
      ))}
    </div>
  );
}
