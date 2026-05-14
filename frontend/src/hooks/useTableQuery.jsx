import { useCallback } from "react";

export const useTableOnChange = (setQuery) => {
  const handleTableChange = useCallback(
    (pagination, filters, sorter) => {
      setQuery((prev) => {
        let next = { ...prev };
        if (sorter && sorter.field && sorter.order) {
          const direction = sorter.order === "ascend" ? "asc" : "desc";
          next.sort = `${sorter.field},${direction}`;
        } else {
          delete next.sort;
        }
        return next;
      });
    },
    [setQuery]
  );

  return handleTableChange;
};
