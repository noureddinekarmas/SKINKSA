const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.officialskinksa.store";

export type StoreAnalyticsEventType =
  | "page_view"
  | "product_view"
  | "add_to_cart"
  | "begin_checkout";

export interface TrackStoreEventInput {
  event_type: StoreAnalyticsEventType;
  path?: string | null;
  product_slug?: string | null;
  session_id?: string | null;
  utm_source?: string | null;
  utm_medium?: string | null;
  utm_campaign?: string | null;
}

/** Fire-and-forget; never throws to the UI */
export function trackStoreEvent(payload: TrackStoreEventInput): void {
  if (typeof window === "undefined") return;
  void fetch(`${API_BASE}/v1/analytics/events`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  }).catch(() => {});
}
