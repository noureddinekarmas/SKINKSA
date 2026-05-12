"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { trackStoreEvent } from "@/lib/api/analytics";
import { getOrCreateSessionId, readUtmFromLocation } from "@/lib/analytics/session";
import { trackBrowserPixelsRoutePageView } from "@/lib/tracking";

/**
 * Sends page_view / product_view with server-side MaxMind + optional IPQuality filtering.
 */
export default function AnalyticsBeacon() {
  const pathname = usePathname() || "/";
  const lastPath = useRef<string | null>(null);
  /** First pathname effect matches full page load; PixelScripts already sent PageView / ttq.page() / PAGE_VIEW. */
  const skipRoutePixelPageViews = useRef(true);

  useEffect(() => {
    if (lastPath.current === pathname) return;
    lastPath.current = pathname;

    const fromUrl = readUtmFromLocation();

    const productSlug = pathname.startsWith("/products/")
      ? pathname.replace(/^\/products\//, "").split("/")[0] || null
      : null;

    const eventType = productSlug ? "product_view" : "page_view";

    trackStoreEvent({
      event_type: eventType,
      path: pathname,
      product_slug: productSlug,
      session_id: getOrCreateSessionId(),
      utm_source: fromUrl.utm_source,
      utm_medium: fromUrl.utm_medium,
      utm_campaign: fromUrl.utm_campaign,
    });

    if (skipRoutePixelPageViews.current) {
      skipRoutePixelPageViews.current = false;
    } else {
      trackBrowserPixelsRoutePageView();
    }
  }, [pathname]);

  return null;
}
