import { siteConfig } from "@/config/site";

/** Format a number as store currency, e.g. "Rs 12,500". */
export function formatCurrency(amount: number): string {
  const { symbol, position, locale } = siteConfig.currency;
  const formatted = new Intl.NumberFormat(locale, {
    maximumFractionDigits: 0,
  }).format(Math.round(amount));
  return position === "before" ? `${symbol} ${formatted}` : `${formatted} ${symbol}`;
}

/** Format a date consistently across server/client. */
export function formatDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(d);
}

export function formatDateTime(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(d);
}
