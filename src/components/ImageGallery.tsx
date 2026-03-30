"use client";

import { useState, useEffect, useCallback } from "react";
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

  const goNext = useCallback(() => {
    setCurrent((c) => (c + 1) % images.length);
    window.scrollTo({ top: 0 });
  }, [images.length]);

  const goPrev = useCallback(() => {
    setCurrent((c) => (c - 1 + images.length) % images.length);
    window.scrollTo({ top: 0 });
  }, [images.length]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") goNext();
      if (e.key === "ArrowLeft") goPrev();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose, goNext, goPrev]);

  if (images.length === 0) return null;

  const hasThumbs = images.length > 1;

  return (
    <>
      {/* Fixed controls — always on screen */}
      <div className="fixed inset-x-0 top-0 z-[120] flex items-center justify-between px-4 py-3 bg-gradient-to-b from-black/70 to-transparent pointer-events-none">
        {hasThumbs ? (
          <span className="rounded-full bg-white/20 px-4 py-1.5 text-sm text-white pointer-events-auto">
            {current + 1} / {images.length}
          </span>
        ) : (
          <span />
        )}
        <button
          onClick={onClose}
          className="flex items-center gap-2 rounded-full bg-white/25 px-4 py-2 text-white transition-all hover:bg-white/40 active:scale-95 pointer-events-auto"
        >
          <X size={18} />
          <span className="text-sm font-medium">Fermer</span>
        </button>
      </div>

      {/* Fixed bottom bar */}
      {hasThumbs && (
        <div className="fixed inset-x-0 bottom-0 z-[120] flex items-center justify-center gap-3 px-4 py-3 bg-gradient-to-t from-black/70 to-transparent pointer-events-none">
          <button
            onClick={goPrev}
            className="rounded-full bg-white/20 p-2.5 text-white transition-all hover:bg-white/30 active:scale-95 pointer-events-auto"
          >
            <ChevronLeft size={22} />
          </button>

          <div className="flex gap-2 rounded-xl bg-white/10 p-1.5 backdrop-blur-sm overflow-x-auto pointer-events-auto">
            {images.map((img, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
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

          <button
            onClick={goNext}
            className="rounded-full bg-white/20 p-2.5 text-white transition-all hover:bg-white/30 active:scale-95 pointer-events-auto"
          >
            <ChevronRight size={22} />
          </button>
        </div>
      )}

      {/* Scrollable overlay with image */}
      <div
        className="fixed inset-0 z-[110] overflow-y-auto bg-black/90 animate-fade-in"
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
      >
        <div className="flex min-h-full items-start justify-center px-4 pt-16 pb-24">
          <img
            src={images[current].fullSize}
            alt={images[current].alt}
            className="rounded-lg shadow-2xl"
            style={{ maxWidth: "min(95vw, 1200px)" }}
          />
        </div>
      </div>
    </>
  );
}
