/**
 * Moroccan UGC Lifestyle — authentic Darija selfie ad (9:16)
 *
 * Brief: daytime modern Moroccan salon / café, handheld smartphone UGC,
 * soft sun through window, tea glass on table, natural Darija dialogue.
 *
 * Requires:
 *   ADSKULL_API_KEY with Creator plan or higher
 *   Optional: tmp/ad-moroccan-ugc/refs/product.jpg for product lock
 *
 * Usage:
 *   $env:ADSKULL_API_KEY="ask_..."; node scripts/generate-moroccan-ugc-lifestyle.mjs
 *   node scripts/generate-moroccan-ugc-lifestyle.mjs --gender=male
 *   node scripts/generate-moroccan-ugc-lifestyle.mjs --gender=female
 *
 * Output:
 *   tmp/ad-moroccan-ugc/out/moroccan-ugc-lifestyle.mp4
 */
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const WORK = path.join(ROOT, "tmp", "ad-moroccan-ugc");
const REFS = path.join(WORK, "refs");
const OUT = path.join(WORK, "out");
const PRODUCT_REF = path.join(REFS, "product.jpg");

const API = "https://api.adskull.io/v1";
const KEY = process.env.ADSKULL_API_KEY;
if (!KEY) {
  console.error("Missing ADSKULL_API_KEY");
  process.exit(1);
}

const genderArg = (process.argv.find((a) => a.startsWith("--gender=")) || "--gender=female")
  .split("=")[1]
  .toLowerCase();
const isMale = genderArg === "male" || genderArg === "man" || genderArg === "شاب";

const SUBJECT = isMale
  ? "Young Moroccan man, mid-20s, natural Maghrebi features, short neat hair, simple elegant casual outfit (clean tee or light shirt), warm friendly energy"
  : "Young Moroccan woman, mid-20s, natural Maghrebi features, simple elegant casual outfit, natural makeup, warm friendly energy";

const NEGATIVE =
  "subtitles, captions, burned-in text, watermark, logo overlay, TikTok UI, phone frame, cartoon, anime, distorted face, extra fingers, plastic skin, overproduced studio lighting, English speech, MSA formal Arabic only, exaggerated acting, jump cuts, location change, outfit change";

const SHARED_LOOK = `
Ultra-realistic authentic Moroccan UGC smartphone footage, vertical 9:16, 1080x1920.
Audience: Morocco (MA), casual friendly authentic tone — not studio commercial.
Subject: ${SUBJECT}.
Location: modern Moroccan living room (salon) OR elegant Moroccan café — same place throughout.
Daytime soft sunlight through a window, light Moroccan décor, rug (zellige/zarbia vibe), plants, glass of Moroccan mint tea (atay) on the table.
Camera: selfie-style smartphone, eye-level, medium close-up to medium shot, slow natural push-ins, natural reframing, handheld micro-shake, smartphone wide-lens feel, gentle autofocus, subtle background blur.
Lighting: soft sun from window, light shadows, warm natural colors.
Grade: realistic cinematic UGC, natural skin tones, mild contrast, balanced saturation, very light grain.
Visual taste: social-media authentic, premium but real, no overproduction.
Persist continuity: SAME person, SAME outfit, SAME lighting, SAME location for the full clip.
NO burned-in subtitles. NO watermark. NO on-screen text.
Native Moroccan Darija spoken naturally with pauses (not robotic). Soft Moroccan lo-fi / light Gnawa-tinged BGM under ~95 BPM, low under voice. Home ambience, hand movement, tea glass on table, light footsteps, natural breath — subtle, not exaggerated.
`.trim();

const PROMPT = `${SHARED_LOOK}

Continuous single-take UGC clip (15s), speaking Darija directly to camera with spontaneous smile and natural hand gestures:

[0.0–2.0s] Hook — eye contact, energetic but real:
"السلام عليكم! بغيت نوريكم حاجة عجباتني بزاف."

[2.0–8.0s] Reaction / proof — slight lean-in, genuine surprised smile; if a product reference is provided, briefly show or gesture toward it on the table near the tea glass:
"بصراحة ما كنتش متوقع الجودة تكون بهاد المستوى، ولكن فاجأتني."

[8.0–15.0s] Soft CTA — nod, recommend, end on smile + direct look into lens:
"إلى بغيتي شي حاجة عملية وثمنها مناسب، أنصحك تجربها."

End frame: warm smile, direct eye contact, tea glass visible, calm handheld hold.
Audio: clear Darija voice mixed over quiet Moroccan lo-fi BGM + soft room ambience.`;

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
  const body = {
    mode: "generate",
    model_id: "kling-3.0",
    prompt,
    negative_prompt: NEGATIVE,
    ratio: "9:16",
    resolution: "1080p",
    duration_seconds: duration,
    audio_enabled: true,
  };
  if (inputImageUrl) body.input_image_url = inputImageUrl;
  return api("POST", "/video-generations", body, { "Idempotency-Key": idempotencyKey });
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

async function main() {
  await fs.mkdir(REFS, { recursive: true });
  await fs.mkdir(OUT, { recursive: true });

  let inputImageUrl;
  try {
    await fs.access(PRODUCT_REF);
    console.log("Uploading optional product reference...");
    inputImageUrl = await uploadAsset(PRODUCT_REF);
    console.log("Product URL:", inputImageUrl);
  } catch {
    console.log("No product.jpg in refs — generating text-to-video lifestyle UGC.");
  }

  console.log(`\nGender: ${isMale ? "male" : "female"}`);
  console.log("Generating 15s Moroccan UGC lifestyle clip...");

  const job = await createVideo({
    prompt: PROMPT,
    duration: "15",
    idempotencyKey: `ma-ugc-lifestyle-${isMale ? "m" : "f"}-v1`,
    inputImageUrl,
  });
  console.log("Job:", job.id, job.status, `credits_reserved=${job.credits_reserved ?? "?"}`);

  const done = await pollJob(job.id);
  const asset = (done.assets || []).find((a) => a.type === "video") || done.assets?.[0];
  if (!asset?.url) throw new Error("No video asset in completed job");

  const finalOut = path.join(OUT, "moroccan-ugc-lifestyle.mp4");
  await download(asset.url, finalOut);
  console.log("\nDONE:", finalOut);
  console.log("Credits used:", done.credits_used ?? "?");
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
