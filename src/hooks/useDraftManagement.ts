import { useEffect } from "react";
import type { useBlogFormState } from "./useBlogFormState";

export const useDraftManagement = (
  mode: "create" | "edit",
  formState: ReturnType<typeof useBlogFormState>
) => {
  const {
    title,
    slug,
    content,
    category,
    tags,
    featuredImage,
    metaTitle,
    metaDescription,
    metaKeywords,
    setTitle,
    setSlug,
    setContent,
    setCategory,
    setTags,
    setFeaturedImage,
    setMetaTitle,
    setMetaDescription,
    setMetaKeywords,
  } = formState;

  useEffect(() => {
    if (mode === "edit") return;

    try {
      const draft = localStorage.getItem("postFormDraft");
      if (draft) {
        const d = JSON.parse(draft);
        if (d.title) setTitle(d.title);
        if (d.slug) setSlug(d.slug);
        if (d.content) setContent(d.content);
        if (d.category) setCategory(d.category);
        if (d.tags) setTags(d.tags);
        if (d.featuredImage) setFeaturedImage(d.featuredImage);
        if (d.metaTitle) setMetaTitle(d.metaTitle);
        if (d.metaDescription) setMetaDescription(d.metaDescription);
        if (d.metaKeywords) setMetaKeywords(d.metaKeywords);
      }
    } catch (error) {
      console.warn("Failed to load draft:", error);
    }
  }, [
    mode,
    setTitle,
    setSlug,
    setContent,
    setCategory,
    setTags,
    setFeaturedImage,
    setMetaTitle,
    setMetaDescription,
    setMetaKeywords,
  ]);

  useEffect(() => {
    if (mode === "edit") return;

    const draft = {
      title,
      slug,
      content,
      category,
      tags,
      featuredImage,
      metaTitle,
      metaDescription,
      metaKeywords,
    };

    try {
      localStorage.setItem("postFormDraft", JSON.stringify(draft));
    } catch (error) {
      console.warn("Failed to save draft:", error);
    }
  }, [
    title,
    slug,
    content,
    category,
    tags,
    featuredImage,
    metaTitle,
    metaDescription,
    metaKeywords,
    mode,
  ]);
};
