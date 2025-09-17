import { useMemo } from "react";
import type { Comment, CommentStatus } from "@/types/comment";
import React from "react";

export const useCommentFilters = (comments: Comment[]) => {
  const [filter, setFilter] = React.useState<CommentStatus | "all">("all");
  const [search, setSearch] = React.useState("");
  const [commenter, setCommenter] = React.useState("");
  const [postFilter, setPostFilter] = React.useState("");
  const [date, setDate] = React.useState("");

  const filteredComments = useMemo(
    () =>
      comments
        .filter((c) => (filter === "all" ? true : c.status === filter))
        .filter((c) =>
          search.trim()
            ? c.content.toLowerCase().includes(search.toLowerCase()) ||
              c.author.toLowerCase().includes(search.toLowerCase())
            : true
        )
        .filter((c) =>
          commenter.trim()
            ? c.author.toLowerCase().includes(commenter.toLowerCase())
            : true
        )
        .filter((c) => (postFilter ? c.postId === postFilter : true))
        .filter((c) =>
          date
            ? new Date(c.createdAt).toISOString().slice(0, 10) === date
            : true
        ),
    [comments, filter, search, commenter, postFilter, date]
  );

  const clearFilters = () => {
    setFilter("all");
    setSearch("");
    setCommenter("");
    setPostFilter("");
    setDate("");
  };

  return {
    filter,
    setFilter,
    search,
    setSearch,
    commenter,
    setCommenter,
    postFilter,
    setPostFilter,
    date,
    setDate,
    filteredComments,
    clearFilters,
  };
};
