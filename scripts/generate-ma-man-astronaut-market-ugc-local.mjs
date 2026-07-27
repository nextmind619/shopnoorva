/**
 * Moroccan man UGC — exact astronaut product from uploaded ref (local)
 * Male Darija (ar-MA-JamalNeural) + Ken Burns. No AdSkull / no lip-sync.
 *
 *   node scripts/generate-ma-man-astronaut-market-ugc-local.mjs
 */
import fs from "fs/promises";
import path from "path";
import { fileURLToPath, pathToFileURL } from "url";
import { spawn } from "child_process";
import { createRequire } from "module";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const WORK = path.join(ROOT, "tmp", "ad-astronaut-market-ugc");
const FRAMES = path.join(WORK, "frames-man");
const AUDIO = path.join(WORK, "audio-man");
const CLIPS = path.join(WORK, "clips-man");
const OUT_WORK = path.join(WORK, "out", "ma-man-astronaut-market-ugc.mp4");
const OUT_PUBLIC = path.join(ROOT, "public", "videos", "ma-man-astronaut-market-ugc.mp4");
const OUT_DOWNLOADS = path.join(process.env.USERPROFILE || "", "Downloads", "ma-man-astronaut-market-ugc.mp4");
const ASSETS = path.join(
  process.env.USERPROFILE || "",
  ".cursor",
  "projects",
  "c-Users-admin-tmp-shopnoorva-rabbit",
  "assets",
);

const W = 1080;
const H = 1920;
const FPS = 30;
const VOICE = "ar-MA-JamalNeural";

const SCENES = [
  {
    id: "01-hold",
    image: "ma-man-astro-01.png",
    voiceText:
      "السلام عليكم! شوفو معايا هاد الرائد الفضائي. بصراحة أول حاجة شدتني فيه هو الشكل ديالو،",
  },
  {
    id: "02-lens",
    image: "ma-man-astro-02.png",
    voiceText:
      "ولكن ملي شعلتو صدمتني النتيجة. كيحول السقف والحيط لسماء عامرة بالنجوم، وكيدير جو هادئ بزاف.",
  },
  {
    id: "03-speaker",
    image: "ma-man-astro-03.png",
    voiceText:
      "سواء فالبيت، فغرفة الأطفال، ولا حتى باش ترتاح فالليل، كيخدم مزيان. الجودة ديالو زوينة، والاستعمال ديالو ساهل، والشكل ديالو كيزين أي بلاصة. أنا شخصياً عجبني بزاف.",
  },
  {
    id: "04-cta",
    image: "ma-man-astro-04.png",
    voiceText: "إلى بغيتي تعرف الثمن ولا تطلبو، الرابط موجود.",
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
    const pkg = path.join(WORK, "node_modules", "edge-tts-universal");
    try {
      await fs.access(path.join(pkg, "dist", "index.js"));
      return await import(pathToFileURL(path.join(pkg, "dist", "index.js")).href);
    } catch {
      console.log("Installing edge-tts-universal…");
      await fs.mkdir(WORK, { recursive: true });
      await new Promise((resolve, reject) => {
        const p = spawn("npm", ["install", "edge-tts-universal@1.4.0", "--prefix", WORK, "--no-save"], {
          stdio: "inherit",
          shell: true,
        });
        p.on("exit", (code) => (code === 0 ? resolve() : reject(new Error(`npm exit ${code}`))));
      });
      return await import(pathToFileURL(path.join(pkg, "dist", "index.js")).href);
    }
  }
}

async function ttsToFile(mod, text, outMp3) {
  const { EdgeTTS } = mod;
  const tts = new EdgeTTS(text, VOICE, { rate: "+2%", pitch: "+0Hz" });
  const result = await tts.synthesize();
  await fs.writeFile(outMp3, Buffer.from(await result.audio.arrayBuffer()));
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
      else resolve(Math.max(0.5, parseFloat(out.trim()) || 1));
    });
  });
}

async function fitAudio(inMp3, outWav, targetSec) {
  await run(
    "ffmpeg",
    [
      "-y",
      "-i",
      inMp3,
      "-af",
      `apad=pad_dur=${targetSec},atrim=0:${targetSec},afade=t=in:st=0:d=0.04,afade=t=out:st=${Math.max(0.15, targetSec - 0.2)}:d=0.2`,
      "-ar",
      "44100",
      "-ac",
      "1",
      outWav,
    ],
    { silent: true },
  );
}

async function stillToClip(imagePath, outPath, durationSec, zoomIn = true) {
  const frames = Math.max(2, Math.round(durationSec * FPS));
  const zExpr = zoomIn ? `'min(zoom+0.00085,1.08)'` : `'if(eq(on,1),1.08,max(zoom-0.00085,1.0))'`;
  const yExpr = `'ih/2-(ih/zoom/2)+1.8*sin(on/14)'`;
  const vf = [
    `scale=${W * 2}:${H * 2}:force_original_aspect_ratio=increase`,
    `crop=${W * 2}:${H * 2}`,
    `zoompan=z=${zExpr}:x='iw/2-(iw/zoom/2)':y=${yExpr}:d=${frames}:s=${W}x${H}:fps=${FPS}`,
    `eq=brightness=0.008:saturation=1.03:contrast=1.02`,
    `noise=alls=1:allf=t`,
  ].join(",");
  await run(
    "ffmpeg",
    ["-y", "-loop", "1", "-i", imagePath, "-vf", vf, "-t", String(durationSec), "-r", String(FPS), "-pix_fmt", "yuv420p", "-an", outPath],
    { silent: true },
  );
}

