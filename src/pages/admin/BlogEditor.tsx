import React from "react";
import BlogForm from "@/components/post/BlogForm";
import { useParams, useNavigate } from "react-router-dom";
import { categories as defaultCategories } from "@/data/categories";
import type { Post } from "@/types/post";
import { v4 as uuidv4 } from "uuid";
import { getAllPosts, saveAllPosts } from "@/lib/postsStorage";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowLeft } from "lucide-react";
import { toast } from "sonner";

const levenshteinDistance = (a: string, b: string): number => {
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
};

const normalizeText = (text: string): string =>
  text.replace(/\s+/g, " ").trim().toLowerCase();

const calculateContentSimilarity = (
  content1: string,
  content2: string
): number => {
  const a = normalizeText(content1);
  const b = normalizeText(content2);
  const minLen = Math.min(a.length, b.length);

  if (minLen < 30) return 0;

  let matches = 0;
  for (let i = 0; i < minLen; i++) {
    if (a[i] === b[i]) matches++;
  }

  return matches / minLen;
};

const validatePostData = (
  data: Omit<Post, "id" | "createdAt">,
  existingPosts: Post[],
  currentPostId?: string
) => {
  const errors: string[] = [];

  if (!data.title?.trim()) {
    errors.push("Title is required");
  }

  if (!data.slug?.trim()) {
    errors.push("Slug is required");
  }

  if (!data.content?.trim()) {
    errors.push("Content is required");
  }

  const otherPosts = existingPosts.filter((p) => p.id !== currentPostId);
  const normalizedSlug = data.slug?.trim().toLowerCase();
  const duplicateSlug = otherPosts.some(
    (p) => p.slug?.trim().toLowerCase() === normalizedSlug
  );

  if (duplicateSlug) {
    errors.push(
      "A post with this slug already exists. Please choose a unique slug."
    );
  }
  const normalizedTitle = data.title?.trim().toLowerCase();
  const similarTitle = otherPosts.find(
    (p) =>
      levenshteinDistance(p.title.trim().toLowerCase(), normalizedTitle) <= 2
  );

  if (similarTitle) {
    errors.push(
      `A post with a very similar title already exists: "${similarTitle.title}"`
    );
  }
  if (data.content) {
    const similarContent = otherPosts.find(
      (p) =>
        p.content && calculateContentSimilarity(data.content!, p.content) > 0.9
    );

    if (similarContent) {
      errors.push(
        `A post with very similar content already exists: "${similarContent.title}"`
      );
    }
  }

  return errors;
};

const BlogEditorContent: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isEdit = Boolean(id && id !== "new");

  const {
    data: posts = [],
    isLoading: postsLoading,
    error: postsError,
  } = useQuery({
    queryKey: ["posts"],
    queryFn: getAllPosts,
    staleTime: 2 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
  });

  const postToEdit = React.useMemo(
    () => (isEdit ? posts.find((p) => p.id === id) : undefined),
    [posts, isEdit, id]
  );

  const categories = React.useMemo(
    () => defaultCategories.map((c) => c.title),
    []
  );

  const allTags = React.useMemo(
    () => Array.from(new Set(posts.flatMap((p) => p.tags || []))),
    [posts]
  );

  const savePostMutation = useMutation({
    mutationFn: async (data: Omit<Post, "id" | "createdAt">) => {
      const currentPosts = await getAllPosts();

      const validationErrors = validatePostData(
        data,
        currentPosts,
        postToEdit?.id
      );
      if (validationErrors.length > 0) {
        throw new Error(validationErrors.join("\n"));
      }

      let updatedPosts: Post[];

      if (isEdit && postToEdit) {
        updatedPosts = currentPosts.map((p) =>
          p.id === postToEdit.id
            ? {
                ...p,
                ...data,
                updatedAt: new Date().toISOString(),
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
          scheduledDate:
            data.status === "scheduled" ? data.scheduledDate : undefined,
        };
        updatedPosts = [newPost, ...currentPosts];
      }

      saveAllPosts(updatedPosts);
      return updatedPosts;
    },
    onSuccess: (updatedPosts) => {
      queryClient.setQueryData(["posts"], updatedPosts);

      toast(`Post ${isEdit ? "updated" : "created"} successfully!`);

      setTimeout(() => navigate("/admin/posts"), 300);
    },
    onError: (error: Error) => {
      toast(
        <div>
          <strong className="text-destructive">Error</strong>
          <div>{error.message}</div>
        </div>
      );
    },
  });

  if (postsLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin mx-auto" />
          <p className="text-muted-foreground">Loading posts...</p>
        </div>
      </div>
    );
  }

  if (postsError) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <p className="text-destructive">Error loading posts</p>
          <Button
            onClick={() =>
              queryClient.invalidateQueries({ queryKey: ["posts"] })
            }
          >
            Retry
          </Button>
        </div>
      </div>
    );
  }

  if (isEdit && !postToEdit) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <p className="text-muted-foreground">Post not found</p>
          <Button onClick={() => navigate("/admin/posts")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Posts
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">
            {isEdit ? "Edit Post" : "Create New Post"}
          </h1>
          {postToEdit && (
            <p className="text-sm text-muted-foreground mt-1">
              Editing: {postToEdit.title}
            </p>
          )}
        </div>

        <Button
          variant="outline"
          onClick={() => navigate("/admin/posts")}
          disabled={savePostMutation.isPending}
          className="w-full sm:w-auto"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Posts
        </Button>
      </div>

      <div className="bg-card rounded-lg border shadow-sm">
        <div className="p-6">
          <BlogForm
            mode={isEdit ? "edit" : "create"}
            initialData={postToEdit}
            onSubmit={(data) => savePostMutation.mutate(data)}
            categories={categories}
            tagSuggestions={allTags}
          />
        </div>
      </div>

      {savePostMutation.isPending && (
        <div className="fixed inset-0 bg-background/50 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-card p-6 rounded-lg shadow-lg border text-center space-y-4">
            <Loader2 className="h-8 w-8 animate-spin mx-auto" />
            <p className="text-sm text-muted-foreground">
              {isEdit ? "Updating post..." : "Creating post..."}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default BlogEditorContent;
