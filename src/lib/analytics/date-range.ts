import {
  endOfDay,
  format,
  startOfDay,
  subDays,
} from "date-fns";
import type { DatePreset, DateRange } from "@/types/analytics";

const PRESET_LABELS: Record<Exclude<DatePreset, "custom">, string> = {
  today: "Today",
  yesterday: "Yesterday",
  "7d": "Last 7 Days",
  "30d": "Last 30 Days",
  "90d": "Last 90 Days",
};

export function resolveDateRange(
  preset: DatePreset = "7d",
  fromParam?: string | null,
  toParam?: string | null
): DateRange {
  const now = new Date();

  if (preset === "custom" && fromParam && toParam) {
    return {
      preset,
      from: startOfDay(new Date(fromParam)).toISOString(),
      to: endOfDay(new Date(toParam)).toISOString(),
      label: `${format(new Date(fromParam), "MMM d")} – ${format(new Date(toParam), "MMM d, yyyy")}`,
    };
  }

  if (preset === "today") {
    return {
      preset,
      from: startOfDay(now).toISOString(),
      to: endOfDay(now).toISOString(),
      label: PRESET_LABELS.today,
    };
  }

  if (preset === "yesterday") {
    const y = subDays(now, 1);
    return {
      preset,
      from: startOfDay(y).toISOString(),
      to: endOfDay(y).toISOString(),
      label: PRESET_LABELS.yesterday,
    };
  }

  const days = preset === "90d" ? 90 : preset === "30d" ? 30 : 7;
  const from = startOfDay(subDays(now, days - 1));

  return {
    preset,
    from: from.toISOString(),
    to: endOfDay(now).toISOString(),
    label: PRESET_LABELS[preset as Exclude<DatePreset, "custom">] ?? PRESET_LABELS["7d"],
  };
}

export function getPreviousRange(range: DateRange): { from: string; to: string } {
  const fromMs = new Date(range.from).getTime();
  const toMs = new Date(range.to).getTime();
  const span = toMs - fromMs;
  return {
    from: new Date(fromMs - span - 1).toISOString(),
    to: new Date(fromMs - 1).toISOString(),
  };
}

export function isWithinRange(iso: string, from: string, to: string): boolean {
  const t = new Date(iso).getTime();
  return t >= new Date(from).getTime() && t <= new Date(to).getTime();
}

export function dayKeysInRange(from: string, to: string): string[] {
  const keys: string[] = [];
  const cursor = startOfDay(new Date(from));
  const end = startOfDay(new Date(to));
  while (cursor <= end) {
    keys.push(format(cursor, "yyyy-MM-dd"));
    cursor.setDate(cursor.getDate() + 1);
  }
  return keys;
}
