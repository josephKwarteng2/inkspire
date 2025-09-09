export function getPostLikes(postId: string): number {
  if (typeof window === "undefined") return 0;
  const likes = localStorage.getItem(`post_likes_${postId}`);
  return likes ? parseInt(likes, 10) : 0;
}

export function likePost(postId: string) {
  if (typeof window === "undefined") return;
  const current = getPostLikes(postId);
  localStorage.setItem(`post_likes_${postId}`, String(current + 1));
}

export function unlikePost(postId: string) {
  if (typeof window === "undefined") return;
  const current = getPostLikes(postId);
  localStorage.setItem(
    `post_likes_${postId}`,
    String(Math.max(0, current - 1))
  );
}
