import type { Comment } from "@/types/comment";

const STORAGE_KEY = "comments";

export function getAllComments(): Comment[] {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export function saveAllComments(comments: Comment[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(comments));
}

export function addComment(comment: Comment) {
  const comments = getAllComments();
  comments.unshift(comment);
  saveAllComments(comments);
}

export function updateComment(id: string, update: Partial<Comment>) {
  const comments = getAllComments();
  const idx = comments.findIndex((c) => c.id === id);
  if (idx !== -1) {
    comments[idx] = {
      ...comments[idx],
      ...update,
      updatedAt: new Date().toISOString(),
    };
    saveAllComments(comments);
  }
}

export function deleteComment(id: string) {
  const comments = getAllComments().filter((c) => c.id !== id);
  saveAllComments(comments);
}
