/**
 * Astronaut Galaxy Projector — Moroccan Darija UGC TikTok ad (9:16)
 *
 * Requires:
 *   ADSKULL_API_KEY with Creator plan or higher
 *   ffmpeg on PATH
 *
 * Usage:
 *   node scripts/generate-astronaut-ugc-tiktok.mjs
 *
 * Output:
 *   tmp/ad-astronaut-ugc/out/astronaut-ugc-agadir-tiktok.mp4
 */
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { spawn } from "child_process";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const WORK = path.join(ROOT, "tmp", "ad-astronaut-ugc");
const REFS = path.join(WORK, "refs");
const CLIPS = path.join(WORK, "clips");
const OUT = path.join(WORK, "out");
const PRODUCT_REF = path.join(
  REFS,
  "product-hero.jpg",
);
const FALLBACK_PRODUCT = path.join(
  "C:/Users/admin/luxmar/public/products/astronaut-bt-speaker-projector/01-hero-white-bg.jpg",
);

const API = "https://api.adskull.io/v1";
const KEY = process.env.ADSKULL_API_KEY;
if (!KEY) {
  console.error("Missing ADSKULL_API_KEY");
  process.exit(1);
}

const NEGATIVE =
  "subtitles, captions, burned-in text, watermark, logo overlay, TikTok UI, phone frame, cartoon, anime, distorted face, extra fingers, wrong product, colored astronaut, plastic toy look, robotic voice, English speech";

const SHARED_LOOK = `
Ultra-realistic UGC smartphone footage, vertical 9:16, 1080x1920.
Shot on iPhone in a modern apartment bedroom in Agadir, Morocco at night.
Warm Moroccan home interior, soft ambient lamps, cozy bedroom.
Young Moroccan man 26 years old, casual hoodie, natural Agadir Darija accent,
looking into camera like a real TikTok creator, energetic but believable, no exaggerated acting.
Camera: handheld smartphone, slight natural shake, Sony A7S III cinematic look, 35mm shallow depth of field, smooth autofocus, realistic HDR, professional color grade.
Product MUST match reference exactly: white astronaut galaxy projector Bluetooth speaker,
white spacesuit body, round dark visor projector lens, smaller star lens above, circular chest speaker grille,
short rounded arms/legs, white moon-texture base, optional black remote.
RGB galaxy nebula projection, moving stars on ceiling, rotating head, premium lighting.
NO burned-in subtitles. NO watermark. NO on-screen text.
Native Moroccan Darija dialogue spoken naturally with pauses (not robotic).
`.trim();

const SCENES = [
  {
    id: "01-hook-reveal",
    duration: "10",
    file: "01-hook-reveal.mp4",
    prompt: `${SHARED_LOOK}

Scene timeline (0-10s continuous clip):
0-3s: Dark cozy bedroom. Creator speaks directly to camera with TikTok hook energy:
"واش شفتو هاد الجهاز؟ والله حتى بدل ليا الغرفة كاملة!"
Quick handheld pan reveals the white astronaut projector on the nightstand.
3-10s: Close-up as he turns the projector ON. RGB galaxy lights explode across ceiling and walls,
stars drifting. He continues:
"غير شعلو... وكيولي السقف عامر بالنجوم والمجرات."
Highly realistic product details matching the reference image.
Audio: his natural Darija voice only + soft ambient room tone.`,
  },
  {
    id: "02-bluetooth-music",
    duration: "10",
    file: "02-bluetooth-music.mp4",
    prompt: `${SHARED_LOOK}

Continuous UGC clip (10s), same creator and same Agadir bedroom night setting,
galaxy projector already ON with vivid RGB nebula and moving stars on ceiling.
Creator connects Bluetooth from his phone; relaxing lo-fi music begins from the astronaut chest speaker.
He speaks natural Moroccan Darija:
"وزيد عليها... فيه سبيكر بلوتوث، شغل الموسيقى ديالك وخلي الجو ولا خيال."
Then a wider cinematic handheld shot of the room glowing with galaxy light while music plays.
NO text overlays. Match product reference exactly.`,
  },
  {
    id: "03-cta-close",
    duration: "10",
    file: "03-cta-close.mp4",
    prompt: `${SHARED_LOOK}

Final UGC clip (10s), same creator, same room, projector illuminating the bedroom.
Wide cinematic handheld shot then push-in to product.
Creator speaks natural Moroccan Darija:
"مثالي لغرفة النوم، الأطفال، وحتى إلا بغيتي غير ترتاح بعد الخدمة."
Then close-up of the white astronaut projector while he smiles and points to it:
"والأحسن؟ الدفع عند الاستلام والتوصيل لجميع المدن المغربية. طلبو دابا قبل ما يسالي العرض."
End on a premium cinematic shot of the projector illuminating the room with RGB galaxy and stars.
NO text, NO watermark.`,
  },
];

async function sleep(ms) {
  await new Promise((r) => setTimeout(r, ms));
}

