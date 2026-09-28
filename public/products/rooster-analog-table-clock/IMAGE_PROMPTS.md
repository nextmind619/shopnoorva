# برومبتات صور — ساعة الفروج الكلاسيكية (rooster-analog-table-clock)

**الصفحة:** https://shopnoorva.shop/ar/products/rooster-analog-table-clock

**مرجع المنتج (إلزامي):** `product-reference.jpg` — لا تعيد تصميم الساعة.

بعد التوليد، ضع الملفات في المسارات أدناه ثم:

```bash
node scripts/setup-rooster-clock-images.mjs
```

(أو حدّث `scripts/setup-rooster-clock-images.mjs` بمسارات الـ PNG الجديدة.)

---

## هوية المنتج (ثابتة في كل البرومبتات)

- **الساعة:** ساعة طاولة **analogique**، إطار دائري **كروم/فضي لامع**، **stand معدني** مدمج.
- **الوجه:** أبيض، **أرقام عربية 1–12** سوداء واضحة، **نقاط خضراء** حول الحافة، عقارب سوداء + **عقرب ثواني أحمر**.
- **الوسط:** رسم **دجاجة/فروج** بني/برتقالي يكنس الحب، **فرخ صغير**، **بيت أخضر** وشجر — **نفس الرسم** كالمرجع.
- **الجو:** دار مغربية دافئة، أيام زمان (1980–2000)، كريم/بيج/خشب، ضوء ذهبي، **بدون** مزدحمة، **بدون** نص أو watermark.

---

## 1) `02-premium-hero` — الهيرو (القسم 1)

**أين في الصفحة:** الصورة الكبيرة تحت العنوان العاطفي «كاينين حوايج صغار…» + شبكة الديكور (تكرار).

**المسار:** `public/products/rooster-analog-table-clock/02-premium-hero.jpg`

**النسبة:** 3:4 · **1536×2048** (أو 2000×2000)

**Prompt:**
```
Ultra-realistic lifestyle photograph, vertical 3:4. EXACT rooster analog table clock from reference unchanged: polished chrome circular frame, integrated silver metal stand, white dial with bold black Arabic numerals 1-12, green minute dots, black hour and minute hands, thin red second hand, center folk-art illustration of brown hen pecking grain with small chick, green house and trees. Clock on polished wooden side table in warm nostalgic Moroccan family salon circa 1990s: cream walls, subtle traditional textile or zellige accent, wooden armchair edge soft blur, golden afternoon sunlight from window, uncluttered elegant composition. Photorealistic, shallow depth of field, no people, no text, no watermark, 8K.
```

**Negative:**
```
redesign clock, digital clock, different dial art, modern minimalist clock, cluttered junk, cold blue light, watermark, Arabic text in image, wrong numerals, plastic frame, matte black frame
```

---

## 2) `03-lifestyle` — قسم الذكريات (القسم 2)

**أين:** «واش باقي كتفكر فداك الوقت؟» + شبكة الديكور.

**المسار:** `public/lifestyle/rooster-analog-table-clock/03-lifestyle.jpg`

**النسبة:** 4:3 · **2048×1536**

**Prompt:**
```
Nostalgic emotional lifestyle photo, 4:3. EXACT same chrome rooster table clock from reference on old wooden TV cabinet or shelf in Moroccan grandparents home (dar jdad): warm beige tones, faded family photo frames softly blurred, lace curtain light, calm afternoon mood. Clock product identical to reference — chrome, rooster dial, metal stand. No people, no text, no watermark, photorealistic.
```

**Negative:**
```
different clock model, smart watch, wall clock only without stand, dark horror mood, dirty cheap room, watermark, text overlay
```

---

## 3) `09-close-up` — كشف المنتج + الخاتمة (الأقسام 3 و 9)

**أين:** «ومن هنا جات ساعة الفروج» + «بعض الأشياء ما كتحتاجش…».

