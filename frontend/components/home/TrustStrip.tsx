import { ShieldCheck, Truck, Clock, RefreshCw } from "lucide-react";

const trustItems = [
  { icon: ShieldCheck, title: "الدفع عند الاستلام", subtitle: "عايِني طلبك أولاً", color: "text-[#15803D]", bg: "bg-green-50" },
  { icon: Truck, title: "شحن سريع ومجاني", subtitle: "لكل مناطق السعودية", color: "text-[#2563EB]", bg: "bg-blue-50" },
  { icon: RefreshCw, title: "ضمان ذهبي 30 يوماً", subtitle: "فلوسك ترجع لك بدون أسئلة", color: "text-[#B7791F]", bg: "bg-amber-50" },
  { icon: Clock, title: "دعم على مدار الساعة", subtitle: "عبر الواتساب", color: "text-[#312E81]", bg: "bg-indigo-50" },
];

export default function TrustStrip() {
  return (
    <section className="bg-white py-10 border-b border-[#E2E8F0] shadow-sm relative z-20">
      <div className="max-w-6xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-6">
        {trustItems.map(({ icon: Icon, title, subtitle, color, bg }) => (
          <div key={title} className="flex flex-col sm:flex-row items-center text-center sm:text-right gap-4 p-2">
            <div className={`w-14 h-14 rounded-full ${bg} flex items-center justify-center flex-shrink-0`}>
              <Icon className={`w-7 h-7 ${color}`} />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-[#0F172A] text-base">{title}</span>
              <span className="text-[#475569] text-sm mt-0.5">{subtitle}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
