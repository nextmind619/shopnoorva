# برومبتات صور — حزام دعم الحمل + هدية ميزان الحرارة

**الصفحة:** https://shopnoorva.shop/ar/products/adjustable-maternity-support-belt

**العرض:** 199 درهم — حزام + ميزان حرارة رقمي هدية (CodPlus).

---

## كيف تستعمل Gemini (خطوة بخطوة)

### 1) جهّز مرجعين (من CodPlus / صورك)

| ملف مرجع | منين | لشنو |
|----------|------|------|
| **`belt-reference.jpg`** | لقطة السوق CodPlus للحزام (الإنفوغرافيك: حامله + من الخلف) | **كل** صور الحزام |
| **`thermometer-reference.jpg`** | لقطة CodPlus لميزان DARCARE + العلبة | **فقط** `gift-digital-thermometer` |

حطهم فـ `public/products/adjustable-maternity-support-belt/sources/` (أو أي مجلد عندك) — المهم **ترفقهم فـ Gemini** مع كل برومبت.

### 2) فـ Gemini

1. افتح **Gemini** (تطبيق أو web) → **Create image** / **توليد صورة** (Imagen).
2. **Attach / Upload:** حمّل المرجع المناسب (جدول تحت).
3. **انسخ الـ Prompt** (إنجليزي — Gemini كيخدم أحسن).
4. **Negative prompt** إلا كان خانة (أو زيد فآخر البرومبت: `Avoid: ...`).
5. **Aspect ratio** حسب الجدول (3:4، 1:1، 4:3…).
6. نزّل الصورة → سمّيها **`اسم-الملف.jpg`** (بدون مسافات).

### 3) رفع للموقع

```bash
# ضع JPG بنفس الأسماء هنا:
public/products/adjustable-maternity-support-belt/

# ثم حوّل لـ webp (اختياري — Next.js كيقبل JPG):
# أو شغّل السكript باش يعيد الـ manifest من JPG:
node scripts/seed-maternity-belt-placeholders.mjs
# الأفضل: استبدل الـ .jpg يدوياً وشغّل optimize إذا عندك سكript، أو حط .webp بنفس الاسم
```

**أسماء إلزامية:**

| اسم الملف (بدون امتداد) | أين فالصفحة |
|-------------------------|-------------|
| `02-premium-hero` | هيرو تحت العنوان |
| `01-hero-white-bg` | كatalog / بديل أبيض |
| `10-features` | شبكة المميزات |
| `03-lifestyle` | lifestyle حامله |
| `14-product-in-use` | لبس / من الخلف |
| `17-infographic` | إنفو (اختياري قوي للإعلانات) |
| `gift-digital-thermometer` | قسم الهدية + الفورم |

---

## هوية المنتج (ثابتة في كل برومبتات الحزام)

- **الحزام:** لون **بيج/بيج فاتح (tan/beige)**، قماش **مضلّع/elastic ribbed**، **أشرطة كتاف (suspenders)** فوق الكتافين، حزام **عريض تحت البطن** + دعم **من الخلف** (cross-back)، **Velcro / خطافات** — **نفس الشكل** كالمرجع CodPlus.
- **ما تبدّلش:** لون أحمر/أسود كحزام رياضي، حزام بدون كتافين إلا المرجع عندك بلا كتافين (المرجع CodPlus **فيها كتافين**).
- **الهدية (ميزان):** أبيض، **غطاء بنفسجي** فالرأس، شاشة **36.5°C**، علامة **DARCARE** + قلب أزرق، علبة **أبيض/أزرق** MT502 — **نفس المرجع**، بلا إعادة تصميم.

**جو الصور:** دافئ، نظيف، **امرأة حامل** (25–35)، محجبة أو لا (حسب جمهورك)، **دار مغربية** أو neutral modern — **بدون** نص عربي فالصورة (النص غير `17-infographic`).

---

## أي صورة ترفق لـ Gemini؟

| الملف المطلوب | **مرفق Gemini #1** | **مرفق Gemini #2** (اختياري) |
|---------------|-------------------|-------------------------------|
| `02-premium-hero` | `belt-reference.jpg` | — |
| `01-hero-white-bg` | `belt-reference.jpg` (crop الحزام) | — |
| `10-features` | `belt-reference.jpg` | — |
| `03-lifestyle` | `belt-reference.jpg` | — |
| `14-product-in-use` | `belt-reference.jpg` | — |
| `17-infographic` | `belt-reference.jpg` | `thermometer-reference.jpg` (صغير فالزاوية) |
| `gift-digital-thermometer` | **`thermometer-reference.jpg` فقط** | — |

