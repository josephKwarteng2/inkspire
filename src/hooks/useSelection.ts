import { useState } from "react";

export const useSelection = () => {
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const handleSelect = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleSelectAll = (allIds: string[] = []) => {
    setSelected((prev) =>
      prev.size === allIds.length ? new Set() : new Set(allIds)
    );
  };

  const clearSelection = () => setSelected(new Set());

  return { selected, handleSelect, handleSelectAll, clearSelection };
};