/** Market ambience only — no music */
async function makeMarketAmbience(outWav, durationSec) {
  await run(
    "ffmpeg",
    [
      "-y",
      "-f",
      "lavfi",
      "-i",
      `anoisesrc=color=pink:amplitude=0.022:sample_rate=44100:duration=${durationSec}`,
      "-f",
      "lavfi",
      "-i",
      `anoisesrc=color=brown:amplitude=0.014:sample_rate=44100:duration=${durationSec}`,
      "-filter_complex",
      `[0]highpass=f=200,lowpass=f=4500,volume=0.7[a];[1]lowpass=f=800,volume=0.55[b];[a][b]amix=inputs=2:duration=first,afade=t=in:d=0.4,afade=t=out:st=${Math.max(0.3, durationSec - 0.6)}:d=0.6`,
      "-ar",
      "44100",
      "-ac",
      "1",
      outWav,
    ],
    { silent: true },
  );
}

async function concatWavs(files, outPath) {
  const listPath = path.join(AUDIO, "concat-audio.txt");
  await fs.writeFile(listPath, files.map((f) => `file '${f.replace(/\\/g, "/")}'`).join("\n"), "utf8");
  await run("ffmpeg", ["-y", "-f", "concat", "-safe", "0", "-i", listPath, "-c", "copy", outPath], { silent: true });
}

async function concatVideos(files, outPath) {
  const listPath = path.join(CLIPS, "concat-silent.txt");
  await fs.writeFile(listPath, files.map((f) => `file '${f.replace(/\\/g, "/")}'`).join("\n"), "utf8");
  try {
    await run("ffmpeg", ["-y", "-f", "concat", "-safe", "0", "-i", listPath, "-c", "copy", outPath], { silent: true });
  } catch {
    await run(
      "ffmpeg",
      ["-y", "-f", "concat", "-safe", "0", "-i", listPath, "-c:v", "libx264", "-preset", "veryfast", "-crf", "19", "-pix_fmt", "yuv420p", "-r", String(FPS), "-an", outPath],
      { silent: true },
    );
  }
}

async function mixAndMux(videoPath, voiceWav, bedWav, outPath) {
  await run(
    "ffmpeg",
    [
      "-y",
      "-i",
      videoPath,
      "-i",
      voiceWav,
      "-i",
      bedWav,
      "-filter_complex",
      "[1:a]volume=1.05[v];[2:a]volume=0.28[b];[v][b]amix=inputs=2:duration=first:dropout_transition=0[a]",
      "-map",
      "0:v:0",
      "-map",
      "[a]",
      "-c:v",
      "libx264",
      "-preset",
      "medium",
      "-crf",
      "18",
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

async function main() {
  await fs.mkdir(FRAMES, { recursive: true });
  await fs.mkdir(AUDIO, { recursive: true });
  await fs.mkdir(CLIPS, { recursive: true });
  await fs.mkdir(path.dirname(OUT_WORK), { recursive: true });
  await fs.mkdir(path.dirname(OUT_PUBLIC), { recursive: true });

  console.log("Man + exact astronaut @ Moroccan market (local)");
  console.log("Voice:", VOICE);

  for (const scene of SCENES) {
    await fs.copyFile(path.join(ASSETS, scene.image), path.join(FRAMES, scene.image));
    console.log("Frame:", scene.image);
  }

  const edge = await ensureEdgeTts();
  const fittedWavs = [];
  const videoParts = [];
  let totalDur = 0;

  for (let i = 0; i < SCENES.length; i++) {
    const scene = SCENES[i];
    console.log(`\n=== ${scene.id} ===`);
    const rawMp3 = path.join(AUDIO, `${scene.id}.mp3`);
    await ttsToFile(edge, scene.voiceText, rawMp3);
    const voiceDur = await probeDuration(rawMp3);
    const bed = voiceDur + 0.35;
    totalDur += bed;
    console.log(`TTS ${voiceDur.toFixed(2)}s → ${bed.toFixed(2)}s`);
    const fitted = path.join(AUDIO, `${scene.id}-fit.wav`);
    await fitAudio(rawMp3, fitted, bed);
    fittedWavs.push(fitted);
    const clip = path.join(CLIPS, `${scene.id}.mp4`);
    await stillToClip(path.join(FRAMES, scene.image), clip, bed, i % 2 === 0);
    videoParts.push(clip);
  }

  console.log(`\nTotal ~${totalDur.toFixed(1)}s — stitching…`);
  const silent = path.join(CLIPS, "full-silent.mp4");
  await concatVideos(videoParts, silent);
  const voiceFull = path.join(AUDIO, "full-voice.wav");
  await concatWavs(fittedWavs, voiceFull);
  const ambience = path.join(AUDIO, "market-ambience.wav");
  await makeMarketAmbience(ambience, totalDur + 0.4);
  await mixAndMux(silent, voiceFull, ambience, OUT_WORK);
  await fs.copyFile(OUT_WORK, OUT_PUBLIC);
  await fs.copyFile(OUT_WORK, OUT_DOWNLOADS);

  console.log("\nDONE:", OUT_PUBLIC);
  console.log("Downloads:", OUT_DOWNLOADS);
  console.log("Duration:", (await probeDuration(OUT_PUBLIC)).toFixed(1), "s");
}

main().catch((e) => {
  console.error("\nFAILED:", e.message);
  process.exit(1);
});
