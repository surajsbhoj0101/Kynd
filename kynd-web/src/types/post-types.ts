export const POST_TYPES = [
  { value: "COMMUNITY", label: "Community discussion" },
  { value: "LOOKING_FOR_HELP", label: "Looking for help" },
  { value: "OFFERING_HELP", label: "Offering help" },
  { value: "BORROW", label: "Borrow" },
  { value: "LEND", label: "Lend" },
  { value: "SHARE", label: "Share" },
  { value: "CONTRIBUTE", label: "Contribute" },
  { value: "ORGANIZE", label: "Organize" },
] as const;

export type PostType = (typeof POST_TYPES)[number]["value"];

export const POST_TYPE_BADGE_CLASSES: Record<PostType, string> = {
  COMMUNITY: "bg-post-community text-on-post-community",
  LOOKING_FOR_HELP: "bg-post-looking-for-help text-on-post-looking-for-help",
  OFFERING_HELP: "bg-post-offering-help text-on-post-offering-help",
  BORROW: "bg-post-borrow text-on-post-borrow",
  LEND: "bg-post-lend text-on-post-lend",
  SHARE: "bg-post-share text-on-post-share",
  CONTRIBUTE: "bg-post-contribute text-on-post-contribute",
  ORGANIZE: "bg-post-organize text-on-post-organize",
};

export function getPostTypeLabel(type: string): string {
  return (
    POST_TYPES.find((postType) => postType.value === type)?.label ??
    "Community post"
  );
}

export function getPostTypeBadgeClasses(type: string): string {
  return (
    POST_TYPE_BADGE_CLASSES[type as PostType] ??
    "bg-surface-container-high text-on-surface-variant"
  );
}
