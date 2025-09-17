import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAllPosts } from "@/lib/postsStorage";
import {
  getAllComments,
  updateComment,
  deleteComment,
} from "@/lib/commentsStorage";
import type { Comment, CommentStatus } from "@/types/comment";

export const useComments = () => {
  const queryClient = useQueryClient();

  const { data: comments = [], isLoading: commentsLoading } = useQuery<
    Comment[]
  >({
    queryKey: ["comments-all"],
    queryFn: () => getAllComments(),
  });

  const { data: posts = [], isLoading: postsLoading } = useQuery<
    { id: string; title: string }[]
  >({
    queryKey: ["posts-all"],
    queryFn: () => getAllPosts().map((p) => ({ id: p.id, title: p.title })),
  });

  const updateCommentMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: CommentStatus }) => {
      updateComment(id, { status });
      return Promise.resolve();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments-all"] });
    },
  });

  const deleteCommentMutation = useMutation({
    mutationFn: (id: string) => {
      deleteComment(id);
      return Promise.resolve(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments-all"] });
    },
  });

  const editContentMutation = useMutation({
    mutationFn: ({ id, content }: { id: string; content: string }) => {
      updateComment(id, { content });
      return Promise.resolve();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments-all"] });
    },
  });

  return {
    comments,
    posts,
    loading: commentsLoading || postsLoading,
    setLoading: () => {},
    handleStatus: (id: string, status: CommentStatus) =>
      updateCommentMutation.mutate({ id, status }),
    handleDelete: (id: string) => deleteCommentMutation.mutate(id),
    handleEditContent: (id: string, content: string) =>
      editContentMutation.mutate({ id, content }),
    refreshComments: () =>
      queryClient.invalidateQueries({ queryKey: ["comments-all"] }),
  };
};
