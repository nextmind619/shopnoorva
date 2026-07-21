/**
 * Astronaut product-page video — «شاهد النتيجة»
 * Matches page subtitle: الاستخدام · المزايا · الأجواء النهائية
 *
 * Moroccan Darija (Edge TTS ar-MA-JamalNeural) + Ken Burns on product photos.
 *
 * Requires: ffmpeg + ffprobe on PATH, network for Edge TTS
 *
 *   node scripts/generate-astronaut-watch-result.mjs
 *
 * Output: public/videos/astronaut-watch-result.mp4
 */
import fs from "fs/promises";
import path from "path";
import { fileURLToPath, pathToFileURL } from "url";
import { spawn } from "child_process";
import { createRequire } from "module";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const WORK = path.join(ROOT, "tmp", "ad-astronaut-watch-result");
const AUDIO = path.join(WORK, "audio");
const CLIPS = path.join(WORK, "clips");
const OUT_PUBLIC = path.join(ROOT, "public", "videos", "astronaut-watch-result.mp4");
const OUT_WORK = path.join(WORK, "out", "astronaut-watch-result.mp4");

const SLUG = "astronaut-bt-speaker-projector";
const W = 1080;
const H = 1920;
const FPS = 30;
const VOICE = "ar-MA-JamalNeural";

function img(...parts) {
  return path.join(ROOT, "public", ...parts);
}

async function firstExisting(candidates) {
  for (const p of candidates) {
    try {
      await fs.access(p);
      return p;
    } catch {
      /* next */
    }
  }
  return null;
}

/** Three acts = page subtitle */
const ACTS = [
  {
    id: "01-usage",
    title: "الاستخدام",
    durationSec: 12,
    voiceText:
      "الاستخدام ساهل بزاف. حط رائد الفضاء فوق طاولة ولا كومودينو، وصّل الكابل Type-C، شعل الجهاز، ووجّه الخوذة للسقف. من الريموت غيّر الألوان والسطوع وأنت مرتاح فالسير.",
    resolveImages: async () =>
      [
        await firstExisting([
          img("products", SLUG, "02-premium-hero.jpg"),
          img("products", SLUG, "01-hero-white-bg.jpg"),
        ]),
        await firstExisting([
          img("products", SLUG, "09-close-up.jpg"),
          img("products", SLUG, "02-premium-hero.jpg"),
        ]),
        await firstExisting([
          img("lifestyle", SLUG, "14-product-in-use.jpg"),
          img("lifestyle", SLUG, "03-lifestyle.jpg"),
        ]),
      ].filter(Boolean),
  },
  {
    id: "02-benefits",
    title: "المزايا",
    durationSec: 12,
    voiceText:
      "المزايا واضحة: إسقاط مجرة ونجوم HD على السقف والجدران، سبيكر بلوتوث مدمج فالصدر، ريموت تحكم كامل، وتصميم أنيق كيبقى يزيّن الغرفة حتى وهو مطفي. جهاز واحد كيجمع الإضاءة والموسيقى.",
    resolveImages: async () =>
      [
        await firstExisting([
          img("lifestyle", SLUG, "05-living-room.jpg"),
          img("lifestyle", SLUG, "03-lifestyle.jpg"),
        ]),
        await firstExisting([
          img("generated", SLUG, "10-features.jpg"),
          img("products", SLUG, "09-close-up.jpg"),
        ]),
        await firstExisting([
          img("lifestyle", SLUG, "06-gaming-room.jpg"),
          img("lifestyle", SLUG, "04-bedroom.jpg"),
        ]),
      ].filter(Boolean),
  },
  {
    id: "03-atmosphere",
    title: "الأجواء النهائية",
    durationSec: 14,
    voiceText:
      "والأجواء النهائية؟ غرفة هادئة، سقف عامر بالنجوم والمجرات، وموسيقى من الهاتف بلا أسلاك. مثالي قبل النوم، لغرفة الأطفال، ولا غير باش ترتاح بعد الخدمة. الدفع عند الاستلام، والتوصيل لجميع المدن المغربية. شوف النتيجة… وطلب دابا من نورڤا.",
    resolveImages: async () =>
      [
        await firstExisting([
          img("lifestyle", SLUG, "04-bedroom.jpg"),
          img("lifestyle", SLUG, "03-lifestyle.jpg"),
        ]),
        await firstExisting([
          img("lifestyle", SLUG, "07-romantic-room.jpg"),
          img("lifestyle", SLUG, "08-kids-room.jpg"),
        ]),
        await firstExisting([
          img("lifestyle", SLUG, "08-kids-room.jpg"),
          img("products", SLUG, "02-premium-hero.jpg"),
        ]),
        await firstExisting([
          img("products", SLUG, "02-premium-hero.jpg"),
          img("products", SLUG, "01-hero-white-bg.jpg"),
        ]),
      ].filter(Boolean),
  },
];

