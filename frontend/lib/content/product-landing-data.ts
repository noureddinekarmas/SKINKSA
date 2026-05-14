import type { Offer, Product } from "@/lib/api/products";
import type { ProductMarketSlug } from "@/lib/content/main-product";
import {
  AUTHORITY_BAND,
  MECHANISM_BLOCK,
  OBJECTION_BUSTER,
  PAIN_CHECKLIST,
  PRODUCT_DESCRIPTION_GALLERY,
  PRODUCT_HEADLINE,
  PRODUCT_HERO_GALLERY,
  PRODUCT_HERO_QUOTE,
  PRODUCT_HOW_TO,
  PRODUCT_INGREDIENTS,
  PRODUCT_LIFESTYLE_VISUAL,
  PRODUCT_RESULT_VISUAL,
  AUTHENTICITY_SECTION,
  PRODUCT_VS_COMPARISON,
  PRODUCT_REVIEWS as REVIEWS_KSA,
  SCIENCE_PROOF_LIST as SCIENCE_KSA,
  SOCIAL_STRIP as SOCIAL_KSA,
  STORY_FRAMES as STORY_KSA,
} from "@/lib/content/product-page";
import type { GalleryImage, StoryFrame } from "@/lib/content/product-page";
import { productAsset } from "@/lib/content/product-assets";

export type ShopCurrency = "SAR" | "QAR" | "KWD";

export type ProductFaqItem = { question: string; answer: string };

export type CheckoutRegionOption = { value: string; label: string };

/** One bundle-tier image (square / pack shot). */
export type OfferBundleImage = { src: string; alt: string };

/** One trust / safety pillar (short title + one line). */
export type ProductTrustPillar = { title: string; body: string };

/** Official vs unofficial — tight scan (no long essays). */
export type ProductAuthenticCompare = {
  officialTitle: string;
  officialBullets: readonly string[];
  otherTitle: string;
  otherBullets: readonly string[];
};

export type UpsellBundleConfig = {
  /** Main title; include emojis for the interstitial */
  headlineAr: string;
  /** Short persuasive line under the title */
  hookLineAr: string;
  /** Extra full-size bottles in the upsell line (matches backend line quantity) */
  addonBottleQty: number;
  /** Unit description, e.g. عبوة سيروم ٣٠ مل */
  bottleLabelAr: string;
};

/** Hero stats row (NAMBeauty-style trust micro-grid). */
export type HeroStatItem = { value: string; label: string };

export type ProductLandingData = {
  product: Product;
  currency: ShopCurrency;
  currencyLabelAr: string;
  numberLocale: string;
  /** Punchy merchandising H1 — conversion PDP (short), not the long catalog title. */
  pdpShortTitle: string;
  /** One line under H1 (benefit / positioning). */
  pdpSubtitle: string;
  /** 3–4 very short bullets — storefront style, no emoji. */
  pdpBullets: readonly string[];
  /** Legacy strip copy; shown inside scarcity card under gallery (not full-page banner). */
  pdpUrgencyLine: string;
  /** Scarcity title under gallery (bold). */
  pdpScarcityHeadline: string;
  /** Scarcity support line under gallery. */
  pdpScarcityBody: string;
  /** Full-width primary CTA under offer tiles. */
  pdpPrimaryCta: string;
  /** Short label for breadcrumb «current» segment. */
  pdpBreadcrumbCurrent: string;
  /** Fine print under the bold stats band. */
  pdpBoldStatsNote: string;
  faq: ProductFaqItem[];
  upsellAddonPrice: number;
  /** Shown struck-through next to the offer price */
  upsellCompareAtPrice: number;
  upsellBundle: UpsellBundleConfig;
  topPromoStrip: string;
  /** 3–5 compact stats under hero (e.g. ٣٠ مل، SFDA). */
  heroStats: readonly HeroStatItem[];
  /** Aggregate rating shown in hero (e.g. 4.9). */
  heroRatingScore: string;
  /** Short line next to rating (e.g. verified purchase context). */
  heroRatingCaption: string;
  vsComparison: typeof PRODUCT_VS_COMPARISON;
  mobileBadgeRegions: string;
  mobileBadgeQuality: string;
  valueStripDelivery: string;
  valueStripRegulatory: string;
  reviewsEyebrow: string;
  cartTrustLine: string;
  checkoutIntro: string;
  checkoutFooterDelivery: string;
  phonePlaceholder: string;
  phoneSchemaMessage: string;
  regionSelectPlaceholder: string;
  regionLabelMinMessage: string;
  addressPlaceholder: string;
  checkoutRegions: CheckoutRegionOption[];
  authenticity: typeof AUTHENTICITY_SECTION;
  authorityBand: typeof AUTHORITY_BAND;
  mechanismBlock: typeof MECHANISM_BLOCK;
  objectionBuster: typeof OBJECTION_BUSTER;
  painChecklist: typeof PAIN_CHECKLIST;
  productBenefits: readonly string[];
  productDescriptionGallery: typeof PRODUCT_DESCRIPTION_GALLERY;
  productHeadline: string;
  productHeroGallery: GalleryImage[];
  productHeroQuote: typeof PRODUCT_HERO_QUOTE;
  productHowTo: typeof PRODUCT_HOW_TO;
  productIngredients: typeof PRODUCT_INGREDIENTS;
  productLifestyleVisual: typeof PRODUCT_LIFESTYLE_VISUAL;
  productResultVisual: typeof PRODUCT_RESULT_VISUAL;
  productTagline: string;
  productReviews: (typeof REVIEWS_KSA)[number][];
  scienceProofList: readonly string[] | typeof SCIENCE_KSA;
  socialStrip: {
    stat: string;
    statLabel: string;
    ratingLine: string;
    cities: readonly string[];
  };
  storyFrames: StoryFrame[];
  /**
   * Thumbnails for bundle picker — keys match `Offer.code` (OFFER_1 … OFFER_3).
   * Files: see `OFFER_BUNDLE_IMAGES` under `/public/images/product/`.
   */
  offerBundleImages: Readonly<Record<"OFFER_1" | "OFFER_2" | "OFFER_3", OfferBundleImage>>;
  /** Emotional hook — acknowledges the problem in one line. */
  pdpEmpathyLine: string;
  /** Brand promise / solution — one line, calm and confident. */
  pdpSolutionLine: string;
  /** Large figure for daily momentum (e.g. orders). Pair with caption + note. */
  pdpDailyOrdersFigure: string;
  pdpDailyOrdersCaption: string;
  /** Honest qualifier under the daily figure (keeps trust). */
  pdpDailyOrdersNote: string;
  /** Authority & safety — three compact pillars. */
  pdpTrustPillars: readonly ProductTrustPillar[];
  /** We are the original; others are not — side-by-side. */
  pdpAuthenticCompare: ProductAuthenticCompare;
};

