import React from "react";
import { Table, TableBody } from "@/components/ui/table";
import CommentTableHeader from "./CommentTableHeader";
import CommentTableRow from "./CommentTableRow";
import type { Comment } from "@/types/comment";

import type { CommentStatus } from "@/types/comment";
import EmptyPostsLottie from "./EmptyPostsLottie";
interface CommentTableProps {
  comments: Comment[];
  posts: { id: string; title: string }[];
  selectedComments: Set<string>;
  selectAll: boolean;
  onSelectAll: (allIds: string[]) => void;
  onSelect: (id: string) => void;
  onApprove: (id: string) => void;
  onPending: (id: string) => void;
  onSpam: (id: string) => void;
  onDelete: (id: string) => void;
  onEditContent?: (id: string, content: string) => void;
  onEditStatus?: (id: string, status: CommentStatus) => void;
}

const CommentTable: React.FC<CommentTableProps> = ({
  comments,
  posts,
  selectedComments,
  selectAll,
  onSelectAll,
  onSelect,
  onApprove,
  onPending,
  onSpam,
  onDelete,
  onEditContent,
  onEditStatus,
}) => {
  if (comments.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <EmptyPostsLottie className="w-64 h-64 mb-4" />
        <div className="text-muted-foreground text-sm">No comments found</div>
      </div>
    );
  }
  const allIds = comments.map((c) => c.id);
  return (
    <Table>
      <CommentTableHeader
        selectAll={selectAll}
        onSelectAll={onSelectAll}
        allIds={allIds}
      />
      <TableBody>
        {comments.map((comment) => {
          const post = posts.find((p) => String(p.id) === comment.postId);
          return (
            <CommentTableRow
              key={comment.id}
              comment={comment}
              postTitle={post ? post.title : undefined}
              isSelected={selectedComments.has(comment.id)}
              onSelect={onSelect}
              onApprove={onApprove}
              onPending={onPending}
              onSpam={onSpam}
              onDelete={onDelete}
              onEditContent={onEditContent}
              onEditStatus={onEditStatus}
            />
          );
        })}
      </TableBody>
    </Table>
  );
};

export default CommentTable;