**المسار:** `public/products/rooster-analog-table-clock/09-close-up.jpg`

**النسبة:** 1:1 · **2000×2000**

**Prompt (استوديو / منتج حاد):**
```
Studio product photograph, square 1:1. EXACT rooster analog table clock from reference, centered, sharp focus on dial: white face, Arabic numerals, green dots, rooster illustration, chrome frame and stand reflections. Soft warm neutral background (cream gradient), professional e-commerce lighting, slight shadow under stand. Can include hand holding clock ONLY if matching reference composition. No text, no watermark, 8K macro clarity on dial details.
```

**Negative:**
```
altered dial design, wrong hands, missing stand, floating clock, cartoon, watermark, price tag in image
```

**Prompt (بديل — نفس مرجع السوق):**
```
Use uploaded product-reference.jpg as pixel-accurate source; clean background optional; optimize only — do not regenerate dial art.
```

---

## 4) `05-living-room` — شبكة الديكور (القسم 5)

**أين:** «ذكرى من الماضي…» — صالون مغربي.

**المسار:** `public/lifestyle/rooster-analog-table-clock/05-living-room.jpg`

**النسبة:** 4:3 · **2048×1536**

**Prompt:**
```
Traditional Moroccan living room, 4:3. EXACT chrome rooster table clock from reference on low wooden coffee table near sofa with warm textiles (cream, burgundy, brown). 1990s family home nostalgia, soft sunlight, tidy elegant room. Clock unchanged from reference. No people, no text, no watermark, photorealistic.
```

**Negative:**
```
luxury hotel lobby, ultra modern white apartment, wrong clock, clutter, watermark
```

---

## 5) `14-product-in-use` — شبكة الديكور (مدخل / طاولة)

**أين:** شبكة الديكور — مدخل أنيق.

**المسار:** `public/lifestyle/rooster-analog-table-clock/14-product-in-use.jpg`

**النسبة:** 4:3 · **2048×1536**

**Prompt:**
```
Moroccan home entrance foyer, 4:3. EXACT rooster analog table clock from reference on elegant wooden console table. Warm cream walls, subtle burgundy accent, traditional ceramic vase or small brass lantern nearby, golden warm light. Product identical to reference. Uncluttered, photorealistic, no people, no text, no watermark.
```

**Negative:**
```
outdoor souk background, wrong product, digital clock, watermark, crowded props
```

---

## 6) `01-hero-white-bg` — كatalog / OG (اختياري — غير معروض حالياً في الـ LP)

**المسار:** `public/products/rooster-analog-table-clock/01-hero-white-bg.jpg`

**النسبة:** 1:1 · **2000×2000**

**Prompt:**
```
E-commerce hero on pure white background, square 1:1. EXACT rooster analog table clock from reference, front-facing, chrome frame and stand, full dial visible, soft natural shadow beneath stand. Studio lighting, no props, no text, no watermark.
```

---

## 7) `product-reference.jpg` — المرجع الأصلي

**المصدر:** صورة السوق / المنتج الحقيقي — **لا تولّد من الصفر** إلا للخلفية فقط مع تركيب المنتج كما هو.

---

## ملخص استخدام الصور في الصفحة

| ملف الصورة | قسم الصفحة |
|------------|------------|
| `02-premium-hero` | الهيرو + شبكة الديكور |
| `03-lifestyle` | الذاكرة + شبكة الديكور |
| `09-close-up` | كشف المنتج + الرسالة الأخيرة |
| `05-living-room` | شبكة الديكور |
| `14-product-in-use` | شبكة الديكور |

---

## Regenerate checklist

1. Attach `product-reference.jpg` as **reference_image** in every lifestyle prompt.
2. Verify: chrome frame, rooster dial, Arabic numerals, metal stand.
3. Run `node scripts/setup-rooster-clock-images.mjs`.
4. Hard-refresh LP after deploy (CDN cache).
