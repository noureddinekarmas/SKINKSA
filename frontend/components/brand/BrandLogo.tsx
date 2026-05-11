import { useId } from "react";

type Variant = "header" | "footer";

/**
 * شعار رسومي (قطرة/إشراق) — بدون حرف كرمز.
 * السطر الذهبي: جمالك الآن
 */
export function BrandLogoLockup({ variant = "header", className = "" }: { variant?: Variant; className?: string }) {
  const uid = useId().replace(/:/g, "");
  const gradId = `sk-logo-grad-${uid}`;
  const isFooter = variant === "footer";

  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <svg
        className="h-9 w-9 shrink-0"
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden
      >
        <defs>
          <linearGradient id={gradId} x1="8" y1="6" x2="34" y2="36" gradientUnits="userSpaceOnUse">
            <stop stopColor={isFooter ? "#3b82f6" : "#1a56db"} />
            <stop offset="1" stopColor={isFooter ? "#60a5fa" : "#2563eb"} />
          </linearGradient>
        </defs>
        {/* قطرة ناعمة + هالة — مرجع منتجات العناية */}
        <path
          d="M20 3.5c-.8 0-1.5.4-1.9 1.1-2.1 3.6-6.8 11.2-8.9 16.8C8.5 24.6 8 26.8 8 29c0 6.6 5.4 12 12 12s12-5.4 12-12c0-2.2-.5-4.4-1.2-7.6-2.1-5.6-6.8-13.2-8.9-16.8-.4-.7-1.1-1.1-1.9-1.1z"
          fill={`url(#${gradId})`}
        />
        <path
          d="M20 11.5c-3.2 3.8-6 9-6 13 0 3.3 2.7 6 6 6s6-2.7 6-6c0-4-2.8-9.2-6-13z"
          fill="white"
          fillOpacity={isFooter ? 0.2 : 0.22}
        />
        <ellipse cx="20" cy="26" rx="3" ry="2" fill="white" fillOpacity={isFooter ? 0.35 : 0.4} />
      </svg>
      <span className="flex flex-col items-start leading-none">
        <span
          className={`text-[15px] font-bold tracking-[0.12em] sm:text-base ${
            isFooter ? "text-white" : "text-[#1a56db]"
          }`}
        >
          SKINKSA
        </span>
        <span className="mt-1 text-[10px] font-semibold tracking-[0.18em] text-[#c9a44a] sm:text-[11px]">
          جمالك الآن
        </span>
      </span>
    </span>
  );
}
