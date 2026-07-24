import { config } from "dotenv";
import { fileURLToPath } from "node:url";
import path from "node:path";
import fs from "node:fs/promises";
import { spawn } from "node:child_process";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
config({ path: path.join(__dirname, ".env") });

const REPO_ROOT = path.join(__dirname, "..");
const PRODUCTS_JSON = path.join(__dirname, "output", "pending-products.json");
const POSTERS_DIR = path.join(__dirname, "output", "posters");
const VIDEOS_DIR = path.join(__dirname, "output", "videos");

// Optional: path to a royalty-free background music file (mp3/wav/etc).
// We don't ship any music ourselves (copyright) — set this to your own track.
const MUSIC_PATH = process.env.AUTOMATION_MUSIC_PATH
  ? path.resolve(REPO_ROOT, process.env.AUTOMATION_MUSIC_PATH)
  : null;

const DURATION_SECONDS = 12;
const FPS = 25;
const OUT_WIDTH = 1080;
const OUT_HEIGHT = 1920; // 9:16 vertical — Reels / TikTok / Shorts format

function runFfmpeg(args) {
  return new Promise((resolve, reject) => {
    const proc = spawn("ffmpeg", args, { stdio: ["ignore", "ignore", "pipe"] });
    let stderr = "";
    proc.stderr.on("data", (chunk) => {
      stderr += chunk.toString();
    });
    proc.on("close", (code) => {
      if (code === 0) resolve();
      else reject(new Error(`ffmpeg exited with code ${code}\n${stderr.slice(-1500)}`));
    });
    proc.on("error", (err) => {
      if (err.code === "ENOENT") {
        reject(
          new Error(
            "ffmpeg not found on PATH. Install it first (Windows: winget install ffmpeg / choco install ffmpeg, or download a static build and add it to PATH)."
          )
        );
      } else {
        reject(err);
      }
    });
  });
}

async function checkFfmpegAvailable() {
  try {
    await runFfmpeg(["-version"]);
    return true;
  } catch {
    return false;
  }
}

async function generateVideo(product) {
  const posterPath = path.join(POSTERS_DIR, `${product.slug}.png`);
  await fs.access(posterPath).catch(() => {
    throw new Error(`Poster not found: ${path.relative(REPO_ROOT, posterPath)}. Run "npm run automation:poster" first.`);
  });

  const outPath = path.join(VIDEOS_DIR, `${product.slug}.mp4`);
  const totalFrames = DURATION_SECONDS * FPS;

  // Foreground: subtle slow zoom-in (Ken Burns) on the poster itself.
  // Background: same poster, cover-cropped + blurred, fills the full 9:16 frame
  // behind the (slightly shorter) poster so there are no black bars.
  const filterComplex = [
    `[0:v]split=2[fg_src][bg_src]`,
    `[fg_src]scale=1620:2025,zoompan=z='min(zoom+0.0006,1.12)':d=${totalFrames}:s=1080x1350:fps=${FPS}[fg]`,
    `[bg_src]scale=${OUT_WIDTH}:${OUT_HEIGHT}:force_original_aspect_ratio=increase,crop=${OUT_WIDTH}:${OUT_HEIGHT},gblur=sigma=25[bg]`,
    `[bg][fg]overlay=(W-w)/2:(H-h)/2:shortest=1[outv]`,
  ].join(";");

  const args = ["-y", "-loop", "1", "-i", posterPath];

  if (MUSIC_PATH) {
    args.push("-stream_loop", "-1", "-i", MUSIC_PATH);
  } else {
    args.push("-f", "lavfi", "-i", "anullsrc=channel_layout=stereo:sample_rate=44100");
  }

  args.push(
    "-filter_complex",
    filterComplex,
    "-map",
    "[outv]",
    "-map",
    "1:a",
    "-t",
    String(DURATION_SECONDS),
    "-r",
    String(FPS),
    "-pix_fmt",
    "yuv420p",
    "-c:v",
    "libx264",
    "-preset",
    "faster",
    "-crf",
    "22",
    "-c:a",
    "aac",
    "-b:a",
    "128k",
    "-shortest",
    outPath
  );

  await runFfmpeg(args);
  return outPath;
}

async function main() {
  const ffmpegOk = await checkFfmpegAvailable();
  if (!ffmpegOk) {
    console.error(
      "FFmpeg is not installed or not on PATH.\n" +
        "Windows: winget install ffmpeg  (or)  choco install ffmpeg\n" +
        "Then restart the terminal and try again."
    );
    process.exit(1);
  }

  const raw = await fs.readFile(PRODUCTS_JSON, "utf-8").catch(() => null);
  if (!raw) {
    console.error(
      `Could not find ${path.relative(REPO_ROOT, PRODUCTS_JSON)}. Run "npm run automation:fetch" first.`
    );
    process.exit(1);
  }

  const products = JSON.parse(raw);
  await fs.mkdir(VIDEOS_DIR, { recursive: true });

  const limitArg = process.argv.find((a) => a.startsWith("--limit="));
  const limit = limitArg ? parseInt(limitArg.split("=")[1], 10) : null;
  const toProcess = limit ? products.slice(0, limit) : products;

  if (limit) {
    console.log(`--limit=${limit} set — only processing the first ${toProcess.length} product(s).\n`);
  }

  if (!MUSIC_PATH) {
    console.log(
      "No AUTOMATION_MUSIC_PATH set in automation/.env — videos will be generated with silent audio.\n" +
        "Add your own royalty-free track and set AUTOMATION_MUSIC_PATH=path/to/music.mp3 to include music.\n"
    );
  }

  console.log(`Generating ${toProcess.length} video(s), ~${DURATION_SECONDS}s each. This can take a while...\n`);

  let done = 0;
  for (const product of toProcess) {
    try {
      const outPath = await generateVideo(product);
      done++;
      console.log(`  ✔ (${done}/${toProcess.length}) ${product.title} -> ${path.relative(REPO_ROOT, outPath)}`);
    } catch (err) {
      console.warn(`  ✘ Skipped "${product.title}": ${err.message}`);
    }
  }

  console.log(`\nDone. ${done}/${toProcess.length} video(s) saved in ${path.relative(REPO_ROOT, VIDEOS_DIR)}`);
}

main();
