# 04 - Funnel, Offers, Cart, Checkout, Upsell

## Funnel Principle

The store should not feel like a normal product page. It should feel like a premium skincare brand funnel:

`authority -> emotion -> proof -> offer -> low-friction COD -> AOV increase -> confirmation`

## Offer Logic

Offers:

- `OFFER_1`: 1 piece, 129 SAR.
- `OFFER_2`: 2 pieces, 159 SAR.
- `OFFER_3`: 3 pieces, 199 SAR.

Recommended default:

- desktop: preselect `OFFER_2`.
- mobile paid traffic: test `OFFER_3` as default.

Savings display:

- 2 pieces vs two single pieces: `وفر 99 ر.س`.
- 3 pieces vs three single pieces: `وفر 188 ر.س`.

Per-piece display:

- 1pc: `129 ر.س / العبوة`
- 2pc: `79.5 ر.س / العبوة`
- 3pc: `66.3 ر.س / العبوة`

## Product CTA Behavior

When CTA is clicked:

1. Validate selected offer.
2. Add exact bundle to cart.
3. Fire `AddToCart` browser event.
4. Open cart drawer.
5. Prepare server event payload with same `event_id`.

## Cart Drawer

Cart drawer content:

- product line item,
- selected bundle,
- quantity,
- subtotal,
- cross-sell carousel,
- trust strip,
- CTA to checkout popup.

Cart cross-sell rules:

- show 2-4 products when available,
- support 1-click add,
- do not discount main serum in cart,
- keep copy premium.

If no real cross-sell products exist yet:

- implement component and seed one placeholder add-on disabled by config,
- allow business to enable later.

## Checkout Popup

Fields:

- full name,
- phone number.

Accepted phone formats:

- `05XXXXXXXX`
- `5XXXXXXXX`
- `+9665XXXXXXXX`
- `9665XXXXXXXX`

Normalize to:

- E.164: `+9665XXXXXXXX`
- digits: `9665XXXXXXXX`

Validation:

- must be Saudi mobile number,
- must begin with Saudi mobile prefix after country code: `5`,
- must contain 9 national digits after `966`.

Submission:

1. Fire `InitiateCheckout` when popup opens.
2. Submit name, phone, cart, attribution, and event ids to backend.
3. Backend creates order with status `draft`.
4. Show upsell interstitial.

## Upsell Interstitial

Timing:

- 10-15 seconds.
- Use `12` seconds default.

Offer:

- relevant product/add-on at 99 SAR.
- This is the only discounted place.

Rules:

- no main product discount here,
- countdown visible,
- accept and skip are both clear,
- after countdown, skip automatically or show "continue" state.

Events:

- `UpsellView`
- `UpsellAccept`
- `UpsellSkip`

After accept/skip:

1. Backend updates order.
2. Backend finalizes order to `pending_confirmation`.
3. Backend sends webhook to Google Sheet.
4. Browser redirects to `/thank-you?order=...`.

## Thank-You Conversion Psychology

Thank-you page should reduce cancellation:

- remind customer that no payment is required now,
- tell her she will receive confirmation,
- show order summary,
- reinforce premium choice,
- offer support.

Example:

`طلبك وصلنا بنجاح. فريقنا راح يتواصل معك لتأكيد التفاصيل قبل الشحن. الدفع عند الاستلام، ولا تحتاجين تدفعين الآن.`

## COD Operations Notes

Store must capture:

- name,
- phone,
- order source,
- UTM/click ids,
- items,
- accepted upsell,
- total.

Recommended later additions:

- city field,
- address field after confirmation,
- WhatsApp confirmation automation.
