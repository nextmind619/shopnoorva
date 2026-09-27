/**
 * NOORVA — Laptop desk TikTok/Reels ad (9:16, ~22s)
 * Style: fast cuts + Darija hook + product shots + COD CTA (like typical product reels)
 *
 * Usage: node scripts/generate-laptop-desk-reel-ad.mjs
 * Output: public/ads/mobile-laptop-desk-reel-ar.mp4
 */
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { spawnSync } from "child_process";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const PRODUCT_DIR = path.join(ROOT, "public/products/mobile-laptop-desk-with-wheels");
const WORK = path.join(ROOT, "tmp/laptop-desk-reel");
const OUT_DIR = path.join(ROOT, "public/ads");
const FONT_BOLD = "/usr/share/fonts/truetype/noto/NotoKufiArabic-Bold.ttf";
const FONT_REG = "/usr/share/fonts/truetype/noto/NotoKufiArabic-Regular.ttf";

const W = 1080;
const H = 1920;
const FPS = 30;

const SCENES = [
  {
    image: "03-lifestyle.jpg",
    duration: 3.2,
    main: "تعبتي تحمل اللابتوب فوق ركبتك؟",
    sub: "هاد الحل غادي يريّحك…",
    accent: "#6366f1",
  },
  {
    image: "02-premium-hero.jpg",
    duration: 3,
    main: "طاولة لابتوب متحركة",
    sub: "سطح واسع · هيكل متين · عجلات",
    accent: "#4f46e5",
  },
  {
    image: "10-features.jpg",
    duration: 3.2,
    main: "4 مميزات فصورة وحدة",
    sub: "ارتفاع · عجلات 360° · سطح · استعمال متعدد",
    accent: "#4338ca",
  },
  {
    image: "14-product-in-use.jpg",
    duration: 3.2,
    main: "اشتغل من الكنبة أو السرير",
    sub: "بلا ما تتعذّب بالوضعية 💻",
    accent: "#6366f1",
  },
  {
    image: "gift-crossbody-bag.jpg",
    duration: 3,
    main: "🎁 هدية مجانية مع الطلب",
    sub: "حقيبة كتف مقاومة للماء + USB",
    accent: "#d97706",
  },
  {
    image: "02-premium-hero.jpg",
    duration: 3.8,
    main: "399 درهم · الدفع عند الاستلام",
    sub: "توصيل مجاني · NOORVA · اطلب دابا 👇",
    accent: "#059669",
    cta: true,
  },
];

function escapeXml(s) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/"/g, "&quot;");
}

async function renderSlide({ image, main, sub, accent, cta }) {
  const bgPath = path.join(PRODUCT_DIR, image);
  const bg = await sharp(bgPath)
    .resize(W, H, { fit: "cover", position: "centre" })
    .modulate({ brightness: cta ? 0.92 : 0.88, saturation: 1.05 })
    .toBuffer();

  const gradientH = cta ? 720 : 560;
  const svg = `
<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="g" x1="0" y1="1" x2="0" y2="0">
      <stop offset="0%" stop-color="rgba(8,8,12,0.92)"/>
      <stop offset="55%" stop-color="rgba(8,8,12,0.55)"/>
      <stop offset="100%" stop-color="rgba(8,8,12,0)"/>
    </linearGradient>
  </defs>
  <rect x="0" y="${H - gradientH}" width="${W}" height="${gradientH}" fill="url(#g)"/>
  <rect x="48" y="${H - gradientH + 40}" width="6" height="120" rx="3" fill="${accent}"/>
  <text x="${W - 56}" y="${H - gradientH + 110}" text-anchor="end" font-family="Noto Kufi Arabic" font-size="52" font-weight="700" fill="#ffffff">${escapeXml(main)}</text>
  <text x="${W - 56}" y="${H - gradientH + 175}" text-anchor="end" font-family="Noto Kufi Arabic" font-size="34" font-weight="400" fill="#e2e8f0">${escapeXml(sub)}</text>
  <text x="${W / 2}" y="72" text-anchor="middle" font-family="Noto Kufi Arabic" font-size="28" font-weight="700" fill="#ffffff" opacity="0.95">NOORVA</text>
  <text x="${W / 2}" y="108" text-anchor="middle" font-family="DejaVu Sans" font-size="22" fill="#a5b4fc">shopnoorva.shop</text>
  ${
    cta
      ? `<rect x="120" y="${H - 130}" width="${W - 240}" height="72" rx="36" fill="${accent}"/>
  <text x="${W / 2}" y="${H - 82}" text-anchor="middle" font-family="Noto Kufi Arabic" font-size="32" font-weight="700" fill="#ffffff">اطلب دابا — COD</text>`
      : ""
  }
</svg>`;

  const overlay = await sharp(Buffer.from(svg))
    .png()
    .toBuffer();

  return sharp(bg)
    .composite([{ input: overlay, top: 0, left: 0 }])
    .jpeg({ quality: 93, mozjpeg: true })
    .toBuffer();
}

function runFfmpeg(args) {
  const r = spawnSync("ffmpeg", args, { stdio: "inherit" });
  if (r.status !== 0) throw new Error(`ffmpeg failed: ${args.join(" ")}`);
}

async function slideToClip(jpegBuf, outMp4, duration, index) {
  const frame = path.join(WORK, `frame-${index}.jpg`);
  await fs.writeFile(frame, jpegBuf);
  const frames = Math.round(duration * FPS);
  const zoomDir = index % 2 === 0 ? 1 : -1;
  const zStart = zoomDir > 0 ? 1.0 : 1.12;
  const zEnd = zoomDir > 0 ? 1.12 : 1.0;
  runFfmpeg([
    "-y",
    "-loop",
    "1",
    "-i",
    frame,
    "-vf",
    `scale=${W}:${H}:force_original_aspect_ratio=increase,crop=${W}:${H},zoompan=z='${zStart}+(${zEnd}-${zStart})*on/${frames}':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=${frames}:s=${W}x${H}:fps=${FPS},format=yuv420p`,
    "-t",
    String(duration),
    "-an",
    outMp4,
  ]);
}

async function concatClips(clips, outPath) {
  const list = path.join(WORK, "concat.txt");
  const lines = clips.map((c) => `file '${c.replace(/'/g, "'\\''")}'`).join("\n");
  await fs.writeFile(list, lines);
  runFfmpeg([
    "-y",
    "-f",
    "concat",
    "-safe",
    "0",
    "-i",
    list,
    "-c:v",
    "libx264",
    "-preset",
    "medium",
    "-crf",
    "20",
    "-pix_fmt",
    "yuv420p",
    "-movflags",
    "+faststart",
    outPath,
  ]);
}

async function main() {
  await fs.mkdir(WORK, { recursive: true });
  await fs.mkdir(OUT_DIR, { recursive: true });

  const clips = [];
  for (let i = 0; i < SCENES.length; i++) {
    const scene = SCENES[i];
    console.log(`Scene ${i + 1}/${SCENES.length}: ${scene.image}`);
    const jpeg = await renderSlide(scene);
    const clip = path.join(WORK, `clip-${i}.mp4`);
    await slideToClip(jpeg, clip, scene.duration, i);
    clips.push(clip);
  }

  const outPath = path.join(OUT_DIR, "mobile-laptop-desk-reel-ar.mp4");
  await concatClips(clips, outPath);
  console.log("\n✅ Reel ad:", outPath);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
