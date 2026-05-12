import { apiFetch } from "./client";

export interface DraftOrderPayload {
  customer_name: string;
  customer_phone: string;
  customer_address?: string;
  customer_province?: string;
  /** ISO currency for the storefront checkout (SAR / QAR / KWD). Stored on the order; amounts still use `unit_price_sar` field name in the payload for API compatibility. */
  checkout_currency?: string;
  cart_items: Array<{
    product_id?: string;
    offer_code: string;
    quantity: number;
    unit_price_sar: number;
    title_snapshot: string;
  }>;
  attribution?: {
    source_url?: string;
    utm_source?: string;
    utm_medium?: string;
    utm_campaign?: string;
    utm_content?: string;
    utm_term?: string;
    fbclid?: string;
    ttclid?: string;
    snap_click_id?: string;
    user_agent?: string;
    ip_address?: string;
  };
  event_ids?: {
    initiate_checkout?: string;
    add_to_cart?: string;
  };
}

export interface DraftOrderResponse {
  id: string;
  order_number: string;
  status: string;
  total_sar: number;
}

export async function createDraftOrder(payload: DraftOrderPayload): Promise<DraftOrderResponse> {
  return apiFetch<DraftOrderResponse>("/v1/orders/draft", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function applyUpsell(orderId: string, accepted: boolean): Promise<unknown> {
  return apiFetch(`/v1/orders/${orderId}/upsell`, {
    method: "POST",
    body: JSON.stringify({ accepted }),
  });
}

export async function finalizeOrder(orderId: string, eventIdPurchase?: string): Promise<unknown> {
  return apiFetch(`/v1/orders/${orderId}/finalize`, {
    method: "POST",
    body: JSON.stringify({ event_id_purchase: eventIdPurchase }),
  });
}

export async function getOrderSummary(orderId: string): Promise<unknown> {
  return apiFetch(`/v1/orders/${orderId}/summary`);
}
