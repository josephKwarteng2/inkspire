import type { PostStatus } from "@/types/post";

interface StatusBadgeProps {
  status: PostStatus;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const statusConfig = {
    draft: { bg: "bg-gray-200", text: "text-gray-700", label: "Draft" },
    published: {
      bg: "bg-green-200",
      text: "text-green-800",
      label: "Published",
    },
    scheduled: {
      bg: "bg-yellow-200",
      text: "text-yellow-800",
      label: "Scheduled",
    },
  };

  const config = statusConfig[status];

  return (
    <div className="mb-2">
      <span
        className={`inline-block px-3 py-1 text-xs rounded ${config.bg} ${config.text}`}
      >
        {config.label}
      </span>
    </div>
  );
};
