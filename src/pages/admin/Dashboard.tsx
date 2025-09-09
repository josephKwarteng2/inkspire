import React from "react";
import { useNavigate } from "react-router-dom";
import type { Post } from "@/types/post";
import { categories as defaultCategories } from "@/data/categories";

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();

  const [posts] = React.useState<Post[]>(() => {
    const stored = localStorage.getItem("posts");
    return stored ? (JSON.parse(stored) as Post[]) : [];
  });
  const [categories] = React.useState<string[]>(() =>
    defaultCategories.map((c) => c.title)
  );

  const recentPosts = posts.slice(-5).reverse();

  return (
    <>
      <div className="mb-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        <div className="bg-card rounded shadow p-6 flex flex-col items-center">
          <span className="text-4xl font-bold">{posts.length}</span>
          <span className="text-muted-foreground mt-2">Total Posts</span>
        </div>
        <div className="bg-card rounded shadow p-6 flex flex-col items-center">
          <span className="text-4xl font-bold">{categories.length}</span>
          <span className="text-muted-foreground mt-2">Categories</span>
        </div>
        <div className="bg-card rounded shadow p-6 flex flex-col items-center">
          <span className="text-4xl font-bold">
            {[...new Set(posts.flatMap((p) => p.tags || []))].length}
          </span>
          <span className="text-muted-foreground mt-2">Unique Tags</span>
        </div>
      </div>
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-4">Recent Posts</h2>
        <ul className="divide-y divide-border bg-card rounded shadow">
          {recentPosts.length === 0 && (
            <li className="p-4 text-muted-foreground">No posts yet.</li>
          )}
          {recentPosts.map((post) => (
            <li
              key={post.id}
              className="p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2"
            >
              <span className="font-medium break-words max-w-full">
                {post.title}
              </span>
              <span className="text-xs text-muted-foreground whitespace-nowrap">
                {post.category || "Uncategorized"}
              </span>
              <button
                className="text-primary hover:underline text-sm whitespace-nowrap"
                onClick={() => navigate(`/admin/posts/${post.id}`)}
              >
                Edit
              </button>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default AdminDashboard;