**قاعدة:** صور الحزام = **مرجع الحزام**. الهدية = **مرجع الميزان فقط**.

---

## 1) `02-premium-hero` — الهيرو

**المسار:** `public/products/adjustable-maternity-support-belt/02-premium-hero.jpg`  
**النسبة:** 3:4 · **1536×2048**

**Prompt:**
```
Ultra-realistic lifestyle photo, vertical 3:4. Use the uploaded belt-reference image: EXACT same beige/tan maternity support belt with shoulder suspenders, wide under-belly band, and back support straps — do not redesign. Pregnant Moroccan woman (7–8 months), modest black or navy top, hands gently on belly, warm soft window light in clean modern Moroccan bedroom or living room (cream walls, subtle textile). Belt clearly visible and correctly worn under belly. Empathetic, premium motherhood mood. Photorealistic, shallow depth of field, no text, no watermark, no logos except exact belt hardware as reference.
```

**Negative:**
```
wrong belt color, sports weightlifting belt, no shoulder straps, red belt, cartoon, watermark, Arabic text overlay, price tag, different buckle layout
```

---

## 2) `01-hero-white-bg` — منتج على أبيض (كatalog)

**المسار:** `public/products/adjustable-maternity-support-belt/01-hero-white-bg.jpg`  
**النسبة:** 1:1 · **2000×2000**

**Prompt:**
```
E-commerce product photo, square 1:1, pure white background #FFFFFF. Lay flat or mannequin torso: EXACT maternity belt from uploaded belt-reference — beige ribbed fabric, shoulder straps, abdominal band, back crossover straps, hook-and-loop fasteners visible. Soft studio lighting, soft shadow under product. Sharp focus, no model face needed (torso form or flat lay OK). No text, no watermark, 8K commercial.
```

**Negative:**
```
colored background, lifestyle clutter, wrong product, black belt, watermark
```

---

## 3) `10-features` — collage المميزات (بدون نص أو مع مساحة فارغة للنص)

**المسار:** `public/products/adjustable-maternity-support-belt/10-features.jpg`  
**النسبة:** 4:5 · **1600×2000**

**Prompt:**
```
Clean marketing composite, vertical 4:5, warm beige and soft pink background. Four panels showing EXACT same beige maternity belt from belt-reference: (1) front view on pregnant belly support, (2) back view showing strap crossover on lower back, (3) close-up of breathable ribbed fabric texture, (4) close-up of adjustable hook-and-loop fastener. Consistent lighting, premium medical-maternity aesthetic. Leave generous empty margins for later Arabic text overlay OR no text at all in image. No watermark.
```

**Negative:**
```
single tiny photo, messy collage, wrong belt, readable English/French text unless you want it, watermark
```

**بديل:** استخرج **crop** من إنفو CodPlus (`belt-reference`) + حسّن الجودة فـ Gemini:  
`Enhance resolution of uploaded marketplace infographic crops; keep belt shape and colors identical; clean edges; no new design elements.`

---

## 4) `03-lifestyle` — حامله فالدار

**المسار:** `public/products/adjustable-maternity-support-belt/03-lifestyle.jpg`  
**النسبة:** 4:3 · **2048×1536**

**Prompt:**
```
Lifestyle photo 4:3. Pregnant woman in casual home clothes walking slowly in bright Moroccan apartment hallway or salon, wearing EXACT beige maternity support belt from belt-reference. Natural smile, relaxed posture, morning sunlight. Partner or family blurred in background optional. Shows comfort while moving — "support in every step". Photorealistic, no text, no watermark.
```

**Negative:**
```
hospital only, bedridden, wrong belt, dark depressing mood, watermark
```

---

## 5) `14-product-in-use` — من الخلف / أسفل البطن

**المسار:** `public/products/adjustable-maternity-support-belt/14-product-in-use.jpg`  
**النسبة:** 4:3 · **2048×1536**

