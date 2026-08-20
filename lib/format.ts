import { CURRENCY, TIME_ZONE } from "./domain";

const money = new Intl.NumberFormat("en-US", { style: "currency", currency: CURRENCY });
const moneyCompact = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: CURRENCY,
  notation: "compact",
  maximumFractionDigits: 1,
});
const dateOnly = new Intl.DateTimeFormat("en-US", { dateStyle: "medium", timeZone: TIME_ZONE });
const dateAndTime = new Intl.DateTimeFormat("en-US", {
  dateStyle: "medium",
  timeStyle: "short",
  timeZone: TIME_ZONE,
});

export function formatMoney(cents: number) {
  return money.format(cents / 100);
}

export function formatMoneyCompact(cents: number) {
  return moneyCompact.format(cents / 100);
}

export function formatDate(value: Date) {
  return dateOnly.format(value);
}

export function formatDateTime(value: Date) {
  return `${dateAndTime.format(value)} ${TIME_ZONE}`;
}

const MINUTE = 60_000;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

export function formatRelative(value: Date, now = Date.now()) {
  const elapsed = now - value.getTime();
  if (elapsed < MINUTE) return "just now";
  if (elapsed < HOUR) return `${Math.floor(elapsed / MINUTE)}m ago`;
  if (elapsed < DAY) return `${Math.floor(elapsed / HOUR)}h ago`;
  const days = Math.floor(elapsed / DAY);
  if (days < 30) return `${days}d ago`;
  return formatDate(value);
}

export function formatDuration(ms: number) {
  if (ms < HOUR) return `${Math.max(1, Math.round(ms / MINUTE))} min`;
  if (ms < DAY) return `${(ms / HOUR).toFixed(1)} hrs`;
  return `${(ms / DAY).toFixed(1)} days`;
}

// integer maths only, never a float on an amount
export function parseAmountToCents(input: string) {
  const trimmed = input.trim().replace(/[$,\s]/g, "");
  if (!/^\d{1,9}(\.\d{1,2})?$/.test(trimmed)) return null;
  const [whole, fraction = ""] = trimmed.split(".");
  return Number(whole) * 100 + Number(fraction.padEnd(2, "0"));
}

export function centsToAmountInput(cents: number) {
  return (cents / 100).toFixed(2);
}

const dayShort = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  timeZone: TIME_ZONE,
});

export function formatDayShort(isoDate: string) {
  return dayShort.format(new Date(`${isoDate}T00:00:00Z`));
}
