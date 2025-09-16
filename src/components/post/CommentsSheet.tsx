import { MessageCircle } from "lucide-react";
import { Sheet, SheetTrigger, SheetContent } from "../ui/sheet";
import { DialogTitle } from "../ui/dialog";
import { Input } from "../ui/input";
import {
  getAllComments,
  addComment,
  updateComment,
} from "@/lib/commentsStorage";
import { Popover, PopoverTrigger, PopoverContent } from "../ui/popover";
import type { Comment } from "@/types/comment";
import { v4 as uuidv4 } from "uuid";
import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

interface CommentsSheetProps {
  postId: string;
}

const CommentsSheet: React.FC<CommentsSheetProps> = ({ postId }) => {
  const queryClient = useQueryClient();
  const [author, setAuthor] = React.useState("");
  const [content, setContent] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [submitting, setSubmitting] = React.useState(false);
  const [success, setSuccess] = React.useState("");
  const [error, setError] = React.useState("");
  const [replyTo, setReplyTo] = React.useState<string | null>(null);

  const { data: comments = [] } = useQuery<Comment[]>({
    queryKey: ["comments", postId],
    queryFn: () =>
      getAllComments().filter(
        (c) => c.postId === postId && c.status === "approved"
      ),
  });

  type CommentTree = Comment & { replies: CommentTree[] };

  function buildCommentTree(comments: Comment[]): CommentTree[] {
    const map: Record<string, CommentTree> = {};
    const roots: CommentTree[] = [];
    comments.forEach((c) => (map[c.id] = { ...c, replies: [] }));
    Object.values(map).forEach((c) => {
      if (c.parentId) {
        if (map[c.parentId]) map[c.parentId].replies.push(c);
      } else {
        roots.push(c);
      }
    });
    return roots;
  }

  const addCommentMutation = useMutation({
    mutationFn: (newComment: Comment) => {
      addComment(newComment);
      return Promise.resolve();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", postId] });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!author.trim() || !email.trim() || !content.trim()) {
      setError("All fields are required.");
      return;
    }
    setSubmitting(true);
    const newComment: Comment = {
      id: uuidv4(),
      postId,
      author,
      email,
      content,
      status: "pending",
      createdAt: new Date().toISOString(),
      parentId: replyTo || undefined,
    };
    addCommentMutation.mutate(newComment, {
      onSuccess: () => {
        setAuthor("");
        setEmail("");
        setContent("");
        setSuccess("Comment submitted for review.");
        setSubmitting(false);
        setReplyTo(null);
      },
      onError: () => {
        setError("Failed to submit comment.");
        setSubmitting(false);
      },
    });
  };

  const REACTIONS_KEY = "comment-reactions-user";

  function getUserReactions(): Record<string, string> {
    if (typeof window === "undefined") return {};
    try {
      const stored = localStorage.getItem(REACTIONS_KEY);
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  }

  function saveUserReactions(reactions: Record<string, string>) {
    if (typeof window === "undefined") return;
    localStorage.setItem(REACTIONS_KEY, JSON.stringify(reactions));
  }

  const [userReactions, setUserReactions] = React.useState<
    Record<string, string>
  >({});

  React.useEffect(() => {
    setUserReactions(getUserReactions());
  }, []);

  const updateCommentMutation = useMutation({
    mutationFn: ({
      commentId,
      reactions,
    }: {
      commentId: string;
      reactions: Record<string, number>;
    }) => {
      updateComment(commentId, { reactions });
      return Promise.resolve();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", postId] });
    },
  });

  function handleReaction(commentId: string, emoji: string) {
    const prevReactions = getUserReactions();
    const prevEmoji = prevReactions[commentId];
    const newReactions = { ...prevReactions };
    const newComments = getAllComments();
    const idx = newComments.findIndex((c) => c.id === commentId);
    if (idx === -1) return;
    const comment = { ...newComments[idx] };
    comment.reactions = { ...comment.reactions };
    if (prevEmoji === emoji) {
      comment.reactions[emoji] = Math.max(
        (comment.reactions[emoji] || 1) - 1,
        0
      );
      delete newReactions[commentId];
    } else {
      if (prevEmoji) {
        comment.reactions[prevEmoji] = Math.max(
          (comment.reactions[prevEmoji] || 1) - 1,
          0
        );
      }
      comment.reactions[emoji] = (comment.reactions[emoji] || 0) + 1;
      newReactions[commentId] = emoji;
    }
    newComments[idx] = comment;
    saveUserReactions(newReactions);
    updateCommentMutation.mutate({ commentId, reactions: comment.reactions });
    setUserReactions(newReactions);
  }
  function stringToColor(str: string) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    const color = `hsl(${hash % 360}, 60%, 70%)`;
    return color;
  }

  function renderComments(tree: CommentTree[], level = 0) {
    return tree.map((c) => (
      <div
        key={c.id}
        className={`flex gap-2 mb-4 relative group ${
          level > 0 ? "pl-4 md:pl-8" : ""
        }`}
      >
        {level > 0 && (
          <div className="absolute left-0 top-6 bottom-2 w-3 flex justify-center">
            <div className="w-1 h-full bg-zinc-200 dark:bg-zinc-700 rounded-full" />
          </div>
        )}
        <div className="flex-shrink-0">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white shadow"
            style={{ background: stringToColor(c.author) }}
          >
            {c.author.slice(0, 2).toUpperCase()}
          </div>
        </div>

        <div className="flex-1">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-xl px-4 py-3 shadow-sm">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                {c.author}
              </span>
              <span className="text-xs text-zinc-400">
                {new Date(c.createdAt).toLocaleString()}
              </span>
            </div>
            <div className="text-zinc-800 dark:text-zinc-200 mb-2 whitespace-pre-line">
              {c.content}
            </div>
            <div className="flex gap-2 items-center mb-1">
              <Popover>
                <PopoverTrigger asChild>
                  <button
                    type="button"
                    aria-label="React to comment"
                    className="text-lg px-2 py-1 rounded-full border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800 shadow transition-all"
                  >
                    {userReactions[c.id] || "👍"}
                  </button>
                </PopoverTrigger>
                <PopoverContent className="flex gap-2 p-2 w-auto min-w-0 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 shadow-lg rounded-xl">
                  {["👍", "❤️", "😂", "🎉"].map((emoji) => {
                    const selected = userReactions[c.id] === emoji;
                    return (
                      <button
                        key={emoji}
                        type="button"
                        aria-label={`React with ${emoji}`}
                        className={`text-2xl px-1 py-0.5 rounded-full border transition-all duration-150
                          ${
                            selected
                              ? "ring-2 ring-primary border-primary bg-primary/10 scale-110 shadow"
                              : "border-transparent hover:bg-zinc-100 dark:hover:bg-zinc-800"
                          }
                        `}
                        style={{ outline: "none" }}
                        onClick={() => handleReaction(c.id, emoji)}
                      >
                        <span className="align-middle">{emoji}</span>
                        <span className="text-xs align-top ml-0.5">
                          {c.reactions?.[emoji] || 0}
                        </span>
                      </button>
                    );
                  })}
                </PopoverContent>
              </Popover>
              <button
                className="text-xs text-primary-600 dark:text-primary-400 hover:underline font-medium ml-2"
                onClick={() => {
                  setReplyTo(c.id);
                  setContent("");
                  setAuthor("");
                  setEmail("");
                  setError("");
                  setSuccess("");
                }}
              >
                Reply
              </button>
            </div>
          </div>

          {replyTo === c.id && (
            <form
              onSubmit={handleSubmit}
              className="mt-3 mb-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl px-4 py-3 shadow-sm"
            >
              <Input
                type="text"
                placeholder="Your reply..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
                className="mb-2"
              />
              <div className="flex gap-2 mb-2">
                <Input
                  type="text"
                  placeholder="Your name"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  required
                />
                <Input
                  type="email"
                  placeholder="Your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              {error && (
                <div className="text-destructive text-sm mb-1">{error}</div>
              )}
              {success && (
                <div className="text-green-700 text-sm mb-1">{success}</div>
              )}
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="bg-primary text-white px-4 py-1 rounded text-xs font-medium"
                  disabled={submitting}
                >
                  {submitting ? "Submitting..." : "Reply"}
                </button>
                <button
                  type="button"
                  className="text-xs text-zinc-400 hover:underline"
                  onClick={() => setReplyTo(null)}
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

          {c.replies && c.replies.length > 0 && (
            <div className="mt-2">{renderComments(c.replies, level + 1)}</div>
          )}
        </div>
      </div>
    ));
  }

  const commentTree = buildCommentTree(comments);

  return (
    <Sheet>
      <SheetTrigger asChild>
        <button
          aria-label="Open comments"
          className="flex items-center gap-1 text-muted-foreground hover:text-primary transition"
        >
          <MessageCircle size={20} />
          <span className="hidden md:inline">Comments</span>
        </button>
      </SheetTrigger>
      <SheetContent side="left" className="max-w-md w-full overflow-y-auto p-0">
        <div className="flex flex-col h-full">
          <div className="border-b px-6 py-4 flex items-center justify-between">
            <DialogTitle className="font-semibold text-lg">
              Responses ({comments.length})
            </DialogTitle>
            <button className="text-xl text-muted-foreground hover:text-primary">
              &times;
            </button>
          </div>
          <div className="flex-1 overflow-y-auto px-6 py-4">
            {replyTo === null && (
              <form onSubmit={handleSubmit} className="mb-6">
                <Input
                  type="text"
                  placeholder="What are your thoughts?"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  required
                  className="mb-2"
                />
                <Input
                  type="text"
                  placeholder="Your name"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  required
                  className="mb-2"
                />
                <Input
                  type="email"
                  placeholder="Your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="mb-2"
                />
                {error && (
                  <div className="text-destructive text-sm mb-2">{error}</div>
                )}
                {success && (
                  <div className="text-green-700 text-sm mb-2">{success}</div>
                )}
                <button
                  type="submit"
                  className="bg-primary text-white px-4 py-2 rounded w-full"
                  disabled={submitting}
                >
                  {submitting ? "Submitting..." : "Post Comment"}
                </button>
              </form>
            )}
            <div className="space-y-4">
              {comments.length === 0 && (
                <div className="text-muted-foreground mb-4">
                  No responses yet.
                </div>
              )}
              {renderComments(commentTree)}
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default CommentsSheet;
