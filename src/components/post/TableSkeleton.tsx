import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

const AdminPostsTableSkeleton: React.FC = () => (
  <div className="overflow-x-auto w-full">
    <table className="min-w-full divide-y divide-border">
      <thead>
        <tr className="bg-muted">
          <th className="w-12 py-4 min-w-12" />
          <th className="py-4 min-w-48" />
          <th className="py-4 min-w-20" />
          <th className="py-4 min-w-32" />
          <th className="py-4 min-w-28" />
          <th className="py-4 min-w-32" />
          <th className="py-4 min-w-28" />
          <th className="py-4 min-w-28" />
          <th className="py-4 min-w-24" />
          <th className="w-12 py-4 min-w-12" />
        </tr>
      </thead>
      <tbody>
        {[...Array(6)].map((_, i) => (
          <tr key={i} className="border-b border-border">
            <td className="px-2 py-3">
              <Skeleton className="h-4 w-4 mx-auto" />
            </td>
            <td className="px-2 py-3">
              <Skeleton className="h-4 w-40" />
            </td>
            <td className="px-2 py-3 text-center">
              <Skeleton className="h-4 w-8 mx-auto" />
            </td>
            <td className="px-2 py-3">
              <Skeleton className="h-4 w-24" />
            </td>
            <td className="px-2 py-3">
              <Skeleton className="h-4 w-16" />
            </td>
            <td className="px-2 py-3">
              <Skeleton className="h-4 w-24" />
            </td>
            <td className="px-2 py-3">
              <Skeleton className="h-4 w-16" />
            </td>
            <td className="px-2 py-3">
              <Skeleton className="h-4 w-16" />
            </td>
            <td className="px-2 py-3">
              <Skeleton className="h-4 w-16" />
            </td>
            <td className="px-2 py-3">
              <Skeleton className="h-4 w-8 mx-auto" />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default AdminPostsTableSkeleton;
