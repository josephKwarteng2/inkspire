import React, { useRef, useEffect, useMemo, useCallback } from "react";
import { useUserRole } from "@/context/UserRoleContext";
import type {
  Post,
  PostActions,
  PostFilters,
  SortKey,
  SortDirection,
  ViewFilter,
} from "@/types/post";
import { useFilterReducer } from "@/hooks/useFilterReducer";
import { usePostFilters } from "@/hooks/usePostFilters";
import { usePostSelection } from "@/hooks/usePostSelection";
import {
  getPostCounts,
  getUniqueAuthors,
  getUniqueTags,
} from "@/utils/postUtils";
import PostStats from "./BlogStats";
import PostFiltersToolbar from "./BlogFiltersToolbar";
import BulkActionDialogs from "./BulkActionDialogs";
import PostTable from "./BlogTable";
import PostPagination from "./BlogPagination";
import PostPreview from "./BlogPreview";
import PostHistoryDialog from "./BlogHistoryDialog";
import EmptyPostsLottie from "./EmptyPostsLottie";
import { ErrorBoundary } from "./ErrorBoundary";

interface PostListProps extends PostActions, PostFilters {
  posts: Post[];
}

const BlogList: React.FC<PostListProps> = ({
  posts,
  onEdit,
  onDelete,
  onPermanentDelete,
  onPublish,
  onDuplicate,
  onBulkPublish,
  onBulkSchedule,
  onRestore,
  categories = [],
  filterCategory,
  onFilterCategory,
  onExport,
  onToggleFeatured,
}) => {
  const { role } = useUserRole();
  const tableScrollRef = useRef<HTMLDivElement>(null);
  const [scrolledX, setScrolledX] = React.useState(false);

  const [filters, dispatch] = useFilterReducer();
  const { paginatedPosts } = usePostFilters(posts, filters);
  const {
    selectedPosts,
    selectAll,
    handleSelectAll,
    handleSelectPost,
    clearSelection,
  } = usePostSelection();

  useEffect(() => {
    const elementRef = tableScrollRef.current;
    if (!elementRef) return;

    const handleScroll = () => {
      setScrolledX(elementRef.scrollLeft > 0);
    };

    elementRef.addEventListener("scroll", handleScroll);
    return () => elementRef.removeEventListener("scroll", handleScroll);
  }, []);

  React.useEffect(() => {
    clearSelection();
  }, [
    filters.search,
    filters.sortKey,
    filters.sortDirection,
    filters.authorFilter,
    filterCategory,
    filters.currentPage,
    filters.postsPerPage,
    clearSelection,
  ]);

  const [showDeleteDialog, setShowDeleteDialog] = React.useState(false);
  const [showPublishDialog, setShowPublishDialog] = React.useState(false);
  const [showScheduleModal, setShowScheduleModal] = React.useState(false);
  const [showScheduleConfirm, setShowScheduleConfirm] = React.useState(false);
  const [scheduleDate, setScheduleDate] = React.useState("");
  const [previewPost, setPreviewPost] = React.useState<Post | null>(null);
  const [historyPost, setHistoryPost] = React.useState<Post | null>(null);

  const postCounts = useMemo(() => getPostCounts(posts), [posts]);
  const uniqueAuthors = useMemo(() => getUniqueAuthors(posts), [posts]);
  const uniqueTags = useMemo(() => getUniqueTags(posts), [posts]);
  const totalPages = Math.ceil(posts.length / filters.postsPerPage);

  const handleSearchChange = useCallback(
    (search: string) => {
      dispatch({ type: "SET_SEARCH", payload: search });
    },
    [dispatch]
  );

  const handleSortKeyChange = useCallback(
    (sortKey: SortKey) => {
      dispatch({ type: "SET_SORT_KEY", payload: sortKey });
    },
    [dispatch]
  );

  const handleSortDirectionChange = useCallback(
    (sortDirection: SortDirection) => {
      dispatch({ type: "SET_SORT_DIRECTION", payload: sortDirection });
    },
    [dispatch]
  );

  const handleAuthorFilterChange = useCallback(
    (authorFilter: string) => {
      dispatch({ type: "SET_AUTHOR_FILTER", payload: authorFilter });
    },
    [dispatch]
  );

  const handleViewFilterChange = useCallback(
    (viewFilter: ViewFilter) => {
      dispatch({ type: "SET_VIEW_FILTER", payload: viewFilter });
    },
    [dispatch]
  );

  const handleStatusFilterChange = useCallback(
    (statusFilter: string) => {
      dispatch({ type: "SET_STATUS_FILTER", payload: statusFilter });
    },
    [dispatch]
  );

  const handleTagFilterChange = useCallback(
    (tagFilter: string) => {
      dispatch({ type: "SET_TAG_FILTER", payload: tagFilter });
    },
    [dispatch]
  );

  const handleBulkDelete = () => setShowDeleteDialog(true);
  const handleBulkPublish = () => setShowPublishDialog(true);

  const confirmBulkDelete = () => {
    selectedPosts.forEach((postId) => onDelete(postId));
    clearSelection();
    setShowDeleteDialog(false);
  };

  const confirmBulkPublish = () => {
    if (onBulkPublish) onBulkPublish(Array.from(selectedPosts));
    clearSelection();
    setShowPublishDialog(false);
  };

  const confirmBulkSchedule = () => {
    if (onBulkSchedule && scheduleDate) {
      onBulkSchedule(Array.from(selectedPosts), scheduleDate);
    }
    setShowScheduleConfirm(false);
    setShowScheduleModal(false);
    clearSelection();
    setScheduleDate("");
  };

  const handleDeleteWithConfirm = (id: string) => {
    if (role !== "admin") return;
    if (
      window.confirm(
        "Are you sure you want to delete this post? This action cannot be undone."
      )
    ) {
      onDelete(id);
    }
  };

  const handlePublishWithConfirm = (id: string) => {
    if (role !== "admin") return;
    if (window.confirm("Are you sure you want to publish this post?")) {
      if (onPublish) onPublish(id);
    }
  };

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    dispatch({ type: "SET_CURRENT_PAGE", payload: page });
  };

  const handlePostsPerPageChange = (count: number) => {
    dispatch({ type: "SET_POSTS_PER_PAGE", payload: count });
  };

  return (
    <ErrorBoundary>
      <div className="w-full rounded-lg border bg-card shadow-sm text-card-foreground">
        <PostStats counts={postCounts} role={role} />

        <div className="p-6 border-b border-border">
          <PostFiltersToolbar
            search={filters.search}
            setSearch={handleSearchChange}
            sortKey={filters.sortKey}
            setSortKey={handleSortKeyChange}
            sortDirection={filters.sortDirection}
            setSortDirection={handleSortDirectionChange}
            authorFilter={filters.authorFilter}
            setAuthorFilter={handleAuthorFilterChange}
            viewFilter={filters.viewFilter}
            onViewFilter={handleViewFilterChange}
            statusFilter={filters.statusFilter}
            onStatusFilter={handleStatusFilterChange}
            tagFilter={filters.tagFilter}
            onTagFilter={handleTagFilterChange}
            selectedPostsCount={selectedPosts.size}
            onBulkDelete={handleBulkDelete}
            onBulkPublish={handleBulkPublish}
            onShowScheduleModal={() => setShowScheduleModal(true)}
            categories={categories}
            filterCategory={filterCategory}
            onFilterCategory={onFilterCategory}
            uniqueTags={uniqueTags}
            onExport={onExport}
            uniqueAuthors={uniqueAuthors}
            disabled={posts.length === 0}
          />

          <BulkActionDialogs
            selectedPostsCount={selectedPosts.size}
            showDeleteDialog={showDeleteDialog}
            setShowDeleteDialog={setShowDeleteDialog}
            onConfirmBulkDelete={confirmBulkDelete}
            showPublishDialog={showPublishDialog}
            setShowPublishDialog={setShowPublishDialog}
            onConfirmBulkPublish={confirmBulkPublish}
            showScheduleModal={showScheduleModal}
            setShowScheduleModal={setShowScheduleModal}
            showScheduleConfirm={showScheduleConfirm}
            setShowScheduleConfirm={setShowScheduleConfirm}
            scheduleDate={scheduleDate}
            setScheduleDate={setScheduleDate}
            onConfirmBulkSchedule={confirmBulkSchedule}
          />
        </div>

        <div className="w-full">
          {paginatedPosts.length === 0 ? (
            <div className="text-center py-12">
              <EmptyPostsLottie className="mx-auto w-55 h-55" />
            </div>
          ) : (
            <div
              ref={tableScrollRef}
              className={`table-scroll-x w-full${
                scrolledX ? " scrolled-x" : ""
              }`}
            >
              <PostTable
                posts={paginatedPosts}
                selectedPosts={selectedPosts}
                selectAll={selectAll}
                onSelectAll={() => handleSelectAll(paginatedPosts)}
                onSelect={handleSelectPost}
                role={role}
                onEdit={onEdit}
                onDelete={handleDeleteWithConfirm}
                onPermanentDelete={onPermanentDelete}
                onRestore={onRestore}
                onPreview={setPreviewPost}
                onViewHistory={setHistoryPost}
                onPublish={handlePublishWithConfirm}
                onDuplicate={onDuplicate}
                onToggleFeatured={onToggleFeatured}
                viewFilter={filters.viewFilter}
              />
            </div>
          )}
        </div>

        <PostPagination
          currentPage={filters.currentPage}
          totalPages={totalPages}
          postsPerPage={filters.postsPerPage}
          onPageChange={handlePageChange}
          onPostsPerPageChange={handlePostsPerPageChange}
          totalPosts={posts.length}
        />

        <PostPreview
          post={previewPost}
          open={!!previewPost}
          onClose={() => setPreviewPost(null)}
        />

        <PostHistoryDialog
          post={historyPost}
          onClose={() => setHistoryPost(null)}
          onRevert={(revisionId) => {
            // Revision handling logic
          }}
        />
      </div>
    </ErrorBoundary>
  );
};

export default BlogList;