function run(cmd, args, { silent = false } = {}) {
  return new Promise((resolve, reject) => {
    const p = spawn(cmd, args, { stdio: silent ? "pipe" : "inherit", shell: false });
    let err = "";
    if (silent) p.stderr?.on("data", (d) => (err += d.toString()));
    p.on("exit", (code) =>
      code === 0 ? resolve() : reject(new Error(`${cmd} exit ${code}${err ? `\n${err.slice(-900)}` : ""}`)),
    );
  });
}

async function ensureEdgeTts() {
  const require = createRequire(import.meta.url);
  try {
    require.resolve("edge-tts-universal");
    return await import("edge-tts-universal");
  } catch {
    console.log("Installing edge-tts-universal into tmp workdir…");
    await fs.mkdir(WORK, { recursive: true });
    await new Promise((resolve, reject) => {
      const p = spawn("npm", ["install", "edge-tts-universal@1.4.0", "--prefix", WORK, "--no-save"], {
        stdio: "inherit",
        shell: true, // Windows: resolve npm.cmd
      });
      p.on("exit", (code) => (code === 0 ? resolve() : reject(new Error(`npm exit ${code}`))));
    });
    const pkg = path.join(WORK, "node_modules", "edge-tts-universal");
    try {
      return await import(pathToFileURL(path.join(pkg, "dist", "index.js")).href);
    } catch {
      return await import(pathToFileURL(path.join(pkg, "index.js")).href);
    }
  }
}

async function ttsToFile(mod, text, outMp3) {
  const { EdgeTTS } = mod;
  const tts = new EdgeTTS(text, VOICE);
  const result = await tts.synthesize();
  const buf = Buffer.from(await result.audio.arrayBuffer());
  await fs.writeFile(outMp3, buf);
}

async function probeDuration(file) {
  return new Promise((resolve, reject) => {
    const p = spawn(
      "ffprobe",
      ["-v", "error", "-show_entries", "format=duration", "-of", "default=noprint_wrappers=1:nokey=1", file],
      { shell: false },
    );
    let out = "";
    p.stdout.on("data", (d) => (out += d.toString()));
    p.on("exit", (code) => {
      if (code !== 0) reject(new Error(`ffprobe failed: ${file}`));
      else resolve(Math.max(1, parseFloat(out.trim()) || 1));
    });
  });
}

async function stillToClip(imagePath, outPath, durationSec, zoomIn = true) {
  const frames = Math.max(2, Math.round(durationSec * FPS));
  const zExpr = zoomIn
    ? `'min(zoom+0.0008,1.12)'`
    : `'if(eq(on,1),1.12,max(zoom-0.0008,1.0))'`;
  const vf = [
    `scale=${W * 2}:${H * 2}:force_original_aspect_ratio=increase`,
    `crop=${W * 2}:${H * 2}`,
    `zoompan=z=${zExpr}:x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=${frames}:s=${W}x${H}:fps=${FPS}`,
    `eq=brightness=0.02:saturation=1.08`,
  ].join(",");

  await run(
    "ffmpeg",
    ["-y", "-loop", "1", "-i", imagePath, "-vf", vf, "-t", String(durationSec), "-r", String(FPS), "-pix_fmt", "yuv420p", "-an", outPath],
    { silent: true },
  );
}

