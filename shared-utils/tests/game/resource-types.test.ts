import { describe, expect, it } from "vitest";
import { isResourceTypeAllowed } from "../../src/game";

describe("isResourceTypeAllowed", () => {
  it("allows any resource when types includes a wildcard", () => {
    expect(isResourceTypeAllowed(["*"], "iron")).toBe(true);
  });

  it("allows a listed resource type", () => {
    expect(isResourceTypeAllowed(["iron", "copper"], "iron")).toBe(true);
  });

  it("rejects a resource type that is not listed", () => {
    expect(isResourceTypeAllowed(["iron", "copper"], "gold")).toBe(false);
  });
});
