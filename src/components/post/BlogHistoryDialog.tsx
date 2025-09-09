import React from "react";
import { RevisionDiffView } from "./RevisionDiffView";
import { useIsAdmin } from "@/hooks/useIsAdmin";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { Post } from "@/types/post";

interface BlogHistoryDialogProps {
  post: Post | null;
  onClose: () => void;
  onRevert?: (revisionId: string) => void;
}

const BlogHistoryDialog: React.FC<BlogHistoryDialogProps> = ({
  post,
  onClose,
  onRevert,
}) => {
  const isAdmin = useIsAdmin();
  const [previewRev, setPreviewRev] = React.useState<
    import("@/types/post").PostRevision | null
  >(null);
  return (
    <>
      <Dialog open={!!post} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Revision History - {post?.title}</DialogTitle>
          </DialogHeader>
          <div className="max-h-96 overflow-y-auto">
            {post?.revisions && post.revisions.length > 0 ? (
              <div className="space-y-4">
                {post.revisions.map((rev, idx) => (
                  <div key={rev.id} className="border rounded p-3 bg-muted/50">
                    <div className="flex justify-end mb-2 gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setPreviewRev(rev)}
                      >
                        Preview
                      </Button>
                      {onRevert && idx !== 0 && isAdmin && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => onRevert(rev.id)}
                        >
                          Revert to this
                        </Button>
                      )}
                    </div>
                    <div className="flex justify-between items-start text-xs text-muted-foreground mb-2">
                      <span className="font-medium">
                        Revision #
                        {post.revisions?.length
                          ? post.revisions.length - idx
                          : idx + 1}
                      </span>
                      <span>
                        {rev.updatedAt
                          ? new Date(rev.updatedAt).toLocaleString()
                          : new Date(rev.createdAt).toLocaleString()}
                      </span>
                    </div>

                    <div className="space-y-2">
                      <div>
                        <h4 className="font-semibold text-sm text-foreground">
                          {rev.title}
                        </h4>
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-xs">
                        <div>
                          <span className="text-muted-foreground">Slug:</span>
                          <span className="ml-2 font-mono text-foreground">
                            {rev.slug}
                          </span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Author:</span>
                          <span className="ml-2 text-foreground">
                            {rev.author}
                          </span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Status:</span>
                          <span
                            className={`ml-2 px-1.5 py-0.5 rounded text-xs font-medium ${
                              rev.status === "published"
                                ? "bg-green-100 text-green-800"
                                : rev.status === "draft"
                                ? "bg-gray-100 text-gray-800"
                                : "bg-blue-100 text-blue-800"
                            }`}
                          >
                            {rev.status}
                          </span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">
                            Category:
                          </span>
                          <span className="ml-2 text-foreground">
                            {rev.category || "—"}
                          </span>
                        </div>
                      </div>

                      {rev.tags && rev.tags.length > 0 && (
                        <div className="text-xs">
                          <span className="text-muted-foreground">Tags:</span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {rev.tags.map((tag, tagIdx) => (
                              <span
                                key={tagIdx}
                                className="bg-primary/10 text-primary px-1.5 py-0.5 rounded text-xs"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="text-xs">
                        <span className="text-muted-foreground">
                          Content Preview:
                        </span>
                        <div className="mt-1 p-2 bg-background border rounded text-xs text-muted-foreground">
                          {rev.content.slice(0, 150)}
                          {rev.content.length > 150 ? "..." : ""}
                        </div>
                      </div>

                      {idx === 0 && (
                        <div className="flex items-center gap-2 pt-2">
                          <span className="inline-flex items-center gap-1 text-xs text-green-600 bg-green-50 px-2 py-1 rounded">
                            <svg
                              className="w-3 h-3"
                              fill="currentColor"
                              viewBox="0 0 8 8"
                            >
                              <circle cx="4" cy="4" r="3" />
                            </svg>
                            Current Version
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="text-muted-foreground">
                  <svg
                    className="w-12 h-12 mx-auto mb-4 text-muted-foreground/50"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  <p className="text-sm">
                    No revision history available for this post.
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Revisions will appear here when the post is edited.
                  </p>
                </div>
              </div>
            )}
          </div>
          <DialogFooter className="flex justify-between items-center">
            <div className="text-xs text-muted-foreground">
              {post?.revisions?.length
                ? `${post.revisions.length} revision${
                    post.revisions.length > 1 ? "s" : ""
                  }`
                : "No revisions"}
            </div>
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Preview Revision Dialog */}
      <Dialog open={!!previewRev} onOpenChange={() => setPreviewRev(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Revision Preview</DialogTitle>
          </DialogHeader>
          {previewRev && (
            <RevisionDiffView revision={previewRev} current={post} />
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setPreviewRev(null)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default BlogHistoryDialog;
