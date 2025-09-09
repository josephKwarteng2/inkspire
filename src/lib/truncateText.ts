// Utility to truncate text to a given length and add ellipsis if needed
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  // Try to cut at the last space before maxLength for better word breaks
  const truncated = text.slice(0, maxLength);
  const lastSpace = truncated.lastIndexOf(" ");
  return (lastSpace > 0 ? truncated.slice(0, lastSpace) : truncated) + "...";
}
