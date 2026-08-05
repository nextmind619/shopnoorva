import { aiConfig, isConfigured } from "../config";

function normalizePrivateKey(raw: string): string {
  let key = raw.trim();
  if (
    (key.startsWith('"') && key.endsWith('"')) ||
    (key.startsWith("'") && key.endsWith("'"))
  ) {
    key = key.slice(1, -1);
  }
  return key.replace(/\\n/g, "\n");
}

export function resolveGoogleServiceAccount(): { email: string; privateKey: string } | null {
  const rawKey = process.env.GOOGLE_PRIVATE_KEY || "";
  const rawEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL || "";

  if (rawKey.trim().startsWith("{")) {
    try {
      const json = JSON.parse(rawKey) as { client_email?: string; private_key?: string };
      const email = json.client_email || rawEmail;
      const privateKey = normalizePrivateKey(json.private_key || "");
      if (isConfigured(email) && isConfigured(privateKey)) {
        return { email, privateKey };
      }
    } catch {
      /* fall through */
    }
  }

  const email = aiConfig.googleSheets.serviceAccountEmail;
  const privateKey = normalizePrivateKey(aiConfig.googleSheets.privateKey);
  if (isConfigured(email) && isConfigured(privateKey)) {
    return { email, privateKey };
  }

  return null;
}

export function isGoogleSheetsConfigured(): boolean {
  return Boolean(resolveGoogleServiceAccount()) && isConfigured(aiConfig.googleSheets.spreadsheetId);
}

export function getGoogleSheetsConfigSummary() {
  const creds = resolveGoogleServiceAccount();
  return {
    spreadsheetId: aiConfig.googleSheets.spreadsheetId || null,
    sheet: aiConfig.googleSheets.orderSheetName,
    serviceAccountEmail: creds?.email || null,
    privateKeyLoaded: Boolean(creds?.privateKey),
    privateKeyLooksValid: Boolean(creds?.privateKey?.includes("BEGIN PRIVATE KEY")),
    configured: isGoogleSheetsConfigured(),
  };
}
