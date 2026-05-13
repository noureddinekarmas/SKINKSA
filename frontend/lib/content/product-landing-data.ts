import type { Offer, Product } from "@/lib/api/products";
import type { ProductMarketSlug } from "@/lib/content/main-product";
import {
  AUTHORITY_BAND,
  MECHANISM_BLOCK,
  OBJECTION_BUSTER,
  PAIN_CHECKLIST,
  PRODUCT_BENEFITS,
  PRODUCT_DESCRIPTION_GALLERY,
  PRODUCT_HEADLINE,
  PRODUCT_HERO_GALLERY,
  PRODUCT_HERO_QUOTE,
  PRODUCT_HOW_TO,
  PRODUCT_INGREDIENTS,
  PRODUCT_KICKER,
  PRODUCT_LIFESTYLE_VISUAL,
  PRODUCT_RESULT_VISUAL,
  PRODUCT_TAGLINE,
  AUTHENTICITY_SECTION,
  PRODUCT_REVIEWS as REVIEWS_KSA,
  SCIENCE_PROOF_LIST as SCIENCE_KSA,
  SOCIAL_STRIP as SOCIAL_KSA,
  STORY_FRAMES as STORY_KSA,
} from "@/lib/content/product-page";
import type { StoryFrame } from "@/lib/content/product-page";

export type ShopCurrency = "SAR" | "QAR" | "KWD";

export type ProductFaqItem = { question: string; answer: string };

export type CheckoutRegionOption = { value: string; label: string };

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

export type ProductLandingData = {
  product: Product;
  currency: ShopCurrency;
  currencyLabelAr: string;
  numberLocale: string;
  faq: ProductFaqItem[];
  upsellAddonPrice: number;
  /** Shown struck-through next to the offer price */
  upsellCompareAtPrice: number;
  upsellBundle: UpsellBundleConfig;
  topPromoStrip: string;
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
  productBenefits: typeof PRODUCT_BENEFITS;
  productDescriptionGallery: typeof PRODUCT_DESCRIPTION_GALLERY;
  productHeadline: typeof PRODUCT_HEADLINE;
  productHeroGallery: typeof PRODUCT_HERO_GALLERY;
  productHeroQuote: typeof PRODUCT_HERO_QUOTE;
  productHowTo: typeof PRODUCT_HOW_TO;
  productIngredients: typeof PRODUCT_INGREDIENTS;
  productKicker: string;
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
};

const PROD_ID = "prod_blue_copper_serum" as const;

