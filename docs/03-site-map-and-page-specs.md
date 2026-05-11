# 03 - Site Map and Page Specs

## Required Public Routes

- `/` - Home
- `/collections` - Collection page
- `/products/blue-copper-peptide-serum` - Main product landing page
- `/about` - About SKINKSA
- `/contact` - Contact
- `/thank-you` - Order confirmation
- `/privacy-policy`
- `/terms-and-conditions`
- `/shipping-and-cod-policy`
- `/returns-policy`

## Global Header

Layout direction: RTL.

Header structure:

- Right:
  - circular monogram with `N` inside,
  - circle uses brand primary color,
  - beside it text logo:
    - first line: `SKINKSA`
    - second line: `SKINKSA` smaller.
- Center:
  - nav links: `الرئيسية`, `المجموعة`, `عن SKINKSA`, `تواصل معنا`.
- Left:
  - cart button with count badge.

Behavior:

- sticky,
- desktop nav visible,
- mobile hamburger or compact nav,
- cart opens drawer globally,
- subtle shadow/blur after scroll.

## Global Footer

Footer must include:

- brand description,
- menu links,
- policy links,
- support contact placeholders,
- social placeholders,
- COD and shipping reassurance,
- copyright.

## Home Page

Primary purpose: make SKINKSA feel like a real premium brand before pushing offer.

Sections:

1. Hero
   - emotional premium claim,
   - product visual placeholder,
   - CTA to product/offer.

2. Trust strip
   - `الدفع عند الاستلام`
   - `شحن داخل السعودية`
   - `دعم عبر الواتساب`
   - `جودة موثقة`

3. Pain-to-solution
   - tired/dull skin problem,
   - SKINKSA as premium routine solution.

4. Product spotlight
   - show main product,
   - show 2 or 3 bundle cards,
   - CTA opens product page or cart flow.

5. Ingredient science
   - copper peptide explanation,
   - supporting ingredients placeholder,
   - no unsupported medical claims.

6. Social proof
   - review cards,
   - UGC/video placeholders,
   - KSA customer context.

7. Quality and certification
   - slots for real certificates,
   - batch/quality promise.

8. FAQ
   - address objections before CTA.

9. Final CTA
   - premium scarcity + COD reassurance.

## Collection Page

Purpose: make catalog feel brand-owned and scalable.

Include:

- collection hero,
- product grid,
- product card for main serum,
- placeholder cards only if clearly marked as coming soon,
- CTA to product page.

Product card must show:

- benefit headline,
- star row,
- price/bundle from,
- scarcity badge,
- CTA.

## Product Landing Page

Purpose: highest-converting page for paid traffic.

Sections:

1. Product hero with gallery
   - 4 image slots:
     - bottle render,
     - texture,
     - ingredient shot,
     - lifestyle/vanity shot.

2. Offer selector
   - 1pc/2pc/3pc cards,
   - best value badge,
   - savings calculation.

3. CTA block
   - add selected offer to cart,
   - open cart drawer immediately.

4. Results/benefits
   - benefit-led but compliant.

5. Ingredient science
   - simple Arabic explanation.

6. How to use
   - morning/evening guidance placeholder.

7. Reviews and UGC
   - verified review structure.

8. Quality/certifications
   - real proof only.

9. FAQ
   - near final CTA.

10. Sticky mobile CTA
   - selected offer + price + CTA.

## About Page

Include:

- brand story,
- why SKINKSA exists,
- quality philosophy,
- KSA customer focus,
- founder/brand image placeholder,
- trust CTA.

## Contact Page

Include:

- WhatsApp button placeholder,
- email placeholder,
- phone placeholder,
- working hours,
- support promise,
- simple contact form optional.

## Thank-You Page

Must be dynamic by order id token.

Show:

- order number,
- items,
- total,
- COD reminder,
- confirmation expectation,
- support contact,
- event tracking confirmation (`Purchase` server/browser already fired).
