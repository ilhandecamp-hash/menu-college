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
  const overlayRef = useRef<HTMLDivElement>(null);

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
    document.body.style.overflow = "hidden";

    // Capture wheel at the overlay element level
    const overlay = overlayRef.current;
    if (overlay) {
      const handleWheel = (e: WheelEvent) => {
        e.preventDefault();
        e.stopPropagation();
        onClose();
      };
      overlay.addEventListener("wheel", handleWheel, { passive: false });
      return () => {
        document.removeEventListener("keydown", handleKey);
        overlay.removeEventListener("wheel", handleWheel);
        document.body.style.overflow = "";
      };
    }

    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [onClose, goNext, goPrev]);

  if (images.length === 0) return null;

  const hasThumbs = images.length > 1;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[100] bg-black/85 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
      onTouchEnd={(e) => {
        // Tap anywhere on overlay closes
        if (e.target === overlayRef.current) onClose();
      }}
      style={{ touchAction: "none" }}
    >
      {/* Close button — big, always visible */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
        className="fixed right-3 top-3 z-[110] flex items-center gap-2 rounded-full bg-white/25 px-4 py-2.5 text-white transition-all duration-300 hover:bg-white/40 hover:scale-105 active:scale-95"
        aria-label="Fermer"
      >
        <X size={20} />
        <span className="text-sm font-medium">Fermer</span>
      </button>

      {/* Counter */}
      {hasThumbs && (
        <div className="fixed top-3 left-1/2 z-[110] -translate-x-1/2 rounded-full bg-white/15 px-4 py-1.5 text-sm text-white/80 backdrop-blur-sm">
          {current + 1} / {images.length}
        </div>
      )}

      {/* Layout: full screen flex column */}
      <div className="flex h-full w-full flex-col items-center justify-center px-14 py-16">
        {/* Main image area */}
        <div
          className="flex flex-1 items-center justify-center overflow-hidden"
          style={{ maxHeight: hasThumbs ? "calc(100% - 80px)" : "100%" }}
          onClick={(e) => e.stopPropagation()}
        >
          <img
            src={images[current].fullSize}
            alt={images[current].alt}
            className="max-h-full max-w-full rounded-lg object-contain shadow-2xl"
          />
        </div>

        {/* Caption */}
        {images[current].alt && (
          <p className="mt-2 text-center text-sm text-white/60">
            {images[current].alt}
          </p>
        )}

        {/* Thumbnail strip */}
        {hasThumbs && (
          <div
            className="mt-3 flex gap-2 rounded-xl bg-white/10 p-2 backdrop-blur-sm"
            onClick={(e) => e.stopPropagation()}
          >
            {images.map((img, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`h-12 w-12 flex-shrink-0 overflow-hidden rounded-lg transition-all duration-300 ${
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

      {/* Navigation arrows — fixed to viewport */}
      {hasThumbs && (
        <>
          <button
            onClick={(e) => {
              e.stopPropagation();
              goPrev();
            }}
            className="fixed left-3 top-1/2 z-[110] -translate-y-1/2 rounded-full bg-white/15 p-3 text-white transition-all duration-300 hover:bg-white/30 hover:scale-110 active:scale-95"
            aria-label="Précédent"
          >
            <ChevronLeft size={26} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              goNext();
            }}
            className="fixed right-3 top-1/2 z-[110] -translate-y-1/2 rounded-full bg-white/15 p-3 text-white transition-all duration-300 hover:bg-white/30 hover:scale-110 active:scale-95"
            aria-label="Suivant"
          >
            <ChevronRight size={26} />
          </button>
        </>
      )}
    </div>
  );
}
