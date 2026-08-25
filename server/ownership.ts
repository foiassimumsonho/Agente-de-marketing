export function userOwnsResource(resourceUserId: number, currentUserId: number) {
  return resourceUserId === currentUserId;
}
