import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAllComments, addComment } from "@/lib/commentsStorage";
import type { Comment } from "@/types/comment";
import { v4 as uuidv4 } from "uuid";

interface CommentsSectionProps {
  postId: string;
}

const CommentsSection: React.FC<CommentsSectionProps> = ({ postId }) => {
  const queryClient = useQueryClient();
  const [author, setAuthor] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [content, setContent] = React.useState("");
  const [submitting, setSubmitting] = React.useState(false);
  const [success, setSuccess] = React.useState("");
  const [error, setError] = React.useState("");

  const { data: comments = [] } = useQuery<Comment[]>({
    queryKey: ["comments", postId],
    queryFn: () => {
      return getAllComments().filter(
        (c) => c.postId === postId && c.status === "approved"
      );
    },
  });

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
    };
    addCommentMutation.mutate(newComment, {
      onSuccess: () => {
        setAuthor("");
        setEmail("");
        setContent("");
        setSuccess("Comment submitted for review.");
        setSubmitting(false);
      },
      onError: () => {
        setError("Failed to submit comment.");
        setSubmitting(false);
      },
    });
  };

  return (
    <div className="mt-12">
      <h2 className="text-lg font-semibold mb-4">Comments</h2>
      {comments.length === 0 && (
        <div className="text-muted-foreground mb-4">No comments yet.</div>
      )}
      <div className="space-y-4 mb-8">
        {comments.map((c) => (
          <div key={c.id} className="bg-muted/30 rounded p-3">
            <div className="font-semibold text-primary">{c.author}</div>
            <div className="text-xs text-muted-foreground mb-1">
              {new Date(c.createdAt).toLocaleString()}
            </div>
            <div>{c.content}</div>
          </div>
        ))}
      </div>
      <form
        onSubmit={handleSubmit}
        className="space-y-3 bg-muted/10 rounded p-4"
      >
        <div>
          <input
            type="text"
            className="w-full px-3 py-2 rounded border"
            placeholder="Your name"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            required
          />
        </div>
        <div>
          <input
            type="email"
            className="w-full px-3 py-2 rounded border"
            placeholder="Your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <textarea
            className="w-full px-3 py-2 rounded border"
            placeholder="Your comment"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            rows={3}
          />
        </div>
        {error && <div className="text-destructive text-sm">{error}</div>}
        {success && <div className="text-green-700 text-sm">{success}</div>}
        <button
          type="submit"
          className="bg-primary text-white px-4 py-2 rounded"
          disabled={submitting}
        >
          {submitting ? "Submitting..." : "Submit Comment"}
        </button>
      </form>
    </div>
  );
};

export default CommentsSection;
