import { generateText } from "./openai";
import { store, type StoredOrder } from "./memory-store";
import { aiConfig } from "./config";

export interface FraudResult {
  score: number;
  flags: string[];
  decision: "allow" | "review" | "block";
  reason: string;
  isDuplicate: boolean;
  duplicateOf?: string;
}

function normalizePhone(phone: string): string {
  return phone.replace(/\D/g, "").replace(/^212/, "").replace(/^0/, "");
}

export function detectDuplicateOrder(input: {
  phone: string;
  address: string;
  total: number;
  items: Array<{ sku: string; quantity: number }>;
}): { isDuplicate: boolean; duplicateOf?: string; flags: string[] } {
  const windowMs = aiConfig.automation.duplicateWindowMinutes * 60 * 1000;
  const now = Date.now();
  const phone = normalizePhone(input.phone);
  const itemKey = input.items
    .map((i) => `${i.sku}:${i.quantity}`)
    .sort()
    .join("|");

  const match = store.orders.find((o) => {
    const age = now - new Date(o.createdAt).getTime();
    if (age > windowMs) return false;
    if (normalizePhone(o.phone) !== phone) return false;
    const existingKey = o.items
      .map((i) => `${i.sku}:${i.quantity}`)
      .sort()
      .join("|");
    const sameItems = existingKey === itemKey;
    const sameTotal = Math.abs(o.total - input.total) < 1;
    const sameAddress = o.address.trim().toLowerCase() === input.address.trim().toLowerCase();
    return sameItems || (sameTotal && sameAddress);
  });

  if (!match) return { isDuplicate: false, flags: [] };
  return {
    isDuplicate: true,
    duplicateOf: match.id,
    flags: ["duplicate_order_window", `duplicate_of:${match.orderNumber}`],
  };
}

function heuristicFraudScore(input: {
  phone: string;
  city: string;
  address: string;
  total: number;
  email?: string;
}): { score: number; flags: string[] } {
  const flags: string[] = [];
  let score = 0;

  const phoneDigits = input.phone.replace(/\D/g, "");
  if (phoneDigits.length < 9) {
    score += 40;
    flags.push("invalid_phone");
  }
  if (/^(\d)\1{7,}$/.test(phoneDigits)) {
    score += 50;
    flags.push("fake_phone_pattern");
  }

  if (!input.address || input.address.trim().length < 8) {
    score += 25;
    flags.push("incomplete_address");
  }
  if (/test|asdf|xxx|fake/i.test(input.address)) {
    score += 45;
    flags.push("test_address");
  }

  if (!input.city) {
    score += 15;
    flags.push("missing_city");
  }

  if (input.total > 3000) {
    score += 20;
    flags.push("high_value_cod");
  }

  const recentSamePhone = store.orders.filter(
    (o) =>
      normalizePhone(o.phone) === normalizePhone(input.phone) &&
      Date.now() - new Date(o.createdAt).getTime() < 24 * 60 * 60 * 1000
  );
  if (recentSamePhone.length >= 3) {
    score += 35;
    flags.push("velocity_phone");
  }

  const cancelledRatio =
    recentSamePhone.length > 0
      ? recentSamePhone.filter((o) => o.status === "cancelled").length / recentSamePhone.length
      : 0;
  if (cancelledRatio >= 0.5 && recentSamePhone.length >= 2) {
    score += 30;
    flags.push("high_cancel_history");
  }

  if (input.email && /tempmail|mailinator|10minutemail/i.test(input.email)) {
    score += 25;
    flags.push("disposable_email");
  }

  return { score: Math.min(100, score), flags };
}

export async function analyzeOrderFraud(input: {
  phone: string;
  email?: string;
  city: string;
  address: string;
  total: number;
  items: Array<{ sku: string; quantity: number; name: string }>;
}): Promise<FraudResult> {
  const duplicate = detectDuplicateOrder(input);
  if (duplicate.isDuplicate) {
    return {
      score: 95,
      flags: duplicate.flags,
      decision: "block",
      reason: "Duplicate order detected within protection window",
      isDuplicate: true,
      duplicateOf: duplicate.duplicateOf,
    };
  }

  const heuristic = heuristicFraudScore(input);

  let aiScore = heuristic.score;
  let aiFlags = [...heuristic.flags];
  let reason = "Heuristic risk evaluation";

  try {
    const aiRaw = await generateText(
      "You are a Moroccan COD ecommerce fraud analyst. Return JSON with score (0-100), flags (string[]), decision (allow|review|block), reason.",
      JSON.stringify({
        market: "Morocco",
        payment: "COD heavy",
        order: input,
        heuristic,
      }),
      { json: true, temperature: 0.1 }
    );
    const parsed = JSON.parse(aiRaw) as {
      score?: number;
      flags?: string[];
      decision?: "allow" | "review" | "block";
      reason?: string;
    };
    aiScore = Math.max(heuristic.score, Number(parsed.score || 0));
    aiFlags = Array.from(new Set([...(parsed.flags || []), ...heuristic.flags]));
    reason = parsed.reason || reason;
  } catch {
    // keep heuristic
  }

  const threshold = aiConfig.automation.fraudThreshold;
  const decision =
    aiScore >= threshold + 15 ? "block" : aiScore >= threshold ? "review" : "allow";

  return {
    score: aiScore,
    flags: aiFlags,
    decision,
    reason,
    isDuplicate: false,
  };
}

export function applyFraudToOrder(order: StoredOrder, fraud: FraudResult): StoredOrder {
  order.fraudScore = fraud.score;
  order.fraudFlags = fraud.flags;
  order.isDuplicate = fraud.isDuplicate;
  order.duplicateOf = fraud.duplicateOf;
  if (fraud.decision === "block") order.status = "cancelled";
  if (fraud.decision === "review") order.status = "review";
  return order;
}
