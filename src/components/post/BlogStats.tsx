import React from "react";

interface BlogStatsProps {
  counts: {
    total: number;
    published: number;
    scheduled: number;
    draft: number;
    trashed: number;
  };
  role: string;
}

const BlogStats: React.FC<BlogStatsProps> = ({ counts, role }) => {
  if (role !== "admin") return null;

  return (
    <div className="flex flex-wrap gap-4 p-4 border-b border-border bg-muted/50">
      <div className="flex flex-col items-center min-w-[80px]">
        <span className="font-bold text-lg">{counts.total}</span>
        <span className="text-xs text-muted-foreground">Total</span>
      </div>
      <div className="flex flex-col items-center min-w-[80px]">
        <span className="font-bold text-lg">{counts.published}</span>
        <span className="text-xs text-muted-foreground">Published</span>
      </div>
      <div className="flex flex-col items-center min-w-[80px]">
        <span className="font-bold text-lg">{counts.scheduled}</span>
        <span className="text-xs text-muted-foreground">Scheduled</span>
      </div>
      <div className="flex flex-col items-center min-w-[80px]">
        <span className="font-bold text-lg">{counts.draft}</span>
        <span className="text-xs text-muted-foreground">Drafts</span>
      </div>
      <div className="flex flex-col items-center min-w-[80px]">
        <span className="font-bold text-lg">{counts.trashed}</span>
        <span className="text-xs text-muted-foreground">Trashed</span>
      </div>
    </div>
  );
};

export default BlogStats;
