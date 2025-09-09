import React from "react";
import { showToast } from "@/lib/toast";
import { getAllPosts, saveAllPosts } from "@/lib/postsStorage";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import type { Post } from "@/types/post";
import { categories as defaultCategories } from "@/data/categories";
import AdminLayout from "./Layout";
import PostList from "@/components/post/BlogList";
import AdminPostsTableSkeleton from "@/components/post/TableSkeleton";
import AdminCategories from "./BlogCategories";

const BlogContent: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [categories, setCategories] = React.useState<string[]>(() =>
    defaultCategories.map((c) => c.title)
  );
  const [filterCategory, setFilterCategory] = React.useState<string>("");
  const { data: posts = [], isLoading: loading } = useQuery<Post[]>({
    queryKey: ["admin-posts"],
    queryFn: () => {
      const loaded = getAllPosts();
      const now = new Date();
      let updated = false;
      const publishedTitles: string[] = [];
      const updatedPosts = loaded.map((p) => {
        if (
          p.status === "scheduled" &&
          p.scheduledDate &&
          new Date(p.scheduledDate) <= now
        ) {
          updated = true;
          publishedTitles.push(p.title);
          return {
            ...p,
            status: "published" as Post["status"],
            scheduledDate: undefined,
          };
        }
        return p;
      });
      if (updated) {
        saveAllPosts(updatedPosts);
        if (publishedTitles.length > 0) {
          showToast(
            `Scheduled post${
              publishedTitles.length > 1 ? "s" : ""
            } published: ${publishedTitles.join(", ")}`,
            "success"
          );
        }
      }
      return updatedPosts;
    },
    refetchInterval: 30000,
  });

  const updatePostsMutation = useMutation({
    mutationFn: async (updatedPosts: Post[]) => {
      saveAllPosts(updatedPosts);
      return updatedPosts;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-posts"] });
    },
  });

  const handleAddCategory = (cat: string) => {
    if (cat && !categories.includes(cat)) {
      setCategories((prev) => [...prev, cat]);
    }
  };

  const handleRemoveCategory = (cat: string) => {
    setCategories((prev) => prev.filter((c) => c !== cat));
    const updatedPosts = posts.map((p) =>
      p.category === cat ? { ...p, category: "" } : p
    );
    updatePostsMutation.mutate(updatedPosts);
  };

  const handleBulkPublish = (ids: string[]) => {
    const updatedPosts = posts.map((p) =>
      ids.includes(p.id)
        ? {
            ...p,
            status: "published" as Post["status"],
            scheduledDate: undefined,
          }
        : p
    );
    updatePostsMutation.mutate(updatedPosts);
  };

  const handleBulkSchedule = (ids: string[], date: string) => {
    const updatedPosts = posts.map((p) =>
      ids.includes(p.id)
        ? { ...p, status: "scheduled" as Post["status"], scheduledDate: date }
        : p
    );
    updatePostsMutation.mutate(updatedPosts);
  };

  const handleEdit = (id: string) => {
    navigate(`/admin/posts/${id}`);
  };

  const handleDelete = (id: string) => {
    const updatedPosts = posts.map((p) =>
      p.id === id ? { ...p, trashed: true } : p
    );
    updatePostsMutation.mutate(updatedPosts);
  };

  const handlePermanentDelete = (id: string) => {
    const updatedPosts = posts.filter((p) => p.id !== id);
    updatePostsMutation.mutate(updatedPosts);
  };

  const handleRestore = (id: string) => {
    const updatedPosts = posts.map((p) =>
      p.id === id ? { ...p, trashed: false } : p
    );
    updatePostsMutation.mutate(updatedPosts);
  };

  const handlePublish = (id: string) => {
    const updatedPosts = posts.map((p) =>
      p.id === id
        ? {
            ...p,
            status: "published" as Post["status"],
            scheduledDate: undefined,
          }
        : p
    );
    updatePostsMutation.mutate(updatedPosts);
  };

  const handleDuplicate = (id: string) => {
    const post = posts.find((p) => p.id === id);
    if (!post) return;
    const newPost = {
      ...post,
      id: crypto.randomUUID
        ? crypto.randomUUID()
        : Math.random().toString(36).slice(2),
      title: post.title + " (Copy)",
      status: "draft" as Post["status"],
      createdAt: new Date().toISOString(),
      updatedAt: undefined,
    };
    const updatedPosts = [newPost, ...posts];
    updatePostsMutation.mutate(updatedPosts);
  };

  return (
    <div className="w-full max-w-full space-y-6">
      <AdminCategories
        categories={categories}
        onAddCategory={handleAddCategory}
        onRemoveCategory={handleRemoveCategory}
      />
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between w-full gap-3">
        <div>
          <h2 className="text-xl font-semibold mb-1 logo-inkspire">Posts</h2>
          <p className="text-sm logo-inkspire">
            Manage your blog posts and content
          </p>
        </div>
      </div>
      <div className="w-full">
        {loading ? (
          <AdminPostsTableSkeleton />
        ) : (
          <PostList
            posts={
              filterCategory
                ? posts.filter((p) => p.category === filterCategory)
                : posts
            }
            onEdit={handleEdit}
            onDelete={handleDelete}
            onRestore={handleRestore}
            onPermanentDelete={handlePermanentDelete}
            onPublish={handlePublish}
            onDuplicate={handleDuplicate}
            onBulkPublish={handleBulkPublish}
            onBulkSchedule={handleBulkSchedule}
            categories={categories}
            filterCategory={filterCategory}
            onFilterCategory={setFilterCategory}
          />
        )}
      </div>
    </div>
  );
};

const Blogs: React.FC = () => {
  return (
    <AdminLayout>
      <BlogContent />
    </AdminLayout>
  );
};

export default Blogs;
