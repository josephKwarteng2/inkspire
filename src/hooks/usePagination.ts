import React from "react";
import { useMemo } from "react";

export const usePagination = <T>(items: T[], itemsPerPage: number) => {
  const [page, setPage] = React.useState(1);

  const totalPages = Math.ceil(items.length / itemsPerPage) || 1;
  const paginatedItems = useMemo(
    () => items.slice((page - 1) * itemsPerPage, page * itemsPerPage),
    [items, page, itemsPerPage]
  );
  React.useEffect(() => {
    if (page > totalPages) setPage(1);
  }, [page, totalPages]);

  return { page, setPage, paginatedItems, totalPages };
};
