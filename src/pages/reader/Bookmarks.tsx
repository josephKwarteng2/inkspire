import React, { useEffect, useState } from "react";
import { getAllPosts } from "@/lib/postsStorage";
import type { Post } from "@/types/post";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Bookmarks: React.FC = () => {
  const [bookmarkedPosts, setBookmarkedPosts] = useState<Post[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const savedIds: string[] = JSON.parse(
      localStorage.getItem("saved_posts") || "[]"
    );
    const allPosts = getAllPosts();
    const filtered = allPosts.filter((p) => savedIds.includes(String(p.id)));
    setBookmarkedPosts(filtered);
  }, []);

  return (
    <div className="max-w-2xl mx-auto py-22 px-4">
      <h1 className="text-2xl font-bold mb-6">My Bookmarks</h1>
      {bookmarkedPosts.length === 0 ? (
        <div className="text-muted-foreground text-lg">No bookmarks yet.</div>
      ) : (
        <div className="space-y-6">
          {bookmarkedPosts.map((post) => (
            <Card key={post.id} className="flex flex-col gap-2 p-5">
              <div className="font-semibold text-xl mb-1">{post.title}</div>
              <div className="text-sm text-muted-foreground mb-2">
                {post.category} &middot; By {post.author}
              </div>
              <div className="text-sm mb-2 line-clamp-3">
                {post.metaDescription ||
                  (post.content
                    ? post.content.slice(0, 120) +
                      (post.content.length > 120 ? "..." : "")
                    : "")}
              </div>
              <Button size="sm" onClick={() => navigate(`/posts/${post.id}`)}>
                Read Post
              </Button>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Bookmarks;
