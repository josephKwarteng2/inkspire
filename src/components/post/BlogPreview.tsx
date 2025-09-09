import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import type { Post } from "@/types/post";

interface BlogPreviewProps {
  post: Post | null;
  open: boolean;
  onClose: () => void;
}

const BlogPreview: React.FC<BlogPreviewProps> = ({ post, open, onClose }) => {
  if (!post) return null;
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Preview: {post.title}</DialogTitle>
          <DialogClose onClick={onClose} />
        </DialogHeader>
        <div className="mb-2 text-sm text-muted-foreground">
          By {post.author} | {post.category} | {post.tags?.join(", ")}
        </div>
        <div
          className="prose max-w-none overflow-y-auto flex-1"
          style={{ minHeight: 0 }}
          dangerouslySetInnerHTML={{ __html: post.content ?? "" }}
        />
      </DialogContent>
    </Dialog>
  );
};

export default BlogPreview;
