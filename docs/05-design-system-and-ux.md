# 05 - Design System and UX

## Visual Strategy

SKINKSA should look like:

- premium clinical skincare,
- high-end DTC beauty,
- Arabic-first and Saudi-friendly,
- clean, trustworthy, and modern.

Avoid:

- generic dropshipping templates,
- cluttered badges,
- fake luxury gold overload,
- cheap countdown spam.

## Color Palette

Primary:

- Midnight Indigo: `#312E81`

Secondary:

- Soft Copper: `#B7791F`

Accent:

- Serum Blue: `#2563EB`

Neutrals:

- Ink: `#0F172A`
- Slate: `#475569`
- Mist: `#F8FAFC`
- Border: `#E2E8F0`
- White: `#FFFFFF`

Semantic:

- Success: `#15803D`
- Warning: `#B45309`
- Error: `#B91C1C`

## Typography

Arabic:

- Primary: `IBM Plex Sans Arabic`
- Alternate: `Tajawal`

English/numbers:

- `Inter`

Rules:

- use large mobile-readable Arabic text,
- avoid very thin weights,
- CTA text should be bold enough for mobile.

## Tailwind Theme Tokens

Use Tailwind CSS v4 CSS-first `@theme` tokens in `app/globals.css`:

```css
@import "tailwindcss";

@theme {
  --font-sans: "IBM Plex Sans Arabic", "Tajawal", "Inter", sans-serif;
  --color-brand-primary: #312E81;
  --color-brand-copper: #B7791F;
  --color-brand-blue: #2563EB;
  --color-brand-ink: #0F172A;
  --color-brand-mist: #F8FAFC;
}
```

## Header Design

Right-side brand lockup:

- circle with `N` in white,
- circle background `#312E81`,
- next to it text logo:
  - `SKINKSA` main,
  - `SKINKSA` smaller below.

Even though the brand name is English, keep UI Arabic-first.

## Component Style

Cards:

- rounded corners,
- soft border,
- subtle shadow,
- lots of whitespace.

Buttons:

- primary solid indigo,
- secondary white with border,
- checkout CTA high contrast.

Badges:

- use sparingly,
- best value badge in copper,
- COD/trust badges in neutral/green.

## Layout Rules

Desktop:

- max width `1200px`,
- alternating text/image sections:
  - text right + image left,
  - next section text left + image right.

Mobile:

- single column,
- sticky CTA on product page,
- cart drawer full height or bottom sheet.

## Image Placeholder Spec

Provide replaceable placeholders:

- `/placeholders/serum-bottle.webp`
- `/placeholders/serum-texture.webp`
- `/placeholders/copper-peptide-ingredient.webp`
- `/placeholders/lifestyle-vanity.webp`

If AI coder cannot generate images, use gradient/photo placeholders with descriptive alt text and clear filenames.

## Recommended UI Libraries

Use:

- `shadcn/ui` for dialog, drawer/sheet, accordion, button, input.
- `lucide-react` for icons.
- `framer-motion` only for subtle reveal and drawer transitions.

Accessibility:

- Dialogs must trap focus.
- Buttons must have accessible names.
- Form errors must be announced visually and programmatically.
