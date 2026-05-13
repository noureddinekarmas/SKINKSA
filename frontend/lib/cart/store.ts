import { create } from "zustand";
import { persist } from "zustand/middleware";
import { trackStoreEvent } from "@/lib/api/analytics";
import { getOrCreateSessionId, readUtmFromLocation } from "@/lib/analytics/session";
import type { ShopCurrency } from "@/lib/content/product-landing-data";
import { PRODUCT_CART_IMAGE } from "@/lib/content/products";

export interface CartOffer {
  code: "OFFER_1" | "OFFER_2" | "OFFER_3";
  quantity: number;
  price_sar: number;
  label_ar: string;
  currency: ShopCurrency;
}

export interface CartItem {
  id: string;
  productId: string;
  slug: string;
  titleAr: string;
  offerCode: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  currency: ShopCurrency;
  isUpsell?: boolean;
  image?: string;
}

function emitCartAnalytics(event_type: "add_to_cart" | "begin_checkout", slug: string | null) {
  if (typeof window === "undefined") return;
  const utm = readUtmFromLocation();
  trackStoreEvent({
    event_type,
    path: window.location.pathname || "/",
    product_slug: slug,
    session_id: getOrCreateSessionId(),
    utm_source: utm.utm_source,
    utm_medium: utm.utm_medium,
    utm_campaign: utm.utm_campaign,
  });
}

interface CartState {
  items: CartItem[];
  selectedOffer: CartOffer | null;
  isDrawerOpen: boolean;
  isCheckoutOpen: boolean;
  addOfferToCart: (
    offer: CartOffer,
    product: { id: string; slug: string; titleAr: string; imageUrl?: string | null }
  ) => void;
  addCrossSell: (item: CartItem) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  cartTotal: () => number;
  openDrawer: () => void;
  closeDrawer: () => void;
  openCheckout: () => void;
  closeCheckout: () => void;
  setSelectedOffer: (offer: CartOffer) => void;
  replaceCartWithOffer: (
    offer: CartOffer,
    product: { id: string; slug: string; titleAr: string; imageUrl?: string | null }
  ) => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      selectedOffer: null,
      isDrawerOpen: false,
      isCheckoutOpen: false,
      addOfferToCart: (offer, product) => {
        const item: CartItem = {
          id: `offer-${offer.code}-${Date.now()}`,
          productId: product.id,
          slug: product.slug,
          titleAr: product.titleAr,
          offerCode: offer.code,
          quantity: offer.quantity,
          unitPrice: offer.price_sar / offer.quantity,
          totalPrice: offer.price_sar,
          currency: offer.currency,
          image: product.imageUrl || PRODUCT_CART_IMAGE,
        };
        set({ items: [item], selectedOffer: offer, isDrawerOpen: true });
        emitCartAnalytics("add_to_cart", product.slug);
      },
      addCrossSell: (item) => set((state) => ({ items: [...state.items, item] })),
      removeItem: (id) => set((state) => ({ items: state.items.filter((i) => i.id !== id) })),
      clearCart: () => set({ items: [], selectedOffer: null }),
      cartTotal: () => get().items.reduce((sum, item) => sum + item.totalPrice, 0),
      openDrawer: () => set({ isDrawerOpen: true }),
      closeDrawer: () => set({ isDrawerOpen: false }),
      openCheckout: () => {
        const first = get().items[0];
        emitCartAnalytics("begin_checkout", first ? first.slug : null);
        set({ isCheckoutOpen: true });
      },
      closeCheckout: () => set({ isCheckoutOpen: false }),
      setSelectedOffer: (offer) => set({ selectedOffer: offer }),
      replaceCartWithOffer: (offer, product) => {
        const item: CartItem = {
          id: `offer-${offer.code}-${Date.now()}`,
          productId: product.id,
          slug: product.slug,
          titleAr: product.titleAr,
          offerCode: offer.code,
          quantity: offer.quantity,
          unitPrice: offer.price_sar / offer.quantity,
          totalPrice: offer.price_sar,
          currency: offer.currency,
          image: product.imageUrl || PRODUCT_CART_IMAGE,
        };
        set({ items: [item], selectedOffer: offer, isDrawerOpen: false });
      },
    }),
    { name: "skinksa-cart-v2", partialize: (state) => ({ items: state.items, selectedOffer: state.selectedOffer }) }
  )
);
