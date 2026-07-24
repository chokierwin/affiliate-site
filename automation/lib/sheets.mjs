import { google } from "googleapis";

/**
 * Required environment variables (see automation/.env.example):
 * - GOOGLE_SERVICE_ACCOUNT_EMAIL
 * - GOOGLE_PRIVATE_KEY          (keep the \n escapes, they get unescaped below)
 * - GOOGLE_SHEET_ID             (from the sheet's normal URL, NOT the "publish to web" link)
 * - GOOGLE_SHEET_TAB            (tab/sheet name, e.g. "Sheet1")
 */
function requireEnv(name) {
  const value = process.env[name];
  if (!value) {
    throw new Error(
      `Missing required env var: ${name}. Copy automation/.env.example to automation/.env and fill it in.`
    );
  }
  return value;
}

function getSpreadsheetId() {
  const raw = requireEnv("GOOGLE_SHEET_ID");
  // Accept either a bare ID or a full Google Sheets URL (pasted via "Copy link")
  const match = raw.match(/\/d\/([a-zA-Z0-9-_]+)/);
  return match ? match[1] : raw.trim();
}

let cachedClient = null;

export function getSheetsClient() {
  if (cachedClient) return cachedClient;

  const email = requireEnv("GOOGLE_SERVICE_ACCOUNT_EMAIL");
  const privateKey = requireEnv("GOOGLE_PRIVATE_KEY").replace(/\\n/g, "\n");

  const auth = new google.auth.JWT({
    email,
    key: privateKey,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  cachedClient = google.sheets({ version: "v4", auth });
  return cachedClient;
}

// Maps the header names used in the sheet to the internal field names we
// use in code. The sheet uses the same lowercase English headers as
// lib/products.ts (title, price, image, link, badge, rating, uploaded).
const HEADER_MAP = {
  title: "title",
  price: "price",
  rating: "rating",
  badge: "badge",
  image: "image",
  video: "video",
  link: "link",
  uploaded: "uploaded",
};

/**
 * Reads all rows from the sheet and returns them as objects, plus the
 * 1-indexed sheet row number (accounting for the header row) so callers can
 * write back to the exact same row later.
 */
export async function fetchAllRows() {
  const sheets = getSheetsClient();
  const spreadsheetId = getSpreadsheetId();
  const tab = requireEnv("GOOGLE_SHEET_TAB");

  const res = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: `${tab}!A:Z`,
  });

  const rows = res.data.values || [];
  if (rows.length === 0) return { headers: [], columnIndex: {}, items: [] };

  const headerRow = rows[0];
  const columnIndex = {}; // internal field name -> 0-based column index
  headerRow.forEach((h, i) => {
    const key = HEADER_MAP[h.trim()];
    if (key) columnIndex[key] = i;
  });

  const items = rows.slice(1).map((row, i) => {
    const item = { sheetRow: i + 2 }; // +2: 1 for header, 1 for 1-indexing
    for (const [field, colIdx] of Object.entries(columnIndex)) {
      item[field] = (row[colIdx] ?? "").toString().trim();
    }
    return item;
  });

  return { headers: headerRow, columnIndex, items };
}

/**
 * Returns only rows where the "Uploaded" column is "pending" (or empty,
 * treated the same as pending) and has the minimum fields needed to build
 * a poster/video.
 */
export async function fetchPendingProducts() {
  const { items } = await fetchAllRows();
  return items.filter((item) => {
    const status = (item.uploaded || "pending").toLowerCase();
    return status === "pending" && item.title && item.image && item.link;
  });
}

/**
 * Writes a single value into the "Uploaded" column for a given sheet row.
 * Use this once poster/video/upload steps for that product are done.
 */
export async function updateUploadedStatus(sheetRow, value) {
  const sheets = getSheetsClient();
  const spreadsheetId = getSpreadsheetId();
  const tab = requireEnv("GOOGLE_SHEET_TAB");
  const { columnIndex } = await fetchAllRows();

  if (columnIndex.uploaded === undefined) {
    throw new Error('Could not find an "Uploaded" column in the sheet header row.');
  }

  const colLetter = columnToLetter(columnIndex.uploaded);

  await sheets.spreadsheets.values.update({
    spreadsheetId,
    range: `${tab}!${colLetter}${sheetRow}`,
    valueInputOption: "RAW",
    requestBody: { values: [[value]] },
  });
}

function columnToLetter(index) {
  let letter = "";
  let n = index + 1;
  while (n > 0) {
    const rem = (n - 1) % 26;
    letter = String.fromCharCode(65 + rem) + letter;
    n = Math.floor((n - 1) / 26);
  }
  return letter;
}
