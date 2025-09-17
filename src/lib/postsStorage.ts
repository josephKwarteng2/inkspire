import type { Post } from "@/types/post";

const STORAGE_KEY = "posts";

export function getAllPosts(): Post[] {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export function saveAllPosts(posts: Post[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
  } catch (e: unknown) {
    if (
      e &&
      typeof e === "object" &&
      (("name" in e &&
        (e as { name?: string }).name === "QuotaExceededError") ||
        ("code" in e && (e as { code?: number }).code === 22))
    ) {
      alert(
        "Error: Local storage is full. Please delete some posts or clear your browser storage."
      );
    } else {
      throw e;
    }
  }
}
