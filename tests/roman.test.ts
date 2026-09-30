import { describe, expect, it } from "vitest";
import { fromRoman, joinRomanDate, romanDate, toRoman } from "../src/lib/tools/roman";

describe("toRoman", () => {
  it.each([
    [1, "I"], [4, "IV"], [9, "IX"], [40, "XL"], [90, "XC"], [400, "CD"], [900, "CM"],
    [1994, "MCMXCIV"], [2025, "MMXXV"], [3999, "MMMCMXCIX"],
  ])("%i -> %s", (n, r) => expect(toRoman(n)).toBe(r));

  it("rejects out of range and non-integers", () => {
    expect(toRoman(0)).toBeNull();
    expect(toRoman(4000)).toBeNull();
    expect(toRoman(-5)).toBeNull();
    expect(toRoman(2.5)).toBeNull();
    expect(toRoman(NaN)).toBeNull();
  });
});

describe("fromRoman", () => {
  it("round-trips 1..3999", () => {
    for (let i = 1; i <= 3999; i++) expect(fromRoman(toRoman(i)!)).toBe(i);
  });
  it("rejects non-canonical and invalid input", () => {
    expect(fromRoman("IIII")).toBeNull();
    expect(fromRoman("VX")).toBeNull();
    expect(fromRoman("")).toBeNull();
    expect(fromRoman("ABC")).toBeNull();
  });
});

describe("romanDate", () => {
  it("converts a valid date", () => {
    const p = romanDate("2025-12-24");
    expect(p).toEqual({ day: "XXIV", month: "XII", year: "MMXXV" });
    expect(joinRomanDate(p!, "·")).toBe("XII·XXIV·MMXXV");
    expect(joinRomanDate(p!, "", "dmy")).toBe("XXIVXIIMMXXV");
  });
  it("rejects impossible dates and out-of-range years", () => {
    expect(romanDate("2025-02-30")).toBeNull();
    expect(romanDate("")).toBeNull();
    expect(romanDate("0000-01-01")).toBeNull();
  });
});
