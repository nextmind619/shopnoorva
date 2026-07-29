/**
 * Convert vertical ad PNG/JPG to Facebook 1:1 (1080×1080).
 * Keeps full creative (no crop): blurred background + centered fit.
 *
 * Usage: node scripts/resize-vertical-ad-to-1x1.mjs <input> [output]
 */

import path from "path";
import { fileURLToPath } from "url";
import sharp from "sharp";

const SIZE = 1080;

async function toSquare1080(inputPath, outputPath) {
  const img = sharp(inputPath).rotate();

  const bg = await img
    .clone()
    .resize(SIZE, SIZE, { fit: "cover", position: "centre" })
    .blur(28)
    .modulate({ brightness: 0.75, saturation: 1.1 })
    .toBuffer();

  const fg = await img
    .clone()
    .resize(SIZE, SIZE, {
      fit: "contain",
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .toBuffer();

  const ext = path.extname(outputPath).toLowerCase();
  let pipeline = sharp(bg).composite([{ input: fg, gravity: "centre" }]);

  if (ext === ".png") {
    pipeline = pipeline.png({ compressionLevel: 9 });
  } else {
    pipeline = pipeline.jpeg({ quality: 92, mozjpeg: true });
  }

  await pipeline.toFile(outputPath);
  const meta = await sharp(outputPath).metadata();
  console.log(`OK ${outputPath} → ${meta.width}×${meta.height}`);
}

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const defaultInputs = [
  "c__Users_admin_AppData_Roaming_Cursor_User_workspaceStorage_20fa50bb1ae1d39b0ebfd5bed5341b9e_images_1000077749-8ecc1e24-0ae6-4dba-b2ff-3c532d9459f8.png",
  "c__Users_admin_AppData_Roaming_Cursor_User_workspaceStorage_20fa50bb1ae1d39b0ebfd5bed5341b9e_images_1000077752-d61cd96e-247b-462f-b0fe-e823d4a6a2c1.png",
  "c__Users_admin_AppData_Roaming_Cursor_User_workspaceStorage_20fa50bb1ae1d39b0ebfd5bed5341b9e_images_1000077747-97225650-0138-477a-8ca9-b2430e8fc619.png",
  "c__Users_admin_AppData_Roaming_Cursor_User_workspaceStorage_20fa50bb1ae1d39b0ebfd5bed5341b9e_images_1000077719-ae2bea1d-b8c9-462f-9850-9e952e0d670f.png",
  "c__Users_admin_AppData_Roaming_Cursor_User_workspaceStorage_20fa50bb1ae1d39b0ebfd5bed5341b9e_images_1000077720-70a93bf6-ea07-41ab-a729-e3bd036db323.png",
];

const outNames = [
  "astronaut-ad-01-space-experience-1x1.jpg",
  "astronaut-ad-02-bedroom-morocco-1x1.jpg",
  "astronaut-ad-03-black-friday-1x1.jpg",
  "astronaut-ad-04-bedroom-stars-1x1.jpg",
  "astronaut-ad-05-features-1x1.jpg",
];

const args = process.argv.slice(2);
const outDir = path.join(__dirname, "../public/ads");

if (args.length >= 1 && !args[0].startsWith("--batch")) {
  const input = path.resolve(args[0]);
  const output = path.resolve(
    args[1] ?? input.replace(/\.(png|jpe?g)$/i, "-1080x1080.jpg"),
  );
  await toSquare1080(input, output);
} else {
  const cursorAssets = path.join(
    "C:",
    "Users",
    "admin",
    ".cursor",
    "projects",
    "c-Users-admin-tmp-shopnoorva-rabbit",
    "assets",
  );
  for (let i = 0; i < defaultInputs.length; i++) {
    const input = path.join(cursorAssets, defaultInputs[i]);
    const output = path.join(outDir, outNames[i]);
    await toSquare1080(input, output);
  }
}
