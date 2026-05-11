import type { Offer, Product } from "@/lib/api/products";

export const STATIC_OFFERS: Offer[] = [
  {
    id: "offer_1",
    code: "OFFER_1",
    label_ar: "كورس النضارة الفورية (عبوة واحدة)",
    quantity: 1,
    price_sar: 129,
    compare_at_sar: 179,
    is_default: false,
    badge_ar: null,
    sort_order: 1,
  },
  {
    id: "offer_2",
    code: "OFFER_2",
    label_ar: "كورس التجديد المتكامل (عبوتين)",
    quantity: 2,
    price_sar: 159,
    compare_at_sar: 258,
    is_default: true,
    badge_ar: "النتيجة المضمونة",
    sort_order: 2,
  },
  {
    id: "offer_3",
    code: "OFFER_3",
    label_ar: "كورس شباب البشرة (٣ عبوات)",
    quantity: 3,
    price_sar: 199,
    compare_at_sar: 387,
    is_default: false,
    badge_ar: "أعلى توفير",
    sort_order: 3,
  },
];

export const STATIC_PRODUCT: Product = {
  id: "prod_blue_copper_serum",
  slug: "blue-copper-peptide-serum",
  title_ar:
    "سيروم ببتيد النحاس الأزرق لشد البشرة وتجديدها، مضاد للشيخوخة، 30 مل - تركيبة منشطة للبشرة مع خلاصة مُشرقة",
  title_en: "Blue Copper Peptide Serum",
  description_ar:
    "سيروم فاخر مركّز بتقنية ببتيد النحاس الأزرق لدعم مظهر البشرة المشدودة والمتجددة. تركيبة علمية خفيفة تمتص بسرعة وتناسب الاستخدام اليومي.",
  status: "active",
  base_image_url: null,
  offers: STATIC_OFFERS,
};