async function api(method, route, body, headers = {}) {
  const res = await fetch(`${API}${route}`, {
    method,
    headers: {
      Authorization: `Bearer ${KEY}`,
      ...(body ? { "Content-Type": "application/json" } : {}),
      ...headers,
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  let json;
  try {
    json = JSON.parse(text);
  } catch {
    json = { raw: text };
  }
  if (!res.ok) {
    const err = new Error(`AdSkull ${res.status}: ${text.slice(0, 500)}`);
    err.status = res.status;
    err.payload = json;
    throw err;
  }
  return json;
}

async function uploadAsset(filePath) {
  const buf = await fs.readFile(filePath);
  const form = new FormData();
  form.append("asset_type", "image");
  form.append("file", new Blob([buf], { type: "image/jpeg" }), path.basename(filePath));
  const res = await fetch(`${API}/assets`, {
    method: "POST",
    headers: { Authorization: `Bearer ${KEY}` },
    body: form,
  });
  const json = await res.json();
  if (!res.ok) throw new Error(`Asset upload failed: ${JSON.stringify(json)}`);
  const url = json.url || json.asset?.url || json.data?.url;
  if (!url) throw new Error(`No asset URL in response: ${JSON.stringify(json)}`);
  return url;
}

async function createVideo({ prompt, duration, idempotencyKey, inputImageUrl }) {
  return api(
    "POST",
    "/video-generations",
    {
      mode: "generate",
      model_id: "kling-3.0",
      prompt,
      negative_prompt: NEGATIVE,
      ratio: "9:16",
      resolution: "1080p",
      duration_seconds: duration,
      audio_enabled: true,
      input_image_url: inputImageUrl,
    },
    { "Idempotency-Key": idempotencyKey },
  );
}

async function pollJob(jobId) {
  for (let i = 0; i < 180; i++) {
    const job = await api("GET", `/video-generations/${jobId}`);
    const status = job.status;
    const pct = job.progress_percent ?? 0;
    process.stdout.write(`\r${jobId} ${status} ${pct}%   `);
    if (status === "completed") {
      console.log("");
      return job;
    }
    if (status === "failed" || status === "canceled") {
      throw new Error(`Job ${jobId} ${status}: ${job.failure_message || JSON.stringify(job)}`);
    }
    await sleep(5000);
  }
  throw new Error(`Timeout polling ${jobId}`);
}

async function download(url, dest) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Download failed ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  await fs.writeFile(dest, buf);
}

function run(cmd, args) {
  return new Promise((resolve, reject) => {
    const p = spawn(cmd, args, { stdio: "inherit", shell: false });
    p.on("exit", (code) => (code === 0 ? resolve() : reject(new Error(`${cmd} exit ${code}`))));
  });
}

async function stitch(files, output) {
  const listPath = path.join(CLIPS, "concat.txt");
  const body = files.map((f) => `file '${f.replace(/\\/g, "/")}'`).join("\n");
  await fs.writeFile(listPath, body);
  await run("ffmpeg", [
    "-y",
    "-f",
    "concat",
    "-safe",
    "0",
    "-i",
    listPath,
    "-c:v",
    "libx264",
    "-pix_fmt",
    "yuv420p",
    "-r",
    "30",
    "-c:a",
    "aac",
    "-b:a",
    "192k",
    "-movflags",
    "+faststart",
    "-vf",
    "scale=1080:1920:force_original_aspect_ratio=decrease,pad=1080:1920:(ow-iw)/2:(oh-ih)/2",
    output,
  ]);
}

async function main() {
  await fs.mkdir(REFS, { recursive: true });
  await fs.mkdir(CLIPS, { recursive: true });
  await fs.mkdir(OUT, { recursive: true });

  try {
    await fs.access(PRODUCT_REF);
  } catch {
    await fs.copyFile(FALLBACK_PRODUCT, PRODUCT_REF);
  }

  console.log("Uploading product reference...");
  const productUrl = await uploadAsset(PRODUCT_REF);
  console.log("Product URL:", productUrl);

  const localClips = [];
  for (const scene of SCENES) {
    const dest = path.join(CLIPS, scene.file);
    console.log(`\nGenerating ${scene.id} (${scene.duration}s)...`);
    const job = await createVideo({
      prompt: scene.prompt,
      duration: scene.duration,
      idempotencyKey: `astronaut-ugc-${scene.id}-v1`,
      inputImageUrl: productUrl,
    });
    console.log("Job:", job.id, job.status);
    const done = await pollJob(job.id);
    const asset = (done.assets || []).find((a) => a.type === "video") || done.assets?.[0];
    if (!asset?.url) throw new Error(`No video asset for ${scene.id}`);
    await download(asset.url, dest);
    console.log("Saved", dest);
    localClips.push(dest);
  }

  const finalOut = path.join(OUT, "astronaut-ugc-agadir-tiktok.mp4");
  console.log("\nStitching...");
  await stitch(localClips, finalOut);
  console.log("\nDONE:", finalOut);
}

main().catch((e) => {
  console.error("\nFAILED:", e.message);
  if (e.status === 403) {
    console.error(
      "\nAdSkull returned plan_required. Upgrade to Creator plan (or higher) at https://adskull.io then rerun.",
    );
  }
  process.exit(1);
});
