import type { Offer, Product } from "@/lib/api/products";
import { productAsset } from "@/lib/content/product-assets";

/** Cart drawer & checkout thumbnails (same asset as gallery hero). */
export const PRODUCT_CART_IMAGE = productAsset("/images/product/gallery-main-1.png");

export const STATIC_OFFERS: Offer[] = [
  {
    id: "offer_1",
    code: "OFFER_1",
    label_ar: "عبوة واحدة · ٣٠ مل",
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
    label_ar: "عبوتان · مدة استخدام أوضح للروتين",
    quantity: 2,
    price_sar: 159,
    compare_at_sar: 258,
    is_default: true,
    badge_ar: "خيار متوازن",
    sort_order: 2,
  },
  {
    id: "offer_3",
    code: "OFFER_3",
    label_ar: "ثلاث عبوات · للالتزام دون انقطاع",
    quantity: 3,
    price_sar: 199,
    compare_at_sar: 387,
    is_default: false,
    badge_ar: "أفضل قيمة للعبوة",
    sort_order: 3,
  },
];

export const STATIC_PRODUCT: Product = {
  id: "prod_blue_copper_serum",
  slug: "blue-copper-peptide-serum",
  title_ar:
    "سيروم ببتيد النحاس الأزرق SKINKSA — منتج واحد: الببتيد لشد البشرة وتجديدها، 30 مل",
  title_en: "SKINKSA Blue Copper Peptide Serum — 30ml",
  description_ar:
    "سيروم فاخر مركّز بتقنية ببتيد النحاس الأزرق لدعم مظهر البشرة المشدودة والمتجددة. تركيبة علمية خفيفة تمتص بسرعة وتناسب الاستخدام اليومي.",
  status: "active",
  base_image_url: null,
  offers: STATIC_OFFERS,
};
