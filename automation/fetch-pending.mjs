import { config } from "dotenv";
import { fileURLToPath } from "node:url";
import path from "node:path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
config({ path: path.join(__dirname, ".env") });

import fs from "node:fs/promises";
import { fetchPendingProducts } from "./lib/sheets.mjs";

const OUTPUT_DIR = path.join(process.cwd(), "automation", "output");
const IMAGES_DIR = path.join(OUTPUT_DIR, "images");
const OUTPUT_JSON = path.join(OUTPUT_DIR, "pending-products.json");

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 60);
}

async function downloadImage(url, destPath) {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Failed to download image (${res.status}): ${url}`);
  }
  const buffer = Buffer.from(await res.arrayBuffer());
  await fs.writeFile(destPath, buffer);
}

function guessExtension(url) {
  const match = url.split("?")[0].match(/\.(jpg|jpeg|png|webp|gif)$/i);
  return match ? match[0] : ".jpg";
}

async function main() {
  await fs.mkdir(IMAGES_DIR, { recursive: true });

  console.log("Fetching pending products from Google Sheets...");
  const pending = await fetchPendingProducts();
  console.log(`Found ${pending.length} pending product(s).`);

  const results = [];

  for (const [i, product] of pending.entries()) {
    const slug = `${String(i + 1).padStart(3, "0")}-${slugify(product.title)}`;
    const ext = guessExtension(product.image);
    const imagePath = path.join(IMAGES_DIR, `${slug}${ext}`);

    try {
      await downloadImage(product.image, imagePath);
      console.log(`  ✔ Downloaded image for "${product.title}"`);
    } catch (err) {
      console.warn(`  ✘ Skipped image for "${product.title}": ${err.message}`);
    }

    results.push({
      ...product,
      slug,
      localImagePath: path.relative(process.cwd(), imagePath),
    });
  }

  await fs.writeFile(OUTPUT_JSON, JSON.stringify(results, null, 2), "utf-8");
  console.log(`\nSaved ${results.length} pending product(s) to ${path.relative(process.cwd(), OUTPUT_JSON)}`);
}

main().catch((err) => {
  console.error("Fatal error:", err.message);
  const apiError = err.response?.data?.error;
  if (apiError) {
    console.error("API error details:", JSON.stringify(apiError, null, 2));
  }
  console.error(
    "\nCommon causes: wrong GOOGLE_SHEET_ID, wrong GOOGLE_SHEET_TAB name (must match the tab name exactly), or the sheet wasn't shared with the service account email as Editor."
  );
  process.exit(1);
});