/** Filenames you should add under `frontend/public/images/product/` */
const OFFER_BUNDLE_IMAGES: Readonly<Record<"OFFER_1" | "OFFER_2" | "OFFER_3", OfferBundleImage>> = {
  OFFER_1: {
    src: productAsset("/images/product/bundle-offer-1.png"),
    alt: "سيروم SKINKSA — عبوة واحدة (٣٠ مل)",
  },
  OFFER_2: {
    src: productAsset("/images/product/bundle-offer-2.png"),
    alt: "سيروم SKINKSA — عبوتان (٣٠ مل)",
  },
  OFFER_3: {
    src: productAsset("/images/product/bundle-offer-3.png"),
    alt: "سيروم SKINKSA — ثلاث عبوات (٣٠ مل)",
  },
};

const PDP_TRUST_PILLARS: readonly ProductTrustPillar[] = [
  {
    title: "سلامة ووضوح",
    body: "تركيبة مرخّصة ومسار واضح — ما نخبي ورا شعارات فاخرة فقط.",
  },
  {
    title: "مصدر واحد موثوق",
    body: "نبيع الأصلي من هنا؛ أي عبوة خارج قنواتنا لا نستطيع ضمان تركيبتها.",
  },
  {
    title: "تسوّق بهدوء",
    body: "دفع عند الاستلام وسياسة إرجاع منشورة — قرارك أسهل.",
  },
];

const PDP_AUTHENTIC_COMPARE: ProductAuthenticCompare = {
  officialTitle: "من المتجر الرسمي SKINKSA",
  officialBullets: [
    "تغليف ولوت يطابق إعلاننا وترخيصنا.",
    "شحن وتتبّع من نظامنا — لا وسيط مجهول.",
    "ضمان يطابق سياسة الإرجاع المنشورة على الموقع.",
  ],
  otherTitle: "خارج القنوات الرسمية",
  otherBullets: [
    "لا نؤكد سلامة المنتج ولا طريقة تخزينه.",
    "عروض متكررة بلا مرجع — صعوبة التحقق من المصدر.",
    "مخاطرة على بشرتك وعلى ما دفعتِه.",
  ],
};

const PROD_ID = "prod_blue_copper_serum" as const;

function offersSar(): Offer[] {
  return [
    {
      id: "offer_1",
      code: "OFFER_1",
      label_ar: "عبوة واحدة · ٣٠ مل",
      quantity: 1,
      price_sar: 179,
      compare_at_sar: 229,
      is_default: false,
      badge_ar: null,
      sort_order: 1,
    },
    {
      id: "offer_2",
      code: "OFFER_2",
      label_ar: "عبوتان · مدة استخدام أوضح للروتين",
      quantity: 2,
      price_sar: 189,
      compare_at_sar: 358,
      is_default: false,
      badge_ar: "خيار متوازن",
      sort_order: 2,
    },
    {
      id: "offer_3",
      code: "OFFER_3",
      label_ar: "ثلاث عبوات · للالتزام دون انقطاع",
      quantity: 3,
      price_sar: 199,
      compare_at_sar: 537,
      is_default: true,
      badge_ar: "أفضل قيمة للعبوة",
      sort_order: 3,
    },
  ];
}

