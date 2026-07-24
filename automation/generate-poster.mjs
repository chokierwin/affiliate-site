import { config } from "dotenv";
import { fileURLToPath } from "node:url";
import path from "node:path";
import fs from "node:fs/promises";
import { createCanvas, loadImage } from "@napi-rs/canvas";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
config({ path: path.join(__dirname, ".env") });

// Keep in sync with lib/site-config.ts -> shortName
const BRAND_NAME = "RacunBelanja";

const REPO_ROOT = path.join(__dirname, "..");
const PRODUCTS_JSON = path.join(__dirname, "output", "pending-products.json");
const POSTERS_DIR = path.join(__dirname, "output", "posters");

const WIDTH = 1080;
const HEIGHT = 1350; // 4:5 — Instagram feed portrait

const COLORS = {
  overlayTop: "rgba(10, 10, 15, 0.15)",
  overlayBottom: "rgba(10, 10, 15, 0.92)",
  cardBg: "#ffffff",
  price: "#FF5B2E",
  badgeHot: "#FF3B30",
  badgeViral: "#7C3AED",
  cta: "#FF5B2E",
  ctaText: "#ffffff",
  star: "#FFB800",
  textDark: "#1A1A1A",
  textMuted: "#6B6B6B",
};

function formatRupiah(price) {
  const digits = String(price).replace(/[^0-9]/g, "");
  if (!digits) return String(price);
  return "Rp" + Number(digits).toLocaleString("id-ID");
}

