import React from "react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from "@/components/ui/dropdown-menu";
import { Filter, Download, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface BlogFiltersToolbarProps {
  viewFilter?: "all" | "active" | "trashed";
  onViewFilter?: (view: "all" | "active" | "trashed") => void;
  authorFilter: string;
  setAuthorFilter: (filter: string) => void;
  uniqueAuthors: string[];
  sortKey: "date" | "title" | "status" | "author";
  setSortKey: (key: "date" | "title" | "status" | "author") => void;
  sortDirection: "asc" | "desc";
  setSortDirection: (direction: "asc" | "desc") => void;
  selectedPostsCount: number;
  onBulkDelete: () => void;
  onBulkPublish: () => void;
  onShowScheduleModal: () => void;
  categories: string[];
  filterCategory?: string;
  onFilterCategory?: (cat: string) => void;
  statusFilter?: string;
  onStatusFilter?: (status: string) => void;
  tagFilter?: string;
  onTagFilter?: (tag: string) => void;
  uniqueTags?: string[];
  onExport?: () => void;
  search: string;
  setSearch: (search: string) => void;
  disabled?: boolean;
}

const BlogFiltersToolbar: React.FC<BlogFiltersToolbarProps> = ({
  viewFilter,
  onViewFilter,
  authorFilter,
  setAuthorFilter,
  uniqueAuthors,
  sortKey,
  setSortKey,
  sortDirection,
  setSortDirection,
  selectedPostsCount,
  onBulkDelete,
  onBulkPublish,
  onShowScheduleModal,
  categories,
  filterCategory,
  onFilterCategory,
  statusFilter,
  onStatusFilter,
  tagFilter,
  onTagFilter,
  uniqueTags,
  onExport,
  search,
  setSearch,
  disabled = false,
}) => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
      <div className="flex flex-1 items-center gap-3 flex-wrap">
        <div className="flex items-center gap-2">
          <Select
            value={sortKey}
            onValueChange={(v) =>
              setSortKey(v as "date" | "title" | "status" | "author")
            }
            disabled={disabled}
          >
            <SelectTrigger className="min-w-[100px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="date">Date</SelectItem>
              <SelectItem value="title">Title</SelectItem>
              <SelectItem value="status">Status</SelectItem>
              <SelectItem value="author">Author</SelectItem>
            </SelectContent>
          </Select>
          <button
            type="button"
            aria-label="Toggle sort direction"
            className="ml-1 text-xs px-2 py-1 border rounded"
            onClick={() =>
              setSortDirection(sortDirection === "asc" ? "desc" : "asc")
            }
            disabled={disabled}
          >
            {sortDirection === "asc" ? "↑" : "↓"}
          </button>
        </div>
        {selectedPostsCount > 0 && (
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={onBulkDelete}
              className="text-destructive border-destructive hover:bg-destructive/10"
            >
              Delete ({selectedPostsCount})
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onBulkPublish}
              className="text-green-700 border-green-700 hover:bg-green-100"
            >
              Publish ({selectedPostsCount})
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onShowScheduleModal}
              className="text-blue-700 border-blue-700 hover:bg-blue-100"
            >
              Schedule ({selectedPostsCount})
            </Button>
          </>
        )}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="gap-2"
              disabled={disabled}
            >
              <Filter className="h-4 w-4" />
              Filters
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <div className="flex flex-col gap-2 p-2 min-w-[220px]">
              <label className="text-xs font-medium">Show:</label>
              <Select
                value={viewFilter || "active"}
                onValueChange={(v) =>
                  onViewFilter &&
                  onViewFilter(v as "all" | "active" | "trashed")
                }
                disabled={disabled}
              >
                <SelectTrigger className="min-w-[160px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="trashed">Trashed</SelectItem>
                </SelectContent>
              </Select>
              <label className="text-xs font-medium mt-2">Status:</label>
              <Select
                value={statusFilter === "" ? "all" : statusFilter}
                onValueChange={(v) =>
                  onStatusFilter && onStatusFilter(v === "all" ? "" : v)
                }
                disabled={disabled}
              >
                <SelectTrigger className="min-w-[160px]">
                  <SelectValue placeholder="All statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All statuses</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                  <SelectItem value="scheduled">Scheduled</SelectItem>
                </SelectContent>
              </Select>
              <label className="text-xs font-medium mt-2">Tag:</label>
              <Select
                value={tagFilter === "" ? "all" : tagFilter}
                onValueChange={(v) =>
                  onTagFilter && onTagFilter(v === "all" ? "" : v)
                }
                disabled={disabled}
              >
                <SelectTrigger className="min-w-[160px]">
                  <SelectValue placeholder="All tags" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All tags</SelectItem>
                  {uniqueTags &&
                    uniqueTags.map((tag) => (
                      <SelectItem key={tag} value={tag}>
                        {tag}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
              <label className="text-xs font-medium mt-2">Author:</label>
              <Select
                value={authorFilter === "" ? "all" : authorFilter}
                onValueChange={(v) => setAuthorFilter(v === "all" ? "" : v)}
                disabled={disabled}
              >
                <SelectTrigger className="min-w-[160px]">
                  <SelectValue placeholder="All authors" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All authors</SelectItem>
                  {uniqueAuthors.map((author) => (
                    <SelectItem key={author} value={author}>
                      {author}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {categories.length > 0 && onFilterCategory && (
                <>
                  <label className="text-xs font-medium mt-2">Category:</label>
                  <Select
                    value={filterCategory === "" ? "all" : filterCategory}
                    onValueChange={(v) =>
                      onFilterCategory && onFilterCategory(v === "all" ? "" : v)
                    }
                    disabled={disabled}
                  >
                    <SelectTrigger className="min-w-[160px]">
                      <SelectValue placeholder="All categories" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All categories</SelectItem>
                      {categories.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </>
              )}
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
        {onExport && (
          <Button
            variant="outline"
            size="sm"
            onClick={onExport}
            className="gap-2"
          >
            <Download className="h-4 w-4" />
            Export
          </Button>
        )}
        <Button
          size="sm"
          onClick={() => navigate("/admin/posts/new")}
          className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
        >
          <Plus className="h-4 w-4" />
          Add new post
        </Button>
      </div>
      <div className="w-full sm:w-64">
        <input
          type="text"
          className="w-full border rounded px-3 py-2 text-sm"
          placeholder="Search by title, author, or tag..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          disabled={disabled}
        />
      </div>
    </div>
  );
};

export default BlogFiltersToolbar;
