/**
 * Test Google Sheets leads sync (Codplus format).
 *
 * Usage:
 *   node --env-file=.env.local scripts/test-google-sheets-order.mjs
 */
import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";
import { JWT } from "google-auth-library";

const LEADS_HEADERS = [
  "👤 Customer",
  "📞 Phone",
  "🏙️ City",
  "📍 Address",
  "💰 Price",
  "🔢 Qty",
  "🏷️ SKU",
  "🗒️ Note",
];

function loadEnvFile() {
  const envPath = resolve(process.cwd(), ".env.local");
  if (!existsSync(envPath)) return;
  for (const line of readFileSync(envPath, "utf8").split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (!process.env[key]) process.env[key] = value;
  }
}

function encodeRange(sheetName, range) {
  return `'${sheetName.replace(/'/g, "''")}'!${range}`;
}

async function sheetsFetch(auth, spreadsheetId, path, init) {
  const token = await auth.getAccessToken();
  const res = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${token.token}`,
      "Content-Type": "application/json",
      ...(init?.headers || {}),
    },
  });
  const body = await res.text();
  if (!res.ok) throw new Error(`${res.status} ${body}`);
  return body ? JSON.parse(body) : null;
}

async function main() {
  loadEnvFile();

  const spreadsheetId = process.env.GOOGLE_SHEETS_ID;
  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n");

  if (!spreadsheetId || !email || !privateKey) {
    console.error("Missing GOOGLE_SHEETS_ID, GOOGLE_SERVICE_ACCOUNT_EMAIL, or GOOGLE_PRIVATE_KEY");
    process.exit(1);
  }

  const sheetName = process.env.GOOGLE_SHEETS_ORDER_SHEET || "leads";
  const orderNumber = `TEST-${Date.now()}`;

  const testRow = [
    "Test Customer",
    "+212600000000",
    "Casablanca",
    "123 Test Street",
    "199",
    "1",
    "Portable-air-cooler",
    `NOORVA:${orderNumber} | Integration test — safe to delete`,
  ];

  const auth = new JWT({
    email,
    key: privateKey,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  console.log("Checking spreadsheet access...");
  const meta = await sheetsFetch(auth, spreadsheetId, "?fields=sheets.properties.title");
  const sheetExists = meta.sheets?.some((s) => s.properties?.title === sheetName);
  if (!sheetExists) {
    throw new Error(`Sheet tab "${sheetName}" not found. Create it or set GOOGLE_SHEETS_ORDER_SHEET.`);
  }

  const notesRange = encodeURIComponent(encodeRange(sheetName, "H2:H"));
  const existing = await sheetsFetch(auth, spreadsheetId, `/values/${notesRange}`);
  const marker = `NOORVA:${orderNumber}`;
  const duplicate = (existing.values || []).flat().some((value) => String(value).includes(marker));
  if (duplicate) {
    console.log("Duplicate detected — skipping append.");
    return;
  }

  console.log(`Appending test lead ${orderNumber} to "${sheetName}"...`);
  const appendRange = encodeURIComponent(encodeRange(sheetName, "A:H"));
  await sheetsFetch(
    auth,
    spreadsheetId,
    `/values/${appendRange}:append?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS`,
    {
      method: "POST",
      body: JSON.stringify({ values: [testRow] }),
    }
  );

  console.log("Success! Open your sheet:");
  console.log(`https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit`);
  console.log(`Look in tab "${sheetName}" for SKU: Portable-air-cooler`);
}

main().catch((err) => {
  console.error("Test failed:", err.message || err);
  process.exit(1);
});