function wrapText(ctx, text, maxWidth) {
  const words = text.split(" ");
  const lines = [];
  let current = "";
  for (const word of words) {
    const test = current ? `${current} ${word}` : word;
    if (ctx.measureText(test).width > maxWidth && current) {
      lines.push(current);
      current = word;
    } else {
      current = test;
    }
  }
  if (current) lines.push(current);
  return lines;
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

async function drawPoster(product) {
  const canvas = createCanvas(WIDTH, HEIGHT);
  const ctx = canvas.getContext("2d");

  const imagePath = path.join(REPO_ROOT, product.localImagePath);
  const img = await loadImage(imagePath);

  // 1. Blurred, darkened background filling the whole canvas
  ctx.save();
  ctx.filter = "blur(40px) brightness(0.55)";
  const scale = Math.max(WIDTH / img.width, HEIGHT / img.height) * 1.15;
  const bw = img.width * scale;
  const bh = img.height * scale;
  ctx.drawImage(img, (WIDTH - bw) / 2, (HEIGHT - bh) / 2, bw, bh);
  ctx.restore();

  // 2. Gradient overlay for text legibility (subtle top, strong bottom)
  const gradient = ctx.createLinearGradient(0, 0, 0, HEIGHT);
  gradient.addColorStop(0, COLORS.overlayTop);
  gradient.addColorStop(0.55, "rgba(10,10,15,0.35)");
  gradient.addColorStop(1, COLORS.overlayBottom);
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  // 3. Product image card (centered, rounded, drop shadow)
  const cardSize = 760;
  const cardX = (WIDTH - cardSize) / 2;
  const cardY = 130;

  ctx.save();
  ctx.shadowColor = "rgba(0,0,0,0.45)";
  ctx.shadowBlur = 40;
  ctx.shadowOffsetY = 20;
  roundRect(ctx, cardX, cardY, cardSize, cardSize, 32);
  ctx.fillStyle = COLORS.cardBg;
  ctx.fill();
  ctx.restore();

  ctx.save();
  roundRect(ctx, cardX + 12, cardY + 12, cardSize - 24, cardSize - 24, 24);
  ctx.clip();
  // cover-fit the product image inside the card
  const fitScale = Math.max(
    (cardSize - 24) / img.width,
    (cardSize - 24) / img.height
  );
  const fw = img.width * fitScale;
  const fh = img.height * fitScale;
  ctx.drawImage(
    img,
    cardX + 12 + (cardSize - 24 - fw) / 2,
    cardY + 12 + (cardSize - 24 - fh) / 2,
    fw,
    fh
  );
  ctx.restore();

  // 4. Badge (HOT / VIRAL) — top-left ribbon over the card
  if (product.badge) {
    const isHot = product.badge.toUpperCase().includes("HOT");
    ctx.font = "bold 34px sans-serif";
    const label = product.badge.toUpperCase();
    const textW = ctx.measureText(label).width;
    const pillW = textW + 56;
    const pillH = 60;
    const pillX = cardX - 10;
    const pillY = cardY - 10;

    ctx.save();
    ctx.shadowColor = "rgba(0,0,0,0.35)";
    ctx.shadowBlur = 16;
    roundRect(ctx, pillX, pillY, pillW, pillH, pillH / 2);
    ctx.fillStyle = isHot ? COLORS.badgeHot : COLORS.badgeViral;
    ctx.fill();
    ctx.restore();

    ctx.fillStyle = "#ffffff";
    ctx.textBaseline = "middle";
    ctx.fillText(label, pillX + 28, pillY + pillH / 2 + 2);
  }

  // 5. Brand watermark — top right
  ctx.font = "bold 32px sans-serif";
  ctx.fillStyle = "#ffffff";
  ctx.textAlign = "right";
  ctx.textBaseline = "top";
  ctx.fillText(BRAND_NAME, WIDTH - 48, 48);
  ctx.textAlign = "left";

  // 6. Title (wrapped, max 2 lines)
  const contentX = 64;
  const contentWidth = WIDTH - 128;
  let cursorY = cardY + cardSize + 60;

  ctx.font = "bold 46px sans-serif";
  ctx.fillStyle = "#ffffff";
  ctx.textBaseline = "alphabetic";
  const titleLines = wrapText(ctx, product.title, contentWidth).slice(0, 2);
  for (const line of titleLines) {
    ctx.fillText(line, contentX, cursorY);
    cursorY += 56;
  }

  // 7. Rating (stars + number)
  if (product.rating) {
    cursorY += 6;
    ctx.font = "32px sans-serif";
    ctx.fillStyle = COLORS.star;
    ctx.fillText("★★★★★", contentX, cursorY);
    ctx.fillStyle = "rgba(255,255,255,0.85)";
    ctx.fillText(`  ${product.rating}`, contentX + 180, cursorY);
    cursorY += 20;
  }

  // 8. Price (large, accent color) + CTA pill on the right
  cursorY += 56;
  ctx.font = "bold 64px sans-serif";
  ctx.fillStyle = COLORS.price;
  ctx.fillText(formatRupiah(product.price), contentX, cursorY);

  // CTA button
  const ctaText = "Beli Sekarang →";
  ctx.font = "bold 32px sans-serif";
  const ctaTextW = ctx.measureText(ctaText).width;
  const ctaW = ctaTextW + 64;
  const ctaH = 84;
  const ctaX = WIDTH - 64 - ctaW;
  const ctaY = cursorY - 56;

  ctx.save();
  ctx.shadowColor = "rgba(255,91,46,0.5)";
  ctx.shadowBlur = 24;
  roundRect(ctx, ctaX, ctaY, ctaW, ctaH, ctaH / 2);
  ctx.fillStyle = COLORS.cta;
  ctx.fill();
  ctx.restore();

  ctx.fillStyle = COLORS.ctaText;
  ctx.textBaseline = "middle";
  ctx.fillText(ctaText, ctaX + 32, ctaY + ctaH / 2 + 2);

  return canvas;
}

async function main() {
  const raw = await fs.readFile(PRODUCTS_JSON, "utf-8").catch(() => null);
  if (!raw) {
    console.error(
      `Could not find ${path.relative(REPO_ROOT, PRODUCTS_JSON)}. Run "npm run automation:fetch" first.`
    );
    process.exit(1);
  }

  const products = JSON.parse(raw);
  await fs.mkdir(POSTERS_DIR, { recursive: true });

  console.log(`Generating ${products.length} poster(s)...`);

  for (const product of products) {
    try {
      const canvas = await drawPoster(product);
      const outPath = path.join(POSTERS_DIR, `${product.slug}.png`);
      await fs.writeFile(outPath, canvas.toBuffer("image/png"));
      console.log(`  ✔ ${product.title} -> ${path.relative(REPO_ROOT, outPath)}`);
    } catch (err) {
      console.warn(`  ✘ Skipped "${product.title}": ${err.message}`);
    }
  }

  console.log(`\nDone. Posters saved in ${path.relative(REPO_ROOT, POSTERS_DIR)}`);
}

main();
