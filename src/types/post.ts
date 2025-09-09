export type PostStatus = "published" | "scheduled" | "draft";
export type SortKey = "date" | "title" | "status" | "author";
export type SortDirection = "asc" | "desc";
export type ViewFilter = "all" | "active" | "trashed";

export interface Post {
  id: string;
  title: string;
  slug: string;
  content?: string;
  category: string;
  author: string;
  readingTime: number;
  tags?: string[];
  status: PostStatus;
  scheduledDate?: string;
  featuredImage?: string;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string[];
  trashed: boolean;
  createdAt?: string;
  updatedAt?: string;
  revisions?: PostRevision[];
  featured?: boolean;
}

export interface PostRevision {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  author: string;
}

export interface FilterState {
  search: string;
  sortKey: SortKey;
  sortDirection: SortDirection;
  statusFilter: string;
  tagFilter: string;
  authorFilter: string;
  viewFilter: ViewFilter;
  currentPage: number;
  postsPerPage: number;
}

export interface PostActions {
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onPermanentDelete?: (id: string) => void;
  onPublish?: (id: string) => void;
  onDuplicate?: (id: string) => void;
  onBulkPublish?: (ids: string[]) => void;
  onBulkSchedule?: (ids: string[], date: string) => void;
  onRestore?: (id: string) => void;
  onToggleFeatured?: (id: string, featured: boolean) => void;
}

export interface PostFilters {
  categories?: string[];
  filterCategory?: string;
  onFilterCategory?: (cat: string) => void;
  onExport?: () => void;
}
