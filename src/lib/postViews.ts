export function getPostViews(postId: string): number {
  if (typeof window === "undefined") return 0;
  const views = localStorage.getItem(`post_views_${postId}`);
  return views ? parseInt(views, 10) : 0;
}

export function incrementPostViews(postId: string) {
  if (typeof window === "undefined") return;
  const current = getPostViews(postId);
  localStorage.setItem(`post_views_${postId}`, String(current + 1));
}