function offersQar(): Offer[] {
  return [
    {
      id: "offer_1",
      code: "OFFER_1",
      label_ar: "عبوة واحدة · ٣٠ مل",
      quantity: 1,
      price_sar: 199,
      compare_at_sar: 259,
      is_default: false,
      badge_ar: null,
      sort_order: 1,
    },
    {
      id: "offer_2",
      code: "OFFER_2",
      label_ar: "عبوتان · مدة استخدام أوضح للروتين",
      quantity: 2,
      price_sar: 209,
      compare_at_sar: 398,
      is_default: false,
      badge_ar: "خيار متوازن",
      sort_order: 2,
    },
    {
      id: "offer_3",
      code: "OFFER_3",
      label_ar: "ثلاث عبوات · للالتزام دون انقطاع",
      quantity: 3,
      price_sar: 239,
      compare_at_sar: 597,
      is_default: true,
      badge_ar: "أفضل قيمة للعبوة",
      sort_order: 3,
    },
  ];
}

function offersKwd(): Offer[] {
  return [
    {
      id: "offer_1",
      code: "OFFER_1",
      label_ar: "عبوة واحدة · ٣٠ مل",
      quantity: 1,
      price_sar: 19,
      compare_at_sar: 25,
      is_default: false,
      badge_ar: null,
      sort_order: 1,
    },
    {
      id: "offer_2",
      code: "OFFER_2",
      label_ar: "عبوتان · مدة استخدام أوضح للروتين",
      quantity: 2,
      price_sar: 20,
      compare_at_sar: 38,
      is_default: false,
      badge_ar: "خيار متوازن",
      sort_order: 2,
    },
    {
      id: "offer_3",
      code: "OFFER_3",
      label_ar: "ثلاث عبوات · للالتزام دون انقطاع",
      quantity: 3,
      price_sar: 21,
      compare_at_sar: 57,
      is_default: true,
      badge_ar: "أفضل قيمة للعبوة",
      sort_order: 3,
    },
  ];
}

const SCIENCE_QA_KW = [
  "مكوّن أساس معروف في أدب العناية لدعم مظهر التماسك (GHK-Cu).",
  "الهيالورونيك يدعم الاحتفاظ بالرطوبة في طبقة القرنية.",
  "تركيبة مدروسة ومغلّفة بعناية — وتسوّقين من المصدر الرسمي فقط.",
] as const;

const REGIONS_QATAR: CheckoutRegionOption[] = [
  { value: "الدوحة", label: "الدوحة" },
  { value: "الريان", label: "الريان" },
  { value: "أم صلال", label: "أم صلال" },
  { value: "الوكرة", label: "الوكرة" },
  { value: "الخور والذخائر الشمالية", label: "الخور والذخائر الشمالية" },
  { value: "الشمال", label: "الشمال" },
  { value: "الظعاين", label: "الظعاين" },
];

const REGIONS_KUWAIT: CheckoutRegionOption[] = [
  { value: "محافظة العاصمة", label: "محافظة العاصمة" },
  { value: "محافظة حولي", label: "محافظة حولي" },
  { value: "محافظة الفروانية", label: "محافظة الفروانية" },
  { value: "محافظة الجهراء", label: "محافظة الجهراء" },
  { value: "محافظة الأحمدي", label: "محافظة الأحمدي" },
  { value: "محافظة مبارك الكبير", label: "محافظة مبارك الكبير" },
];

function storyQatar(): StoryFrame[] {
  const s = [...STORY_KSA];
  s[2] = {
    ...s[2],
    body: "دفع عند الاستلام داخل قطر يعني ما تدفعين لين تشوفين الطرد بيدج. وضمان ٣٠ يوم يخفّف مخاوف التجربة: إذا ما حسّيتي إن الاستمرار يناسبج، ترجعين وفق سياسة الاسترجاع المنشورة.",
  };
  return s;
}

function storyKuwait(): StoryFrame[] {
  const s = [...STORY_KSA];
  s[2] = {
    ...s[2],
    body: "دفع عند الاستلام داخل الكويت يعطيج مساحة أمان قبل ما تكمّلين المبلغ. وضمان ٣٠ يوم يساعدج تتخذين قرار هادئ — التفاصيل مكتوبة في سياسة الاسترجاع.",
  };
  return s;
}

const PRODUCT_TITLE_QA = "سيروم SKINKSA — ٣٠ مل · قطر";
const PRODUCT_TITLE_KW = "سيروم SKINKSA — ٣٠ مل · الكويت";

const REVIEWS_QATAR = [
  {
    name: "موزة ح.",
    city: "الدوحة",
    tag: "طلبت عبر الموقع",
    rating: 5,
    text: "كنت متخوفة من الشحن لكن التوصيل وصل منظم والمندوب لطيف. السيروم خفيف وما يثقل بشرتي مع الرطوبة.",
  },
  {
    name: "هند ع.",
    city: "الريان",
    tag: "بشرة عادية",
    rating: 5,
    text: "الدفع عند الاستلام راح عني همّة السداد أونلاين. لاحظت ملمس أنعم مع الأيام مو «سحر ليلة» بس إحساس مرتب.",
  },
  {
    name: "سارة م.",
    city: "الوكرة",
    tag: "روتين بسيط",
    rating: 5,
    text: "أحب إن الامتصاص سريع قبل المكياج. التوصيل كان خلال أيام قليلة حسب ما وعدوا تقريباً.",
  },
  {
    name: "لطيفة ر.",
    city: "لوسيل",
    tag: "أول طلب",
    rating: 5,
    text: "غلّفت العبوة مرتبة وواضح إنها من المصدر الرسمي. جرّبت على بقعة صغيرة أولاً وبعدها كملت… مريحة.",
  },
];

