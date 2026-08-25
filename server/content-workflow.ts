export type ContentStatus = "draft" | "approved" | "revision" | "archived";

export function canTransitionContentStatus(current: ContentStatus, next: ContentStatus) {
  if (current === "archived") return false;
  if (next === "approved") return current === "draft" || current === "revision";
  if (next === "revision") return current === "draft";
  if (next === "archived") return current === "draft" || current === "revision" || current === "approved";
  return false;
}

export function isExternallyPublishable(status: ContentStatus) {
  return false;
}
