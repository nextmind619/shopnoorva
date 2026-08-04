import { aiConfig, isConfigured } from "../config";

export function resolveGoogleServiceAccount(): { email: string; privateKey: string } | null {
  const rawKey = process.env.GOOGLE_PRIVATE_KEY || "";
  const rawEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL || "";

  if (rawKey.trim().startsWith("{")) {
    try {
      const json = JSON.parse(rawKey) as { client_email?: string; private_key?: string };
      const email = json.client_email || rawEmail;
      const privateKey = json.private_key?.replace(/\\n/g, "\n") || "";
      if (isConfigured(email) && isConfigured(privateKey)) {
        return { email, privateKey };
      }
    } catch {
      /* fall through */
    }
  }

  const email = aiConfig.googleSheets.serviceAccountEmail;
  const privateKey = aiConfig.googleSheets.privateKey;
  if (isConfigured(email) && isConfigured(privateKey)) {
    return { email, privateKey };
  }

  return null;
}

export function isGoogleSheetsConfigured(): boolean {
  return Boolean(resolveGoogleServiceAccount()) && isConfigured(aiConfig.googleSheets.spreadsheetId);
}
