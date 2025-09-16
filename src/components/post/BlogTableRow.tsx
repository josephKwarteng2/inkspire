import React from "react";
import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Pencil, Trash, Plus } from "lucide-react";
import type { Post } from "@/types/post";

interface PostTableRowProps {
  post: Post;
  isSelected: boolean;
  onSelect: (id: string) => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onRestore?: (id: string) => void;
  onPermanentDelete?: (id: string) => void;
  onPreview: (post: Post) => void;
  onViewHistory: (post: Post) => void;
  onPublish?: (id: string) => void;
  onDuplicate?: (id: string) => void;
  onToggleFeatured?: (id: string, featured: boolean) => void;
  viewFilter?: "all" | "active" | "trashed";
}

const BlogTableRow: React.FC<PostTableRowProps> = ({
  post,
  isSelected,
  onSelect,
  onEdit,
  onDelete,
  onRestore,
  onPermanentDelete,
  onPreview,
  onViewHistory,
  onPublish,
  onDuplicate,
  onToggleFeatured,
  viewFilter,
}) => {
  return (
    <TableRow
      className={`bg-card border-b border-border hover:bg-muted transition-colors ${
        isSelected ? "bg-primary/10" : ""
      }`}
    >
      <TableCell className="py-4 bg-background text-foreground">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => onSelect(post.id)}
          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 focus:ring-2"
        />
      </TableCell>
      <TableCell className="py-4 bg-background text-foreground">
        <div className="font-semibold text-foreground max-w-xs truncate">
          {post.title}
        </div>
      </TableCell>
      <TableCell className="py-4 text-center bg-background text-foreground">
        {typeof post.featured === "boolean" && onToggleFeatured ? (
          <button
            type="button"
            aria-label={
              post.featured ? "Unmark as featured" : "Mark as featured"
            }
            title={post.featured ? "Unmark as featured" : "Mark as featured"}
            className={`inline-flex items-center justify-center w-7 h-7 rounded-full border transition-colors ${
              post.featured
                ? "bg-yellow-200 border-yellow-400 text-yellow-800"
                : "bg-gray-100 border-gray-300 text-gray-400 hover:bg-yellow-100 hover:text-yellow-700"
            }`}
            onClick={() => onToggleFeatured(post.id, !post.featured)}
          >
            {post.featured ? (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 15l-5.878 3.09 1.122-6.545L.488 6.91l6.561-.955L10 0l2.951 5.955 6.561.955-4.756 4.635 1.122 6.545z" />
              </svg>
            ) : (
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 20 20"
              >
                <path d="M10 15l-5.878 3.09 1.122-6.545L.488 6.91l6.561-.955L10 0l2.951 5.955 6.561.955-4.756 4.635 1.122 6.545z" />
              </svg>
            )}
          </button>
        ) : (
          <span className="text-foreground">—</span>
        )}
      </TableCell>
      <TableCell className="py-4 bg-background text-foreground">
        <span className="text-foreground text-xs font-mono">
          {post.slug || "—"}
        </span>
      </TableCell>
      <TableCell className="py-4 bg-background text-foreground">
        <span className="text-foreground text-sm">{post.category || "—"}</span>
      </TableCell>
      <TableCell className="py-4 bg-background text-foreground">
        {post.tags && post.tags.length > 0 ? (
          <div className="flex flex-wrap gap-1 max-w-xs">
            {post.tags.slice(0, 2).map((tag: string, i: number) => (
              <span
                key={i}
                className="bg-gray-100 text-gray-700 text-xs rounded-full px-2 py-1 font-medium"
              >
                {tag}
              </span>
            ))}
            {post.tags.length > 2 && (
              <span className="text-xs text-foreground">
                +{post.tags.length - 2} more
              </span>
            )}
          </div>
        ) : (
          <span className="text-foreground text-sm">—</span>
        )}
      </TableCell>
      <TableCell className="py-4 bg-background text-foreground">
        <span className="text-foreground text-sm">{post.author || "—"}</span>
      </TableCell>
      <TableCell className="py-4 bg-background text-foreground">
        {post.status === "draft" && (
          <span
            className="inline-flex items-center gap-1.5 rounded-full bg-gray-200 px-2.5 py-1 text-xs font-semibold text-gray-800 border border-gray-400"
            aria-label="Draft status"
            title="Draft"
          >
            <svg
              className="w-3 h-3 mr-1 text-gray-500"
              fill="currentColor"
              viewBox="0 0 8 8"
            >
              <circle cx="4" cy="4" r="3" />
            </svg>
            Draft
          </span>
        )}
        {post.status === "published" && (
          <span
            className="inline-flex items-center gap-1.5 rounded-full bg-green-200 px-2.5 py-1 text-xs font-semibold text-green-900 border border-green-500"
            aria-label="Published status"
            title="Published"
          >
            <svg
              className="w-3 h-3 mr-1 text-green-600"
              fill="currentColor"
              viewBox="0 0 8 8"
            >
              <circle cx="4" cy="4" r="3" />
            </svg>
            Published
          </span>
        )}
        {post.status === "scheduled" && (
          <span
            className="inline-flex items-center gap-1.5 rounded-full bg-blue-200 px-2.5 py-1 text-xs font-semibold text-blue-900 border border-blue-500"
            aria-label="Scheduled status"
            title="Scheduled"
          >
            <svg
              className="w-3 h-3 mr-1 text-blue-600"
              fill="currentColor"
              viewBox="0 0 8 8"
            >
              <circle cx="4" cy="4" r="3" />
            </svg>
            Scheduled
            {post.scheduledDate && (
              <span className="ml-2 text-xs text-blue-700 font-normal">
                {new Date(post.scheduledDate).toLocaleString()}
              </span>
            )}
          </span>
        )}
      </TableCell>
      <TableCell className="py-4">
        <span className="text-foreground text-sm">
          {post.createdAt
            ? new Date(post.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })
            : "—"}
        </span>
      </TableCell>
      <TableCell className="py-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
              aria-label="Open actions menu"
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onPreview(post)}>
              <span className="flex items-center">
                <svg
                  className="w-4 h-4 mr-2"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z" />
                  <circle cx={12} cy={12} r={3} />
                </svg>
                Preview
              </span>
            </DropdownMenuItem>
            {onDuplicate && (
              <DropdownMenuItem onClick={() => onDuplicate(post.id)}>
                <span className="flex items-center">
                  <svg
                    className="w-4 h-4 mr-2"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="9" y="9" width="13" height="13" rx="2" />
                    <rect x="3" y="3" width="13" height="13" rx="2" />
                  </svg>
                  Duplicate
                </span>
              </DropdownMenuItem>
            )}
            <DropdownMenuItem onClick={() => onViewHistory(post)}>
              <span className="flex items-center">
                <svg
                  className="w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                >
                  <path d="M3 3v5h5M21 21v-5h-5" />
                  <path d="M3 21c4.97-4.97 13.03-4.97 18 0" />
                  <path d="M3 3c4.97 4.97 13.03 4.97 18 0" />
                </svg>
                View History
              </span>
            </DropdownMenuItem>
            {onEdit && (
              <DropdownMenuItem onClick={() => onEdit(post.id)}>
                <Pencil className="w-4 h-4 mr-2" /> Edit
              </DropdownMenuItem>
            )}
            {onPublish && post.status === "draft" && (
              <DropdownMenuItem
                onClick={() => onPublish(post.id)}
                className="text-green-700 focus:text-green-700"
              >
                <Plus className="w-4 h-4 mr-2" /> Publish
              </DropdownMenuItem>
            )}
            {onPublish && post.status === "scheduled" && (
              <DropdownMenuItem
                onClick={() => onPublish(post.id)}
                className="text-blue-700 focus:text-blue-700"
              >
                <Plus className="w-4 h-4 mr-2" /> Publish Now
              </DropdownMenuItem>
            )}
            {onDelete && !post.trashed && (
              <DropdownMenuItem
                onClick={() => onDelete(post.id)}
                className="text-destructive focus:text-destructive"
              >
                <Trash className="w-4 h-4 mr-2" /> Trash
              </DropdownMenuItem>
            )}
            {onRestore && post.trashed && (
              <DropdownMenuItem
                onClick={() => onRestore(post.id)}
                className="text-green-700 focus:text-green-700"
              >
                <Plus className="w-4 h-4 mr-2" /> Restore
              </DropdownMenuItem>
            )}
            {onPermanentDelete && post.trashed && viewFilter === "trashed" && (
              <DropdownMenuItem
                onClick={() =>
                  window.confirm(
                    "Permanently delete this post? This cannot be undone."
                  ) && onPermanentDelete(post.id)
                }
                className="text-destructive focus:text-destructive"
              >
                <Trash className="w-4 h-4 mr-2" /> Permanently Delete
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
};

export default BlogTableRow;