**Prompt:**
```
Educational product photo 4:3. Two views in one frame OR single back view: pregnant woman standing sideways and from behind, wearing EXACT belt from belt-reference. Clearly show (a) wide band under belly from side profile, (b) back straps crossing lumbar area. Neutral light grey or cream studio backdrop. Hands on lower back optional to suggest relief. No text, no watermark, photorealistic.
```

**Negative:**
```
front-only glamour shot hiding back support, wrong strap layout, sports belt, watermark
```

**Tip:** أحسن نتيجة = **ارفق نفس `belt-reference.jpg`** (فيها already من الخلف).

---

## 6) `17-infographic` — إنفو عربي (للإعلانات / اختياري فLP)

**المسار:** `public/products/adjustable-maternity-support-belt/17-infographic.jpg`  
**النسبة:** 1:1 · **1080×1080** (Instagram / Meta)

**Prompt:**
```
Square infographic 1:1, soft pink and beige gradient background, RTL-friendly layout. Center: pregnant woman wearing EXACT belt from belt-reference. Small product cutout bottom corner: DARCARE digital thermometer from thermometer-reference (white body, purple cap) labeled visually as gift with ribbon icon only — no fake brand redesign. Empty placeholder strips only for Canva — do NOT generate Arabic or any text in the image. Icons: belly support, back posture, adjustable straps. Clean Meta ad style, high contrast, no watermark.
```

**Negative:**
```
English-only wall of text, illegible Arabic, wrong belt, wrong thermometer shape, cluttered
```

**ملاحظة:** Gemini أحياناً كيغلط فالعربي — **الأفضل:** صورة بلا نص + تزيد النص فـ Canva.

---

## 6b) إنفو «شنو غادي يوصلك» — **مرأة لابسة الحزام** (صحيح)

**أخطاء الصورة الخاطئة:** حزام posture (X فالظهر) flat-lay + عربي مشوه (Gemini).

**مرفقات:** `belt-reference.jpg` + `thermometer-reference.jpg` · **1:1**

**Prompt:**
```
Square 1:1, soft pink-beige gradient. MAIN: pregnant woman (7–8 mo) WEARING EXACT maternity belt from belt-reference — beige ribbed, shoulder suspenders, band under belly, back straps; NOT posture X-brace, NOT flat lay. SECONDARY corner: EXACT DARCARE thermometer+box from thermometer-reference, small gift ribbon. Three icon placeholders OR icons with NO text. Empty top banner — NO Arabic/English in image. Photorealistic, no watermark.
```

**Negative:** `flat lay belt, posture corrector, X back brace, Arabic text, gibberish letters, wrong belt, DAQCARE typo`

**Canva (RTL):** عنوان **شنو غادي يوصلك فالطلبية؟** · **199 درهم** · **🎁 ميزان حرارة — هدية** · أيقونات: **يدعم البطن** · **يرتاح الظهر** · **قابل للتعديل** · **توصيل مجاني** · **الدفع عند الاستلام**

---

## 7) `gift-digital-thermometer` — الهدية

**المسار:** `public/products/adjustable-maternity-support-belt/gift-digital-thermometer.jpg`  
**النسبة:** 1:1 · **2000×2000**

**Prompt:**
```
Studio product photo 1:1. EXACT DARCARE digital thermometer from uploaded thermometer-reference: white body, purple top cap, metal tip, LCD showing 36.5°C, vertical DARCARE logo with blue heart icon. Place next to EXACT retail box from reference (white and light blue, THERMOMÈTRE DIGITAL, 60s badge). Soft white or very light blue gradient background, pharmacy-clean lighting. Free-gift premium feel. Do not alter brand layout. No extra text, no watermark.
```

**Negative:**
```
generic thermometer without DARCARE, wrong colors, no box, watermark, redesigned packaging
```

**مرفق Gemini:** **`thermometer-reference.jpg` فقط** (screenshot CodPlus ديال الميزان).

---

## سير عمل مختصر (Gemini)

```
1. belt-reference.jpg  → 02, 01, 10, 03, 14 (+ 17 مع الميزان)
2. thermometer-reference.jpg → gift-digital-thermometer
3. سمّي الملفات → public/products/adjustable-maternity-support-belt/*.jpg
4. deploy / refresh cache
```

---

## Negative عام (تقدر تزيدو فكل طلب)

```
low resolution, deformed hands, extra fingers, wrong pregnancy stage for product, sexualized pose, hospital gore, watermark, logo NOORVA unless requested, fake CE marks, different SKU product
```
