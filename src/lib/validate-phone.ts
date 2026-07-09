/** Validates Moroccan mobile numbers (06, 07, 05 + 8 digits). */
export function isValidMoroccanPhone(phone: string): boolean {
  const cleaned = phone.replace(/[\s\-().]/g, "");
  return /^(\+212|00212|212)?[5-7]\d{8}$/.test(cleaned) || /^0[5-7]\d{8}$/.test(cleaned);
}

export function normalizeMoroccanPhone(phone: string): string {
  const cleaned = phone.replace(/[\s\-().]/g, "");
  if (cleaned.startsWith("+212")) return cleaned;
  if (cleaned.startsWith("00212")) return `+${cleaned.slice(2)}`;
  if (cleaned.startsWith("212")) return `+${cleaned}`;
  if (cleaned.startsWith("0")) return `+212${cleaned.slice(1)}`;
  return `+212${cleaned}`;
}
