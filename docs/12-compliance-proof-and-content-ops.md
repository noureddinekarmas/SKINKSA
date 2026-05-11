# 12 - Compliance, Proof, and Content Ops

## Core Rule

Premium authority must come from real proof, not fake claims.

The website can have proof placeholders during development, but production must display only verified proof.

## Required Proof Content Types

Create content structures for:

- certifications,
- ingredient sources,
- product packaging/batch images,
- reviews,
- UGC videos,
- before/after images if allowed,
- support policies.

Each proof item needs:

- title,
- source,
- status (`draft`, `verified`, `published`),
- asset URL,
- description,
- date added.

Only `published` items render on production pages.

## Skincare Claim Rules

Allowed:

- supports appearance,
- helps improve appearance,
- promotes visible radiance,
- supports skin-feeling smoother,
- results vary by skin type.

Avoid unless legally substantiated:

- cures skin disease,
- removes wrinkles permanently,
- clinically proven percentages,
- dermatologist recommended,
- FDA/SFDA certified,
- medical treatment.

## Before/After Rules

If used:

- must be real customer consented,
- no misleading lighting/editing,
- include disclaimer:
  - `النتائج تختلف حسب نوع البشرة وطريقة الاستخدام.`

## Certification Display

Never show fake certificate logos.

If certification documents are not ready:

- render a "quality promise" section instead,
- hide certification badges until verified.

## Reviews

Reviews must be:

- real,
- Arabic-first,
- optionally city/region if consented,
- not over-edited.

Development placeholders must be clearly marked in code/config.

## Privacy/Policy Pages

Required policy pages:

- Privacy Policy
- Terms and Conditions
- Shipping and COD Policy
- Returns Policy

Include tracking disclosure:

- browser pixels,
- server-side ad measurement,
- order data storage for COD operations.

## Paid Traffic Readiness

Before scaling ads:

- replace placeholder images,
- replace placeholder reviews,
- verify proof claims,
- test all events,
- test sheet webhook,
- test mobile UX in TikTok/Snap in-app browsers.
