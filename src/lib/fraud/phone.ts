/**
 * Moroccan phone validation & normalization for COD fraud prevention.
 * Canonical store format: 06XXXXXXXX / 07XXXXXXXX / 05XXXXXXXX
 */

const MOBILE_PREFIXES = new Set([
  // Maroc Telecom (IAM)
  "0610", "0611", "0612", "0613", "0614", "0615", "0616", "0617", "0618", "0619",
  "0620", "0621", "0622", "0623", "0624", "0625", "0626", "0627", "0628", "0629",
  "0630", "0631", "0632", "0633", "0634", "0635", "0636", "0637", "0638", "0639",
  "0640", "0641", "0642", "0643", "0644", "0645", "0646", "0647", "0648", "0649",
  "0650", "0651", "0652", "0653", "0654", "0655", "0656", "0657", "0658", "0659",
  // Orange / Méditel historically + Inwi + shared 06/07 ranges (broad valid mobiles)
  "0660", "0661", "0662", "0663", "0664", "0665", "0666", "0667", "0668", "0669",
  "0670", "0671", "0672", "0673", "0674", "0675", "0676", "0677", "0678", "0679",
  "0680", "0681", "0682", "0683", "0684", "0685", "0686", "0687", "0688", "0689",
  "0690", "0691", "0692", "0693", "0694", "0695", "0696", "0697", "0698", "0699",
  "0700", "0701", "0702", "0703", "0704", "0705", "0706", "0707", "0708", "0709",
  "0710", "0711", "0712", "0713", "0714", "0715", "0716", "0717", "0718", "0719",
  "0720", "0721", "0722", "0723", "0724", "0725", "0726", "0727", "0728", "0729",
  "0760", "0761", "0762", "0763", "0764", "0765", "0766", "0767", "0768", "0769",
  "0770", "0771", "0772", "0773", "0774", "0775", "0776", "0777", "0778", "0779",
  "0780", "0781", "0782", "0783", "0784", "0785", "0786", "0787", "0788", "0789",
]);

/** Digits-only national mobile body: 9 digits starting with 5/6/7 */
function extractNationalDigits(phone: string): string | null {
  let digits = phone.replace(/\D/g, "");
  if (digits.startsWith("00212")) digits = digits.slice(5);
  else if (digits.startsWith("212")) digits = digits.slice(3);
  if (digits.startsWith("0") && digits.length === 10) digits = digits.slice(1);
  if (digits.length !== 9) return null;
  if (!/^[5-7]\d{8}$/.test(digits)) return null;
  return digits;
}

/** Obvious fake / sequential / repeated patterns */
function isObviouslyFake(national9: string): boolean {
  const local10 = `0${national9}`;

  // All same digit: 111111111, 666666666
  if (/^(\d)\1{8}$/.test(national9)) return true;
  if (/^(\d)\1{9}$/.test(local10)) return true;

  // Repeating pairs / blocks
  if (/^(\d{2})\1{3}\d?$/.test(national9)) return true;
  if (/^(\d{3})\1{2}$/.test(national9)) return true;

  // Sequential ascending/descending (at least 8 steps)
  const seq = "0123456789876543210";
  if (seq.includes(national9.slice(0, 8)) || seq.includes(national9)) return true;

  // Common test numbers
  const banned = new Set([
    "600000000", "611111111", "622222222", "633333333", "644444444",
    "655555555", "666666666", "677777777", "688888888", "699999999",
    "700000000", "711111111", "722222222", "733333333", "744444444",
    "755555555", "766666666", "777777777", "788888888", "799999999",
    "500000000", "512345678", "612345678", "712345678",
    "600000001", "666666660", "060606060".slice(1),
  ]);
  if (banned.has(national9)) return true;

  // Too many identical digits (>= 7 of same)
  for (let d = 0; d <= 9; d++) {
    const count = national9.split(String(d)).length - 1;
    if (count >= 7) return true;
  }

  return false;
}

export interface PhoneValidationResult {
  valid: boolean;
  normalized: string; // 06XXXXXXXX
  international: string; // +2126XXXXXXXX
  national9: string;
  reasons: string[];
}

/**
 * Normalize to local Moroccan format 0XXXXXXXXX for deduplication.
 * Accepts +212 / 212 / 00212 / 0X…
 */
export function normalizeMoroccanPhoneLocal(phone: string): string | null {
  const national = extractNationalDigits(phone);
  if (!national) return null;
  return `0${national}`;
}

export function toInternationalMoroccan(phone: string): string | null {
  const national = extractNationalDigits(phone);
  if (!national) return null;
  return `+212${national}`;
}

export function validateMoroccanPhone(phone: string): PhoneValidationResult {
  const reasons: string[] = [];
  const cleaned = (phone || "").trim();

  if (!cleaned) {
    return { valid: false, normalized: "", international: "", national9: "", reasons: ["phone_empty"] };
  }

  const digitsOnly = cleaned.replace(/\D/g, "");
  if (digitsOnly.length < 9 || digitsOnly.length > 14) {
    reasons.push("phone_invalid_length");
  }

  const national = extractNationalDigits(cleaned);
  if (!national) {
    reasons.push("phone_invalid_format");
    return {
      valid: false,
      normalized: "",
      international: "",
      national9: "",
      reasons,
    };
  }

  const first = national[0];
  if (first !== "5" && first !== "6" && first !== "7") {
    reasons.push("phone_invalid_prefix");
  }

  // Soft-flag uncommon mobile prefix blocks (still valid by length/pattern)
  const prefix4 = `0${national.slice(0, 3)}`;
  if (!MOBILE_PREFIXES.has(prefix4)) {
    reasons.push("phone_uncommon_prefix");
  }

  // 05 ranges are often landline-adjacent; COD prefers 06/07
  if (first === "5") {
    reasons.push("phone_landline_range");
  }

  if (isObviouslyFake(national)) {
    reasons.push("fake_phone_pattern");
  }

  const hardFail = reasons.some((r) =>
    ["phone_invalid_length", "phone_invalid_format", "phone_invalid_prefix", "fake_phone_pattern", "phone_empty"].includes(r)
  );

  const normalized = `0${national}`;
  const international = `+212${national}`;

  const softOnly = new Set(["phone_landline_range", "phone_uncommon_prefix"]);
  const valid = !hardFail;

  return {
    valid,
    normalized,
    international,
    national9: national,
    reasons: valid ? reasons.filter((r) => softOnly.has(r)) : reasons,
  };
}

export function phonesMatch(a: string, b: string): boolean {
  const na = normalizeMoroccanPhoneLocal(a);
  const nb = normalizeMoroccanPhoneLocal(b);
  return Boolean(na && nb && na === nb);
}
