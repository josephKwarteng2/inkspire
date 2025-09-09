import React from "react";
import { TableHead, TableRow, TableHeader } from "@/components/ui/table";

interface BlogTableHeaderProps {
  selectAll: boolean;
  onSelectAll: () => void;
}

const BlogTableHeader: React.FC<BlogTableHeaderProps> = ({
  selectAll,
  onSelectAll,
}) => {
  return (
    <TableHeader>
      <TableRow className="border-b border-border bg-muted">
        <TableHead className="w-12 py-4 min-w-12 bg-muted text-foreground">
          <input
            type="checkbox"
            checked={selectAll}
            onChange={onSelectAll}
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 focus:ring-2"
          />
        </TableHead>
        <TableHead className="font-medium text-foreground py-4 min-w-48 bg-muted">
          Title
        </TableHead>
        <TableHead className="font-medium text-foreground py-4 text-center min-w-20 bg-muted">
          Featured
        </TableHead>
        <TableHead className="font-medium text-foreground py-4 min-w-32 bg-muted">
          Slug
        </TableHead>
        <TableHead className="font-medium text-foreground py-4 min-w-28 bg-muted">
          Category
        </TableHead>
        <TableHead className="font-medium text-foreground py-4 min-w-32 bg-muted">
          Tags
        </TableHead>
        <TableHead className="font-medium text-foreground py-4 min-w-28 bg-muted">
          Author
        </TableHead>
        <TableHead className="font-medium text-foreground py-4 min-w-28 bg-muted">
          Status
        </TableHead>
        <TableHead className="font-medium text-foreground py-4 min-w-24 bg-muted">
          Created
        </TableHead>
        <TableHead className="w-12 py-4 min-w-12 bg-muted">Actions</TableHead>
      </TableRow>
    </TableHeader>
  );
};

export default BlogTableHeader;
