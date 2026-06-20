type ClassValue = string | number | null | undefined | false;

/** Tiny className joiner — no dependency needed for this use. */
export function cn(...values: ClassValue[]): string {
  return values.filter(Boolean).join(" ");
}
