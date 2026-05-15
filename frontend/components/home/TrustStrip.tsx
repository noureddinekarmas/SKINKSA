import { ShieldCheck, Truck, Clock, RefreshCw } from "lucide-react";

const trustItems = [
  {
    icon: ShieldCheck,
    title: "الدفع عند الاستلام",
    subtitle: "عايِني طلبك أولاً",
    color: "text-[var(--color-brand-success)]",
    bg: "bg-emerald-50",
  },
  {
    icon: Truck,
    title: "شحن سريع ومجاني",
    subtitle: "إلى عنوانك مع تتبّع واضح",
    color: "text-[var(--color-brand-primary)]",
    bg: "bg-[var(--color-brand-light)]",
  },
  {
    icon: RefreshCw,
    title: "ضمان ذهبي 30 يوماً",
    subtitle: "فلوسك ترجع لك بدون أسئلة",
    color: "text-[#9a7b2c]",
    bg: "bg-[#fef9ec]",
  },
  {
    icon: Clock,
    title: "دعم على مدار الساعة",
    subtitle: "عبر الواتساب",
    color: "text-[var(--color-brand-primary)]",
    bg: "bg-[var(--color-brand-mist)]",
  },
];

export default function TrustStrip() {
  return (
    <section className="relative z-20 border-b border-[var(--color-brand-border)] bg-gradient-to-b from-white to-[var(--color-brand-mist)]/50 py-10 shadow-sm">
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-6 px-4 md:grid-cols-4">
        {trustItems.map(({ icon: Icon, title, subtitle, color, bg }) => (
          <div key={title} className="flex flex-col items-center gap-4 p-2 text-center sm:flex-row sm:text-right">
            <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-full ${bg} ring-2 ring-[var(--color-brand-border)]/60`}>
              <Icon className={`h-7 w-7 ${color}`} />
            </div>
            <div className="flex flex-col">
              <span className="text-base font-black text-[var(--color-brand-ink)]">{title}</span>
              <span className="mt-0.5 text-sm text-[var(--color-brand-slate)]">{subtitle}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
