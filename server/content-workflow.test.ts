import { describe, expect, it } from "vitest";
import { canTransitionContentStatus, isExternallyPublishable } from "./content-workflow";

describe("content approval workflow", () => {
  it("allows a draft to be approved, returned, or archived", () => {
    expect(canTransitionContentStatus("draft", "approved")).toBe(true);
    expect(canTransitionContentStatus("draft", "revision")).toBe(true);
    expect(canTransitionContentStatus("draft", "archived")).toBe(true);
  });
  it("allows a revision to be approved but not archived content to change", () => {
    expect(canTransitionContentStatus("revision", "approved")).toBe(true);
    expect(canTransitionContentStatus("revision", "archived")).toBe(true);
    expect(canTransitionContentStatus("archived", "approved")).toBe(false);
    expect(canTransitionContentStatus("archived", "revision")).toBe(false);
  });
  it("never exposes a status as externally publishable", () => {
    expect(isExternallyPublishable("draft")).toBe(false);
    expect(isExternallyPublishable("approved")).toBe(false);
    expect(isExternallyPublishable("revision")).toBe(false);
    expect(isExternallyPublishable("archived")).toBe(false);
  });
});
