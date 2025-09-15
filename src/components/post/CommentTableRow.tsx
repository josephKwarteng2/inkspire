import React from "react";
import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import type { Comment, CommentStatus } from "@/types/comment";
import InlineEdit from "@/components/ui/InlineEdit";
import CommentPreviewModal from "@/components/post/CommentPreviewModal";
import UserPopover from "@/components/post/UserPopover";

interface CommentTableRowProps {
  comment: Comment;
  postTitle?: string;
  isSelected: boolean;
  onSelect: (id: string) => void;
  onApprove: (id: string) => void;
  onPending: (id: string) => void;
  onSpam: (id: string) => void;
  onDelete: (id: string) => void;
  onEditContent?: (id: string, content: string) => void;
  onEditStatus?: (id: string, status: CommentStatus) => void;
}

const CommentTableRow: React.FC<CommentTableRowProps> = ({
  comment,
  postTitle,
  isSelected,
  onSelect,
  onApprove,
  onPending,
  onSpam,
  onDelete,
  onEditContent,
  onEditStatus,
}) => {
  const [previewOpen, setPreviewOpen] = React.useState(false);
  return (
    <TableRow
      className={`border-b border-border hover:bg-muted transition-colors ${
        isSelected ? "bg-primary/10" : ""
      }`}
    >
      <TableCell className="py-4 bg-background text-foreground">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => onSelect(comment.id)}
          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 focus:ring-2"
        />
      </TableCell>
      <TableCell className="py-4 bg-background text-foreground font-semibold">
        <UserPopover author={comment.author} email={comment.email} />
      </TableCell>
      <TableCell className="py-4 bg-background text-foreground text-xs">
        {comment.email}
      </TableCell>
      <TableCell className="py-4 bg-background text-foreground text-xs">
        {postTitle || (
          <span className="italic text-muted-foreground">[Post not found]</span>
        )}
      </TableCell>
      <TableCell className="py-4 bg-background text-foreground">
        <Select
          value={comment.status}
          onValueChange={(value) =>
            typeof onEditStatus === "function" &&
            onEditStatus(comment.id, value as CommentStatus)
          }
        >
          <SelectTrigger
            className={`min-w-[110px] px-2 py-1 rounded text-xs font-medium outline-none focus:ring-2 focus:ring-primary
              ${
                comment.status === "approved"
                  ? "bg-green-100 text-green-800"
                  : comment.status === "pending"
                  ? "bg-yellow-100 text-yellow-800"
                  : "bg-red-100 text-red-800"
              }
            `}
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem
              value="approved"
              className="bg-green-100 text-green-800"
            >
              Approved
            </SelectItem>
            <SelectItem
              value="pending"
              className="bg-yellow-100 text-yellow-800"
            >
              Pending
            </SelectItem>
            <SelectItem value="spam" className="bg-red-100 text-red-800">
              Spam
            </SelectItem>
          </SelectContent>
        </Select>
      </TableCell>
      <TableCell className="py-4 bg-background text-foreground text-xs">
        {new Date(comment.createdAt).toLocaleString()}
      </TableCell>
      <TableCell className="py-4 bg-background text-foreground max-w-xs truncate text-sm">
        {typeof onEditContent === "function" ? (
          <InlineEdit
            value={comment.content}
            onSave={(val) => onEditContent(comment.id, val)}
            className="w-full min-w-0"
          />
        ) : (
          comment.content
        )}
        <CommentPreviewModal
          open={previewOpen}
          onClose={() => setPreviewOpen(false)}
          content={comment.content}
          author={comment.author}
        />
      </TableCell>
      <TableCell className="py-4 bg-background text-foreground">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="icon" variant="ghost">
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setPreviewOpen(true)}>
              View
            </DropdownMenuItem>
            {comment.status !== "approved" && (
              <DropdownMenuItem onClick={() => onApprove(comment.id)}>
                Approve
              </DropdownMenuItem>
            )}
            {comment.status !== "pending" && (
              <DropdownMenuItem onClick={() => onPending(comment.id)}>
                Mark Pending
              </DropdownMenuItem>
            )}
            {comment.status !== "spam" && (
              <DropdownMenuItem onClick={() => onSpam(comment.id)}>
                Mark Spam
              </DropdownMenuItem>
            )}
            <DropdownMenuItem
              onClick={() => onDelete(comment.id)}
              className="text-destructive"
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
};

export default CommentTableRow;
