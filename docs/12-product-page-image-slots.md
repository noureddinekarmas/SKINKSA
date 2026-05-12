# Product page — image slots (`/products/blueskin`)

Put files in: **`frontend/public/images/product/`**

Use **exact filenames** below (or rename your exports to match before copying). The site loads them as static URLs: `/images/product/<filename>?v=<PRODUCT_ASSET_VERSION>`.

## Nine slots (current layout)

The product page is built for **nine** distinct images. If you only have **eight**, send all eight and say which slot is missing — we can **reuse** one image in two places in code.

| # | **Filename (use this name)** | **Where it appears on the page** |
|---|------------------------------|----------------------------------|
| 1 | `gallery-main-1.png` | **Hero — main carousel** (first/largest thumb: pack shot bottle). Also cart thumbnail & home hero. |
| 2 | `gallery-texture-2.png` | **Hero carousel** (thumb «القوام»). **Listed gallery** block. |
| 3 | `gallery-usage-3.png` | **Hero carousel** (thumb «الاستخدام»). **«وش يتغيّر…» / benefits** — large image on the right. |
| 4 | `gallery-quality-4.png` | **Hero carousel** (thumb «الجودة»). **Mechanism / science** block — photo under «نقاط إثبات». |
| 5 | `section-before-after.jpg` | **«قبل وبعد»** full-width section (before/after). **Listed gallery** block. Prefer `.jpg`. |
| 6 | `section-lifestyle-model.png` | **«في يومج العادي»** — lifestyle / model holding product. |
| 7 | `story-card-1.png` | **Story bento — card 1** («وجهج يقول تعب؟»). **Listed gallery** block. |
| 8 | `story-card-2.png` | **Story bento — card 2** («ليش ذا المكوّن؟»). |
| 9 | `story-card-4.png` | **Story bento — card 3** («ثقة قبل الفلوس»). *(Same art as your `story-card-4.png`; not `story-card-3.png`.)* |

## Eight images?

Pick one merge strategy and tell us:

- **Option A:** Use the same file for `gallery-quality-4.png` and `gallery-usage-3.png` (we point both slots to one asset in code), **or**
- **Option B:** Use one image for both `story-card-2.png` and `story-card-4.png`, **or**
- **Option C:** Skip a hero thumb (only 3 carousel extras instead of 4) — requires a small code change.

## Why images «don’t appear»

1. **Wrong folder** — must be `frontend/public/images/product/`, not Desktop only.
2. **Wrong filename** — must match the table (Linux servers are **case-sensitive**: `.JPG` ≠ `.jpg`).
3. **Deploy** — after pushing, the hosting build must include `public/` and a new deploy must run.
4. **Cache** — after replacing files, bump `PRODUCT_ASSET_VERSION` in `frontend/lib/content/product-assets.ts`.

## What to send next

Rename your **8 (or 9)** files to the names in column 2, list them in a message like:

`1 gallery-main-1.png — done`, `2 gallery-texture-2.png — done`, …

Or zip the folder `product/` with correctly named files — we can verify paths in the repo.
