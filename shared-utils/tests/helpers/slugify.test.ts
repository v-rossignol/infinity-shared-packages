import { describe, expect, it } from "vitest";
import { slugify } from "../../src/helpers";

describe("slugify", () => {
  it("lowercases and replaces spaces with hyphens", () => {
    expect(slugify("Iron Ore")).toBe("iron-ore");
  });

  it("removes non-word characters", () => {
    expect(slugify("Scout X1!")).toBe("scout-x1");
  });
});
