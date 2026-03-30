"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

interface GalleryImage {
  thumbnail: string;
  fullSize: string;
  alt: string;
}

interface ImageGalleryProps {
  images: GalleryImage[];
  initialIndex?: number;
  onClose: () => void;
}

export default function ImageGallery({
  images,
  initialIndex = 0,
  onClose,
}: ImageGalleryProps) {
  const [current, setCurrent] = useState(initialIndex);
  const scrollRef = useRef<HTMLDivElement>(null);

  const goNext = useCallback(() => {
    setCurrent((c) => (c + 1) % images.length);
    scrollRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  }, [images.length]);

  const goPrev = useCallback(() => {
    setCurrent((c) => (c - 1 + images.length) % images.length);
    scrollRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  }, [images.length]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") goNext();
      if (e.key === "ArrowLeft") goPrev();
    };
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [onClose, goNext, goPrev]);

  if (images.length === 0) return null;

  const hasThumbs = images.length > 1;

  return (
    <div className="fixed inset-0 z-[100] flex flex-col bg-black/85 backdrop-blur-sm animate-fade-in">
      {/* Top bar — always visible */}
      <div className="flex items-center justify-between px-4 py-3 flex-shrink-0">
        {/* Counter */}
        {hasThumbs ? (
          <span className="rounded-full bg-white/15 px-4 py-1.5 text-sm text-white/80">
            {current + 1} / {images.length}
          </span>
        ) : (
          <span />
        )}

        {/* Close button */}
        <button
          onClick={onClose}
          className="flex items-center gap-2 rounded-full bg-white/25 px-4 py-2 text-white transition-all duration-300 hover:bg-white/40 active:scale-95"
        >
          <X size={18} />
          <span className="text-sm font-medium">Fermer</span>
        </button>
      </div>

      {/* Scrollable image area */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto overflow-x-hidden"
        onClick={(e) => {
          // Click on the dark background (not the image) closes
          if (e.target === e.currentTarget) onClose();
        }}
      >
        <div className="flex min-h-full items-center justify-center px-4 py-4">
          <img
            src={images[current].fullSize}
            alt={images[current].alt}
            className="max-w-full rounded-lg shadow-2xl"
            style={{ maxWidth: "min(100%, 1200px)" }}
          />
        </div>
      </div>

      {/* Bottom bar — thumbnails + arrows */}
      <div className="flex items-center justify-center gap-3 px-4 py-3 flex-shrink-0">
        {/* Prev arrow */}
        {hasThumbs && (
          <button
            onClick={goPrev}
            className="rounded-full bg-white/15 p-2.5 text-white transition-all duration-300 hover:bg-white/30 active:scale-95"
            aria-label="Précédent"
          >
            <ChevronLeft size={22} />
          </button>
        )}

        {/* Thumbnail strip */}
        {hasThumbs && (
          <div className="flex gap-2 rounded-xl bg-white/10 p-1.5 backdrop-blur-sm overflow-x-auto">
            {images.map((img, i) => (
              <button
                key={i}
                onClick={() => {
                  setCurrent(i);
                  scrollRef.current?.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className={`h-11 w-11 flex-shrink-0 overflow-hidden rounded-lg transition-all duration-300 ${
                  i === current
                    ? "ring-2 ring-white scale-110"
                    : "opacity-50 hover:opacity-80"
                }`}
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

        {/* Next arrow */}
        {hasThumbs && (
          <button
            onClick={goNext}
            className="rounded-full bg-white/15 p-2.5 text-white transition-all duration-300 hover:bg-white/30 active:scale-95"
            aria-label="Suivant"
          >
            <ChevronRight size={22} />
          </button>
        )}
      </div>
    </div>
  );
}
