/**
 * Public storefront variants (one PDP slug per GCC market). Used by admin “Storefronts” tab.
 */
import { getSiteUrl } from "@/lib/site";
import { type ProductMarketSlug, PRODUCT_MARKET_SLUGS } from "@/lib/content/main-product";
import { getProductLandingData, type ShopCurrency } from "@/lib/content/product-landing-data";

export type StorefrontCatalogRow = {
  slug: ProductMarketSlug;
  regionCode: string;
  countryEn: string;
  countryAr: string;
  currency: ShopCurrency;
  currencyLabelAr: string;
  numberLocale: string;
  productId: string;
  titleAr: string;
  path: string;
  absoluteUrl: string;
  defaultOfferCode: string | null;
  defaultOfferLabelAr: string | null;
  defaultOfferPrice: number | null;
  offerCount: number;
  topPromoStrip: string;
  valueStripDelivery: string;
};

const MARKET_META: Record<
  ProductMarketSlug,
  { regionCode: string; countryEn: string; countryAr: string }
> = {
  blueskin: {
    regionCode: "KSA",
    countryEn: "Primary storefront (SAR)",
    countryAr: "المتجر الأساسي (ر.س)",
  },
  qarskin: {
    regionCode: "QA",
    countryEn: "Storefront (QAR)",
    countryAr: "واجهة ر.ق",
  },
  kwtskin: {
    regionCode: "KW",
    countryEn: "Storefront (KWD)",
    countryAr: "واجهة د.ك",
  },
};

export function getStorefrontCatalogRows(): StorefrontCatalogRow[] {
  const origin = getSiteUrl();
  return PRODUCT_MARKET_SLUGS.map((slug) => {
    const meta = MARKET_META[slug];
    const d = getProductLandingData(slug);
    const path = `/products/${slug}`;
    const defOffer = d.product.offers.find((o) => o.is_default) ?? d.product.offers[0] ?? null;
    return {
      slug,
      regionCode: meta.regionCode,
      countryEn: meta.countryEn,
      countryAr: meta.countryAr,
      currency: d.currency,
      currencyLabelAr: d.currencyLabelAr,
      numberLocale: d.numberLocale,
      productId: d.product.id,
      titleAr: d.product.title_ar,
      path,
      absoluteUrl: `${origin}${path}`,
      defaultOfferCode: defOffer?.code ?? null,
      defaultOfferLabelAr: defOffer?.label_ar ?? null,
      defaultOfferPrice: defOffer?.price_sar ?? null,
      offerCount: d.product.offers.length,
      topPromoStrip: d.topPromoStrip,
      valueStripDelivery: d.valueStripDelivery,
    };
  });
}
