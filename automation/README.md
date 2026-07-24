# Automation Scripts

Standalone Node.js scripts that automate the content pipeline (Sheet → poster →
video → social upload). These run **locally or via a scheduled job** (e.g. cron,
GitHub Actions) — they are separate from the Next.js app and are not deployed
to Vercel.

## Step 1: Fetch pending products (done)

Reads the Google Sheet, filters rows where `Uploaded` = `pending`, downloads
each product image, and writes `automation/output/pending-products.json`.

### Setup

1. `cp automation/.env.example automation/.env`
2. Follow the comments in `.env.example` to create a Google service account,
   enable the Sheets API, and share your sheet with the service account email.
3. Fill in `GOOGLE_SHEET_ID` and `GOOGLE_SHEET_TAB` in `.env`.

> Note: this uses the Google Sheets **API** (read + write), which is
> different from the public CSV link (`lib/products.ts`) the live site uses
> to display products. The CSV link is read-only and can't update the
> `Uploaded` column.

### Run

```bash
npm run automation:fetch
```

Output:
- `automation/output/pending-products.json` — array of pending products with
  a generated `slug` and local image path
- `automation/output/images/` — downloaded product images

### Sheet columns expected

| title | price | image | link | badge | rating | uploaded |
|-------|-------|-------|------|-------|--------|----------|

Same lowercase headers as the ones `lib/products.ts` already reads from the
public CSV. `uploaded` should be `pending` for new rows. Column order doesn't
matter — headers are matched by name, not position.

## Step 2: Generate posters (done)

Reads `automation/output/pending-products.json` (from Step 1) and the
downloaded product images, and generates a branded 1080×1350 poster PNG for
each pending product — blurred background, product photo card, badge, title,
rating, price, and a "Beli Sekarang" CTA.

### Run

```bash
npm run automation:poster
```

Requires Step 1 (`npm run automation:fetch`) to have been run first.

Output: `automation/output/posters/<slug>.png`

### Customizing the design

Colors, fonts, and layout constants are all in
`automation/generate-poster.mjs` (see the `COLORS` object and the
`drawPoster()` function). The brand name shown on the poster is set via the
`BRAND_NAME` constant — keep it in sync with `lib/site-config.ts` ->
`shortName` if you change it there.

## Prerequisite: FFmpeg (needed for Step 3)

Video generation shells out to the `ffmpeg` command, so it must be installed
and on your PATH:

- **Windows**: `winget install ffmpeg` (or `choco install ffmpeg` if you use
  Chocolatey). Restart your terminal afterwards so PATH updates take effect.
- Verify with: `ffmpeg -version`

## Step 3: Generate videos (done)

Reads `automation/output/posters/*.png` (from Step 2) and turns each into a
short 9:16 vertical video (1080×1920, 12s, 25fps) with a slow Ken Burns
zoom-in on the poster and a blurred full-bleed version of the same poster
filling the background — sized for Reels / TikTok / Shorts.

### Run

```bash
npm run automation:video
```

Requires Step 2 (`npm run automation:poster`) to have been run first.
Encoding is CPU-heavy — expect roughly 30–60 seconds per video, so a full
batch of ~40 products can take 20–40 minutes. To test on just the first
product before running the full batch:

```bash
npm run automation:video -- --limit=1
```

Output: `automation/output/videos/<slug>.mp4`

### Adding background music

By default videos are generated with **silent audio** — no music is bundled
(copyright). To add your own royalty-free track:

1. Drop an mp3/wav file somewhere in the repo, e.g. `automation/music/track1.mp3`
2. In `automation/.env`, add:
   ```
   AUTOMATION_MUSIC_PATH=automation/music/track1.mp3
   ```
3. Re-run `npm run automation:video` — the track will loop/trim to fit the
   12s duration automatically.

### Customizing

Duration, resolution, zoom speed, and blur strength are constants at the top
of `automation/generate-video.mjs` (`DURATION_SECONDS`, `FPS`, `OUT_WIDTH`,
`OUT_HEIGHT`, and the `zoompan`/`gblur` parameters inside `generateVideo()`).

## Next steps (not built yet)

- `automation/upload.mjs` — auto-upload to Instagram Reels/Facebook
  Reels/TikTok + call `updateUploadedStatus()` from `lib/sheets.mjs` to mark
  rows done
