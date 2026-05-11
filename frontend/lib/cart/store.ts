import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartOffer {
  code: "OFFER_1" | "OFFER_2" | "OFFER_3";
  quantity: number;
  price_sar: number;
  label_ar: string;
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
  isUpsell?: boolean;
  image?: string;
}

interface CartState {
  items: CartItem[];
  selectedOffer: CartOffer | null;
  isDrawerOpen: boolean;
  isCheckoutOpen: boolean;
  addOfferToCart: (offer: CartOffer, product: { id: string; slug: string; titleAr: string }) => void;
  addCrossSell: (item: CartItem) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  cartTotal: () => number;
  openDrawer: () => void;
  closeDrawer: () => void;
  openCheckout: () => void;
  closeCheckout: () => void;
  setSelectedOffer: (offer: CartOffer) => void;
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
          image: "/placeholders/serum-bottle.svg",
        };
        set({ items: [item], selectedOffer: offer, isDrawerOpen: true });
      },
      addCrossSell: (item) => set((state) => ({ items: [...state.items, item] })),
      removeItem: (id) => set((state) => ({ items: state.items.filter((i) => i.id !== id) })),
      clearCart: () => set({ items: [], selectedOffer: null }),
      cartTotal: () => get().items.reduce((sum, item) => sum + item.totalPrice, 0),
      openDrawer: () => set({ isDrawerOpen: true }),
      closeDrawer: () => set({ isDrawerOpen: false }),
      openCheckout: () => set({ isCheckoutOpen: true }),
      closeCheckout: () => set({ isCheckoutOpen: false }),
      setSelectedOffer: (offer) => set({ selectedOffer: offer }),
    }),
    { name: "skinksa-cart", partialize: (state) => ({ items: state.items, selectedOffer: state.selectedOffer }) }
  )
);
