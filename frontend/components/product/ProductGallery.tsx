"use client";

import Image from "next/image";
import { useState } from "react";

import type { GalleryImage } from "@/lib/content/product-page";
import { cn } from "@/lib/utils";

type GalleryVariant = "marketing" | "storefront";

export default function ProductGallery({
  images,
  variant = "storefront",
}: {
  images: GalleryImage[];
  variant?: GalleryVariant;
}) {
  const [active, setActive] = useState(0);
  const current = images[active];
  const overlay = variant === "marketing" ? current.overlay : undefined;
  const single = images.length <= 1;
  const isClean = variant === "storefront";

  return (
    <div className="flex flex-col gap-3">
      <div
        className={cn(
          "relative w-full overflow-hidden bg-white",
          isClean
            ? "aspect-square rounded-2xl border border-neutral-200 p-6 sm:p-8"
            : cn(
                "group rounded-[1.75rem] border border-[var(--color-brand-border)] bg-gradient-to-br from-[#e8f2ff] via-white to-[#fdf8ee] shadow-[0_28px_70px_-28px_rgba(26,86,219,0.55)] ring-1 ring-black/[0.04]",
                single ? "aspect-[3/4] sm:aspect-[4/5] md:aspect-square" : "aspect-square"
              )
        )}
      >
        {!isClean && (
          <div className="pointer-events-none absolute inset-2 rounded-[1.35rem] border border-white/80" />
        )}
        <Image
          src={current.src}
          alt={current.alt}
          fill
          className={cn(
            "transition duration-300",
            isClean ? "object-contain object-center" : "object-cover object-center group-hover:scale-[1.02]"
          )}
          sizes={single ? "(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 640px" : "(max-width: 768px) 100vw, 50vw"}
          priority
        />
        {!isClean && (
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[58%] bg-gradient-to-t from-[#0f1c2e]/92 via-[#0f1c2e]/35 to-transparent" />
        )}
        {overlay && (
          <div className="absolute inset-x-0 bottom-0 p-5 text-right text-white sm:p-6">
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
        <div className="grid grid-cols-4 gap-2">
          {images.map((img, i) => (
            <button
              key={`${typeof img.src === "string" ? img.src : "local"}-${i}`}
              type="button"
              onClick={() => setActive(i)}
              aria-label={img.alt || img.thumbLabel || `صورة ${i + 1}`}
              className={cn(
                "relative aspect-square overflow-hidden rounded-lg border transition",
                i === active ? "border-neutral-900 ring-1 ring-neutral-900" : "border-neutral-200 hover:border-neutral-400"
              )}
            >
              <Image src={img.src} alt="" fill className="object-cover" sizes="96px" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
