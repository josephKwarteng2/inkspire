interface ErrorDisplayProps {
  error: string;
}

export const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ error }) => (
  <div className="bg-destructive/10 border border-destructive text-destructive rounded px-3 py-2 text-sm mb-2">
    {error}
  </div>
);
