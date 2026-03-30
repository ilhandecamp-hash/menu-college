"use client";

import { ExternalLink, Calendar, Camera } from "lucide-react";
import { useRef, useState, useEffect } from "react";
import ImageGallery from "./ImageGallery";

interface ArticleImage {
  thumbnail: string;
  fullSize: string;
  alt: string;
}

interface ArticleCardProps {
  title: string;
  url: string;
  date: string;
  images: ArticleImage[];
  index: number;
}

export default function ArticleCard({
  title,
  url,
  date,
  images,
  index,
}: ArticleCardProps) {
  const [visible, setVisible] = useState(false);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [galleryIndex, setGalleryIndex] = useState(0);
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

  const hasImages = images.length > 0;

  return (
    <>
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

        {/* Hero image */}
        {hasImages && (
          <button
            onClick={() => {
              setGalleryIndex(0);
              setGalleryOpen(true);
            }}
            className="relative block w-full overflow-hidden cursor-pointer"
          >
            <img
              src={images[0].fullSize}
              alt={images[0].alt || title}
              className="h-44 w-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
            {/* Photo count badge */}
            {images.length > 1 && (
              <span className="absolute bottom-2 right-2 inline-flex items-center gap-1 rounded-full bg-black/50 px-2.5 py-1 text-xs font-medium text-white backdrop-blur-sm">
                <Camera size={12} />
                {images.length} photos
              </span>
            )}
          </button>
        )}

        {/* Content */}
        <div className="p-4">
          <h3 className="mb-3 text-sm font-semibold text-slate-800 leading-snug transition-colors duration-300 group-hover:text-[var(--primary-dark)]">
            {title}
          </h3>

          {/* Image thumbnails row */}
          {images.length > 1 && (
            <div className="mb-3 flex gap-1.5 overflow-x-auto pb-1">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setGalleryIndex(i);
                    setGalleryOpen(true);
                  }}
                  className="h-12 w-12 flex-shrink-0 overflow-hidden rounded-lg transition-all duration-300 hover:scale-110 hover:ring-2 hover:ring-[var(--primary)]"
                >
                  <img
                    src={img.thumbnail}
                    alt={img.alt}
                    className="h-full w-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs text-slate-400">
              <Calendar size={13} />
              <span>{date}</span>
            </div>

            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-medium text-white transition-all duration-300 hover:shadow-md hover:scale-105 bg-primary-gradient"
            >
              <ExternalLink size={12} />
              Voir
            </a>
          </div>
        </div>
      </div>

      {/* Lightbox gallery */}
      {galleryOpen && (
        <ImageGallery
          images={images}
          initialIndex={galleryIndex}
          onClose={() => setGalleryOpen(false)}
        />
      )}
    </>
  );
}
