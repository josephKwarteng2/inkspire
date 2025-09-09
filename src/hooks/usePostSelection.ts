import { useState, useCallback } from "react";
import type { Post } from "@/types/post";

export const usePostSelection = () => {
  const [selectedPosts, setSelectedPosts] = useState<Set<string>>(new Set());
  const [selectAll, setSelectAll] = useState(false);

  const handleSelectAll = useCallback((posts: Post[]) => {
    setSelectedPosts((prev) => {
      if (prev.size === posts.length) {
        return new Set();
      } else {
        return new Set(posts.map((post) => post.id));
      }
    });
    setSelectAll((prev) => !prev);
  }, []);

  const handleSelectPost = useCallback((postId: string) => {
    setSelectedPosts((prev) => {
      const newSelected = new Set(prev);
      if (newSelected.has(postId)) {
        newSelected.delete(postId);
      } else {
        newSelected.add(postId);
      }
      return newSelected;
    });
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedPosts(new Set());
    setSelectAll(false);
  }, []);

  return {
    selectedPosts,
    selectAll,
    handleSelectAll,
    handleSelectPost,
    clearSelection,
  };
};
