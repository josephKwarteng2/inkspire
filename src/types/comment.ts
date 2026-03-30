export type CommentStatus = "pending" | "approved" | "spam";

export interface Comment {
  id: string;
  postId: string;
  author: string;
  email: string;
  content: string;
  status: CommentStatus;
  createdAt: string;
  updatedAt?: string;
  parentId?: string;
  reactions?: {
    [emoji: string]: number;
  };
}
