"use client";

import Image from "next/image";
import { useState } from "react";

import type { GalleryImage } from "@/lib/content/product-page";

export default function ProductGallery({ images }: { images: GalleryImage[] }) {
  const [active, setActive] = useState(0);
  const current = images[active];
  const overlay = current.overlay;

  return (
    <div className="flex flex-col gap-4">
      <div className="group relative aspect-square w-full overflow-hidden rounded-[1.75rem] border border-[var(--color-brand-border)] bg-gradient-to-br from-[#e8f2ff] via-white to-[#fdf8ee] shadow-[0_28px_70px_-28px_rgba(26,86,219,0.55)] ring-1 ring-black/[0.04]">
        <div className="pointer-events-none absolute inset-2 rounded-[1.35rem] border border-white/80" />
        <Image
          src={current.src}
          alt={current.alt}
          fill
          className="object-cover transition duration-500 group-hover:scale-[1.02]"
          sizes="(max-width: 768px) 100vw, 50vw"
          priority
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0f1c2e]/85 via-[#0f1c2e]/15 to-transparent" />
        {overlay && (
          <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6 text-right text-white">
            {overlay.kicker && (
              <p className="mb-1.5 text-[11px] font-bold uppercase tracking-[0.25em] text-[#c9a44a]/95 sm:text-xs">
                {overlay.kicker}
              </p>
            )}
            <p className="text-balance text-xl font-black leading-snug sm:text-2xl">{overlay.title}</p>
            {overlay.subtitle && (
              <p className="mt-2 max-w-prose text-pretty text-sm leading-relaxed text-white/90">{overlay.subtitle}</p>
            )}
          </div>
        )}
      </div>

      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-2 sm:gap-3">
          {images.map((img, i) => (
            <button
              key={`${typeof img.src === "string" ? img.src : "local"}-${i}`}
              type="button"
              onClick={() => setActive(i)}
              aria-label={img.alt || img.thumbLabel || `صورة ${i + 1}`}
              className={`relative aspect-square overflow-hidden rounded-2xl border-2 transition-all ${
                i === active
                  ? "border-[var(--color-brand-primary)] shadow-lg ring-2 ring-[var(--color-brand-primary)]/30"
                  : "border-[var(--color-brand-border)] hover:border-[var(--color-brand-primary)]/40"
              }`}
            >
              <Image src={img.src} alt="" fill className="object-cover" sizes="96px" />
              {img.thumbLabel && (
                <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent py-2 text-center text-[10px] font-bold text-white sm:text-[11px]">
                  {img.thumbLabel}
                </span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
