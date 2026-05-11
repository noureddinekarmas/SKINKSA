# 09 - Tracking Pixels, CAPI, and Deduplication

## Goal

Maximize paid traffic signal quality while keeping page speed high.

Implement:

- Meta Pixel + Meta Conversions API
- TikTok Pixel + TikTok Events API
- Snapchat Pixel + Snapchat Conversions API

## Performance Rule

All browser pixels must be deferred.

Use Next.js:

```tsx
<Script strategy="afterInteractive" />
```

Do not block first paint or LCP with tracking code.

## Event List

Required events:

- `PageView`
- `ViewContent`
- `AddToCart`
- `InitiateCheckout`
- `SubmitCODForm`
- `UpsellView`
- `UpsellAccept`
- `UpsellSkip`
- `Purchase`

Map custom events to platform standard events where possible:

- `ViewContent` -> standard view content
- `AddToCart` -> standard add to cart
- `InitiateCheckout` -> standard checkout
- `Purchase` -> standard purchase
- custom upsell events can remain custom.

## Deduplication Rule

Generate one `event_id` per action in frontend.

The same `event_id` must be:

- sent to browser pixel event,
- sent in backend API payload,
- used in server-side CAPI event.

This allows platforms to deduplicate browser/server copies.

## Event ID Format

Use UUID v4 or ULID.

Examples:

- `atc_01HX...`
- `purchase_01HX...`

Prefixing is useful for debugging but not required.

## Attribution Capture

Capture and persist:

- `utm_source`
- `utm_medium`
- `utm_campaign`
- `utm_content`
- `utm_term`
- `fbclid`
- `ttclid`
- Snap click id if present
- landing page
- referrer

Store in local/session storage and send with order.

## Phone Normalization

Accepted user inputs:

- `05XXXXXXXX`
- `5XXXXXXXX`
- `+9665XXXXXXXX`
- `9665XXXXXXXX`

Normalize:

- E.164: `+9665XXXXXXXX`
- digits only: `9665XXXXXXXX`

## Hashing Rules

Hash with SHA-256 lowercase hex on backend only.

Meta:

- `ph` should be digits-only with country code, then SHA-256 hashed.
- For KSA: hash `9665XXXXXXXX`.

Snapchat:

- remove non-numeric characters including `+`,
- include country code,
- remove leading local `0`,
- hash digits-only value.
- For KSA: hash `9665XXXXXXXX`.

TikTok:

- Advanced Matching / Events API requires hashed email/phone for manual server matching.
- Use lowercase SHA-256 hex.
- Store both `+966...` and `966...` normalized values.
- Implement provider-specific formatter so final payload can be adjusted based on TikTok endpoint diagnostics.

## Server Payload Common Data

Each CAPI service should receive:

- event name,
- event id,
- event time,
- source URL,
- IP address,
- user agent,
- phone hash,
- click id if available,
- value,
- currency `SAR`,
- contents/products,
- order id for purchase.

## Browser Event Timing

Fire browser events:

- `ViewContent`: product page load.
- `AddToCart`: CTA click after cart add succeeds.
- `InitiateCheckout`: checkout popup open.
- `SubmitCODForm`: valid checkout form submitted.
- `UpsellView`: upsell screen displayed.
- `UpsellAccept`/`UpsellSkip`: user decision.
- `Purchase`: finalization success / thank-you.

## Backend Event Timing

Fire server events:

- on draft order: `InitiateCheckout` and/or `SubmitCODForm`.
- on upsell decision: upsell event.
- on finalize: `Purchase`.

Avoid duplicate server `Purchase`.

## Privacy

- no raw phone in logs,
- do not expose CAPI tokens in frontend,
- privacy policy must disclose tracking and advertising measurement.

## QA Checklist

Before launch:

- Meta Pixel Helper sees browser events.
- Meta Events Manager sees CAPI events and dedup.
- TikTok Pixel Helper sees browser events.
- TikTok Events Manager sees server events.
- Snap Pixel Helper / Events Manager sees events.
- Purchase value equals final COD total.
- Currency is always `SAR`.
- Event IDs match browser/server pairs.
