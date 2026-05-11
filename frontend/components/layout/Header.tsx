"use client";

import Link from "next/link";
import { ShoppingBag, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { useCartStore } from "@/lib/cart/store";

const navLinks = [
  { href: "/", label: "الرئيسية" },
  { href: "/collections", label: "المجموعة" },
  { href: "/about", label: "عن SKINKSA" },
  { href: "/contact", label: "تواصل معنا" },
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const items = useCartStore((s) => s.items);
  const openDrawer = useCartStore((s) => s.openDrawer);

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      {/* ── ANNOUNCEMENT BAR ── */}
      <div className="bg-gradient-to-r from-[#1a56db] to-[#3b82f6] text-white text-center py-2 px-4 text-xs sm:text-sm font-bold shadow-md relative z-[60]">
        <div className="animate-pulse inline-block mr-2">🔥</div>
        عرض محدود: اطلبي كورس التجديد المتكامل واحصلي على النتيجة المضمونة (الدفع عند الاستلام)
        <div className="animate-pulse inline-block ml-2">🔥</div>
      </div>

      <header
        className={`sticky top-0 z-50 w-full bg-white transition-shadow duration-300 ${
          scrolled ? "shadow-md backdrop-blur-sm" : "border-b border-[#d5e3f0]"
        }`}
      >
        <div className="mx-auto flex h-16 max-w-screen-xl items-center justify-between px-4 sm:px-6">
          {/* Cart button (left in RTL) */}
          <button
            onClick={openDrawer}
            aria-label="عربة التسوق"
            className="relative flex items-center gap-1.5 rounded-full p-2 text-[#0f1c2e] transition hover:bg-[#f0f7ff]"
          >
            <ShoppingBag size={22} />
            {totalItems > 0 && (
              <span className="absolute -top-0.5 -left-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#1a56db] text-[10px] font-bold text-white">
                {totalItems}
              </span>
            )}
          </button>

          {/* Center nav (desktop) */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="text-sm font-medium text-[#4b5e78] transition hover:text-[#1a56db]"
              >
                {l.label}
              </Link>
            ))}
          </nav>

          {/* Brand lockup (right in RTL) */}
          <Link href="/" className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#1a56db] text-sm font-bold text-white select-none">
              S
            </span>
            <div className="flex flex-col leading-none">
              <span className="text-base font-bold tracking-widest text-[#1a56db]">
                SKINKSA
              </span>
              <span className="text-[10px] tracking-wider text-[#c9a44a] font-medium">
                SKINKSA
              </span>
            </div>
          </Link>

          {/* Mobile hamburger */}
          <button
            className="flex md:hidden p-2 text-[#0f1c2e]"
            onClick={() => setMobileOpen((o) => !o)}
            aria-label="القائمة"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Mobile nav */}
        {mobileOpen && (
          <div className="md:hidden border-t border-[#d5e3f0] bg-white px-4 py-4 flex flex-col gap-3">
            {navLinks.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setMobileOpen(false)}
                className="text-base font-medium text-[#4b5e78] py-1"
              >
                {l.label}
              </Link>
            ))}
          </div>
        )}
      </header>
    </>
  );
}
