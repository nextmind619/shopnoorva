/**
 * Lightweight export for caption-matched scene images only (webp + jpg).
 * Usage: node scripts/process-kids-art-custom-only.mjs
 */
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const PUBLIC = path.join(ROOT, "public");
const ASSET_DIRS = [
  path.join("C:", "Users", "admin", ".cursor", "projects", "c-Users-admin-tmp-shopnoorva-rabbit", "assets"),
  path.join(ROOT, "assets"),
];
const SLUG = "kids-art-set-easel-208";
const OUT = path.join(PUBLIC, "products", SLUG);

const JOBS = [
  "kids-art-howto-01-open-bag",
  "kids-art-howto-02-clip-paper",
  "kids-art-howto-03-choose-tool",
  "kids-art-howto-04-fold-close",
  "kids-art-landing-drawing",
  "kids-art-landing-kids-room",
];

async function resolveSrc(base) {
  for (const dir of ASSET_DIRS) {
    const candidate = path.join(dir, `${base}.png`);
    try {
      await fs.access(candidate);
      return candidate;
    } catch {
      /* next */
    }
  }
  return null;
}

async function exportOne(base) {
  const src = await resolveSrc(base);
  if (!src) {
    console.error(`Missing PNG: ${base}.png`);
    return false;
  }

  const outBase = base.replace(/^kids-art-/, "").replace(/^howto-/, "howto-").replace(/^landing-/, "landing-");
  const name =
    base === "kids-art-howto-01-open-bag"
      ? "howto-01-open-bag"
      : base === "kids-art-howto-02-clip-paper"
        ? "howto-02-clip-paper"
        : base === "kids-art-howto-03-choose-tool"
          ? "howto-03-choose-tool"
          : base === "kids-art-howto-04-fold-close"
            ? "howto-04-fold-close"
            : base === "kids-art-landing-drawing"
              ? "landing-drawing"
              : "landing-kids-room";

  const buf = await sharp(await fs.readFile(src)).rotate().resize(1600, 1200, { fit: "inside" }).jpeg({ quality: 88 }).toBuffer();
  await fs.writeFile(path.join(OUT, `${name}.jpg`), buf);
  await fs.writeFile(path.join(OUT, `${name}.webp`), await sharp(buf).webp({ quality: 85 }).toBuffer());
  console.log(`✓ ${name}`);
  return true;
}

await fs.mkdir(OUT, { recursive: true });
let ok = 0;
for (const job of JOBS) {
  if (await exportOne(job)) ok++;
}
console.log(`Done: ${ok}/${JOBS.length}`);
