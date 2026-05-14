import { CaretDownOutlined, CloseOutlined } from "@ant-design/icons";
import { Spin } from "antd";
import classNames from "classnames";
import { debounce } from "lodash";
import React, { useEffect, useRef, useState } from "react";
import { Select } from "../Select";

export const InfiniteSelect = ({
  fetchData,
  fetchDataByValue,
  label,
  name,
  required,
  keySearch = "label",
  fieldNames = { label: "label", value: "value" },
  pageSize = 10,
  className,
  style,
  value,
  ...rest
}) => {
  const [options, setOptions] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const currentRequestId = useRef(0);

  const loadOptions = async (pageNum = 0, search = "") => {
    if (!fetchData) return;
    setLoading(true);
    const requestId = ++currentRequestId.current;

    try {
      const { data = [], hasMore = false } = await fetchData(pageNum, search);
      if (currentRequestId.current !== requestId) return;

      const arr = (prev) => {
        const combined = pageNum === 0 ? data : [...prev, ...data];

        const map = new Map();
        for (const item of combined) {
          const key = item[fieldNames.value];
          if (!map.has(key)) {
            map.set(key, item);
          }
        }
        return Array.from(map.values());
      };
      setOptions(arr);

      setHasMore(hasMore);
      setPage(pageNum);
    } catch (error) {
      console.error("Error in fetchData:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOptions(0, "");
  }, []);

  useEffect(() => {
    if (value === undefined || value === null) return;

    const currentValues = Array.isArray(value) ? value : [value];

    if (currentValues.length === 0) return;

    const existingIds = options.map((opt) => opt[fieldNames.value]);
    const missingIds = currentValues.filter((id) => !existingIds.includes(id));

    if (missingIds.length === 0) return;

    const loadMissing = async () => {
      try {
        let fetchedItems = [];

        if (fetchDataByValue) {
          const result = await Promise.all(
            missingIds.map((id) => fetchDataByValue(id))
          );
          fetchedItems = result.filter(Boolean);
        } else if (fetchData) {
          const { data = [] } = await fetchData(0, "");
          fetchedItems = data.filter((item) =>
            missingIds.includes(item[fieldNames.value])
          );
        }

        setOptions((prev) => {
          const combined = [...prev, ...fetchedItems];
          const seen = new Set();
          return combined.filter((item) => {
            const val = item[fieldNames.value];
            if (seen.has(val)) return false;
            seen.add(val);
            return true;
          });
        });
      } catch (error) {
        console.error("Error loading selected values:", error);
      }
    };

    loadMissing();
  }, [value]);

  const debouncedSearch = useRef(
    debounce((searchVal) => {
      loadOptions(0, searchVal);
    }, 300)
  ).current;

  const handleSearch = (val) => {
    setSearchTerm(val);
    setPage(0);
    debouncedSearch(val);
  };

  const handleClear = () => {
    setSearchTerm("");
    setPage(0);
    loadOptions(0, "");
  };

  const handleScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    if (!loading && hasMore && scrollTop + clientHeight >= scrollHeight - 10) {
      loadOptions(page + 1, searchTerm);
    }
  };

  const suffixIcon = loading ? (
    <Spin size="small" />
  ) : (
    <CaretDownOutlined style={{ fontSize: 18, pointerEvents: "none" }} />
  );

  return (
    <Select
      name={name}
      label={label}
      required={required}
      showSearch
      allowClear={{
        clearIcon: <CloseOutlined style={{ fontSize: 18 }} />,
      }}
      className={classNames("gt-select", className)}
      style={style}
      onSearch={handleSearch}
      onPopupScroll={handleScroll}
      onClear={handleClear}
      suffixIcon={suffixIcon}
      options={options}
      filterOption={false}
      fieldNames={fieldNames}
      value={value}
      {...rest}
    />
  );
};
