import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { MAIN_PRODUCT_SLUG } from "@/lib/content/main-product";

/**
 * When NEXT_PUBLIC_PRODUCT_MARKETING_HOST matches the request Host (e.g. shop.blueksa),
 * the site root shows the product page while the address bar stays on the subdomain.
 * Requires DNS + panel: point that hostname to this Next app.
 */
export function middleware(request: NextRequest) {
  const configured = process.env.NEXT_PUBLIC_PRODUCT_MARKETING_HOST?.trim().toLowerCase();
  if (!configured) {
    return NextResponse.next();
  }

  const host = request.headers.get("host")?.split(":")[0]?.toLowerCase();
  if (host !== configured) {
    return NextResponse.next();
  }

  const { pathname } = request.nextUrl;
  if (pathname === "/" || pathname === "") {
    const url = request.nextUrl.clone();
    url.pathname = `/products/${MAIN_PRODUCT_SLUG}`;
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/"],
};