const REVIEWS_KUWAIT = [
  {
    name: "ديمة س.",
    city: "مدينة الكويت",
    tag: "COD",
    rating: 5,
    text: "طلبت وما دفعت ولا شي لين يوم التسليم. السيروم ما زاد دهنية وجهي وخفف إحساس الجفاف بعد التكييف.",
  },
  {
    name: "رغد ف.",
    city: "حولي",
    tag: "عبوتين",
    rating: 5,
    text: "الباقة الثانية منطقية لأني أستخدم يومياً. وصل الطلب بدون لفّ دوائر والمندوب اتصل قبل ما يجي.",
  },
  {
    name: "منى ع.",
    city: "الأحمدي",
    tag: "بشرة مختلطة",
    rating: 5,
    text: "الصبر على الروتين يفرق. أنا ما أحب الروائح القوية — هذا تقريباً ما له نفس صارخ، ولقيته يمشي معاي.",
  },
  {
    name: "هبة ك.",
    city: "الجهراء",
    tag: "تجربة مرتبة",
    rating: 5,
    text: "توصيل داخل الكويت كان سلس. السياسة والضمان مذكورة على الموقع وذكّروني أقراها… شي يطمن.",
  },
];

const AUTH_QATAR = {
  ...AUTHENTICITY_SECTION,
  lead: "التركيبة المعروضة هنا تُباع عبر هذا المتجر كمصدر رسمي لطلبات قطر. أي عروض خارج قنواتنا قد تختلف التخزين أو التعامل معها — ولا نقدر نضمن نفس المعايير.",
  real: {
    ...AUTHENTICITY_SECTION.real,
    items: [
      "تغليف رسمي ومسار شحن يمكن تتبّعه من نظامنا داخل قطر.",
      "سياسة استرجاع مكتوبة + دعم بالعربي بعد الشراء.",
      "عروض واضحة بالريال القطري — بدون مفاجآت في السعر عند الاستلام.",
    ],
  },
};

const AUTH_KUWAIT = {
  ...AUTHENTICITY_SECTION,
  lead: "طلبات الكويت تُخدم عبر هذا المتجر الرسمي لضمان نفس تجربة التغليف والمتابعة. المنتجات خارج القنوات الرسمية قد لا تحمل نفس الضمانات.",
  real: {
    ...AUTHENTICITY_SECTION.real,
    items: [
      "شحن داخل الكويت مع تنسيق تسليم واضح وبيانات تواصل محلية.",
      "ضمان ٣٠ يوم وفق السياسة المنشورة — اقرأيها قبل الشراء.",
      "أسعار بالدينار الكويتي كما تظهر في الباقة المختارة.",
    ],
  },
};

const AUTH_KW_BAND = {
  title: AUTHORITY_BAND.title,
  points: [
    { t: "جودة الإمداد", d: "نركز على توريد منتظم وتغليف سليم حتى يصل الطلب بحالة تليق بالعلامة." },
    AUTHORITY_BAND.points[1],
    AUTHORITY_BAND.points[2],
  ],
};

const AUTH_QA_BAND = {
  title: AUTHORITY_BAND.title,
  points: [
    { t: "توصيل قطر", d: "عمليات التجهيز والتسليم مصممة لتغطية مناطق قطر بشكل عملي مع تتبّع وتنسيق." },
    AUTHORITY_BAND.points[1],
    AUTHORITY_BAND.points[2],
  ],
};

const PAIN_QA = [
  PAIN_CHECKLIST[0],
  PAIN_CHECKLIST[1],
  {
    title: "تبغين تسوّقين بأمان داخل قطر",
    detail: "دفع عند الاستلام + متجر رسمي يقلّل المخاطرة على ميزانيتج قبل ما تتأكدين من المنتج.",
  },
];

const PAIN_KW = [
  PAIN_CHECKLIST[0],
  PAIN_CHECKLIST[1],
  {
    title: "تبغين تجربة شراء واضحة داخل الكويت",
    detail: "COD وخط سير مكتوب يساعدج تتجنبين المجهول — خصوصاً مع الطلبات أول مرة.",
  },
];

const OBJ_QATAR = {
  ...OBJECTION_BUSTER,
  lines: [
    OBJECTION_BUSTER.lines[0],
    OBJECTION_BUSTER.lines[1],
    "إذا ما عجبك التوجه — سياسة الاسترجاع مكتوبة… اقرأيها براحتج قبل ما تدفعين ولا ريال قطري عند الباب.",
  ],
};

const OBJ_KUWAIT = {
  ...OBJECTION_BUSTER,
  lines: [
    OBJECTION_BUSTER.lines[0],
    OBJECTION_BUSTER.lines[1],
    "إذا ما عجبك التوجه — سياسة الاسترجاع مكتوبة… اقرأيها براحتج قبل تسديد مبلغ الطلب عند الاستلام.",
  ],
};

const SOCIAL_QATAR = {
  ...SOCIAL_KSA,
  ratingLine: "تقييم تجربة شراء عالي من عميلات داخل قطر",
  cities: ["الدوحة", "الريان", "الوكرة", "الخور", "لوسيل"],
};

const SOCIAL_KUWAIT = {
  ...SOCIAL_KSA,
  ratingLine: "تقييم تجربة شراء عالي من عميلات داخل الكويت",
  cities: ["الكويت", "حولي", "الفروانية", "الأحمدي", "الجهراء"],
};

