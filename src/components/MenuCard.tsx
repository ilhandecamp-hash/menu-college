"use client";

import { Download, FileText, ExternalLink } from "lucide-react";
import { useState, useRef, useEffect } from "react";

interface MenuCardProps {
  title: string;
  url: string;
  index: number;
  downloadText: string;
}

export default function MenuCard({ title, url, index, downloadText }: MenuCardProps) {
  const [loadError, setLoadError] = useState(false);
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
      className={`overflow-hidden rounded-2xl border border-white/60 bg-white/70 shadow-lg backdrop-blur-md transition-all duration-700 hover-lift hover-glow ${
        visible
          ? "translate-y-0 opacity-100"
          : "translate-y-10 opacity-0"
      }`}
      style={{ transitionDelay: `${index * 120}ms` }}
    >
      {/* Top gradient bar with shimmer */}
      <div className="relative h-1.5 overflow-hidden bg-primary-gradient">
        <div className="absolute inset-0 shimmer-bg" />
      </div>

      {/* Title bar */}
      <div className="flex items-center gap-3 border-b border-slate-100 px-5 py-3">
        <div
          className="flex h-9 w-9 items-center justify-center rounded-lg transition-transform duration-300 hover:scale-110 hover:rotate-6"
          style={{
            backgroundColor: "var(--primary-100)",
            color: "var(--primary-dark)",
          }}
        >
          <FileText size={18} />
        </div>
        <h3 className="flex-1 text-base font-semibold text-slate-800">
          {title}
        </h3>
        <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-0.5 text-xs font-medium text-slate-400 transition-all duration-300 hover:bg-primary-gradient hover:text-white hover:border-transparent">
          PDF
        </span>
      </div>

      {/* PDF Preview */}
      <div className="relative bg-slate-50">
        {!loadError ? (
          <iframe
            src={`${url}#navpanes=0&view=Fit`}
            title={title}
            className="h-[600px] w-full border-0 sm:h-[750px] lg:h-[900px]"
            onError={() => setLoadError(true)}
          />
        ) : (
          <div className="flex h-[400px] flex-col items-center justify-center gap-4 p-8 text-center">
            <FileText size={48} className="text-slate-300 animate-pulse-soft" />
            <div>
              <p className="text-sm font-medium text-slate-500">
                L&apos;aperçu n&apos;est pas disponible
              </p>
              <p className="mt-1 text-xs text-slate-400">
                Utilisez le bouton ci-dessous pour ouvrir le PDF
              </p>
            </div>
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition-all duration-300 hover:bg-slate-100 hover:scale-105"
            >
              <ExternalLink size={14} />
              Ouvrir dans un nouvel onglet
            </a>
          </div>
        )}
      </div>

      {/* Download bar */}
      <div className="flex items-center justify-between border-t border-slate-100 px-5 py-3">
        <p className="hidden text-xs text-slate-400 sm:block">
          Cliquez pour télécharger le PDF
        </p>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="group inline-flex w-full items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-all duration-300 hover:shadow-lg hover:scale-[1.02] active:scale-95 bg-primary-gradient bg-primary-gradient-hover sm:w-auto"
        >
          <Download size={16} className="transition-transform duration-300 group-hover:animate-bounce" />
          {downloadText}
        </a>
      </div>
    </div>
  );
}
