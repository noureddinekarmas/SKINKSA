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
    <section className="py-16 bg-[#f0f7ff]">
      <div className="max-w-3xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-[#0f1c2e]">أسئلة شائعة</h2>
          <p className="text-[#4b5e78] mt-3">كل ما تحتاجين معرفته</p>
        </div>

        <Accordion className="space-y-3">
          {faqItems.map((item, index) => (
            <AccordionItem
              key={index}
              value={`item-${index}`}
              className="bg-white rounded-xl border border-[#d5e3f0] px-4"
            >
              <AccordionTrigger className="text-[#0f1c2e] font-medium text-right hover:no-underline">
                {item.question}
              </AccordionTrigger>
              <AccordionContent className="text-[#4b5e78] text-sm leading-relaxed">
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
