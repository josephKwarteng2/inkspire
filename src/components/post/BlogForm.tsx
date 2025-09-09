import React, { useMemo, useState } from "react";
import { showToast } from "@/lib/toast";
import type { Post } from "@/types/post";
import PostPreview from "./BlogPreview";
import { StatusBadge } from "../ui/StatusBadge";
import { ErrorDisplay } from "../ui/ErrorDisplay";
import { TitleInput } from "../ui/TitleInput";
import { SlugInput } from "../ui/SlugInput";
import { FeaturedImageInput } from "../ui/FeaturedImageInput";
import { MetaFields } from "../ui/MetaFields";
import { ContentEditor } from "../ui/ContentEditor";
import { CategorySelect } from "../ui/CategorySelect";
import { AuthorSelect } from "../ui/AuthorSelect";
import { StatusSelect } from "../ui/StatusSelect";
import { ScheduledDateInput } from "../ui/ScheduledDateInput";
import { ActionButtons } from "../ui/ActionButtons";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";
import { useDraftManagement } from "@/hooks/useDraftManagement";
import { useBlogFormState } from "@/hooks/useBlogFormState";
import { TagInput } from "../ui/TagInput";
import { useUsers } from "@/hooks/useUsers";

interface BlogFormProps {
  mode: "create" | "edit";
  initialData?: Partial<Post>;
  onSubmit: (data: Omit<Post, "id" | "createdAt">) => void;
  categories: string[];
  tagSuggestions?: string[];
}

const BlogForm: React.FC<BlogFormProps> = ({
  mode,
  initialData,
  onSubmit,
  categories,
  tagSuggestions = [],
}) => {
  const users = useUsers();
  const formState = useBlogFormState(mode, initialData);
  const {
    title,
    setTitle,
    slug,
    setSlug,
    slugManuallyEdited,
    setSlugManuallyEdited,
    content,
    setContent,
    category,
    setCategory,
    tags,
    setTags,
    activeSuggestion,
    setActiveSuggestion,
    status,
    setStatus,
    scheduledDate,
    setScheduledDate,
    error,
    setError,
    featuredImage,
    setFeaturedImage,
    metaTitle,
    setMetaTitle,
    metaDescription,
    setMetaDescription,
    metaKeywords,
    setMetaKeywords,
    previewOpen,
    setPreviewOpen,
  } = formState;

  useKeyboardShortcuts(setStatus, setPreviewOpen);
  useDraftManagement(mode, formState);

  const [author, setAuthor] = useState(() => {
    if (initialData?.author) return initialData.author;
    if (users && users.length > 0) return users[0].name;
    if (typeof window !== "undefined") {
      return localStorage.getItem("lastAuthor") || "";
    }
    return "";
  });

  const tagList = useMemo(
    () =>
      tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
    [tags]
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!title.trim()) {
      setError("Title is required.");
      return;
    }

    if (!slug.trim()) {
      setError("Slug is required.");
      return;
    }

    if (!category || category === "all") {
      setError("Category is required.");
      return;
    }

    if (!author || author === "all") {
      setError("Author is required.");
      return;
    }

    const TAG_LIMIT = 5;
    if (tagList.length > TAG_LIMIT) {
      setError(`You can add up to ${TAG_LIMIT} tags only.`);
      showToast(`You can add up to ${TAG_LIMIT} tags only.`, "error");
      return;
    }

    if (status === "scheduled" && scheduledDate) {
      const now = new Date();
      const scheduled = new Date(scheduledDate);
      if (scheduled < now) {
        setError("Scheduled date and time cannot be in the past.");
        showToast("Scheduled date and time cannot be in the past.", "error");
        return;
      }
    }

    const wordCount = content.trim().split(/\s+/).filter(Boolean).length;
    const MIN_WORDS = 30;
    if (wordCount < MIN_WORDS) {
      setError(
        `Content is too short. Please write at least ${MIN_WORDS} words.`
      );
      showToast(
        `Content is too short. Please write at least ${MIN_WORDS} words.`,
        "error"
      );
      return;
    }

    if (typeof window !== "undefined" && author) {
      localStorage.setItem("lastAuthor", author);
    }

    const postData = {
      title: title.trim(),
      slug: slug.trim(),
      content,
      category,
      author,
      readingTime: Math.max(
        1,
        Math.ceil(content.trim().split(/\s+/).filter(Boolean).length / 200)
      ),
      tags: tagList,
      status,
      scheduledDate: status === "scheduled" ? scheduledDate : undefined,
      featuredImage,
      metaTitle: metaTitle.trim(),
      metaDescription: metaDescription.trim(),
      metaKeywords: metaKeywords
        .split(",")
        .map((k: string) => k.trim())
        .filter(Boolean),
      trashed: false,
    };

    console.log("[DEBUG] PostForm submitting data:", postData);

    setError("");
    showToast(
      mode === "edit"
        ? "Post updated successfully!"
        : "Post created successfully!",
      "success"
    );

    if (mode === "create") {
      try {
        localStorage.removeItem("postFormDraft");
      } catch (error) {
        console.warn("Failed to remove draft:", error);
      }
    }

    onSubmit(postData);
  };

  return (
    <>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <StatusBadge status={status} />

        {error && <ErrorDisplay error={error} />}

        <TitleInput
          title={title}
          setTitle={setTitle}
          slug={slug}
          setSlug={setSlug}
          slugManuallyEdited={slugManuallyEdited}
          setSlugManuallyEdited={setSlugManuallyEdited}
        />

        <SlugInput
          slug={slug}
          setSlug={setSlug}
          setSlugManuallyEdited={setSlugManuallyEdited}
        />

        <FeaturedImageInput
          featuredImage={featuredImage}
          setFeaturedImage={setFeaturedImage}
        />

        <MetaFields
          metaTitle={metaTitle}
          setMetaTitle={setMetaTitle}
          metaDescription={metaDescription}
          setMetaDescription={setMetaDescription}
          metaKeywords={metaKeywords}
          setMetaKeywords={setMetaKeywords}
        />

        <ContentEditor content={content} setContent={setContent} />

        <CategorySelect
          category={category}
          setCategory={setCategory}
          categories={categories}
        />

        <TagInput
          tags={tags}
          setTags={setTags}
          setError={setError}
          setActiveSuggestion={setActiveSuggestion}
          tagSuggestions={tagSuggestions}
          activeSuggestion={activeSuggestion}
        />

        <AuthorSelect author={author} setAuthor={setAuthor} users={users} />

        <StatusSelect status={status} setStatus={setStatus} />

        {status === "scheduled" && (
          <ScheduledDateInput
            scheduledDate={scheduledDate}
            setScheduledDate={setScheduledDate}
          />
        )}

        <ActionButtons mode={mode} setPreviewOpen={setPreviewOpen} />
      </form>

      <PostPreview
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
        post={{
          title,
          slug,
          content,
          category,
          author,
          readingTime: Math.max(
            1,
            Math.ceil(content.trim().split(/\s+/).filter(Boolean).length / 200)
          ),
          tags: tagList,
          status,
          scheduledDate: status === "scheduled" ? scheduledDate : undefined,
          featuredImage,
          metaTitle,
          metaDescription,
          metaKeywords: metaKeywords
            .split(",")
            .map((k) => k.trim())
            .filter(Boolean),
          id: initialData?.id || "preview",
          createdAt: initialData?.createdAt || new Date().toISOString(),
          trashed: false,
        }}
      />
    </>
  );
};

export default BlogForm;
