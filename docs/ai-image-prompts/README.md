# NOORVA — AI Image Prompt Library

Production-ready AI image prompts for every image location across every NOORVA product page. Built for a Moroccan, Arabic-only, Cash-on-Delivery luxury lighting/gift brand with an Apple × Nothing × Dyson × Tesla minimalist aesthetic.

This is a **prompt library**, not generated images. Each entry below is copy-paste-ready for GPT Image, Midjourney, Flux, Ideogram, or Stable Diffusion (minor syntax tweaks noted per tool at the bottom of this file).

## Files in this library

| File | Product | SKU |
|---|---|---|
| [`astronaut-galaxy-projector.md`](./astronaut-galaxy-projector.md) | بروجيكتور رائد الفضاء — Astronaut Galaxy Projector | NRV-ASTRO-01 |
| [`crystal-galaxy-projector.md`](./crystal-galaxy-projector.md) | بروجيكتور كريستال مجرة — Crystal Galaxy Projector | NRV-CRYSTAL-01 |
| [`galaxy-star-projector.md`](./galaxy-star-projector.md) | بروجيكتور نجوم المجرة (Style 2) — Galaxy Star Projector | NRV-STAR-01 |
| [`carousel-night-light.md`](./carousel-night-light.md) | مصباح كاروسيل ليلي — Carousel Night Light | NRV-CAROUSEL-01 |

Each file contains the same **30 image locations**, in the same order, so the set is consistent across the catalog and will auto-extend cleanly to future products (duplicate a file, swap the "Product Visual DNA" block, regenerate).

---

## 1. Brand Visual DNA (applies to every prompt in every file)

Use this as the shared foundation baked into every "Final AI Prompt" below. When creating prompts for a *future* product, keep this section identical and only swap the product-specific block described in each file.

**Brand world:** Apple × Nothing × Dyson × Tesla. Quiet luxury, not "dropshipping." Product photography that could sit inside a flagship Apple Store or a Dyson Demo showroom, re-skinned for a cosmic/gift-lighting brand selling to Morocco via COD.

**Global color system:**
- Base neutrals: warm ivory/cream `#FAF7F2`, soft sand `#F1EAE0`, deep charcoal-black `#0A0A0A`
- Signature accent: champagne/antique gold `#C9A961`
- Cosmic accent family (galaxy scenes only): deep indigo `#1B1035`, nebula violet `#5B3A9E`, teal-cyan `#2FD9C4`, magenta-pink `#E23FA0`
- Never introduce colors outside this system unless the product's own signature color (e.g. carousel pink/gold) requires it

**Global studio baseline (for all non-lifestyle shots):**
- Seamless backdrop, subtle soft gradient, no visible seams or horizon lines
- Large soft diffused key light + gentle rim light for edge separation, low-contrast fill, no harsh amateur flash
- Medium-format digital camera look (Hasselblad/Phase One aesthetic), tack-sharp focus on product, creamy falloff in background
- Generous negative space, centered or rule-of-thirds product placement, no clutter, no props unless specified
- Physically accurate soft shadows and subtle reflections grounding the product — never floating, never flat

**Global negative prompt baseline** (append product-specific negatives per shot):
`no text, no watermark, no logo overlay, no signature, no visible brand name unless specified, no blurry focus, no motion blur unless specified, no distorted proportions, no extra fingers, no deformed hands, no warped remote buttons, no low resolution, no jpeg artifacts, no oversaturation, no plastic-toy cheapness, no dust, no scratches, no fingerprints on lens, no cluttered background, no busy patterns, no cartoon style unless specified, no 3D render look unless specified, no amateur flash photography, no lens flare unless specified, no duplicate products, no asymmetry errors`

**Universal quality/resolution tail** (append to every prompt):
`ultra-realistic commercial product photography, shot on medium format camera, 8K resolution, hyper-detailed, sharp focus, professional retouching, advertising campaign quality, magazine editorial finish`

---

## 2. The 30 Image Locations (applies to every product)

1. Hero Image
2. Pure White Background
3. Luxury Lifestyle Scene
4. Bedroom Scene
5. Living Room Scene
6. Gaming Room
7. Kids Room (if relevant)
8. Romantic Atmosphere
9. Close-up Details
10. Product Materials
11. Product Texture
12. Product in Use
13. Before vs After
14. Premium Packaging
15. What's Inside the Box
16. Product Dimensions
17. Product Features
18. Premium Infographic
19. Trust Image
20. Premium Banner
21. Mobile Banner
22. Collection Banner
23. Social Media Banner
24. Facebook Ad Image
25. Instagram Story
26. TikTok Cover
27. Customer Lifestyle
28. Luxury Flat Lay
29. Premium Gift Scene
30. Night Mode

---

## 3. Fields in every entry

Each of the 30 locations, in each product file, includes:

`Image Name · Purpose · Composition · Camera Angle · Lighting · Lens · Background · Environment · Product Position · Color Palette · Mood · Style · Materials · Textures · Shadows · Reflections · Depth of Field · Quality · Resolution · Negative Prompt · Final AI Prompt`

The **Final AI Prompt** is the only field you need to copy-paste — it already fuses every other field into one dense, tool-ready paragraph. The other fields exist so a designer/art director can tweak one variable (e.g. just the lighting) without rewriting the whole prompt.

---

## 4. Tool-specific syntax notes

The "Final AI Prompt" text is written tool-agnostic. Adapt it like this:

**Midjourney**
Paste the Final AI Prompt, then append parameters, e.g.:
`--ar 1:1 --v 6.1 --style raw --q 2`
(use `--ar 4:5` for mobile banners, `--ar 9:16` for Stories/TikTok, `--ar 16:9` for desktop banners)

**Flux (Flux.1 Pro / Dev)**
Use the Final AI Prompt as-is; Flux respects natural-language photography prompts very literally — keep camera/lens/lighting language intact for best results.

**Stable Diffusion (SDXL/SD3)**
Split the Final AI Prompt into the "Positive Prompt" box and move the entire "Negative Prompt" field into the dedicated negative prompt box. Add a quality booster LoRA if available (e.g. product photography realism LoRA).

**Ideogram**
Use the Final AI Prompt directly; Ideogram handles text-free instructions well — the "no text/no watermark" negative is already baked into the prompt itself for engines without a separate negative field.

**GPT Image**
Use the Final AI Prompt as a single natural-language instruction; GPT Image doesn't use a separate negative-prompt field, so the negative constraints are already folded into the phrasing ("clean background, no text, no watermark...").

---

## 5. How this scales to future products

To generate a 5th, 6th, Nth product file:
1. Duplicate any existing product file as a template
2. Replace the "Product Visual DNA" block at the top with the new product's real materials/colors/shape
3. Keep the Brand Visual DNA (Section 1 above) identical — this is what makes every product page feel like the same premium brand
4. Regenerate the 30 "Final AI Prompt" paragraphs by swapping in the new DNA — the structure, field order, and negative-prompt baseline stay fixed
