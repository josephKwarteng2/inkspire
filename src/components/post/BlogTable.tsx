import React from "react";
import { Table, TableBody } from "@/components/ui/table";
import type { Post } from "@/types/post";
import PostTableHeader from "./BlogTableHeader";
import PostTableRow from "./BlogTableRow";

interface BlogTableProps {
  posts: Post[];
  selectedPosts: Set<string>;
  selectAll: boolean;
  onSelectAll: () => void;
  onSelect: (id: string) => void;
  role: string;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onPermanentDelete?: (id: string) => void;
  onRestore?: (id: string) => void;
  onPreview: (post: Post | null) => void;
  onViewHistory: (post: Post | null) => void;
  onPublish?: (id: string) => void;
  onDuplicate?: (id: string) => void;
  onToggleFeatured?: (id: string, featured: boolean) => void;
  viewFilter: "all" | "active" | "trashed";
}

const BlogTable: React.FC<BlogTableProps> = ({
  posts,
  selectedPosts,
  selectAll,
  onSelectAll,
  onSelect,
  role,
  onEdit,
  onDelete,
  onPermanentDelete,
  onRestore,
  onPreview,
  onViewHistory,
  onPublish,
  onDuplicate,
  onToggleFeatured,
  viewFilter,
}) => {
  return (
    <Table>
      <PostTableHeader selectAll={selectAll} onSelectAll={onSelectAll} />
      <TableBody>
        {posts.map((post: Post) => {
          const canEdit = role === "admin";
          const canDelete = role === "admin";
          const canPublish = role === "admin";

          return (
            <PostTableRow
              key={post.id}
              post={post}
              isSelected={selectedPosts.has(post.id)}
              onSelect={onSelect}
              onEdit={canEdit ? onEdit : undefined}
              onDelete={canDelete && !post.trashed ? onDelete : undefined}
              onRestore={
                canDelete && post.trashed && onRestore ? onRestore : undefined
              }
              onPermanentDelete={
                canDelete && onPermanentDelete ? onPermanentDelete : undefined
              }
              onPreview={onPreview}
              onViewHistory={onViewHistory}
              onPublish={canPublish ? onPublish : undefined}
              onDuplicate={onDuplicate}
              onToggleFeatured={onToggleFeatured}
              viewFilter={viewFilter}
            />
          );
        })}
      </TableBody>
    </Table>
  );
};

export default BlogTable;
