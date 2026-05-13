import { apiFetch } from "./client";

export interface Offer {
  id: string;
  code: string;
  label_ar: string;
  quantity: number;
  price_sar: number;
  compare_at_sar: number | null;
  is_default: boolean;
  badge_ar: string | null;
  sort_order: number;
}

export interface Product {
  id: string;
  slug: string;
  title_ar: string;
  title_en: string | null;
  description_ar: string | null;
  status: string;
  base_image_url: string | null;
  offers: Offer[];
}

export async function getProducts(): Promise<Product[]> {
  return apiFetch<Product[]>("/v1/products", { cache: "no-store" });
}

export async function getProduct(slug: string): Promise<Product> {
  return apiFetch<Product>(`/v1/products/${slug}`, { cache: "no-store" });
}
