/** Shared address key for velocity / duplicate detection */

export function normalizeAddressKey(address: string): string {
  return address
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u064B-\u065F]/g, "") // Arabic diacritics
    .replace(/[^\p{L}\p{N}]+/gu, "")
    .trim();
}

export function normalizeNameKey(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u064B-\u065F]/g, "")
    .replace(/[^\p{L}\p{N}]+/gu, "")
    .trim();
}
