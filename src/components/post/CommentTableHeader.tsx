import React from "react";
import { TableHead, TableRow, TableHeader } from "@/components/ui/table";

interface CommentTableHeaderProps {
  selectAll: boolean;
  onSelectAll: (allIds: string[]) => void;
  allIds: string[];
}

const CommentTableHeader: React.FC<CommentTableHeaderProps> = ({
  selectAll,
  onSelectAll,
  allIds,
}) => {
  return (
    <TableHeader>
      <TableRow className="border-b border-border bg-muted">
        <TableHead className="w-12 py-4 min-w-12 bg-muted text-foreground">
          <input
            type="checkbox"
            checked={selectAll}
            onChange={() => onSelectAll(allIds)}
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 focus:ring-2"
          />
        </TableHead>
        <TableHead className="font-medium text-foreground py-4 min-w-48 bg-muted">
          Commenter
        </TableHead>
        <TableHead className="font-medium text-foreground py-4 min-w-32 bg-muted">
          Email
        </TableHead>
        <TableHead className="font-medium text-foreground py-4 min-w-48 bg-muted">
          Post Title
        </TableHead>
        <TableHead className="font-medium text-foreground py-4 min-w-28 bg-muted">
          Status
        </TableHead>
        <TableHead className="font-medium text-foreground py-4 min-w-32 bg-muted">
          Date
        </TableHead>
        <TableHead className="font-medium text-foreground py-4 min-w-64 bg-muted">
          Content
        </TableHead>
        <TableHead className="w-12 py-4 min-w-12 bg-muted">Actions</TableHead>
      </TableRow>
    </TableHeader>
  );
};

export default CommentTableHeader;
