import { useCallback } from "react";

export const useSortTable = (setQuery, dataSource = []) => {
  return useCallback(
    (pagination, filters, sorter) => {
      setQuery((prev) => {
        const next = { ...prev };

        delete next.lastId;
        delete next.lastPrimaryValue;

        const sortField = sorter?.field || sorter?.columnKey;

        /* ===== SORT ===== */
        if (sortField && sorter?.order) {
          const direction =
            sorter.order === "ascend" ? "asc" : "desc";

          next.sort = `${sortField},${direction}`;

          /* ===== LAST RECORD (CHỈ KHI SORT) ===== */
          if (dataSource?.length) {
            const lastRow = dataSource.at(-1);
            next.lastId = lastRow.id;
            next.lastPrimaryValue =
              lastRow?.[sortField] ?? null;
          }
        } else {
          delete next.sort;
        }

        return next;
      });
    },
    [setQuery, dataSource],
  );
};
