/**
 * Moroccan UGC Lifestyle — local build (NO AdSkull)
 *
 * Still frames (GenerateImage) + Edge TTS Darija (ar-MA-MounaNeural)
 * + ffmpeg Ken Burns → 9:16 MP4
 *
 *   node scripts/generate-moroccan-ugc-lifestyle-local.mjs
 *
 * Output:
 *   tmp/ad-moroccan-ugc/out/moroccan-ugc-lifestyle.mp4
 *   public/videos/moroccan-ugc-lifestyle.mp4
 */
import fs from "fs/promises";
import path from "path";
import { fileURLToPath, pathToFileURL } from "url";
import { spawn } from "child_process";
import { createRequire } from "module";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const WORK = path.join(ROOT, "tmp", "ad-moroccan-ugc");
const FRAMES = path.join(WORK, "frames");
const AUDIO = path.join(WORK, "audio");
const CLIPS = path.join(WORK, "clips");
const OUT_WORK = path.join(WORK, "out", "moroccan-ugc-lifestyle.mp4");
const OUT_PUBLIC = path.join(ROOT, "public", "videos", "moroccan-ugc-lifestyle.mp4");

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
const VOICE = "ar-MA-MounaNeural";

const SCENES = [
  {
    id: "01-hook",
    targetSec: 2.0,
    image: "ma-ugc-01-hook.png",
    voiceText: "السلام عليكم! بغيت نوريكم حاجة عجباتني بزاف.",
  },
  {
    id: "02-reaction",
    targetSec: 6.0,
    image: "ma-ugc-02-reaction.png",
    voiceText: "بصراحة ما كنتش متوقع الجودة تكون بهاد المستوى، ولكن فاجأتني.",
  },
  {
    id: "03-cta",
    targetSec: 7.0,
    image: "ma-ugc-03-cta.png",
    voiceText: "إلى بغيتي شي حاجة عملية وثمنها مناسب، أنصحك تجربها.",
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
    console.log("Installing edge-tts-universal…");
    await fs.mkdir(WORK, { recursive: true });
    await new Promise((resolve, reject) => {
      const p = spawn("npm", ["install", "edge-tts-universal@1.4.0", "--prefix", WORK, "--no-save"], {
        stdio: "inherit",
        shell: true,
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
  const tts = new EdgeTTS(text, VOICE, { rate: "+4%", pitch: "+0Hz" });
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
      else resolve(Math.max(0.4, parseFloat(out.trim()) || 1));
    });
  });
}

/** Pad or trim speech to a fixed bed duration (silence after speech if short). */
async function fitAudio(inMp3, outWav, targetSec) {
  await run(
    "ffmpeg",
    [
      "-y",
      "-i",
      inMp3,
      "-af",
      `apad=pad_dur=${targetSec},atrim=0:${targetSec},afade=t=in:st=0:d=0.05,afade=t=out:st=${Math.max(0.1, targetSec - 0.25)}:d=0.25`,
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
  const zExpr = zoomIn
    ? `'min(zoom+0.0010,1.10)'`
    : `'if(eq(on,1),1.10,max(zoom-0.0010,1.0))'`;
  // Subtle vertical drift mimics handheld
  const yExpr = `'ih/2-(ih/zoom/2)+2*sin(on/18)'`;
  const vf = [
    `scale=${W * 2}:${H * 2}:force_original_aspect_ratio=increase`,
    `crop=${W * 2}:${H * 2}`,
    `zoompan=z=${zExpr}:x='iw/2-(iw/zoom/2)':y=${yExpr}:d=${frames}:s=${W}x${H}:fps=${FPS}`,
    `eq=brightness=0.015:saturation=1.05:contrast=1.03`,
    `noise=alls=2:allf=t`,
  ].join(",");

  await run(
    "ffmpeg",
    [
      "-y",
      "-loop",
      "1",
      "-i",
      imagePath,
      "-vf",
      vf,
      "-t",
      String(durationSec),
      "-r",
      String(FPS),
      "-pix_fmt",
      "yuv420p",
      "-an",
      outPath,
    ],
    { silent: true },
  );
}

async function makeBedAmbience(outWav, durationSec) {
  // Soft brown-noise room tone + very quiet warm pad (stand-in for lo-fi BGM)
  await run(
    "ffmpeg",
    [
      "-y",
      "-f",
      "lavfi",
      "-i",
      `anoisesrc=color=brown:amplitude=0.018:sample_rate=44100:duration=${durationSec}`,
      "-f",
      "lavfi",
      "-i",
      `sine=frequency=110:sample_rate=44100:duration=${durationSec}`,
      "-f",
      "lavfi",
      "-i",
      `sine=frequency=164.81:sample_rate=44100:duration=${durationSec}`,
      "-filter_complex",
      "[1]volume=0.012[a];[2]volume=0.008[b];[0][a][b]amix=inputs=3:duration=first:dropout_transition=0,afade=t=in:d=0.4,afade=t=out:st=" +
        Math.max(0.2, durationSec - 0.6) +
        ":d=0.6",
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
  await run(
    "ffmpeg",
    ["-y", "-f", "concat", "-safe", "0", "-i", listPath, "-c", "copy", outPath],
    { silent: true },
  );
}

async function concatVideos(files, outPath) {
  const listPath = path.join(CLIPS, "concat-silent.txt");
  await fs.writeFile(listPath, files.map((f) => `file '${f.replace(/\\/g, "/")}'`).join("\n"), "utf8");
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
        "20",
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
      "[1:a]volume=1.0[v];[2:a]volume=0.55[b];[v][b]amix=inputs=2:duration=first:dropout_transition=0[a]",
      "-map",
      "0:v:0",
      "-map",
      "[a]",
      "-c:v",
      "libx264",
      "-preset",
      "medium",
      "-crf",
      "20",
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

  console.log("Local Moroccan UGC (no AdSkull)");
  console.log("Voice:", VOICE);

  // Copy generated frames into workdir
  for (const scene of SCENES) {
    const src = path.join(ASSETS, scene.image);
    const dest = path.join(FRAMES, scene.image);
    await fs.copyFile(src, dest);
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
    const bed = Math.max(scene.targetSec, voiceDur + 0.35);
    totalDur += bed;
    console.log(`TTS ${voiceDur.toFixed(2)}s → bed ${bed.toFixed(2)}s`);

    const fitted = path.join(AUDIO, `${scene.id}-fit.wav`);
    await fitAudio(rawMp3, fitted, bed);
    fittedWavs.push(fitted);

    const clip = path.join(CLIPS, `${scene.id}.mp4`);
    const img = path.join(FRAMES, scene.image);
    await stillToClip(img, clip, bed, i % 2 === 0);
    videoParts.push(clip);
  }

  console.log(`\nTotal ~${totalDur.toFixed(1)}s — stitching…`);
  const silent = path.join(CLIPS, "full-silent.mp4");
  await concatVideos(videoParts, silent);

  const voiceFull = path.join(AUDIO, "full-voice.wav");
  await concatWavs(fittedWavs, voiceFull);

  const bed = path.join(AUDIO, "ambience.wav");
  await makeBedAmbience(bed, totalDur + 0.5);

  await mixAndMux(silent, voiceFull, bed, OUT_WORK);
  await fs.copyFile(OUT_WORK, OUT_PUBLIC);

  console.log("\nDONE:", OUT_PUBLIC);
  console.log("Also:", OUT_WORK);
  console.log("Duration:", (await probeDuration(OUT_PUBLIC)).toFixed(1), "s");
}

main().catch((e) => {
  console.error("\nFAILED:", e.message);
  process.exit(1);
});
