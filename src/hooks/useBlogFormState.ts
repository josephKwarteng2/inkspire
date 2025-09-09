import { useState } from "react";
import type { Post, PostStatus } from "@/types/post";

export const useBlogFormState = (
  _mode: "create" | "edit",
  initialData?: Partial<Post>
) => {
  const [title, setTitle] = useState(initialData?.title || "");
  const [slug, setSlug] = useState(initialData?.slug || "");
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);
  const [content, setContent] = useState(initialData?.content || "");
  const [category, setCategory] = useState(initialData?.category || "");
  const [tags, setTags] = useState(initialData?.tags?.join(", ") || "");
  const [activeSuggestion, setActiveSuggestion] = useState(-1);
  const [status, setStatus] = useState<PostStatus>(
    initialData?.status || "draft"
  );
  const [scheduledDate, setScheduledDate] = useState(
    initialData?.scheduledDate || ""
  );
  const [error, setError] = useState("");
  const [featuredImage, setFeaturedImage] = useState(
    initialData?.featuredImage || ""
  );
  const [metaTitle, setMetaTitle] = useState(initialData?.metaTitle || "");
  const [metaDescription, setMetaDescription] = useState(
    initialData?.metaDescription || ""
  );
  const [metaKeywords, setMetaKeywords] = useState(
    initialData?.metaKeywords?.join(", ") || ""
  );
  const [previewOpen, setPreviewOpen] = useState(false);

  return {
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
  };
};
