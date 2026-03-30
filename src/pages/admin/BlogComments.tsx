import React from "react";
import { toast } from "sonner";
import CommentTable from "@/components/post/CommentTable";
import CommentFiltersToolbar from "@/components/post/CommentFiltersToolbar";
import { CommentStatsCard } from "@/components/CommentStatsCard";
import { Button } from "@/components/ui/button";
import { useComments } from "@/hooks/useComments";
import { useCommentFilters } from "@/hooks/useCommentFilters";
import { useSelection } from "@/hooks/useSelection";
import type { CommentStatus } from "@/types/comment";
import { usePagination } from "@/hooks/usePagination";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

const ApprovedIcon = () => (
  <svg
    className="w-5 h-5 text-green-600"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M5 13l4 4L19 7"
    />
  </svg>
);

const PendingIcon = () => (
  <svg
    className="w-5 h-5 text-amber-600"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);

const SpamIcon = () => (
  <svg
    className="w-5 h-5 text-rose-600"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M6 18L18 6M6 6l12 12"
    />
  </svg>
);

const TotalIcon = () => (
  <svg
    className="w-5 h-5 text-blue-600"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
    />
  </svg>
);

const BlogComments: React.FC = () => {
  const {
    comments,
    posts,
    loading,
    setLoading,
    handleStatus,
    handleDelete,
    handleEditContent,
  } = useComments();
  const {
    filter,
    setFilter,
    search,
    setSearch,
    commenter,
    setCommenter,
    postFilter,
    setPostFilter,
    date,
    setDate,
    filteredComments,
    clearFilters,
  } = useCommentFilters(comments);

  const { selected, handleSelect, handleSelectAll, clearSelection } =
    useSelection();
  const [commentsPerPage, setCommentsPerPage] = React.useState(10);
  const {
    page,
    setPage,
    paginatedItems: paginatedComments,
    totalPages,
  } = usePagination(filteredComments, commentsPerPage);

  const approvedCount = comments.filter((c) => c.status === "approved").length;
  const pendingCount = comments.filter((c) => c.status === "pending").length;
  const spamCount = comments.filter((c) => c.status === "spam").length;
  const totalCount = comments.length;

  const stats = [
    {
      title: "Approved",
      count: approvedCount,
      icon: <ApprovedIcon />,
      color: "green",
    },
    {
      title: "Pending",
      count: pendingCount,
      icon: <PendingIcon />,
      color: "amber",
    },
    { title: "Spam", count: spamCount, icon: <SpamIcon />, color: "rose" },
    { title: "Total", count: totalCount, icon: <TotalIcon />, color: "blue" },
  ];

  const handleBulkAction = async (
    action: "approve" | "pending" | "spam" | "delete"
  ) => {
    setLoading();
    try {
      await Promise.all(
        Array.from(selected).map(async (id) => {
          if (action === "delete") {
            handleDelete(id);
          } else {
            handleStatus(id, action as CommentStatus);
          }
        })
      );

      clearSelection();

      const actionLabels = {
        approve: "approved",
        pending: "marked as pending",
        spam: "marked as spam",
        delete: "deleted",
      };

      toast.success(`Selected comments have been ${actionLabels[action]}.`);
    } catch {
      toast.error("An error occurred while processing bulk action.");
    } finally {
      setLoading();
    }
  };

  return (
    <div className="w-full max-w-full space-y-6">
      <h1 className="text-3xl font-bold mb-2 logo-inkspire">
        Comments Moderation
      </h1>
      <p className="text-sm text-muted-foreground mb-2">
        Review, approve, or remove comments from your blog posts.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((stat) => (
          <CommentStatsCard key={stat.title} {...stat} />
        ))}
      </div>

      <div className="flex flex-col gap-3 sm:gap-4">
        <CommentFiltersToolbar
          filter={filter}
          setFilter={(filter: string) =>
            setFilter(filter as CommentStatus | "all")
          }
          search={search}
          setSearch={setSearch}
          commenter={commenter}
          setCommenter={setCommenter}
          postFilter={postFilter}
          setPostFilter={setPostFilter}
          postOptions={posts}
          date={date}
          setDate={setDate}
          selectedCount={selected.size}
          onBulkApprove={() => handleBulkAction("approve")}
          onBulkPending={() => handleBulkAction("pending")}
          onBulkSpam={() => handleBulkAction("spam")}
          onBulkDelete={() => handleBulkAction("delete")}
          loading={loading}
          onClearFilters={clearFilters}
        />
      </div>

      <div className="bg-card rounded-xl border shadow-sm overflow-x-auto">
        <CommentTable
          comments={paginatedComments}
          posts={posts}
          selectedComments={selected}
          selectAll={
            selected.size === filteredComments.length &&
            filteredComments.length > 0
          }
          onSelectAll={(allIds) => handleSelectAll(allIds)}
          onSelect={handleSelect}
          onApprove={(id) => handleStatus(id, "approved")}
          onPending={(id) => handleStatus(id, "pending")}
          onSpam={(id) => handleStatus(id, "spam")}
          onDelete={handleDelete}
          onEditContent={handleEditContent}
          onEditStatus={handleStatus}
        />
      </div>

      {filteredComments.length > 0 && (
        <div className="flex justify-center items-center gap-2 mt-4">
          <Button
            size="sm"
            variant="outline"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            Previous
          </Button>
          <span className="text-sm text-muted-foreground">
            Page {page} of {totalPages}
          </span>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
          >
            Next
          </Button>
          <Select
            value={String(commentsPerPage)}
            onValueChange={(val) => {
              setCommentsPerPage(Number(val));
              setPage(1);
            }}
          >
            <SelectTrigger className="ml-4 w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {[10, 20, 50].map((n) => (
                <SelectItem key={n} value={String(n)}>
                  {n} per page
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
    </div>
  );
};

export default BlogComments;
