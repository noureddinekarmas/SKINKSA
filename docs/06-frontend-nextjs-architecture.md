# 06 - Frontend Next.js Architecture

## Stack

Use:

- Next.js App Router
- TypeScript
- React
- Tailwind CSS v4
- shadcn/ui
- Zustand for cart state
- React Hook Form + Zod
- TanStack Query for client API mutations
- Next Image
- Next Script

## Folder Structure

```text
frontend/
  app/
    layout.tsx
    globals.css
    page.tsx
    collections/page.tsx
    about/page.tsx
    contact/page.tsx
    products/[slug]/page.tsx
    thank-you/page.tsx
    privacy-policy/page.tsx
    terms-and-conditions/page.tsx
    shipping-and-cod-policy/page.tsx
    returns-policy/page.tsx
  components/
    layout/
    home/
    product/
    cart/
    checkout/
    trust/
    ui/
  lib/
    api/
    cart/
    content/
    phone/
    tracking/
    utils/
  public/
    placeholders/
  package.json
  Dockerfile
```

## Rendering Rules

Default to Server Components.

Use Client Components only for:

- offer selection,
- cart drawer,
- checkout popup,
- upsell timer,
- tracking event dispatcher.

Use App Router metadata exports for SEO.

## Data Strategy

Initial build can use content config files for marketing sections:

- `lib/content/products.ts`
- `lib/content/reviews.ts`
- `lib/content/certifications.ts`

Product/offer/pricing must come from backend or a server-side fetch so the source of truth is not only client-side.

## Frontend API Client

Create typed API functions:

- `getProducts()`
- `getProduct(slug)`
- `createDraftOrder(payload)`
- `applyUpsell(orderId, payload)`
- `finalizeOrder(orderId, payload)`
- `getOrderSummary(orderIdOrToken)`

## Cart State

Zustand store:

- `items`
- `selectedOffer`
- `addOfferToCart`
- `addCrossSell`
- `removeItem`
- `clearCart`
- `cartTotal`
- `openDrawer`
- `closeDrawer`

Cart line item must include:

- product id,
- slug,
- title snapshot,
- offer id,
- quantity,
- unit price,
- total price,
- image.

## Phone Helpers

Create:

- `isValidSaudiMobile(phone: string): boolean`
- `normalizeSaudiMobile(phone: string): { e164: string; digits: string }`

Rules:

- accept `05XXXXXXXX`, `5XXXXXXXX`, `+9665XXXXXXXX`, `9665XXXXXXXX`,
- return `+9665XXXXXXXX` and `9665XXXXXXXX`,
- reject landlines and short/incomplete numbers.

## Tracking Integration Points

Every funnel event should call a helper:

```ts
trackCommerceEvent({
  eventName,
  eventId,
  value,
  currency: "SAR",
  contents,
  userData,
})
```

The same `eventId` must be included in backend request payloads.

## Pixel Script Loading

Use Next.js `Script` with `strategy="afterInteractive"` for Meta/TikTok/Snap base scripts.

Requirements:

- no synchronous third-party scripts in `<head>`,
- queue events until scripts are ready,
- support `NEXT_PUBLIC_ENABLE_TRACKING=false` in dev.

## SEO

Arabic metadata:

- home title and description,
- product title and description,
- Open Graph tags,
- canonical URLs,
- product structured data if feasible.

## Frontend Docker

Use multi-stage Dockerfile:

1. install dependencies,
2. build Next.js,
3. run production server on port `3000`.

Required scripts:

- `dev`
- `build`
- `start`
- `lint`
- `typecheck`