/** Merge live catalog product (prices, titles, hero image) into a regional landing template. */
export function mergeApiProductLandingData(base: ProductLandingData, apiProduct: Product): ProductLandingData {
  const heroGallery: GalleryImage[] = apiProduct.base_image_url
    ? [
        {
          src: apiProduct.base_image_url,
          alt: apiProduct.title_ar,
          thumbLabel: base.productHeroGallery[0]?.thumbLabel ?? "المنتج",
        },
        ...base.productHeroGallery.slice(1),
      ]
    : [...base.productHeroGallery];
  const apiDesc = apiProduct.description_ar?.trim() ?? "";
  const useApiTagline = apiDesc.length > 0 && apiDesc.length <= 95;
  const mergedProduct: Product = {
    ...apiProduct,
    description_ar: apiDesc.length > 0 ? apiProduct.description_ar : base.product.description_ar,
  };
  return {
    ...base,
    product: mergedProduct,
    productHeadline: apiProduct.title_ar,
    productTagline: useApiTagline ? apiDesc : base.productTagline,
    productHeroGallery: heroGallery,
  };
}

export function getProductLandingData(slug: ProductMarketSlug): ProductLandingData {
  const baseProduct = (s: string, offers: Offer[], titleAr: string): Product => ({
    id: PROD_ID,
    slug: s,
    title_ar: titleAr,
    title_en: "SKINKSA Blue Copper Peptide Serum — 30ml",
    description_ar:
      "سيروم فاخر مركّز بتقنية ببتيد النحاس الأزرق لدعم مظهر البشرة المشدودة والمتجددة. تركيبة علمية خفيفة تمتص بسرعة وتناسب الاستخدام اليومي.",
    status: "active",
    base_image_url: null,
    offers,
  });

  if (slug === "blueskin") {
    return {
      product: baseProduct("blueskin", offersSar(), "سيروم SKINKSA — ٣٠ مل"),
      currency: "SAR",
      currencyLabelAr: "ر.س",
      numberLocale: "en-SA",
      pdpShortTitle: "سيروم SKINKSA",
      pdpSubtitle: "ببتيد نحاس أزرق مرخّص SFDA — امتصاص سريع وتركيبة خفيفة للاستخدام اليومي.",
      pdpBullets: [
        "يدعم مظهر النضارة والنعومة مع الاستمرار.",
        "قوام خفيف للاستخدام اليومي والمكياج.",
        "متجر رسمي — ترخيص وتغليف أصلي.",
        "دفع عند الاستلام داخل السعودية.",
      ],
      pdpUrgencyLine: "عرض الباقات — حتى اكتمال دفعة الشحن اليوم",
      pdpScarcityHeadline: "دفعات اليوم تُغلق حسب الطلب — والأصلي ينفذ بسرعة من المتجر الرسمي",
      pdpScarcityBody:
        "نخصص كميات للقنوات المعتمدة فقط. اختاري باقتج تحت الصور مباشرة، أكملي بياناتك، والدفع عند الاستلام يبقى لراحتج.",
      pdpPrimaryCta: "أكملي الطلب",
      pdpBreadcrumbCurrent: "SKINKSA",
      pdpBoldStatsNote: "أرقام مبنية على تقييمات العميلات وطلبات من المصدر الرسمي؛ النتائج التجميلية تختلف من شخص لآخر.",
      faq: [],
      upsellAddonPrice: 79,
      upsellCompareAtPrice: 179,
      upsellBundle: {
        headlineAr: "عرض بعد الطلب — عبوة إضافية بسعر أقل",
        hookLineAr: "نفس التركيبة · عبوة كاملة توفّر مقارنة بشراء عبوة لوحدها",
        addonBottleQty: 1,
        bottleLabelAr: "عبوة سيروم كاملة (٣٠ مل)",
      },
      topPromoStrip: "دفع عند الاستلام · توصيل ٣–٥ أيام عمل",
      heroStats: [
        { value: "30", label: "مل في العبوة" },
        { value: "~شهر", label: "روتين تقريبي" },
        { value: "SFDA", label: "مرخّص رسمياً" },
        { value: "يومي", label: "امتصاص سريع" },
      ],
      heroRatingScore: "4.9",
      heroRatingCaption: "آراء عملاء",
      vsComparison: PRODUCT_VS_COMPARISON,
      mobileBadgeRegions: "عميلات من كل المناطق",
      mobileBadgeQuality: "مرخّص SFDA",
      valueStripDelivery: "توصيل داخل المملكة · ٣–٥ أيام عمل",
      valueStripRegulatory: "منتج مرخّص SFDA",
      reviewsEyebrow: "شهادات من السعودية",
      cartTrustLine: "الدفع عند الاستلام داخل السعودية",
      checkoutIntro: "اكتبي اسمك ورقم الجوال لإتمام الطلب.",
      checkoutFooterDelivery: "توصيل سريع",
      phonePlaceholder: "رقم الهاتف (مع رمز الدولة، 7–15 رقماً)",
      phoneSchemaMessage: "أدخل رقماً صالحاً مع رمز الدولة (7–15 رقماً)، أو الرقم المحلي كالسابق",
      regionSelectPlaceholder: "المنطقة / المحافظة",
      regionLabelMinMessage: "اختاري المنطقة",
      addressPlaceholder: "المدينة والحي (أو العنوان الوطني) لتسهيل وصول المندوب",
      checkoutRegions: [
        { value: "الرياض", label: "الرياض" },
        { value: "مكة المكرمة", label: "مكة المكرمة" },
        { value: "المدينة المنورة", label: "المدينة المنورة" },
        { value: "المنطقة الشرقية", label: "المنطقة الشرقية" },
        { value: "القصيم", label: "القصيم" },
        { value: "عسير", label: "عسير" },
        { value: "تبوك", label: "تبوك" },
        { value: "حائل", label: "حائل" },
        { value: "الحدود الشمالية", label: "الحدود الشمالية" },
        { value: "جازان", label: "جازان" },
        { value: "نجران", label: "نجران" },
        { value: "الباحة", label: "الباحة" },
        { value: "الجوف", label: "الجوف" },
      ],
      authenticity: AUTHENTICITY_SECTION,
      authorityBand: AUTHORITY_BAND,
      mechanismBlock: MECHANISM_BLOCK,
      objectionBuster: OBJECTION_BUSTER,
      painChecklist: PAIN_CHECKLIST,
      productBenefits: [],
      productDescriptionGallery: PRODUCT_DESCRIPTION_GALLERY,
      productHeadline: PRODUCT_HEADLINE,
      productHeroGallery: [...PRODUCT_HERO_GALLERY],
      productHeroQuote: PRODUCT_HERO_QUOTE,
      productHowTo: PRODUCT_HOW_TO,
      productIngredients: PRODUCT_INGREDIENTS,
      productLifestyleVisual: PRODUCT_LIFESTYLE_VISUAL,
      productResultVisual: PRODUCT_RESULT_VISUAL,
      productTagline: "",
      productReviews: REVIEWS_KSA,
      scienceProofList: SCIENCE_KSA,
      socialStrip: SOCIAL_KSA,
      storyFrames: [...STORY_KSA],
      offerBundleImages: OFFER_BUNDLE_IMAGES,
      pdpEmpathyLine:
        "إذا حسيتِ إن البشرة تعبت من تجارب كثيرة وما ثبت معك روتين خفيف يلاقي وجهك — فأنتِ مو لوحدك.",
      pdpSolutionLine:
        "SKINKSA يقرّب لكِ العلم لبساطة يومية: ترخيص رسمي، قوام يمتص بسرعة، بدون وعود خرافية.",
      pdpDailyOrdersFigure: "٧٥+",
      pdpDailyOrdersCaption: "طلب موثّق يومياً في أيام الذروة",
      pdpDailyOrdersNote: "رقم تقريبي يتغيّر حسب اليوم والمنطقة؛ يعكس نشاط المتجر لا ضماناً ثابتاً يومياً.",
      pdpTrustPillars: PDP_TRUST_PILLARS,
      pdpAuthenticCompare: PDP_AUTHENTIC_COMPARE,
    };
  }

  if (slug === "qarskin") {
    return {
      product: baseProduct("qarskin", offersQar(), PRODUCT_TITLE_QA),
      currency: "QAR",
      currencyLabelAr: "ر.ق",
      numberLocale: "en-QA",
      pdpShortTitle: "سيروم SKINKSA",
      pdpSubtitle: "نفس التركيبة المرخّصة — توصيل داخل قطر مع الدفع عند الاستلام.",
      pdpBullets: [
        "تركيبة خفيفة للاستخدام اليومي.",
        "من المصدر الرسمي لضمان الأصالة.",
        "توصيل لباب المنزل في أيام عمل.",
        "الاسم ورقم الجوال لإتمام الطلب.",
      ],
      pdpUrgencyLine: "عرض الباقات — حتى اكتمال دفعة الشحن اليوم",
      pdpScarcityHeadline: "دفعات التوصيل داخل قطر تُدار يومياً — أصلي من مصدر واحد فقط",
      pdpScarcityBody:
        "نخصص كميات للمتجر الرسمي داخل قطر. اختاري باقتج تحت الصور، أكملي الطلب، والدفع عند الاستلام عند الباب.",
      pdpPrimaryCta: "أكملي الطلب",
      pdpBreadcrumbCurrent: "SKINKSA",
      pdpBoldStatsNote: "أرقام مبنية على تقييمات وتجارب عميلات وطلبات من المصدر الرسمي.",
      faq: [],
      upsellAddonPrice: 89,
      upsellCompareAtPrice: 199,
      upsellBundle: {
        headlineAr: "بعد الطلب — عبوة إضافية بسعر أقل",
        hookLineAr: "نفس السيروم · عبوة إضافية مع التوصيل داخل قطر",
        addonBottleQty: 1,
        bottleLabelAr: "عبوة سيروم كاملة (٣٠ مل)",
      },
      topPromoStrip: "دفع عند الاستلام · توصيل ٢–٤ أيام",
      heroStats: [
        { value: "30", label: "مل في العبوة" },
        { value: "~شهر", label: "روتين تقريبي" },
        { value: "SFDA", label: "ترخيص مطابق" },
        { value: "قطر", label: "توصيل لباب البيت" },
      ],
      heroRatingScore: "4.9",
      heroRatingCaption: "آراء عملاء",
      vsComparison: PRODUCT_VS_COMPARISON,
      mobileBadgeRegions: "عميلات من قطر",
      mobileBadgeQuality: "منتج أصلي",
      valueStripDelivery: "توصيل داخل قطر · ٢–٤ أيام عمل",
      valueStripRegulatory: "مصدر رسمي SKINKSA",
      reviewsEyebrow: "شهادات من قطر",
      cartTrustLine: "الدفع عند الاستلام داخل قطر",
      checkoutIntro: "اكتبي اسمك ورقم الجوال لإتمام الطلب.",
      checkoutFooterDelivery: "توصيل داخل قطر",
      phonePlaceholder: "رقم الهاتف (محلي أو دولي مع رمز الدولة)",
      phoneSchemaMessage: "أدخل رقماً صالحاً مع رمز الدولة (7–15 رقماً)، أو الرقم المحلي كالسابق",
      regionSelectPlaceholder: "البلدية / المنطقة",
      regionLabelMinMessage: "اختاري المنطقة",
      addressPlaceholder: "المنطقة، الشارع، رقم المبنى — وأي علامة قريبة تساعد المندوب",
      checkoutRegions: REGIONS_QATAR,
      authenticity: AUTH_QATAR as typeof AUTHENTICITY_SECTION,
      authorityBand: AUTH_QA_BAND as typeof AUTHORITY_BAND,
      mechanismBlock: MECHANISM_BLOCK,
      objectionBuster: OBJ_QATAR as typeof OBJECTION_BUSTER,
      painChecklist: PAIN_QA as typeof PAIN_CHECKLIST,
      productBenefits: [],
      productDescriptionGallery: PRODUCT_DESCRIPTION_GALLERY,
      productHeadline: PRODUCT_HEADLINE,
      productHeroGallery: [...PRODUCT_HERO_GALLERY],
      productHeroQuote: PRODUCT_HERO_QUOTE,
      productHowTo: PRODUCT_HOW_TO,
      productIngredients: PRODUCT_INGREDIENTS,
      productLifestyleVisual: PRODUCT_LIFESTYLE_VISUAL,
      productResultVisual: PRODUCT_RESULT_VISUAL,
      productTagline: "",
      productReviews: REVIEWS_QATAR,
      scienceProofList: [...SCIENCE_QA_KW],
      socialStrip: SOCIAL_QATAR,
      storyFrames: storyQatar(),
      offerBundleImages: OFFER_BUNDLE_IMAGES,
      pdpEmpathyLine:
        "الجو الدافئ والتكييف يجهدون البشرة — وتدورين على شيء خفيف يثبت، مو كومة منتجات مبهمة المصدر.",
      pdpSolutionLine:
        "نفس السيروم المرخّص يصلج من المصدر الرسمي داخل قطر: واضح، يُتتبّع، والدفع عند الاستلام يقلّل المخاطرة.",
      pdpDailyOrdersFigure: "٤٥+",
      pdpDailyOrdersCaption: "طلب يومياً في أيام الذروة داخل قطر",
      pdpDailyOrdersNote: "تقدير تشغيلي؛ يختلف حسب الموسم ومعدل الزيارات على الموقع.",
      pdpTrustPillars: PDP_TRUST_PILLARS,
      pdpAuthenticCompare: PDP_AUTHENTIC_COMPARE,
    };
  }

  return {
    product: baseProduct("kwtskin", offersKwd(), PRODUCT_TITLE_KW),
    currency: "KWD",
    currencyLabelAr: "د.ك",
    numberLocale: "en-KW",
    pdpShortTitle: "سيروم SKINKSA",
    pdpSubtitle: "ببتيد نحاس أزرق — توصيل داخل الكويت والدفع عند الاستلام.",
    pdpBullets: [
      "تركيبة خفيفة للاستخدام اليومي.",
      "متجر رسمي وتغليف أصلي.",
      "شحن لباب المنزل خلال أيام عمل.",
      "بيانات بسيطة لإكمال الطلب.",
    ],
    pdpUrgencyLine: "عرض الباقات — حتى اكتمال دفعة الشحن اليوم",
    pdpScarcityHeadline: "دفعات الكويت تُجهّز يومياً — والأصلي من قناة SKINKSA فقط",
    pdpScarcityBody:
      "كميات لكل دفعة شحن وفق الطلب. اختاري باقتج تحت الصور مباشرة، أكملي النموذج، والدفع عند الاستلام عند بابك.",
    pdpPrimaryCta: "أكملي الطلب",
    pdpBreadcrumbCurrent: "SKINKSA",
    pdpBoldStatsNote: "أرقام مستندة إلى تقييمات عملاء ومراجعات من المتجر الرسمي.",
    faq: [],
    upsellAddonPrice: 7.75,
    upsellCompareAtPrice: 19,
    upsellBundle: {
      headlineAr: "بعد الطلب — عبوة إضافية بسعر أقل",
      hookLineAr: "عبوة إضافية لنفس الروتين — توصيل داخل الكويت",
      addonBottleQty: 1,
      bottleLabelAr: "عبوة سيروم كاملة (٣٠ مل)",
    },
    topPromoStrip: "دفع عند الاستلام · توصيل ٢–٤ أيام",
    heroStats: [
      { value: "30", label: "مل في العبوة" },
      { value: "~شهر", label: "روتين تقريبي" },
      { value: "SFDA", label: "ترخيص مطابق" },
      { value: "الكويت", label: "توصيل لباب البيت" },
    ],
    heroRatingScore: "4.9",
    heroRatingCaption: "آراء عملاء",
    vsComparison: PRODUCT_VS_COMPARISON,
    mobileBadgeRegions: "عميلات من الكويت",
    mobileBadgeQuality: "منتج أصلي",
    valueStripDelivery: "توصيل داخل الكويت · ٢–٤ أيام عمل",
    valueStripRegulatory: "مصدر رسمي SKINKSA",
    reviewsEyebrow: "شهادات من الكويت",
    cartTrustLine: "الدفع عند الاستلام داخل الكويت",
    checkoutIntro: "اكتبي اسمك ورقم الجوال لإتمام الطلب.",
    checkoutFooterDelivery: "توصيل داخل الكويت",
    phonePlaceholder: "رقم الهاتف (محلي أو دولي مع رمز الدولة)",
    phoneSchemaMessage: "أدخل رقماً صالحاً مع رمز الدولة (7–15 رقماً)، أو الرقم المحلي كالسابق",
    regionSelectPlaceholder: "المحافظة",
    regionLabelMinMessage: "اختاري المحافظة",
    addressPlaceholder: "المنطقة، القطعة، الشارع — وأي تفاصيل تسهّل التوصيل",
    checkoutRegions: REGIONS_KUWAIT,
    authenticity: AUTH_KUWAIT as typeof AUTHENTICITY_SECTION,
    authorityBand: AUTH_KW_BAND as typeof AUTHORITY_BAND,
    mechanismBlock: MECHANISM_BLOCK,
    objectionBuster: OBJ_KUWAIT as typeof OBJECTION_BUSTER,
    painChecklist: PAIN_KW as typeof PAIN_CHECKLIST,
    productBenefits: [],
    productDescriptionGallery: PRODUCT_DESCRIPTION_GALLERY,
    productHeadline: PRODUCT_HEADLINE,
    productHeroGallery: [...PRODUCT_HERO_GALLERY],
    productHeroQuote: PRODUCT_HERO_QUOTE,
    productHowTo: PRODUCT_HOW_TO,
    productIngredients: PRODUCT_INGREDIENTS,
    productLifestyleVisual: PRODUCT_LIFESTYLE_VISUAL,
    productResultVisual: PRODUCT_RESULT_VISUAL,
    productTagline: "",
    productReviews: REVIEWS_KUWAIT,
    scienceProofList: [...SCIENCE_QA_KW],
    socialStrip: SOCIAL_KUWAIT,
    storyFrames: storyKuwait(),
    offerBundleImages: OFFER_BUNDLE_IMAGES,
    pdpEmpathyLine:
      "التسوّق أونلاين يرهق لما ما تعرفين وش يصلج بشرتك — وكل عبوة «شكلها نفس الشكل» مو معناه نفس المحتوى.",
    pdpSolutionLine:
      "اطلبي من المتجر الرسمي داخل الكويت: تركيبة مرخّصة ومسار واضح، ودفع عند الاستلام يعطيكِ وقت تتأكدين.",
    pdpDailyOrdersFigure: "٣٥+",
    pdpDailyOrdersCaption: "طلب يومياً في أيام الذروة داخل الكويت",
    pdpDailyOrdersNote: "رقم تقريبي للأيام المزدحمة؛ ليس إحصاءً رسمياً يوماً بيوم.",
    pdpTrustPillars: PDP_TRUST_PILLARS,
    pdpAuthenticCompare: PDP_AUTHENTIC_COMPARE,
  };
}

