const MAP: [number, string][] = [
  [1000, "M"], [900, "CM"], [500, "D"], [400, "CD"], [100, "C"], [90, "XC"],
  [50, "L"], [40, "XL"], [10, "X"], [9, "IX"], [5, "V"], [4, "IV"], [1, "I"],
];

/** Integer 1-3999 to a Roman numeral; null when out of range or not an integer. */
export function toRoman(n: number): string | null {
  if (!Number.isInteger(n) || n < 1 || n > 3999) return null;
  let out = "";
  for (const [v, s] of MAP) {
    while (n >= v) {
      out += s;
      n -= v;
    }
  }
  return out;
}

/** Roman numeral to integer; null when not a canonical numeral in 1-3999. */
export function fromRoman(s: string): number | null {
  const str = s.trim().toUpperCase();
  if (!/^[MDCLXVI]+$/.test(str)) return null;
  let n = 0;
  let rest = str;
  for (const [v, sym] of MAP) {
    while (rest.startsWith(sym)) {
      n += v;
      rest = rest.slice(sym.length);
    }
  }
  return rest === "" && toRoman(n) === str ? n : null;
}

export interface RomanDate {
  day: string;
  month: string;
  year: string;
}

/** Parse "YYYY-MM-DD" (native date input value) into Roman parts. Null if invalid or year outside 1-3999. */
export function romanDate(iso: string): RomanDate | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  if (!m) return null;
  const [y, mo, d] = [Number(m[1]), Number(m[2]), Number(m[3])];
  const dt = new Date(Date.UTC(y, mo - 1, d));
  if (dt.getUTCFullYear() !== y || dt.getUTCMonth() !== mo - 1 || dt.getUTCDate() !== d) return null;
  const [day, month, year] = [toRoman(d), toRoman(mo), toRoman(y)];
  return day && month && year ? { day, month, year } : null;
}

export type RomanSeparator = "·" | "." | "-" | "/" | "";

/** Join date parts in month-day-year (US) or day-month-year order. */
export function joinRomanDate(p: RomanDate, sep: RomanSeparator, order: "mdy" | "dmy" = "mdy"): string {
  const parts = order === "mdy" ? [p.month, p.day, p.year] : [p.day, p.month, p.year];
  return parts.join(sep);
}
