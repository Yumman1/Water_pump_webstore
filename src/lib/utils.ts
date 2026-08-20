import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Merge Tailwind class names, resolving conflicts. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Remove em/en dashes and similar separators from customer-facing copy.
 * Replaces them with commas (or a period when the next word is capitalized).
 */
export function cleanCopy(input: string | null | undefined): string {
  if (!input) return "";
  let s = input
    .replace(/[\u2012\u2013\u2014\u2015\u2212]/g, "—") // normalize exotic dashes to em
    .replace(/ *— */g, " — ");

  s = s.replace(/ — ([A-Z])/g, ". $1");
  s = s.replace(/ — /g, ", ");
  s = s.replace(/—/g, ",");
  s = s.replace(/,\s*,+/g, ",");
  s = s.replace(/\.\s*,/g, ".");
  s = s.replace(/,\s*\./g, ".");
  return s.trim();
}

/** Clean every string value in a specs map. */
export function cleanSpecs(specs: Record<string, string> | null | undefined): Record<string, string> {
  if (!specs) return {};
  const out: Record<string, string> = {};
  for (const [k, v] of Object.entries(specs)) {
    out[cleanCopy(k)] = cleanCopy(v);
  }
  return out;
}

/** Turn a string into a URL-safe slug. */
export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Generate a human-friendly order number. */
export function generateOrderNumber(): string {
  const rand = Math.floor(1000 + Math.random() * 9000);
  const stamp = Date.now().toString().slice(-6);
  return `ORD-${stamp}-${rand}`;
}
