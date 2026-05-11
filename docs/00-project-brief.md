# 00 - Project Brief

## Mission

Create a premium KSA-focused DTC skincare store that feels like SKINKSA owns and manufactures its products, not like a generic dropshipping page.

The website must sell a high-priced serum through:

- strong brand authority,
- Arabic/KSA-native emotional copy,
- visible ingredient science,
- social proof,
- certifications and quality proof,
- high-trust COD checkout,
- bundle economics that push AOV upward.

## Primary Revenue Product

Product:

`سيروم ببتيد النحاس الأزرق لشد البشرة وتجديدها، مضاد للشيخوخة، 30 مل - تركيبة منشطة للبشرة مع خلاصة مُشرقة`

Bundle offers:

| Bundle | Price | Purpose |
| --- | ---: | --- |
| 1 piece | 129 SAR | Premium anchor |
| 2 pieces | 159 SAR | Best-value default |
| 3 pieces | 199 SAR | Highest AOV and scarcity push |

Default selected offer should be either 2 pieces or 3 pieces. Use A/B-ready configuration.

## Required Funnel

1. Paid ad lands on home or product landing page.
2. Visitor reads emotional + proof-led story.
3. Visitor selects an offer.
4. CTA adds selected offer to cart and opens cart drawer.
5. Cart drawer shows order summary and cross-sells.
6. Cart CTA opens checkout popup.
7. Checkout popup has only 2 fields:
   - name,
   - KSA phone number.
8. Valid submission creates order draft.
9. Show 10-15 second upsell screen at 99 SAR.
10. Accept or skip upsell.
11. Finalize order.
12. Redirect to thank-you page.
13. Backend sends full order payload to Google Sheet webhook.
14. Browser pixels and server CAPI fire deduplicated events.

## Product/Brand Reality Rule

The store must look premium and authoritative, but must not fabricate:

- fake certifications,
- fake clinical trials,
- fake dermatologist endorsements,
- fake customer review counts,
- fake before/after results.

The implementation must support placeholders in development, but production content must be marked as verified before display.

## Success Metrics

Track by source, campaign, ad set, creative:

- landing page conversion rate,
- add-to-cart rate,
- checkout submit rate,
- upsell acceptance rate,
- final AOV,
- COD confirmation rate,
- delivery rate,
- refund/return rate,
- CAPI match quality.

## Non-Negotiables

- Arabic-first and RTL.
- Mobile-first.
- Fast loading with deferred third-party scripts.
- COD only.
- Valid KSA phone required.
- High AOV bundle presentation.
- Deduplicated web pixel + CAPI setup.
- Dockerized frontend/backend.
- Backend migrations run on startup.
- Google Sheets order export via Apps Script webhook.
