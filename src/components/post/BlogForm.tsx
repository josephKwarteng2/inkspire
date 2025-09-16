import React, { useMemo } from "react";
import { toast } from "sonner";
import type { Dispatch, SetStateAction } from "react";
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
import { getAllPosts } from "@/lib/postsStorage";
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
    videoEmbed,
    setVideoEmbed,
    previewOpen,
    setPreviewOpen,
    excerpt,
    setExcerpt,
  } = formState as typeof formState & {
    excerpt: string;
    setExcerpt: Dispatch<SetStateAction<string>>;
  };
  type Revision = {
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    category: string;
    author: string;
    tags: string;
    status: string;
    scheduledDate: string;
    featuredImage: string;
    metaTitle: string;
    metaDescription: string;
    metaKeywords: string;
    videoEmbed: string;
    date: string;
  };
  const [revisions, setRevisions] = React.useState<Revision[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const revs = localStorage.getItem("postFormRevisions");
        return revs ? JSON.parse(revs) : [];
      } catch {
        return [];
      }
    }
    return [];
  });
  const saveRevision = () => {
    const revision = {
      title,
      slug,
      excerpt,
      content,
      category,
      author,
      tags,
      status,
      scheduledDate,
      featuredImage,
      metaTitle,
      metaDescription,
      metaKeywords,
      videoEmbed,
      date: new Date().toISOString(),
    };

    let newRevisions = [revision, ...revisions].slice(0, 5);
    setRevisions(newRevisions);
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("postFormRevisions", JSON.stringify(newRevisions));
      } catch (e: unknown) {
        if (
          typeof e === "object" &&
          e !== null &&
          ("name" in e || "code" in e) &&
          ((e as { name?: string }).name === "QuotaExceededError" ||
            (e as { code?: number }).code === 22)
        ) {
          newRevisions = newRevisions.slice(0, 4);
          try {
            localStorage.setItem(
              "postFormRevisions",
              JSON.stringify(newRevisions)
            );
            setRevisions(newRevisions);
          } catch {
            localStorage.removeItem("postFormRevisions");
            setRevisions([]);
          }
        }
      }
    }
  };

  useKeyboardShortcuts(setStatus, setPreviewOpen);
  useDraftManagement(mode, formState);

  const [author, setAuthor] = React.useState(() => {
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

  const checkSlugConflict = (slugToCheck: string) => {
    try {
      const posts: Post[] = getAllPosts ? getAllPosts() : [];
      return posts.some(
        (p) =>
          p.slug === slugToCheck &&
          (mode === "create" || (initialData && p.id !== initialData.id))
      );
    } catch {
      return false;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const safeTitle = (title ?? "").trim();
    const safeSlug = (slug ?? "").trim();
    const safeExcerpt = (excerpt ?? "").trim();
    const safeMetaTitle = (metaTitle ?? "").trim();
    const safeMetaDescription = (metaDescription ?? "").trim();
    const safeMetaKeywords = metaKeywords ?? "";
    const safeVideoEmbed = (videoEmbed ?? "").trim();
    const safeContent = content ?? "";
    const safeCategory = category ?? "";
    const safeAuthor = author ?? "";

    if (!safeTitle) {
      setError("Title is required.");
      return;
    }

    if (!safeSlug) {
      setError("Slug is required.");
      return;
    }

    if (checkSlugConflict(safeSlug)) {
      setError("Slug already exists. Please choose a different one.");
      toast.error("Slug already exists. Please choose a different one.");
      return;
    }

    if (!safeCategory || safeCategory === "all") {
      setError("Category is required.");
      return;
    }

    if (!safeAuthor || safeAuthor === "all") {
      setError("Author is required.");
      return;
    }

    const TAG_LIMIT = 5;
    if (tagList.length > TAG_LIMIT) {
      setError(`You can add up to ${TAG_LIMIT} tags only.`);
      toast.error(`You can add up to ${TAG_LIMIT} tags only.`);
      return;
    }

    if (status === "scheduled" && scheduledDate) {
      const now = new Date();
      const scheduled = new Date(scheduledDate);
      if (scheduled < now) {
        setError("Scheduled date and time cannot be in the past.");
        toast.error("Scheduled date and time cannot be in the past.");
        return;
      }
    }

    const wordCount = safeContent.trim().split(/\s+/).filter(Boolean).length;
    const MIN_WORDS = 30;
    if (wordCount < MIN_WORDS) {
      setError(
        `Content is too short. Please write at least ${MIN_WORDS} words.`
      );
      toast.error(
        `Content is too short. Please write at least ${MIN_WORDS} words.`
      );
      return;
    }

    if (typeof window !== "undefined" && safeAuthor) {
      localStorage.setItem("lastAuthor", safeAuthor);
    }

    const postData = {
      title: safeTitle,
      slug: safeSlug,
      excerpt: safeExcerpt,
      content: safeContent,
      category: safeCategory,
      author: safeAuthor,
      readingTime: Math.max(
        1,
        Math.ceil(safeContent.trim().split(/\s+/).filter(Boolean).length / 200)
      ),
      tags: tagList,
      status,
      scheduledDate: status === "scheduled" ? scheduledDate : undefined,
      featuredImage,
      metaTitle: safeMetaTitle,
      metaDescription: safeMetaDescription,
      metaKeywords: safeMetaKeywords
        .split(",")
        .map((k: string) => k.trim())
        .filter(Boolean),
      videoEmbed: safeVideoEmbed,
      trashed: false,
    };

    saveRevision();

    setError("");
    toast.success(
      mode === "edit"
        ? "Post updated successfully!"
        : "Post created successfully!"
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
    <div className="flex flex-col md:flex-row md:items-start w-full min-h-[80vh]">
      <form
        className="w-full md:w-1/2 max-w-full space-y-4 px-4 md:px-8 py-6"
        onSubmit={handleSubmit}
      >
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
        <div>
          <label htmlFor="excerpt" className="block font-medium mb-1">
            Excerpt (short summary)
          </label>
          <textarea
            id="excerpt"
            className="w-full border rounded px-3 py-2 text-sm"
            placeholder="Write a short summary for this post (1-2 sentences)"
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            rows={2}
            maxLength={250}
          />
        </div>
        <ContentEditor content={content} setContent={setContent} />
        <div className="flex gap-2">
          <ActionButtons mode={mode} setPreviewOpen={setPreviewOpen} />
        </div>
      </form>

      <div
        className="hidden md:block h-auto border-l border-gray-200"
        style={{ minHeight: "100%" }}
      />
      <aside
        className="w-full md:w-1/2 max-w-full flex-shrink-0 space-y-4 px-4 md:px-8 py-6"
        style={{ minWidth: 0 }}
      >
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
        <div>
          <label htmlFor="video-embed" className="block font-medium mb-1">
            Video Embed Link (YouTube, Twitter, etc)
          </label>
          <input
            id="video-embed"
            type="text"
            className="w-full border rounded px-3 py-2 text-sm"
            placeholder="Paste a YouTube or Twitter embed link (optional)"
            value={videoEmbed}
            onChange={(e) => setVideoEmbed(e.target.value)}
          />
        </div>
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
        {revisions.length > 0 && (
          <div className="mt-4">
            <div className="flex items-center font-semibold mb-1">
              <span>Revision History</span>
              <button
                type="button"
                aria-label="Clear revision history"
                className="ml-2 text-red-500 hover:text-red-700 font-bold text-lg px-2"
                onClick={() => {
                  setRevisions([]);
                  if (typeof window !== "undefined") {
                    localStorage.removeItem("postFormRevisions");
                  }
                }}
              >
                ×
              </button>
            </div>
            <ul className="text-xs max-h-32 overflow-y-auto">
              {revisions.map((rev: Revision, i: number) => (
                <li key={i} className="mb-1">
                  <span className="text-gray-500">
                    {new Date(rev.date).toLocaleString()}
                  </span>
                  {rev.title && <span className="ml-2">{rev.title}</span>}
                </li>
              ))}
            </ul>
          </div>
        )}
      </aside>
      <PostPreview
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
        post={{
          ...({
            title,
            slug,
            content,
            category,
            author,
            readingTime: Math.max(
              1,
              Math.ceil(
                content.trim().split(/\s+/).filter(Boolean).length / 200
              )
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
            videoEmbed: videoEmbed.trim(),
            id: initialData?.id || "preview",
            createdAt: initialData?.createdAt || new Date().toISOString(),
            trashed: false,
          } as Post),
          excerpt,
        }}
      />
    </div>
  );
};

export default BlogForm;