function offersSar(): Offer[] {
  return [
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
}

function offersQar(): Offer[] {
  return [
    {
      id: "offer_1",
      code: "OFFER_1",
      label_ar: "عبوة واحدة · ٣٠ مل",
      quantity: 1,
      price_sar: 169,
      compare_at_sar: 235,
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
      compare_at_sar: 339,
      is_default: true,
      badge_ar: "خيار متوازن",
      sort_order: 2,
    },
    {
      id: "offer_3",
      code: "OFFER_3",
      label_ar: "ثلاث عبوات · للالتزام دون انقطاع",
      quantity: 3,
      price_sar: 239,
      compare_at_sar: 465,
      is_default: false,
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
      price_sar: 14,
      compare_at_sar: 19,
      is_default: false,
      badge_ar: null,
      sort_order: 1,
    },
    {
      id: "offer_2",
      code: "OFFER_2",
      label_ar: "عبوتان · مدة استخدام أوضح للروتين",
      quantity: 2,
      price_sar: 18,
      compare_at_sar: 29,
      is_default: true,
      badge_ar: "خيار متوازن",
      sort_order: 2,
    },
    {
      id: "offer_3",
      code: "OFFER_3",
      label_ar: "ثلاث عبوات · للالتزام دون انقطاع",
      quantity: 3,
      price_sar: 20,
      compare_at_sar: 39,
      is_default: false,
      badge_ar: "أفضل قيمة للعبوة",
      sort_order: 3,
    },
  ];
}

const FAQ_KSA: ProductFaqItem[] = [
  {
    question: "هل المنتج يناسب كل أنواع البشرة، حتى الحساسة؟",
    answer:
      "نعم، التركيبة لطيفة جداً ومصممة لتناسب مختلف أنواع البشرة بما فيها الحساسة. كما أنها مختبرة ومرخصة من الهيئة العامة للغذاء والدواء (SFDA) لضمان أمانها التام.",
  },
  {
    question: "متى أبدأ بملاحظة الفرق على بشرتي؟",
    answer:
      "معظم عميلاتنا يلاحظن زيادة في الترطيب والنضارة من الأسبوع الأول، ومع الاستمرار لمدة 3 إلى 4 أسابيع ستلاحظين تحسناً كبيراً في ملمس وشد البشرة.",
  },
  {
    question: "ماذا لو لم تعجبني النتيجة؟",
    answer:
      "رضاكِ هو هدفنا الأول. نقدم لكِ (ضماناً ذهبياً لمدة 30 يوماً). استخدمي المنتج، وإذا لم تشعري بفرق ملموس في نضارة وجهك، سنعيد لكِ كامل المبلغ بدون أي تعقيدات.",
  },
  {
    question: "كيف أدفع قيمة الطلب؟",
    answer: "راحتك تهمنا، لذلك لا نطلب منكِ أي دفع مسبق. الدفع يكون يداً بيد (الدفع عند الاستلام) بعد أن يصلك المنتج لباب بيتك.",
  },
  {
    question: "كم يستغرق التوصيل داخل السعودية؟",
    answer:
      "نحن نعمل مع أفضل شركات الشحن لضمان وصول طلبك خلال 3-5 أيام عمل كحد أقصى لأي مدينة في المملكة.",
  },
];

const FAQ_QATAR: ProductFaqItem[] = [
  {
    question: "هل المنتج يناسب كل أنواع البشرة، حتى الحساسة؟",
    answer:
      "نعم، التركيبة لطيفة ومصممة لتناسب أغلب أنواع البشرة بما فيها الحساسة غالباً. نوصي دائماً بتجربة بسيطة على بقعة صغيرة لو بشرتك شديدة الحساسية، والالتزام بتعليمات الاستخدام.",
  },
  {
    question: "متى أبدأ بملاحظة الفرق على بشرتي؟",
    answer:
      "كثير من العميلات يلاحظن ترطيباً أوضح خلال الأسبوع الأول، ومع الاستمرار لمدة 3 إلى 4 أسابيع يتحسّن الإحساس العام بالملمس والمظهر — والنتائج تختلف من شخص لآخر.",
  },
  {
    question: "ماذا لو لم تعجبني النتيجة؟",
    answer:
      "رضاكِ يهمنا. نقدّم ضماناً لمدة 30 يوماً وفق سياسة الاسترجاع المنشورة على المتجر — اقرأي التفاصيل قبل الطلب وتواصلي معنا إذا احتجتِ أي توضيح.",
  },
  {
    question: "كيف أدفع قيمة الطلب داخل قطر؟",
    answer:
      "لا نطلب دفعاً مسبقاً على الموقع. الدفع يكون عند الاستلام (كاش أو حسب سياسة المندوب) بعد استلام الطلب عند باب منزلك في قطر.",
  },
  {
    question: "كم يستغرق التوصيل داخل قطر؟",
    answer:
      "نقوم بشحن الطلبات داخل قطر عبر شركاء شحن موثوقين. في المعتاد يصل الطلب خلال 2 إلى 4 أيام عمل حسب المنطقة، وقد يختلف الوقت في أيام الذروة أو العطل الرسمية.",
  },
];

const FAQ_KUWAIT: ProductFaqItem[] = [
  {
    question: "هل المنتج يناسب كل أنواع البشرة، حتى الحساسة؟",
    answer:
      "التركيبة خفيفة ومناسبة لأغلب الأنواع. إذا بشرتك حساسة جداً، جرّبي كمية بسيطة أولاً على بقعة صغيرة، ثم وسّعي الاستخدام تدريجياً.",
  },
  {
    question: "متى أبدأ بملاحظة الفرق على بشرتي؟",
    answer:
      "كثير من المستخدمات يبدأن بتحسّن في الإحساس بالترطيب أسبوعياً، والنتيجة الأوضح غالباً مع أسابيع من الالتزام اليومي — تختلف حسب نوع البشرة والروتين.",
  },
  {
    question: "ماذا لو لم تعجبني النتيجة؟",
    answer:
      "عندنا ضمان 30 يوماً وفق سياسة الاسترجاع على المتجر. اقرأي الشروط بتمعّن، وإذا احتجتِ مساعدة فريق الدعم جاهز.",
  },
  {
    question: "كيف أدفع قيمة الطلب داخل الكويت؟",
    answer:
      "الدفع عند الاستلام داخل الكويت بدون دفع مسبق عبر الموقع. تدفعين عند استلام الشحنة بحسب طريقة التحصيل المتفق عليها مع شركة التوصيل.",
  },
  {
    question: "كم يستغرق التوصيل داخل الكويت؟",
    answer:
      "عادةً بين 2 و4 أيام عمل داخل محافظات الكويت، مع إمكانية تأخير بسيط خلال الإجازات أو الطلبات المرتفعة جداً.",
  },
];

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

const PRODUCT_TITLE_QA =
  "سيروم ببتيد النحاس الأزرق SKINKSA — منتج واحد: الببتيد لشد البشرة وتجديدها، 30 مل (توصيل قطر)";
const PRODUCT_TITLE_KW =
  "سيروم ببتيد النحاس الأزرق SKINKSA — منتج واحد: الببتيد لشد البشرة وتجديدها، 30 مل (توصيل الكويت)";

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

const TAGLINE_QA = "ببتيد نحاس أزرق مع هيالورونيك: يمتص بسرعة ويناسب الجو الدافئ.";
const TAGLINE_KW = "ببتيد نحاس أزرق مع هيالورونيك: خفيف على البشرة ومناسب للاستخدام اليومي داخل الكويت.";

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
      product: baseProduct(
        "blueskin",
        offersSar(),
        "سيروم ببتيد النحاس الأزرق SKINKSA — منتج واحد: الببتيد لشد البشرة وتجديدها، 30 مل"
      ),
      currency: "SAR",
      currencyLabelAr: "ر.س",
      numberLocale: "en-SA",
      faq: FAQ_KSA,
      upsellAddonPrice: 79,
      upsellCompareAtPrice: 129,
      upsellBundle: {
        headlineAr: "✨🎁 باقة لحظة أخيرة — كمية إضافية بسعر ينافس!",
        hookLineAr: "💎 عبوتك الإضافية بنفس التركيبة — أوفر من شرائها لوحدها 🔥",
        addonBottleQty: 1,
        bottleLabelAr: "عبوة سيروم كاملة (٣٠ مل)",
      },
      topPromoStrip: "الدفع عند الاستلام داخل السعودية · ما يحتاج كرت · توصيل لباب البيت من ٣–٥ أيام عمل",
      mobileBadgeRegions: "عميلات من كل المناطق",
      mobileBadgeQuality: "مرخّص SFDA",
      valueStripDelivery: "توصيل داخل المملكة · ٣–٥ أيام عمل",
      valueStripRegulatory: "منتج مرخّص SFDA",
      reviewsEyebrow: "شهادات من السعودية",
      cartTrustLine: "الدفع عند الاستلام داخل السعودية",
      checkoutIntro: "يرجى إدخال اسمك ورقم الجوال لتأكيد الطلب والتواصل معك عند التوصيل.",
      checkoutFooterDelivery: "توصيل سريع",
      phonePlaceholder: "رقم الجوال (05XXXXXXXX)",
      phoneSchemaMessage: "اكتبي رقم جوال سعودي صحيح مثل 05XXXXXXXX",
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
      productBenefits: PRODUCT_BENEFITS,
      productDescriptionGallery: PRODUCT_DESCRIPTION_GALLERY,
      productHeadline: PRODUCT_HEADLINE,
      productHeroGallery: PRODUCT_HERO_GALLERY,
      productHeroQuote: PRODUCT_HERO_QUOTE,
      productHowTo: PRODUCT_HOW_TO,
      productIngredients: PRODUCT_INGREDIENTS,
      productKicker: PRODUCT_KICKER,
      productLifestyleVisual: PRODUCT_LIFESTYLE_VISUAL,
      productResultVisual: PRODUCT_RESULT_VISUAL,
      productTagline: PRODUCT_TAGLINE,
      productReviews: REVIEWS_KSA,
      scienceProofList: SCIENCE_KSA,
      socialStrip: SOCIAL_KSA,
      storyFrames: [...STORY_KSA],
    };
  }

  if (slug === "qarskin") {
    return {
      product: baseProduct("qarskin", offersQar(), PRODUCT_TITLE_QA),
      currency: "QAR",
      currencyLabelAr: "ر.ق",
      numberLocale: "en-QA",
      faq: FAQ_QATAR,
      upsellAddonPrice: 79,
      upsellCompareAtPrice: 129,
      upsellBundle: {
        headlineAr: "✨🎁 عرض ما بعد الطلب — زيدي كميتك بأحسن سعر!",
        hookLineAr: "💎 نفس السيروم · عبوة إضافية جاهزة للتوصيل داخل قطر 📦",
        addonBottleQty: 1,
        bottleLabelAr: "عبوة سيروم كاملة (٣٠ مل)",
      },
      topPromoStrip: "الدفع عند الاستلام داخل قطر · بدون دفع مسبق عبر الموقع · توصيل لباب المنزل خلال ٢–٤ أيام عمل",
      mobileBadgeRegions: "عميلات من قطر",
      mobileBadgeQuality: "منتج أصلي",
      valueStripDelivery: "توصيل داخل قطر · ٢–٤ أيام عمل",
      valueStripRegulatory: "مصدر رسمي SKINKSA",
      reviewsEyebrow: "شهادات من قطر",
      cartTrustLine: "الدفع عند الاستلام داخل قطر",
      checkoutIntro: "يرجى إدخال اسمك ورقم الجوال لتأكيد الطلب والتواصل معك عند التوصيل داخل قطر.",
      checkoutFooterDelivery: "توصيل داخل قطر",
      phonePlaceholder: "رقم الجوال (مثال: 3XXXXXXX أو +974)",
      phoneSchemaMessage: "اكتبي رقم قطري صحيح مثل 3XXXXXXX أو +974XXXXXXXX",
      regionSelectPlaceholder: "البلدية / المنطقة",
      regionLabelMinMessage: "اختاري المنطقة",
      addressPlaceholder: "المنطقة، الشارع، رقم المبنى — وأي علامة قريبة تساعد المندوب",
      checkoutRegions: REGIONS_QATAR,
      authenticity: AUTH_QATAR as typeof AUTHENTICITY_SECTION,
      authorityBand: AUTH_QA_BAND as typeof AUTHORITY_BAND,
      mechanismBlock: MECHANISM_BLOCK,
      objectionBuster: OBJ_QATAR as typeof OBJECTION_BUSTER,
      painChecklist: PAIN_QA as typeof PAIN_CHECKLIST,
      productBenefits: PRODUCT_BENEFITS,
      productDescriptionGallery: PRODUCT_DESCRIPTION_GALLERY,
      productHeadline: PRODUCT_HEADLINE,
      productHeroGallery: PRODUCT_HERO_GALLERY,
      productHeroQuote: PRODUCT_HERO_QUOTE,
      productHowTo: PRODUCT_HOW_TO,
      productIngredients: PRODUCT_INGREDIENTS,
      productKicker: "منتج واحد · ٣٠ مل · SKINKSA قطر",
      productLifestyleVisual: PRODUCT_LIFESTYLE_VISUAL,
      productResultVisual: PRODUCT_RESULT_VISUAL,
      productTagline: TAGLINE_QA,
      productReviews: REVIEWS_QATAR,
      scienceProofList: [...SCIENCE_QA_KW],
      socialStrip: SOCIAL_QATAR,
      storyFrames: storyQatar(),
    };
  }

  return {
    product: baseProduct("kwtskin", offersKwd(), PRODUCT_TITLE_KW),
    currency: "KWD",
    currencyLabelAr: "د.ك",
    numberLocale: "en-KW",
    faq: FAQ_KUWAIT,
    upsellAddonPrice: 7.25,
    upsellCompareAtPrice: 11.5,
    upsellBundle: {
      headlineAr: "✨🎁 باقة مكملة — عبوة زيادة بتسعيرة محروقة!",
      hookLineAr: "💎 روتين أطول بدون ما تفوتك العبوة الثانية — توصيل الكويت 📦",
      addonBottleQty: 1,
      bottleLabelAr: "عبوة سيروم كاملة (٣٠ مل)",
    },
    topPromoStrip: "الدفع عند الاستلام داخل الكويت · بدون دفع مسبق عبر الموقع · توصيل لباب المنزل خلال ٢–٤ أيام عمل",
    mobileBadgeRegions: "عميلات من الكويت",
    mobileBadgeQuality: "منتج أصلي",
    valueStripDelivery: "توصيل داخل الكويت · ٢–٤ أيام عمل",
    valueStripRegulatory: "مصدر رسمي SKINKSA",
    reviewsEyebrow: "شهادات من الكويت",
    cartTrustLine: "الدفع عند الاستلام داخل الكويت",
    checkoutIntro: "يرجى إدخال اسمك ورقم الجوال لتأكيد الطلب والتواصل معك عند التوصيل داخل الكويت.",
    checkoutFooterDelivery: "توصيل داخل الكويت",
    phonePlaceholder: "رقم الجوال (مثال: 5XXXXXXX أو +965)",
    phoneSchemaMessage: "اكتبي رقم كويتي صحيح مثل 5XXXXXXX أو +965XXXXXXXX",
    regionSelectPlaceholder: "المحافظة",
    regionLabelMinMessage: "اختاري المحافظة",
    addressPlaceholder: "المنطقة، القطعة، الشارع — وأي تفاصيل تسهّل التوصيل",
    checkoutRegions: REGIONS_KUWAIT,
    authenticity: AUTH_KUWAIT as typeof AUTHENTICITY_SECTION,
    authorityBand: AUTH_KW_BAND as typeof AUTHORITY_BAND,
    mechanismBlock: MECHANISM_BLOCK,
    objectionBuster: OBJ_KUWAIT as typeof OBJECTION_BUSTER,
    painChecklist: PAIN_KW as typeof PAIN_CHECKLIST,
    productBenefits: PRODUCT_BENEFITS,
    productDescriptionGallery: PRODUCT_DESCRIPTION_GALLERY,
    productHeadline: PRODUCT_HEADLINE,
    productHeroGallery: PRODUCT_HERO_GALLERY,
    productHeroQuote: PRODUCT_HERO_QUOTE,
    productHowTo: PRODUCT_HOW_TO,
    productIngredients: PRODUCT_INGREDIENTS,
    productKicker: "منتج واحد · ٣٠ مل · SKINKSA الكويت",
    productLifestyleVisual: PRODUCT_LIFESTYLE_VISUAL,
    productResultVisual: PRODUCT_RESULT_VISUAL,
    productTagline: TAGLINE_KW,
    productReviews: REVIEWS_KUWAIT,
    scienceProofList: [...SCIENCE_QA_KW],
    socialStrip: SOCIAL_KUWAIT,
    storyFrames: storyKuwait(),
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
