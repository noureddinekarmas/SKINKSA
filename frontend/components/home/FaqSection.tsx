"use client";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { faqItems } from "@/lib/content/faq";

export default function FaqSection() {
  return (
    <section className="py-16 bg-[var(--color-brand-mist)]">
      <div className="mx-auto max-w-3xl px-4">
        <div className="mb-12 text-center">
          <span className="inline-block rounded-full border border-[var(--color-brand-border)] bg-white px-3 py-1 text-[11px] font-black uppercase tracking-widest text-[var(--color-brand-slate)]">
            دعم ومعلومات
          </span>
          <h2 className="mt-4 text-3xl font-black text-[var(--color-brand-ink)]">أسئلة شائعة</h2>
          <p className="mt-3 text-[var(--color-brand-slate)]">كل ما تحتاجين معرفته قبل الطلب</p>
        </div>

        <Accordion className="space-y-3">
          {faqItems.map((item, index) => (
            <AccordionItem
              key={index}
              value={`item-${index}`}
              className="rounded-2xl border border-[var(--color-brand-border)] bg-white px-4 shadow-sm data-[state=open]:ring-2 data-[state=open]:ring-[var(--color-brand-primary)]/15"
            >
              <AccordionTrigger className="text-right font-bold text-[var(--color-brand-ink)] hover:no-underline">
                {item.question}
              </AccordionTrigger>
              <AccordionContent className="text-sm leading-relaxed text-[var(--color-brand-slate)]">{item.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