export function checkoutMetaForCurrency(currency: ShopCurrency): Pick<
  ProductLandingData,
  | "checkoutRegions"
  | "phonePlaceholder"
  | "phoneSchemaMessage"
  | "regionSelectPlaceholder"
  | "regionLabelMinMessage"
  | "addressPlaceholder"
  | "checkoutIntro"
  | "checkoutFooterDelivery"
  | "currency"
  | "currencyLabelAr"
  | "numberLocale"
  | "upsellAddonPrice"
  | "upsellCompareAtPrice"
  | "upsellBundle"
> {
  const slug: ProductMarketSlug =
    currency === "SAR" ? "blueskin" : currency === "QAR" ? "qarskin" : "kwtskin";
  const d = getProductLandingData(slug);
  return {
    checkoutRegions: d.checkoutRegions,
    phonePlaceholder: d.phonePlaceholder,
    phoneSchemaMessage: d.phoneSchemaMessage,
    regionSelectPlaceholder: d.regionSelectPlaceholder,
    regionLabelMinMessage: d.regionLabelMinMessage,
    addressPlaceholder: d.addressPlaceholder,
    checkoutIntro: d.checkoutIntro,
    checkoutFooterDelivery: d.checkoutFooterDelivery,
    currency: d.currency,
    currencyLabelAr: d.currencyLabelAr,
    numberLocale: d.numberLocale,
    upsellAddonPrice: d.upsellAddonPrice,
    upsellCompareAtPrice: d.upsellCompareAtPrice,
    upsellBundle: d.upsellBundle,
  };
}
