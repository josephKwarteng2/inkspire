import React from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";

interface CommentFiltersToolbarProps {
  filter: string;
  setFilter: (filter: string) => void;
  search: string;
  setSearch: (search: string) => void;
  commenter: string;
  setCommenter: (commenter: string) => void;
  postFilter: string;
  setPostFilter: (postId: string) => void;
  postOptions: { id: string; title: string }[];
  date: string;
  setDate: (date: string) => void;
  selectedCount: number;
  onBulkApprove: () => void;
  onBulkPending: () => void;
  onBulkSpam: () => void;
  onBulkDelete: () => void;
  onClearFilters: () => void;
  loading?: boolean;
}

const statusLabels: Record<string, string> = {
  all: "All",
  pending: "Pending",
  approved: "Approved",
  spam: "Spam",
};

const CommentFiltersToolbar: React.FC<CommentFiltersToolbarProps> = ({
  filter,
  setFilter,
  search,
  setSearch,
  commenter,
  setCommenter,
  postFilter,
  setPostFilter,
  postOptions,
  date,
  setDate,
  selectedCount,
  onBulkApprove,
  onBulkPending,
  onBulkSpam,
  onBulkDelete,
  onClearFilters,
  loading = false,
}) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = React.useState(false);
  const [showSpamConfirm, setShowSpamConfirm] = React.useState(false);

  const handleDelete = () => {
    setShowDeleteConfirm(false);
    onBulkDelete();
  };

  const handleSpam = () => {
    setShowSpamConfirm(false);
    onBulkSpam();
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-6 border-b border-border bg-muted/50">
      <div className="flex gap-2 flex-wrap items-center">
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="min-w-[120px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(statusLabels).map(([value, label]) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button variant="ghost" size="sm" onClick={onClearFilters}>
          Clear Filters
        </Button>
      </div>
      <div className="flex gap-2 flex-wrap items-center">
        <input
          type="text"
          placeholder="Search comments..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border rounded px-3 py-1 text-sm"
        />
        <input
          type="text"
          placeholder="Filter by commenter..."
          value={commenter}
          onChange={(e) => setCommenter(e.target.value)}
          className="border rounded px-3 py-1 text-sm"
        />
        <Select value={postFilter} onValueChange={setPostFilter}>
          <SelectTrigger className="min-w-[140px]">
            <SelectValue placeholder="All Posts" />
          </SelectTrigger>
          <SelectContent>
            {postOptions.map((p) => (
              <SelectItem key={p.id} value={p.id}>
                {p.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={
                "w-[160px] justify-start text-left font-normal" +
                (date ? "" : " text-muted-foreground")
              }
            >
              {date ? new Date(date).toLocaleDateString() : "Pick a date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent align="start" className="p-0">
            <Calendar
              mode="single"
              selected={date ? new Date(date) : undefined}
              onSelect={(selected) =>
                setDate(selected ? selected.toISOString().slice(0, 10) : "")
              }
              initialFocus
            />
          </PopoverContent>
        </Popover>
        {selectedCount > 0 && (
          <>
            <Button
              size="sm"
              variant="default"
              onClick={onBulkApprove}
              disabled={loading}
            >
              {loading ? <span className="animate-spin mr-2">⏳</span> : null}
              Approve Selected
            </Button>
            <Button
              size="sm"
              variant="secondary"
              onClick={onBulkPending}
              disabled={loading}
            >
              {loading ? <span className="animate-spin mr-2">⏳</span> : null}
              Mark Pending
            </Button>
            <Button
              size="sm"
              variant="destructive"
              onClick={() => setShowSpamConfirm(true)}
              disabled={loading}
            >
              {loading ? <span className="animate-spin mr-2">⏳</span> : null}
              Mark Spam
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setShowDeleteConfirm(true)}
              disabled={loading}
            >
              {loading ? <span className="animate-spin mr-2">⏳</span> : null}
              Delete Selected
            </Button>
            <span className="text-xs text-muted-foreground">
              {selectedCount} selected
            </span>

            {showSpamConfirm && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                <div className="bg-white rounded shadow-lg p-6 min-w-[300px]">
                  <div className="mb-4">
                    Are you sure you want to mark the selected comments as spam?
                  </div>
                  <div className="flex gap-2 justify-end">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setShowSpamConfirm(false)}
                      disabled={loading}
                    >
                      Cancel
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={handleSpam}
                      disabled={loading}
                    >
                      Yes, Mark Spam
                    </Button>
                  </div>
                </div>
              </div>
            )}
            {showDeleteConfirm && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                <div className="bg-white rounded shadow-lg p-6 min-w-[300px]">
                  <div className="mb-4">
                    Are you sure you want to delete the selected comments? This
                    action cannot be undone.
                  </div>
                  <div className="flex gap-2 justify-end">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setShowDeleteConfirm(false)}
                      disabled={loading}
                    >
                      Cancel
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={handleDelete}
                      disabled={loading}
                    >
                      Yes, Delete
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default CommentFiltersToolbar;
