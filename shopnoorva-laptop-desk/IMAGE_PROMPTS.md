# برومبتات صور — طاولة لابتوب متحركة (mobile-laptop-desk-with-wheels)

**الصفحة:** https://shopnoorva.shop/ar/products/mobile-laptop-desk-with-wheels

بعد التوليد، سمّي الملفات كما بالأسفل وضعها في `shopnoorva-laptop-desk/sources/` ثم:

```bash
node scripts/optimize-laptop-desk-images.mjs
```

---

## هوية المنتج (ثابتة في كل البرومبتات)

- **المنتج:** طاولة لابتوب متحركة على شكل **C** — سطح **خشب oak فاتح**، هيكل **معدن أبيض**، **4 عجلات سوداء** مع **قفل/فرامل**.
- **الهدية (صورة منفصلة):** حقيبة **sling/crossbody** سوداء، جوانب بنية، **منفذ USB**، قفل رقمي، مقاومة للماء.
- **السوق:** المغرب · COD · NOORVA · واقعي · بدون تقييمات وهمية · بدون شعارات مزيفة.

---

## 1) `02-premium-hero.jpg` — المعرض 1/6 · الهيرو الرئيسي

**أين في الصفحة:** أول slide في المعرض، بطاقة المنتج، CRO.

**النسبة:** 1:1 · **2048×2048** · JPG/WebP

**Prompt:**
```
Ultra-realistic premium e-commerce hero photograph, square 1:1. Modern Moroccan living room: beige fabric sofa, neutral rug, soft natural window light from the left. Center product: mobile rolling laptop desk with C-shaped white metal base that slides under furniture, light oak wood grain rectangular tabletop, four black polyurethane caster wheels with visible lock levers on two wheels. On desk: silver laptop open, wireless mouse, smartphone, small succulent in white pot. Subtle yellow double-arrow graphic on one leg suggesting height adjustment (optional, minimal). Clean composition with empty space at top third for Arabic RTL headline overlay. Photorealistic, sharp focus, no people, no text, no watermark, no brand logos, 8K product photography style.
```

**Negative:**
```
cartoon, 3D render look, plastic glass tabletop, desk without wheels, fixed legs only, cluttered room, dark moody, watermark, Arabic text baked in, wrong product, gaming RGB desk, standing desk only
```

---

## 2) `10-features.jpg` — المعرض 2/6 · 4 مميزات (كومبوزيت)

**أين:** slide «4 مميزات فصورة واحدة» + قسم «كيفاش تستعملها» (ارتفاع).

**النسبة:** 1:1 · **2048×2048**

**Prompt:**
```
Professional Amazon-style marketing composite, square layout, soft grey gradient background. Large center hero: same oak-top white C-frame rolling laptop desk in bright sunlit salon with sofa blurred in background. Four rounded rectangular panels with bold yellow header bars and black English titles only:
(1) top-left "Spacious Tabletop" — top-down flat lay of desk with laptop, mouse, phone, plant on oak surface;
(2) top-right "Adjustable Height" — macro close-up of white metal leg with black star-knob height adjustment mechanism, yellow up-down arrows;
(3) bottom-left "Lockable Wheels" — extreme close-up of black caster wheel, yellow circular "360°" arrow graphic, small metal lock lever engaged;
(4) bottom-right "Multi-Purpose Use" — smaller inset photo: desk base slid under bed, laptop on top, person silhouette optional. Photorealistic product photos inside panels, clean e-commerce design, no watermarks, no Arabic text in image.
```

**Negative:**
```
single photo only, messy collage, illegible text, French labels, low resolution panels, different desk design in each panel, stock photo watermark
```

---

## 3) `03-lifestyle.jpg` — المعرض 3/6 · من الكنبة

**أين:** slide «اشتغل من الكنبة» + أوضاع الاستخدام + CRO خطوة 3.

**النسبة:** 1:1 أو 4:3 · **2048×2048**

**Prompt:**
```
Authentic lifestyle photo, young Moroccan man or woman in casual home clothes working on laptop at mobile C-shape rolling desk positioned in front of beige sofa, modern Casablanca/Rabat style apartment interior, warm afternoon sunlight, wheels and white frame clearly visible, relaxed work-from-home mood, natural smile optional, laptop screen generic glow, photorealistic, shallow depth of field, no text overlay, modest and trustworthy tone for COD ecommerce Morocco.
```

**Negative:**
```
studio white background, corporate office, standing only, no wheels visible, luxury villa unrealistic, western-only cast if off-brand, watermark
```

---

## 4) `14-product-in-use.jpg` — المعرض 4/6 · من السرير + بانر المقارنة

**أين:** slide «من السرير بلا تعب»، **بانner المقارنة** فوق جدول NOORVA vs العادي.

**النسبة:** 1:1 · **2048×2048**

**Prompt:**
```
Cozy bedroom lifestyle photograph. Mobile oak-top white C-base laptop desk rolled so the C-frame slides under a modern low bed frame; locked black caster wheels visible. Person sitting on bed leaning against headboard using laptop comfortably on desk surface, evening warm lamp light, shows ergonomic benefit vs laptop on lap, photorealistic, Moroccan middle-class bedroom aesthetic, clean not cluttered, no text, no watermark.
```

**Negative:**
```
desk far from bed, no under-bed slide, wrong desk type, hospital room, kids nursery only, watermark
```

---

## 5) `17-infographic.jpg` — المعرض 5/6 · ملخص العرض

**أين:** slide «كل شيء واضح» (399 · COD · توصيل).

**النسبة:** 4:5 أو 1:1 · **1080×1350** or **2048×2048**

