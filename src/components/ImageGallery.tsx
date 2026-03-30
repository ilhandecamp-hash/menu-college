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
  }, [images.length]);

  const goPrev = useCallback(() => {
    setCurrent((c) => (c - 1 + images.length) % images.length);
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
    <div
      className="fixed inset-0 z-[110] flex items-center justify-center bg-black/90 animate-fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {/* Close button — top right */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-[130] flex items-center gap-2 rounded-full bg-white/25 px-4 py-2 text-white transition-all hover:bg-white/40 active:scale-95"
      >
        <X size={18} />
        <span className="text-sm font-medium">Fermer</span>
      </button>

      {/* Counter — top left */}
      {hasThumbs && (
        <span className="absolute top-4 left-4 z-[130] rounded-full bg-white/20 px-4 py-1.5 text-sm text-white">
          {current + 1} / {images.length}
        </span>
      )}

      {/* Left arrow — side of image */}
      {hasThumbs && (
        <button
          onClick={goPrev}
          className="absolute left-3 top-1/2 -translate-y-1/2 z-[130] rounded-full bg-white/20 p-3 text-white transition-all hover:bg-white/30 active:scale-95 sm:left-6"
        >
          <ChevronLeft size={24} />
        </button>
      )}

      {/* Right arrow — side of image */}
      {hasThumbs && (
        <button
          onClick={goNext}
          className="absolute right-3 top-1/2 -translate-y-1/2 z-[130] rounded-full bg-white/20 p-3 text-white transition-all hover:bg-white/30 active:scale-95 sm:right-6"
        >
          <ChevronRight size={24} />
        </button>
      )}

      {/* Centered image + thumbnails */}
      <div className="flex flex-col items-center gap-4 px-16 max-h-[92vh] overflow-y-auto">
        <img
          src={images[current].fullSize}
          alt={images[current].alt}
          className="rounded-lg shadow-2xl"
          style={{
            maxWidth: "min(75vw, 850px)",
            maxHeight: "75vh",
            objectFit: "contain",
          }}
        />

        {/* Thumbnails row */}
        {hasThumbs && (
          <div className="flex gap-2 rounded-xl bg-white/10 p-1.5 backdrop-blur-sm overflow-x-auto flex-shrink-0">
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
        )}
      </div>
    </div>
  );
}
