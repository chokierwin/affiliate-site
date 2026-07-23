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

## Next steps (not built yet)

- `automation/generate-poster.mjs` — Canvas poster generation
- `automation/generate-video.mjs` — FFmpeg video generation
- `automation/upload.mjs` — auto-upload to YouTube/Facebook/TikTok +
  call `updateUploadedStatus()` from `lib/sheets.mjs` to mark rows done
