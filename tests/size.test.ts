import { describe, expect, it } from "vitest";
import { aspectRatio, convert, detailCheck, fitPlacements, round, scaleSize, sizeCategory, toInches } from "../src/lib/tools/size";

describe("size helpers", () => {
  it("converts units", () => {
    expect(toInches(2.54, "cm")).toBeCloseTo(1);
    expect(toInches(25.4, "mm")).toBeCloseTo(1);
    expect(round(convert(3, "in", "cm"))).toBe(7.62);
    expect(round(convert(76.2, "mm", "in"))).toBe(3);
  });

  it("picks a category by longest side", () => {
    expect(sizeCategory(1, 1).id).toBe("tiny");
    expect(sizeCategory(1, 2).id).toBe("small");
    expect(sizeCategory(3, 2).id).toBe("medium");
    expect(sizeCategory(4, 8).id).toBe("large");
    expect(sizeCategory(5, 12).id).toBe("half-sleeve");
    expect(sizeCategory(8, 20).id).toBe("sleeve");
  });

  it("simplifies aspect ratios", () => {
    expect(aspectRatio(3, 2).label).toBe("3:2");
    expect(aspectRatio(4, 4).label).toBe("1:1");
    expect(aspectRatio(0, 4).label).toBe("-");
  });

  it("scales and checks detail", () => {
    expect(scaleSize(2, 3, 2)).toEqual({ w: 4, h: 6 });
    expect(detailCheck(2, "fine").enough).toBe(false);
    expect(detailCheck(5, "fine").enough).toBe(true);
  });

  it("fits placements in either orientation", () => {
    const list = [
      { id: "wrist", label: "Wrist", areaIn: { w: 2.5, h: 1.5 } },
      { id: "back", label: "Back", areaIn: { w: 14, h: 18 } },
    ];
    const r = fitPlacements(1.5, 2.5, list);
    expect(r[0].fits).toBe(true);
    expect(r[1].fits).toBe(true);
    expect(fitPlacements(6, 6, list)[0].fits).toBe(false);
  });
});
