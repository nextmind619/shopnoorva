# Mobile Laptop Desk — Image prompts (NOORVA Morocco)

Place finished files in `shopnoorva-laptop-desk/sources/` then run:

```bash
node scripts/optimize-laptop-desk-images.mjs
```

| Output key | Filename base | Use on PDP |
|------------|---------------|------------|
| `01-hero-white-bg` | 01-hero-white-bg | Gallery / catalog white bg |
| `02-premium-hero` | 02-premium-hero | Main hero slide |
| `10-features` | 10-features | 4-panel features composite |
| `03-lifestyle` | 03-lifestyle | Sofa / salon lifestyle |
| `14-product-in-use` | 14-product-in-use | Bed / WFH use |
| `17-infographic` | 17-infographic | Specs one-pager (optional) |
| `gift-crossbody-bag` | gift-crossbody-bag | Free gift slide + gift module |

Until then, the site uses **SVG placeholders** under `public/products/mobile-laptop-desk-with-wheels/`.

---

## 01-hero-white-bg

**Prompt (EN):**  
Premium e-commerce hero photo, pure white seamless background (#FFFFFF), mobile C-shaped laptop desk with light oak wood grain tabletop and white metal frame, four black caster wheels with locks visible, slight 3/4 angle, soft studio lighting, no text, no watermark, ultra sharp product photography, 2048×2048.

**Prompt (AR brief):** صورة منتج على خلفية بيضاء نقية — طاولة لابتوب C-shape، سطح خشبي فاتح، هيكل أبيض، عجلات سوداء.

---

## 02-premium-hero

**Prompt (EN):**  
High-end Moroccan COD ad hero, warm modern living room, beige sofa, natural window light, same mobile laptop desk with oak top and white legs, laptop + mouse + phone + small plant on top, yellow subtle height-adjustment arrows on legs (optional), cinematic but realistic, no fake logos, space at top for Arabic headline overlay, 1:1 2048×2048, photorealistic.

**Negative:** blurry, cartoon, wrong desk shape, glass top only, no wheels.

---

## 10-features (4-panel composite)

**Prompt (EN):**  
Marketing infographic composite, 4 rounded panels on soft grey gradient background, yellow header bars with **English** labels only: "Spacious Tabletop", "Adjustable Height", "Lockable Wheels", "Multi-Purpose Use". Center: large lifestyle shot of oak+white rolling laptop desk in bright salon. Panels show: (1) top-down desk with laptop, (2) close-up height knob on white leg, (3) caster wheel with 360° lock lever, (4) desk slid under bed as bedside table. Clean Amazon-style layout, photorealistic, 2048×2048.

**Note:** Match the reference composite you provided; replace any stock watermarks.

---

## 03-lifestyle

**Prompt (EN):**  
Young Moroccan professional woman or man working on laptop at rolling desk next to beige sofa, Casablanca-style modern apartment, afternoon sun, desk wheels visible, relaxed WFH mood, authentic not overly staged, 4:3 or 1:1, photorealistic.

---

## 14-product-in-use

**Prompt (EN):**  
Bedroom scene: mobile laptop desk base slid under bed frame, laptop on oak surface, person sitting on bed using laptop comfortably, white C-frame and locked wheels visible, cozy evening light, photorealistic, 4:3.

---

## 17-infographic

**Prompt (EN):**  
Single vertical infographic in Arabic RTL layout for NOORVA: icons + short bullets — adjustable height, 360° wheels with lock, spacious top, C-shape slides under sofa/bed, COD Morocco, free gift bag. Colors: indigo #6366f1 + amber gift accent. No fake reviews. 1080×1350 PNG.

---

## gift-crossbody-bag (free gift)

**Prompt (EN):**  
Studio product photo, pure white background, black anti-theft crossbody messenger bag, brown side panels, USB charging port on side, combination lock on zipper, padded strap, matte water-resistant fabric, 3/4 angle, no "FASHION" text (or minimal blank front), photorealistic 1024×1024.

**Post:** add amber pill top-right: «🎁 هدية مجانية» (or run optimize script with `withGiftBadge: true`).

---

## Brand rules (all images)

- Realistic product only — **no** astronaut, galaxy, unrelated gadgets.
- Moroccan market: modest, trustworthy, COD-friendly (no credit card visuals).
- Leave safe margin for RTL text overlays on hero if needed.
