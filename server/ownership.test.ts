import { describe, expect, it } from "vitest";
import { userOwnsResource } from "./ownership";

describe("resource ownership", () => {
  it("allows only the matching authenticated user", () => {
    expect(userOwnsResource(7, 7)).toBe(true);
    expect(userOwnsResource(7, 8)).toBe(false);
  });
});
