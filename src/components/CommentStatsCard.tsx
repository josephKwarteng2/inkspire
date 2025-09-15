interface CommentStatsCardProps {
  title: string;
  count: number;
  icon: React.ReactNode;
  color: string;
}

export const CommentStatsCard: React.FC<CommentStatsCardProps> = ({
  title,
  count,
  icon,
  color,
}) => (
  <div className="bg-card rounded-xl border p-6 shadow-sm">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-muted-foreground">{title}</p>
        <p className={`text-2xl font-bold text-${color} mt-1`}>{count}</p>
      </div>
      <div className={`bg-${color}-100 p-3 rounded-full`}>{icon}</div>
    </div>
  </div>
);
