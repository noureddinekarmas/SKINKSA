declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
    ttq?: { track: (event: string, data?: unknown, opts?: unknown) => void };
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
}

export function trackCommerceEvent({ eventName, eventId, value, currency = "SAR", contents = [] }: TrackingEvent) {
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
      window.fbq("trackCustom", eventName, { value, currency }, { eventID: eventId });
    }
  }

  if (typeof window.ttq?.track === "function") {
    window.ttq.track(eventName, { value, currency, contents }, { event_id: eventId });
  }

  if (typeof window.snaptr === "function") {
    window.snaptr("track", eventName, { price: value, currency, transaction_id: eventId });
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
