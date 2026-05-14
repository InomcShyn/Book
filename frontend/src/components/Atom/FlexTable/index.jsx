import React, { useEffect, useMemo, useState } from "react";
import {
  Table as AntTable,
  Checkbox,
  ConfigProvider,
  Tooltip,
  Popover,
} from "antd";
import { SettingOutlined } from "@ant-design/icons";
import _ from "lodash";
import "./index.scss";
import { useTranslation } from "react-i18next";
import { formatNumber } from "@/utils/formatters";

export const FlexTable = ({
  onChange,
  columns = [],
  pagination,
  className = "",
  isSetSizeNo = true,
  total = 0,
  isChangeColumns,
  hideSettingsColumn = false,
  disableSortIcons = false,
  ...rest
}) => {
  const { t } = useTranslation();
  const defaultCheckedList = columns
    .filter(
      (item) =>
        !item.hiddenColumns && item.key !== "no" && item.key !== "action"
    )
    .map((item) => item.key);
  const [checkedList, setCheckedList] = useState(defaultCheckedList);

  const options = columns
    .filter((item) => item.key !== "no" && item.key !== "action")
    .map(({ key, title }) => ({
      label: title,
      value: key,
    }));

  const visibleColumns = columns.filter(
    (item) =>
      item.key === "no" ||
      item.key === "action" ||
      checkedList.includes(item.key)
  );

  const checkboxContent = (
    <Checkbox.Group
      value={checkedList}
      onChange={(value) => setCheckedList(value)}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: 8,
          maxHeight: 200,
          overflowY: "auto",
        }}
      >
        {options.map(({ label, value }) => (
          <Checkbox key={value} value={value}>
            {label}
          </Checkbox>
        ))}
      </div>
    </Checkbox.Group>
  );

  const settingsColumn = {
    key: "settings",
    fixed: "right",
    width: 50,
    render: () => null,
    align: "right",
    title: (
      <Popover
        content={checkboxContent}
        trigger="click"
        placement="bottomRight"
      >
        <SettingOutlined style={{ cursor: "pointer", fontSize: 16 }} />
      </Popover>
    ),
  };

  const currentColumns = useMemo(() => {
    const processColumns = (cols) =>
      cols.map((item) => {
        if (item.children && item.children.length > 0) {
          return {
            ...item,
            children: processColumns(item.children),
            sorter: false,
            render: undefined,
          };
        }

        let columnWidth = item.width;
        if (item.dataIndex === "no" && isSetSizeNo) {
          columnWidth = item.width || 75;
        }

        const renderContent = (text, record) => {
          const content = item.render ? item.render(text, record) : text;
          const displayContent =
            content === null || content === undefined || content === ""
              ? "-"
              : content;

          const cellContent = (
            <div
              style={{
                textAlign: item.align,
                whiteSpace: "normal",
                wordBreak: "break-word",
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {displayContent}
            </div>
          );

          return item.showTooltip ? (
            <Tooltip
              title={
                typeof text === "object" ? JSON.stringify(text) : String(text)
              }
            >
              {cellContent}
            </Tooltip>
          ) : (
            cellContent
          );
        };

        const isCenterColumn = item.key === "no" || item.key === "action";
        return {
          ...item,
          width: columnWidth,
          align: isCenterColumn ? "center" : "left",
          ellipsis: true,
          sorter:
            disableSortIcons || item.key === "no" || item.key === "action"
              ? false
              : true,
          title: (
            <Tooltip title={item.title}>
              <div
                style={{
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "normal",
                  wordBreak: "break-word",
                  textAlign: "center",
                }}
              >
                {item.title}
              </div>
            </Tooltip>
          ),
          render: renderContent,
        };
      });

    if (_.isEmpty(visibleColumns))
      return hideSettingsColumn ? [] : [settingsColumn];

    const processed = processColumns(visibleColumns);

    return hideSettingsColumn ? processed : [...processed, settingsColumn];
  }, [
    visibleColumns,
    isSetSizeNo,
    checkedList,
    disableSortIcons,
    hideSettingsColumn,
  ]);

  const handlerChangePagination = (page, size) => {
    if (pagination && pagination.onChange) {
      if (size !== pagination.pageSize) {
        pagination.onChange(0, size);
      } else {
        pagination.onChange(page - 1, size);
      }
    }
  };

  useEffect(() => {
    const defaultCheckedList = columns
      .filter((item) => !item.hiddenColumns)
      .map((item) => item.key);

    setCheckedList(defaultCheckedList);
  }, [isChangeColumns]);

  return (
    <ConfigProvider
      locale={{
        Pagination: {
          items_per_page: t("pagination.items_per_page"),
          jump_to: t("pagination.jump_to"),
          page: t("pagination.page"),
          prev_page: t("pagination.prev_page"),
          next_page: t("pagination.next_page"),
        },
        Table: {
          emptyText: t("common.no_data"),
        },
      }}
    >
      <AntTable
        rowKey="id"
        size="small"
        className={`${className} container-table`}
        sticky
        columns={currentColumns}
        {...rest}
        onChange={onChange}
        locale={{
          emptyText: t("table.noData"),
        }}
        bordered
        pagination={
          pagination && {
            showTotal: (total, range) =>
              `${t("pagination.total")} ${formatNumber(total)}`,
            showSizeChanger: true,
            ...pagination,
            current: (pagination.current || 0) + 1,
            onChange: handlerChangePagination,
            showQuickJumper: true,
          }
        }
      />
    </ConfigProvider>
  );
};
