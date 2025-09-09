import { useMemo } from "react";
import type { FilterState, Post } from "@/types/post";

export const usePostFilters = (posts: Post[], filters: FilterState) => {
  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      if (filters.viewFilter === "active" && post.trashed) return false;
      if (filters.viewFilter === "trashed" && !post.trashed) return false;

      const searchLower = filters.search.toLowerCase();
      const inTitle = post.title.toLowerCase().includes(searchLower);
      const inContent = (post.content || "")
        .toLowerCase()
        .includes(searchLower);
      const hasTag =
        filters.tagFilter === "" ||
        (post.tags || []).includes(filters.tagFilter);

      return (
        (filters.authorFilter === "" || post.author === filters.authorFilter) &&
        (filters.statusFilter === "" || post.status === filters.statusFilter) &&
        hasTag &&
        (inTitle || inContent)
      );
    });
  }, [posts, filters]);

  const sortedPosts = useMemo(() => {
    return [...filteredPosts].sort((a, b) => {
      let aValue: string | number = "";
      let bValue: string | number = "";

      switch (filters.sortKey) {
        case "date":
          aValue = new Date(a.createdAt || a.updatedAt || 0).getTime();
          bValue = new Date(b.createdAt || b.updatedAt || 0).getTime();
          break;
        case "title":
          aValue = a.title?.toLowerCase() || "";
          bValue = b.title?.toLowerCase() || "";
          break;
        case "status":
          aValue = a.status?.toLowerCase() || "";
          bValue = b.status?.toLowerCase() || "";
          break;
        case "author":
          aValue = a.author?.toLowerCase() || "";
          bValue = b.author?.toLowerCase() || "";
          break;
        default:
          break;
      }

      if (aValue < bValue) return filters.sortDirection === "asc" ? -1 : 1;
      if (aValue > bValue) return filters.sortDirection === "asc" ? 1 : -1;
      return 0;
    });
  }, [filteredPosts, filters.sortKey, filters.sortDirection]);

  const paginatedPosts = useMemo(() => {
    const start = (filters.currentPage - 1) * filters.postsPerPage;
    return sortedPosts.slice(start, start + filters.postsPerPage);
  }, [sortedPosts, filters.currentPage, filters.postsPerPage]);

  return { filteredPosts, sortedPosts, paginatedPosts };
};
