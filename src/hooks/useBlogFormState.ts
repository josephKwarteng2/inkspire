import React from "react";
import type { Post, PostStatus } from "@/types/post";

export const useBlogFormState = (
  _mode: "create" | "edit",
  initialData?: Partial<Post>
) => {
  const [title, setTitle] = React.useState(initialData?.title || "");
  const [slug, setSlug] = React.useState(initialData?.slug || "");
  const [slugManuallyEdited, setSlugManuallyEdited] = React.useState(false);
  const [content, setContent] = React.useState(initialData?.content || "");
  const [category, setCategory] = React.useState(initialData?.category || "");
  const [tags, setTags] = React.useState(initialData?.tags?.join(", ") || "");
  const [activeSuggestion, setActiveSuggestion] = React.useState(-1);
  const [status, setStatus] = React.useState<PostStatus>(
    initialData?.status || "draft"
  );
  const [scheduledDate, setScheduledDate] = React.useState(
    initialData?.scheduledDate || ""
  );
  const [error, setError] = React.useState("");
  const [featuredImage, setFeaturedImage] = React.useState(
    initialData?.featuredImage || ""
  );
  const [metaTitle, setMetaTitle] = React.useState(
    initialData?.metaTitle || ""
  );
  const [metaDescription, setMetaDescription] = React.useState(
    initialData?.metaDescription || ""
  );
  const [metaKeywords, setMetaKeywords] = React.useState(
    initialData?.metaKeywords?.join(", ") || ""
  );
  const [videoEmbed, setVideoEmbed] = React.useState(
    initialData?.videoEmbed || ""
  );
  const [previewOpen, setPreviewOpen] = React.useState(false);

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
    videoEmbed,
    setVideoEmbed,
    previewOpen,
    setPreviewOpen,
  };
};
