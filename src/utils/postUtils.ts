import type { Post } from "@/types/post";

export const getPostCounts = (posts: Post[]) => {
  return {
    total: posts.length,
    published: posts.filter((p) => p.status === "published").length,
    scheduled: posts.filter((p) => p.status === "scheduled").length,
    draft: posts.filter((p) => p.status === "draft").length,
    trashed: posts.filter((p) => p.trashed).length,
  };
};

export const getUniqueAuthors = (posts: Post[]): string[] => {
  return Array.from(new Set(posts.map((p) => p.author).filter(Boolean)));
};

export const getUniqueTags = (posts: Post[]): string[] => {
  return Array.from(
    new Set(posts.flatMap((p) => p.tags || []).filter(Boolean))
  );
};
