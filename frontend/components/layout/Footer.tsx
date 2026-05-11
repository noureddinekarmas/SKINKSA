import Link from "next/link";
import { Truck, CreditCard, MessageCircle, ShieldCheck } from "lucide-react";

const policyLinks = [
  { href: "/privacy-policy", label: "سياسة الخصوصية" },
  { href: "/terms-and-conditions", label: "الشروط والأحكام" },
  { href: "/shipping-and-cod-policy", label: "سياسة الشحن والدفع" },
  { href: "/returns-policy", label: "سياسة الإرجاع" },
];

const mainLinks = [
  { href: "/", label: "الرئيسية" },
  { href: "/collections", label: "المجموعة" },
  { href: "/about", label: "عن SKINKSA" },
  { href: "/contact", label: "تواصل معنا" },
];

const trustBadges = [
  { icon: CreditCard, label: "الدفع عند الاستلام" },
  { icon: Truck, label: "شحن داخل السعودية" },
  { icon: MessageCircle, label: "دعم عبر الواتساب" },
  { icon: ShieldCheck, label: "جودة موثقة" },
];

export function Footer() {
  return (
    <footer className="bg-[#0f1c2e] text-white mt-auto">
      {/* Trust strip */}
      <div className="border-b border-white/10">
        <div className="mx-auto max-w-screen-xl px-4 sm:px-6 py-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
          {trustBadges.map(({ icon: Icon, label }) => (
            <div key={label} className="flex flex-col items-center gap-2 text-center">
              <Icon size={20} className="text-[#c9a44a]" />
              <span className="text-xs text-white/70 font-medium">{label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="mx-auto max-w-screen-xl px-4 sm:px-6 py-12 grid grid-cols-1 sm:grid-cols-3 gap-10">
        {/* Brand */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#1a56db] text-sm font-bold text-white">
              S
            </span>
            <div className="flex flex-col leading-none">
              <span className="text-base font-bold tracking-widest text-white">SKINKSA</span>
              <span className="text-[10px] tracking-wider text-[#c9a44a]">SKINKSA</span>
            </div>
          </div>
          <p className="text-sm text-white/60 leading-relaxed max-w-xs">
            علامة تجارية سعودية متخصصة في العناية بالبشرة، مبنية على الشفافية والعلم والثقة.
          </p>
        </div>

        {/* Navigation */}
        <div className="flex flex-col gap-3">
          <h3 className="text-sm font-semibold text-white/80 mb-1">الصفحات</h3>
          {mainLinks.map((l) => (
            <Link key={l.href} href={l.href} className="text-sm text-white/60 hover:text-white transition">
              {l.label}
            </Link>
          ))}
        </div>

        {/* Policies & Support */}
        <div className="flex flex-col gap-3">
          <h3 className="text-sm font-semibold text-white/80 mb-1">المساعدة والسياسات</h3>
          {policyLinks.map((l) => (
            <Link key={l.href} href={l.href} className="text-sm text-white/60 hover:text-white transition">
              {l.label}
            </Link>
          ))}
          <div className="mt-2 text-sm text-white/60">
            <p>واتساب: <span className="text-white">+966 5X XXX XXXX</span></p>
            <p className="text-xs mt-0.5">الأحد – الخميس، ٩ص – ٦م</p>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 py-4 text-center text-xs text-white/40">
        © {new Date().getFullYear()} SKINKSA. جميع الحقوق محفوظة.
      </div>
    </footer>
  );
}
