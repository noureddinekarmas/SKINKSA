declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
    ttq?: {
      track: (event: string, data?: Record<string, unknown>, opts?: { event_id?: string }) => void;
      page?: () => void;
      ready?: (cb: () => void) => void;
    };
    snaptr?: (action: string, event?: string, data?: unknown) => void;
  }
}

export function generateEventId(prefix?: string): string {
  const id = crypto.randomUUID();
  return prefix ? `${prefix}_${id}` : id;
}

interface TrackingEvent {
  eventName: string;
  eventId: string;
  value?: number;
  currency?: string;
  contents?: Array<{ id: string; quantity: number; item_price?: number }>;
  userData?: { phone?: string };
  /** Display name for product / bundle (TikTok content_name) */
  contentName?: string;
}

/** TikTok Pixel standard names (see TikTok Events Manager) */
const tikTokStandardMap: Record<string, string> = {
  ViewContent: "ViewContent",
  AddToCart: "AddToCart",
  InitiateCheckout: "InitiateCheckout",
  SubmitCODForm: "SubmitForm",
  Purchase: "CompletePayment",
  UpsellView: "ViewContent",
  UpsellAccept: "AddToCart",
  UpsellSkip: "ClickButton",
};

type TikTokContent = {
  content_id: string;
  content_type: "product";
  content_name?: string;
  quantity?: number;
  price?: number;
};

function toTikTokContents(contents: NonNullable<TrackingEvent["contents"]>, contentName?: string): TikTokContent[] {
  return contents.map((c) => ({
    content_id: c.id,
    content_type: "product",
    ...(contentName ? { content_name: contentName } : {}),
    quantity: c.quantity,
    ...(c.item_price != null && !Number.isNaN(c.item_price) ? { price: c.item_price } : {}),
  }));
}

function buildTikTokPayload(
  tikTokEvent: string,
  value: number | undefined,
  currency: string,
  contents: NonNullable<TrackingEvent["contents"]>,
  contentName?: string
): Record<string, unknown> {
  const payload: Record<string, unknown> = { currency };
  if (value != null && !Number.isNaN(value) && value > 0) {
    payload.value = value;
  }
  let ttContents = toTikTokContents(contents, contentName);
  if (tikTokEvent === "ClickButton" && ttContents.length === 0) {
    ttContents = [{ content_id: "upsell_decline", content_type: "product" }];
  }
  if (ttContents.length) payload.contents = ttContents;
  return payload;
}

/** Call on client-side route changes (App Router); initial load is covered by Pixel snippet `ttq.page()`. */
export function trackTikTokRoutePageView(): void {
  if (process.env.NEXT_PUBLIC_ENABLE_TRACKING !== "true") return;
  if (!process.env.NEXT_PUBLIC_TIKTOK_PIXEL_ID) return;
  if (typeof window === "undefined") return;
  const ttq = window.ttq;
  if (!ttq) return;
  const fire = () => {
    if (typeof ttq.page === "function") ttq.page();
  };
  if (typeof ttq.ready === "function") ttq.ready(fire);
  else fire();
}

/** Meta Pixel: snippet already fires PageView on first paint; call on App Router navigations only. */
export function trackMetaRoutePageView(): void {
  if (process.env.NEXT_PUBLIC_ENABLE_TRACKING !== "true") return;
  if (!process.env.NEXT_PUBLIC_META_PIXEL_ID) return;
  if (typeof window === "undefined") return;
  if (typeof window.fbq === "function") window.fbq("track", "PageView");
}

/** Snap Pixel: matches initial `snaptr('track','PAGE_VIEW')` on client-side navigations. */
export function trackSnapRoutePageView(): void {
  if (process.env.NEXT_PUBLIC_ENABLE_TRACKING !== "true") return;
  if (!process.env.NEXT_PUBLIC_SNAP_PIXEL_ID) return;
  if (typeof window === "undefined") return;
  if (typeof window.snaptr === "function") window.snaptr("track", "PAGE_VIEW");
}

/** Fire deferred pixels’ route PageView after the first pathname (full load handled by PixelScripts). */
export function trackBrowserPixelsRoutePageView(): void {
  trackMetaRoutePageView();
  trackTikTokRoutePageView();
  trackSnapRoutePageView();
}

export function trackCommerceEvent({
  eventName,
  eventId,
  value,
  currency = "SAR",
  contents = [],
  contentName,
}: TrackingEvent) {
  if (process.env.NEXT_PUBLIC_ENABLE_TRACKING !== "true") return;

  const metaEventMap: Record<string, string> = {
    ViewContent: "ViewContent",
    AddToCart: "AddToCart",
    InitiateCheckout: "InitiateCheckout",
    Purchase: "Purchase",
    SubmitCODForm: "SubmitApplication",
    UpsellView: "CustomEvent",
    UpsellAccept: "CustomEvent",
    UpsellSkip: "CustomEvent",
  };

  if (typeof window.fbq === "function") {
    const metaEvent = metaEventMap[eventName] || eventName;
    const isStandard = ["ViewContent", "AddToCart", "InitiateCheckout", "Purchase"].includes(metaEvent);
    if (isStandard) {
      window.fbq("track", metaEvent, { value, currency, contents }, { eventID: eventId });
    } else {
      window.fbq("trackCustom", eventName, { value, currency, contents }, { eventID: eventId });
    }
  }

  if (typeof window.ttq?.track === "function") {
    const tikTokEvent = tikTokStandardMap[eventName];
    if (tikTokEvent) {
      const payload = buildTikTokPayload(tikTokEvent, value, currency, contents, contentName);
      window.ttq.track(tikTokEvent, payload, { event_id: eventId });
    }
  }

  if (typeof window.snaptr === "function") {
    window.snaptr("track", eventName, { price: value, currency, transaction_id: eventId });
  }

  if (process.env.NEXT_PUBLIC_DEBUG_TRACKING === "true") {
    console.debug("[tracking]", eventName, { value, currency, contents, contentName, eventId });
  }
}

export function getAttributionFromStorage(): Record<string, string> {
  if (typeof window === "undefined") return {};
  try {
    const stored = sessionStorage.getItem("skinksa_attribution");
    return stored ? (JSON.parse(stored) as Record<string, string>) : {};
  } catch {
    return {};
  }
}

export function captureAttribution() {
  if (typeof window === "undefined") return;
  try {
    const params = new URLSearchParams(window.location.search);
    const attribution: Record<string, string> = {
      source_url: window.location.href,
      utm_source: params.get("utm_source") || "",
      utm_medium: params.get("utm_medium") || "",
      utm_campaign: params.get("utm_campaign") || "",
      utm_content: params.get("utm_content") || "",
      utm_term: params.get("utm_term") || "",
      fbclid: params.get("fbclid") || "",
      ttclid: params.get("ttclid") || "",
      snap_click_id: params.get("sc_id") || "",
      user_agent: navigator.userAgent,
    };
    sessionStorage.setItem("skinksa_attribution", JSON.stringify(attribution));
  } catch {
    // silent fail
  }
}
