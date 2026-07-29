/**
 * Premium Facebook static ad (1:1, 1080×1080) — Astronaut Galaxy Projector
 * Usage: node scripts/generate-astronaut-fb-static-ad-1x1.mjs
 */

import fs from "fs/promises";
import { readFileSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const SIZE = 1080;

const BEDROOM = path.join(
  ROOT,
  "public/lifestyle/astronaut-bt-speaker-projector/04-bedroom.jpg",
);
const HERO_SCENE = path.join(ROOT, "public/ads/astronaut-fb-ad-hero.png");
const AI_BG = path.join(ROOT, "public/ads/astronaut-fb-ad-bg.png");
const OUT_JPG = path.join(ROOT, "public/ads/astronaut-galaxy-projector-fb-1x1.jpg");
const OUT_PNG = path.join(ROOT, "public/ads/astronaut-galaxy-projector-fb-1x1.png");

function fontDataUri(ttfPath) {
  const b64 = readFileSync(ttfPath).toString("base64");
  return `data:font/ttf;base64,${b64}`;
}

const tahomaUri = fontDataUri("C:\\Windows\\Fonts\\tahoma.ttf");
const segoeBoldUri = fontDataUri("C:\\Windows\\Fonts\\segoeuib.ttf");

function escapeXml(s) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function buildOverlaySvg() {
  const features = [
    { icon: "🌌", label: "Galaxy Projection" },
    { icon: "🎵", label: "Bluetooth Speaker" },
    { icon: "🎮", label: "Remote Control" },
    { icon: "🔄", label: "360° Adjustable" },
    { icon: "⏰", label: "Sleep Timer" },
    { icon: "🎁", label: "Perfect Gift" },
  ];

  const benefits = [
    "إسقاط نجوم ومجرات واقعي",
    "سماعة Bluetooth مدمجة",
    "تحكم سهل عبر الريموت",
    "مناسب للأطفال والكبار",
    "مثالي للنوم والاسترخاء",
    "هدية رائعة لكل المناسبات",
  ];

  const badges = [
    "✅ Free Shipping",
    "✅ Cash On Delivery",
    "✅ High Quality",
  ];

  const featureIcons = features
    .map((f, i) => {
      const x = 90 + i * 150;
      return `
        <g transform="translate(${x}, 652)">
          <circle cx="30" cy="30" r="30" fill="rgba(255,255,255,0.14)" stroke="rgba(255,255,255,0.4)" stroke-width="1.2"/>
          <text x="30" y="38" text-anchor="middle" font-size="24">${f.icon}</text>
          <text x="30" y="74" text-anchor="middle" class="feat-label" font-size="10">${escapeXml(f.label)}</text>
        </g>`;
    })
    .join("");

  const benefitRows = benefits
    .map((b, i) => {
      const col = i % 2;
      const row = Math.floor(i / 2);
      const x = col === 0 ? 540 : 820;
      const y = 748 + row * 34;
      return `<text x="${x}" y="${y}" text-anchor="middle" class="benefit" font-size="18">✔ ${escapeXml(b)}</text>`;
    })
    .join("");

  const badgePills = badges
    .map((b, i) => {
      const x = 180 + i * 300;
      return `
        <rect x="${x - 118}" y="28" width="236" height="36" rx="18" fill="rgba(0,0,0,0.45)" stroke="rgba(255,255,255,0.25)" stroke-width="1"/>
        <text x="${x}" y="52" text-anchor="middle" class="badge" font-size="15">${escapeXml(b)}</text>`;
    })
    .join("");

  return Buffer.from(`
<svg width="${SIZE}" height="${SIZE}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <style>
      @font-face { font-family: 'TahomaAr'; src: url('${tahomaUri}') format('truetype'); }
      @font-face { font-family: 'SegoeBold'; src: url('${segoeBoldUri}') format('truetype'); }
      .headline { font-family: SegoeBold, TahomaAr, sans-serif; fill: #ffffff; font-weight: 700; }
      .sub { font-family: TahomaAr, sans-serif; fill: rgba(255,255,255,0.92); }
      .benefit { font-family: TahomaAr, sans-serif; fill: #f0f4ff; }
      .badge { font-family: SegoeBold, TahomaAr, sans-serif; fill: #ffffff; font-weight: 600; }
      .feat-label { font-family: SegoeBold, TahomaAr, sans-serif; fill: rgba(255,255,255,0.85); }
      .cta-text { font-family: SegoeBold, TahomaAr, sans-serif; fill: #ffffff; font-weight: 700; }
      .cta-sub { font-family: TahomaAr, sans-serif; fill: rgba(255,255,255,0.9); }
    </style>
    <linearGradient id="topFade" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#0a0618" stop-opacity="0.92"/>
      <stop offset="55%" stop-color="#0a0618" stop-opacity="0.35"/>
      <stop offset="100%" stop-color="#0a0618" stop-opacity="0"/>
    </linearGradient>
    <linearGradient id="bottomFade" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#050310" stop-opacity="0"/>
      <stop offset="35%" stop-color="#050310" stop-opacity="0.55"/>
      <stop offset="100%" stop-color="#050310" stop-opacity="0.95"/>
    </linearGradient>
    <radialGradient id="vignette" cx="50%" cy="45%" r="65%">
      <stop offset="55%" stop-color="#000000" stop-opacity="0"/>
      <stop offset="100%" stop-color="#000000" stop-opacity="0.55"/>
    </radialGradient>
    <linearGradient id="ctaGrad" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#7c3aed"/>
      <stop offset="50%" stop-color="#a855f7"/>
      <stop offset="100%" stop-color="#ec4899"/>
    </linearGradient>
    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="3" result="blur"/>
      <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
  </defs>

  <rect width="${SIZE}" height="${SIZE}" fill="url(#vignette)"/>
  <rect width="${SIZE}" height="520" fill="url(#topFade)"/>
  <rect y="520" width="${SIZE}" height="${SIZE - 520}" fill="url(#bottomFade)"/>

  ${badgePills}

  <text x="540" y="118" text-anchor="middle" class="headline" font-size="42" filter="url(#glow)">${escapeXml("🚀 حوّل غرفتك إلى مجرة ساحرة")}</text>
  <text x="540" y="168" text-anchor="middle" class="sub" font-size="21">
    ${escapeXml("استمتع بإضاءة مجرية مذهلة مع سماعة بلوتوث مدمجة")}
  </text>
  <text x="540" y="198" text-anchor="middle" class="sub" font-size="21">
    ${escapeXml("تمنحك أجواءً هادئة ومريحة في كل ليلة.")}
  </text>

  ${featureIcons}
  ${benefitRows}

  <text x="540" y="918" text-anchor="middle" class="cta-sub" font-size="19">${escapeXml("اطلب الآن واستمتع بتجربة فريدة")}</text>
  <rect x="340" y="932" width="400" height="54" rx="27" fill="url(#ctaGrad)" filter="url(#glow)"/>
  <rect x="340" y="932" width="400" height="54" rx="27" fill="none" stroke="rgba(255,255,255,0.35)" stroke-width="1.5"/>
  <text x="540" y="966" text-anchor="middle" class="cta-text" font-size="26">${escapeXml("اطلب الآن")}</text>
</svg>`);
}

async function buildSceneBase() {
  const bgPath = (await fs.stat(HERO_SCENE).catch(() => null))
    ? HERO_SCENE
    : (await fs.stat(AI_BG).catch(() => null))
      ? AI_BG
      : BEDROOM;

  return sharp(bgPath)
    .resize(SIZE, SIZE, { fit: "cover", position: "centre" })
    .modulate({ brightness: 0.98, saturation: 1.05 })
    .png()
    .toBuffer();
}

async function main() {
  await fs.mkdir(path.dirname(OUT_JPG), { recursive: true });

  const base = await buildSceneBase();
  const overlay = buildOverlaySvg();

  const pipeline = sharp(base).composite([{ input: overlay, blend: "over" }]);

  await pipeline.clone().jpeg({ quality: 95, mozjpeg: true }).toFile(OUT_JPG);
  await pipeline.clone().png({ compressionLevel: 9 }).toFile(OUT_PNG);

  const meta = await sharp(OUT_JPG).metadata();
  console.log("Wrote:", OUT_JPG);
  console.log("Wrote:", OUT_PNG);
  console.log("Dimensions:", meta.width, "x", meta.height);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