**Prompt:**
```
Clean Arabic RTL infographic poster for NOORVA Morocco ecommerce, dark indigo background #1a1a24, accent indigo #6366f1 and amber #fbbf24. Central product illustration or small realistic photo of oak white rolling laptop desk. Bullet icons with short Arabic labels (designer adds text in post OR use placeholder lines): adjustable height, 360° lock wheels, wide tabletop, C-shape under sofa/bed, 399 MAD, cash on delivery, free USB crossbody bag gift icon. Modern sans-serif Arabic typography style, premium minimal, NO fake star ratings, no review count, export high resolution PNG.
```

**Negative:**
```
English-only, cluttered flyer, fake 5-star reviews, Amazon logo, Lorem ipsum, wrong currency USD
```

---

## 6) `gift-crossbody-bag.jpg` — المعرض 6/6 · الهدية + bloc الهدية

**أين:** slide «هدية مجانية» + `ProductSurpriseGift`.

**النسبة:** 1:1 · **1024×1024** minimum

**Prompt:**
```
Studio packshot, pure white seamless background #FFFFFF. Men's anti-theft crossbody messenger sling bag, matte black main body, dark brown leather-look side panels, thick padded black shoulder strap with small zip pocket on strap. Visible external USB-A charging port housing on brown panel, small combination lock on main zipper pulls, 3/4 front angle, water-resistant urban style, NO large "FASHION" print on front (blank or minimal small tag), photorealistic product photography, soft shadow under bag, sharp detail.
```

**Negative:**
```
backpack, tote only, no USB port visible, bright colors pink, luxury brand logo, model wearing bag, busy background
```

**بعد الرفع:** أضف شارة «🎁 هدية مجانية» (يمكننا دمجها في `optimize-laptop-desk-images.mjs` لاحقاً).

---

## 7) `01-hero-white-bg.jpg` — اختياري (كتالوج / SEO / مرجع المنتج)

**أين:** manifest · بطاقات قد تستخدم hero white — **غير ظاهرة حالياً في الـ 6 slides** لكن مفيدة للإعلانات و **image reference** لباقي الصور.

**النسبة:** 1:1 · **2048×2048**

**مهم — شكل المنتج الحقيقي (لا تختصره):**
- طبقتان من **خشب oak فاتح**: **سطح علوي** مستطيل + **رف تخزين** أصغر تحته (نفس الخشب).
- هيكل **معدن أبيض**: قاعدة **C-shape** أفقية (عارضتان بيضاويتان/أنبوبيتان + **4 عجلات سوداء**)، عمودان رأسيان مع **مقبض نجمة أسود** لتعديل الارتفاع.
- **ليس** مكتب gaming، **ليس** زجاج، **ليس** standing desk بأرجل رفيعة فقط بدون قاعدة C.

**Prompt (مُحدَّث — يطابق المنتج):**
```
Ultra-realistic isolated e-commerce product photo, square 1:1, seamless very light warm grey studio backdrop #F5F5F7 (NOT pure blown-out white). Single product only: mobile rolling laptop side table with distinctive C-shaped white metal undercarriage — two parallel horizontal white tubes forming the base that slides under sofa/bed, four black polyurethane caster wheels with metal stems evenly spaced on the base, two vertical white telescoping legs with visible black star-knob height adjusters. TWO light oak wood-grain shelves: larger rectangular main tabletop on top, smaller matching oak storage shelf fixed below the main top (dual-tier desk, not single board). Front three-quarter camera angle slightly above eye level, entire C-base and all four wheels fully visible. Soft diffused studio softbox lighting, gentle natural contact shadow under wheels, crisp wood grain texture, matte white powder-coated metal, photorealistic NOT CGI, no laptop no mug no props no people no text no watermark no infographic icons, marketplace hero isolation style, 8K sharp.
```

**Negative:**
```
single shelf only, one flat top only, glass tabletop, black metal frame, wooden legs without wheels, fixed office desk, L-shaped desk, gaming desk RGB, monitor arm, standing desk treadmill, missing under-shelf, tripod legs, three wheels, chrome wheels, pure #FFFFFF clipping halo, overexposed white, dark background, lifestyle room, Arabic text, watermark, wrong proportions, thick chunky gaming aesthetic
```

**إذا استخدمت مرجعاً (موصى به):** ارفع infographie/صورة المنتج الحقيقية كـ **image reference / img2img 0.35–0.55** مع البرومبت أعلاه.

---

## خريطة الصفحة ↔ الملف

| # | ملف المصدر | مكان العرض في الصفحة |
|---|------------|----------------------|
| 1 | `02-premium-hero` | معرض 1 — «طاولة لابتوب متحركة» |
| 2 | `10-features` | معرض 2 — «4 مميزات» |
| 3 | `03-lifestyle` | معرض 3 — «من الكنبة» + أوضاع الاستخدام |
| 4 | `14-product-in-use` | معرض 4 — «من السرير» + بانر المقارنة |
| 5 | `17-infographic` | معرض 5 — «399 · COD» |
| 6 | `gift-crossbody-bag` | معرض 6 — الهدية + قسم الهدية |
| 7 | `01-hero-white-bg` | اختياري — إعلانات / white bg |

---

## نصائح للتوليد (Midjourney / Flux / DALL·E)

1. ولّد **02-premium-hero** و **10-features** أولاً (هما الأهم للتحويل).
2. استخدم **نفس مرجع visual** (صورة المنتج الحقيقية) كـ **image reference** في كل البرومبتات.
3. للكومبوزيت `10-features`: أسهل **تصميم Canva/Figma** من 4 صور حقيقية + العنوان الأصفر.
4. **لا تكتب** «399 درهم» داخل الصورة إلا في `17-infographic` — الثمن موجود في HTML.
