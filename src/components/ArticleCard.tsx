"use client";

import { ExternalLink, Calendar } from "lucide-react";
import { useRef, useState, useEffect } from "react";

interface ArticleCardProps {
  title: string;
  url: string;
  date: string;
  index: number;
}

export default function ArticleCard({ title, url, date, index }: ArticleCardProps) {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.05, rootMargin: "0px 0px -20px 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`group overflow-hidden rounded-2xl border border-white/60 bg-white/70 shadow-md backdrop-blur-md transition-all duration-700 hover-lift hover-glow ${
        visible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
      }`}
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      {/* Top gradient bar with shimmer */}
      <div className="relative h-1.5 overflow-hidden bg-primary-gradient">
        <div className="absolute inset-0 shimmer-bg" />
      </div>

      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="block p-5"
      >
        <h3 className="mb-3 text-base font-semibold text-slate-800 transition-colors duration-300 group-hover:text-[var(--primary-dark)]">
          {title}
        </h3>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <Calendar size={13} />
            <span>{date}</span>
          </div>

          <span
            className="inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-medium text-white transition-all duration-300 group-hover:shadow-md group-hover:scale-105 bg-primary-gradient"
          >
            <ExternalLink size={12} />
            Voir
          </span>
        </div>
      </a>
    </div>
  );
}
