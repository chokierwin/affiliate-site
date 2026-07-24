import { config } from "dotenv";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { google } from "googleapis";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
config({ path: path.join(__dirname, ".env") });

async function main() {
  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const privateKey = (process.env.GOOGLE_PRIVATE_KEY || "").replace(/\\n/g, "\n");
  const rawSheetIdEnv = process.env.GOOGLE_SHEET_ID || "";
  const urlMatch = rawSheetIdEnv.match(/\/d\/([a-zA-Z0-9-_]+)/);
  const spreadsheetId = urlMatch ? urlMatch[1] : rawSheetIdEnv.trim();

  console.log("Using service account:", email);
  console.log("GOOGLE_SHEET_ID raw value:", rawSheetIdEnv);
  console.log("Extracted spreadsheet ID:", spreadsheetId);
  console.log("Private key starts with:", privateKey.slice(0, 30));
  console.log("Private key ends with:", privateKey.slice(-30));
  console.log("");

  const auth = new google.auth.JWT({
    email,
    key: privateKey,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  const sheets = google.sheets({ version: "v4", auth });

  console.log("Step 1: trying to access the spreadsheet metadata (no range)...");
  try {
    const res = await sheets.spreadsheets.get({ spreadsheetId });
    console.log("✔ SUCCESS — spreadsheet title:", res.data.properties.title);
    console.log("  Available tabs:", res.data.sheets.map((s) => s.properties.title));
  } catch (err) {
    console.error("✘ FAILED at spreadsheet-access level.");
    console.error("  This means the service account cannot see the spreadsheet at all —");
    console.error("  either the ID is wrong, or the share didn't actually apply.");
    console.error("  Raw error:", err.response?.data?.error || err.message);
    process.exit(1);
  }
}

main();
