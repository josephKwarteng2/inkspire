import React from "react";
import PostForm from "@/components/post/BlogForm";
import { useParams, useNavigate } from "react-router-dom";
import { categories as defaultCategories } from "@/data/categories";
import type { Post } from "@/types/post";
import { v4 as uuidv4 } from "uuid";
import { getAllPosts, saveAllPosts } from "@/lib/postsStorage";

function levenshtein(a: string, b: string): number {
  const matrix = Array.from({ length: a.length + 1 }, (_, i) => [i]);
  for (let j = 1; j <= b.length; j++) matrix[0][j] = j;
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      if (a[i - 1] === b[j - 1]) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }
  return matrix[a.length][b.length];
}

const BlogEditorContent: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [posts, setPosts] = React.useState<Post[]>([]);
  const isEdit = Boolean(id && id !== "new");

  React.useEffect(() => {
    const loadedPosts = getAllPosts();
    setPosts(loadedPosts);
  }, []);

  const postToEdit = isEdit ? posts.find((p) => p.id === id) : undefined;

  const [categories] = React.useState<string[]>(() =>
    defaultCategories.map((c) => c.title)
  );

  const allTags = Array.from(new Set(posts.flatMap((p) => p.tags || [])));

  const handleSubmit = (data: Omit<Post, "id" | "createdAt">) => {
    const currentPosts = getAllPosts();

    const normalizedSlug = data.slug.trim().toLowerCase();
    const duplicateSlug = currentPosts.some(
      (p) =>
        p.slug &&
        p.slug.trim().toLowerCase() === normalizedSlug &&
        (!isEdit || p.id !== postToEdit?.id)
    );

    if (duplicateSlug) {
      alert(
        "A post with the same slug already exists. Please choose a unique slug."
      );
      return;
    }

    const normalizedTitle = data.title.trim().toLowerCase();
    const similarTitle = currentPosts.find(
      (p) =>
        (!isEdit || p.id !== postToEdit?.id) &&
        levenshtein(p.title.trim().toLowerCase(), normalizedTitle) <= 2
    );

    if (similarTitle) {
      alert(
        `A post with a very similar title already exists: "${similarTitle.title}". Please check for duplicates.`
      );
      return;
    }

    const normalizeContent = (c: string) =>
      c.replace(/\s+/g, " ").trim().toLowerCase();
    const contentToCheck = normalizeContent(data.content || "");
    const similarContent = currentPosts.find(
      (p) =>
        (!isEdit || p.id !== postToEdit?.id) &&
        p.content &&
        contentToCheck.length > 0 &&
        p.content.length > 0 &&
        (() => {
          const a = contentToCheck;
          const b = normalizeContent(p.content);
          const minLen = Math.min(a.length, b.length);
          if (minLen < 30) return false;
          let match = 0;
          for (let i = 0; i < minLen; i++) {
            if (a[i] === b[i]) match++;
          }
          return match / minLen > 0.9;
        })()
    );

    if (similarContent) {
      alert(
        `A post with very similar content already exists (title: "${similarContent.title}"). Please check for duplicates.`
      );
      return;
    }

    let updatedPosts: Post[];

    if (isEdit && postToEdit) {
      updatedPosts = currentPosts.map((p) =>
        p.id === postToEdit.id
          ? {
              ...p,
              ...data,
              updatedAt: new Date().toISOString(),
              status: data.status,
              scheduledDate:
                data.status === "scheduled" ? data.scheduledDate : undefined,
            }
          : p
      );
    } else {
      const newPost: Post = {
        ...data,
        id: uuidv4(),
        createdAt: new Date().toISOString(),
        status: data.status,
        scheduledDate:
          data.status === "scheduled" ? data.scheduledDate : undefined,
      };
      updatedPosts = [newPost, ...currentPosts];
    }

    saveAllPosts(updatedPosts);
    setPosts(updatedPosts);

    setTimeout(() => {
      const verification = getAllPosts();
      console.log(
        "[DEBUG] Post-save verification:",
        verification.length,
        "posts"
      );
      navigate("/admin/posts");
    }, 500);
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold">
          {isEdit ? "Edit Post" : "Create New Post"}
        </h1>
        <button
          onClick={() => navigate("/admin/posts")}
          className="px-4 py-2 text-sm border rounded hover:bg-muted transition w-full sm:w-auto cursor-pointer"
        >
          Back to Posts
        </button>
      </div>

      <div className="bg-card rounded-lg border p-6 shadow-sm">
        <PostForm
          mode={isEdit ? "edit" : "create"}
          initialData={postToEdit}
          onSubmit={handleSubmit}
          categories={categories}
          tagSuggestions={allTags}
        />
      </div>
    </div>
  );
};
export default BlogEditorContent;