async function burnTitle(inputClip, titleAr, outPath) {
  // Soft top label — fixed coords (Windows ffmpeg drawtext is picky with + in expressions)
  const fontCandidates = [
    "C:/Windows/Fonts/arial.ttf",
    "C:/Windows/Fonts/tahoma.ttf",
    "C:/Windows/Fonts/segoeui.ttf",
  ];
  let font = fontCandidates[0];
  for (const f of fontCandidates) {
    try {
      await fs.access(f);
      font = f;
      break;
    } catch {
      /* next */
    }
  }
  const fontEsc = font.replace(/\\/g, "/").replace(/:/g, "\\:");
  // Escape for drawtext: colon and backslash
  const textEsc = titleAr.replace(/\\/g, "\\\\").replace(/:/g, "\\:").replace(/'/g, "\u2019");
  const vf =
    `drawbox=x=0:y=140:w=iw:h=96:color=black@0.40:t=fill:enable='lt(t\\,2.4)',` +
    `drawtext=fontfile='${fontEsc}':text='${textEsc}':fontsize=48:fontcolor=white:borderw=2:bordercolor=black@0.55:x=(w-text_w)/2:y=160:enable='lt(t\\,2.4)'`;

  try {
    await run(
      "ffmpeg",
      ["-y", "-i", inputClip, "-vf", vf, "-c:v", "libx264", "-pix_fmt", "yuv420p", "-an", outPath],
      { silent: true },
    );
  } catch (e) {
    console.warn("  Title overlay skipped:", e.message.split("\n")[0]);
    await fs.copyFile(inputClip, outPath);
  }
}

async function concatAudio(files, outPath) {
  // Re-encode each to identical WAV then concat — avoids MP3 concat demuxer issues on Windows
  const wavs = [];
  for (let i = 0; i < files.length; i++) {
    const wav = path.join(AUDIO, `part-${i}.wav`);
    await run(
      "ffmpeg",
      ["-y", "-i", files[i], "-ar", "24000", "-ac", "1", wav],
      { silent: true },
    );
    wavs.push(wav);
  }
  const listPath = path.join(AUDIO, "concat-audio.txt");
  await fs.writeFile(listPath, wavs.map((f) => `file '${f.replace(/\\/g, "/")}'`).join("\n"), "utf8");
  await run(
    "ffmpeg",
    ["-y", "-f", "concat", "-safe", "0", "-i", listPath, "-c:a", "libmp3lame", "-q:a", "2", outPath],
    { silent: true },
  );
}

async function muxAudio(videoPath, audioPath, outPath) {
  await run(
    "ffmpeg",
    [
      "-y",
      "-i",
      videoPath,
      "-i",
      audioPath,
      "-map",
      "0:v:0",
      "-map",
      "1:a:0",
      "-c:v",
      "libx264",
      "-preset",
      "veryfast",
      "-crf",
      "23",
      "-pix_fmt",
      "yuv420p",
      "-c:a",
      "aac",
      "-b:a",
      "192k",
      "-shortest",
      "-movflags",
      "+faststart",
      outPath,
    ],
    { silent: true },
  );
}

async function concatVideos(files, outPath) {
  const listPath = path.join(CLIPS, `concat-${path.basename(outPath)}.txt`);
  await fs.writeFile(listPath, files.map((f) => `file '${f.replace(/\\/g, "/")}'`).join("\n"), "utf8");
  // Prefer stream copy when all parts share the same codec params
  try {
    await run(
      "ffmpeg",
      ["-y", "-f", "concat", "-safe", "0", "-i", listPath, "-c", "copy", outPath],
      { silent: true },
    );
  } catch {
    await run(
      "ffmpeg",
      [
        "-y",
        "-f",
        "concat",
        "-safe",
        "0",
        "-i",
        listPath,
        "-c:v",
        "libx264",
        "-preset",
        "veryfast",
        "-crf",
        "23",
        "-pix_fmt",
        "yuv420p",
        "-r",
        String(FPS),
        "-an",
        outPath,
      ],
      { silent: true },
    );
  }
}

async function main() {
  await fs.mkdir(AUDIO, { recursive: true });
  await fs.mkdir(CLIPS, { recursive: true });
  await fs.mkdir(path.dirname(OUT_WORK), { recursive: true });
  await fs.mkdir(path.dirname(OUT_PUBLIC), { recursive: true });

  console.log("Voice:", VOICE);
  console.log("Structure: الاستخدام · المزايا · الأجواء النهائية\n");

  const edge = await ensureEdgeTts();
  const actVideos = [];
  const actAudios = [];

  for (const act of ACTS) {
    console.log(`\n=== ${act.title} (${act.id}) ===`);
    const images = await act.resolveImages();
    if (!images.length) throw new Error(`No images for ${act.id}`);

    const mp3 = path.join(AUDIO, `${act.id}.mp3`);
    console.log("TTS…");
    await ttsToFile(edge, act.voiceText, mp3);
    const voiceDur = await probeDuration(mp3);
    const targetDur = Math.max(act.durationSec, voiceDur + 0.6);
    console.log(`Voice ${voiceDur.toFixed(1)}s → ${targetDur.toFixed(1)}s`);

    const per = targetDur / images.length;
    const subs = [];
    for (let i = 0; i < images.length; i++) {
      const sub = path.join(CLIPS, `${act.id}-img${i}.mp4`);
      console.log("  Ken Burns", path.basename(images[i]));
      await stillToClip(images[i], sub, per, i % 2 === 0);
      subs.push(sub);
    }

    const raw = path.join(CLIPS, `${act.id}-raw.mp4`);
    await concatVideos(subs, raw);
    const titled = path.join(CLIPS, `${act.id}-titled.mp4`);
    await burnTitle(raw, act.title, titled);
    actVideos.push(titled);
    actAudios.push(mp3);
  }

  console.log("\nStitching…");
  const silent = path.join(CLIPS, "full-silent.mp4");
  await concatVideos(actVideos, silent);
  const fullAudio = path.join(AUDIO, "full-voice.mp3");
  await concatAudio(actAudios, fullAudio);
  await muxAudio(silent, fullAudio, OUT_WORK);
  await fs.copyFile(OUT_WORK, OUT_PUBLIC);

  console.log("\nDONE:", OUT_PUBLIC);
  console.log("Duration:", (await probeDuration(OUT_PUBLIC)).toFixed(1), "s");
}

main().catch((e) => {
  console.error("\nFAILED:", e.message);
  process.exit(1);
});
