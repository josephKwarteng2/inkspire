import React from "react";
import type { Post } from "@/types/post";

interface RelatedPostsProps {
  currentPost: Post;
  allPosts: Post[];
}

const RelatedPosts: React.FC<RelatedPostsProps> = ({
  currentPost,
  allPosts,
}) => {
  if (!currentPost) return null;
  const related = allPosts
    .filter((p: Post) => {
      if (p.id === currentPost.id) return false;
      if (p.category && p.category === currentPost.category) return true;
      if (Array.isArray(p.tags) && Array.isArray(currentPost.tags)) {
        return (p.tags as string[]).some((tag: string) =>
          (currentPost.tags as string[]).includes(tag)
        );
      }
      return false;
    })
    .slice(0, 4);

  if (related.length === 0) return null;

  return (
    <div className="mt-16">
      <h2 className="text-xl font-bold mb-6">Related Posts</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {related.map((p) => (
          <div
            key={p.id}
            className="flex gap-4 items-center border rounded-lg p-4 bg-card hover:shadow transition cursor-pointer"
            onClick={() => (window.location.href = `/posts/${p.id}`)}
          >
            <img
              src={
                p.featuredImage || "https://placehold.co/120x80?text=No+Image"
              }
              alt={p.title}
              className="w-24 h-16 object-cover rounded"
            />
            <div>
              <div className="font-semibold text-base mb-1">{p.title}</div>
              <div className="text-xs text-muted-foreground mb-1">
                {p.category}
              </div>
              <div className="text-xs text-muted-foreground">
                {Array.isArray(p.tags) ? p.tags.join(", ") : ""}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RelatedPosts;
