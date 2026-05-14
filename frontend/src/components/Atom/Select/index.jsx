import {
  CaretDownOutlined,
  CloseOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import { Select as AntSelect, Form } from "antd";
import classNames from "classnames";
import Label from "../Label";
import { generateRequiredRules } from "@/utils/form/common";
import React from "react";
import "./index.scss";
import { useTranslation } from "react-i18next";

export const Select = ({
  width = "100%",
  keySearch = "label",
  label,
  name,
  required = false,
  rules,
  initialValue,
  validateTrigger,
  validateDebounce,
  validateFirst = true,
  dependencies,
  restField,
  onChange,
  ...rest
}) => {
  const { t } = useTranslation();
  return (
    <Form.Item
      name={name}
      rules={generateRequiredRules(required, rules, t)}
      className="m-0"
      initialValue={initialValue}
      validateTrigger={validateTrigger}
      validateDebounce={validateDebounce}
      validateFirst={validateFirst}
      dependencies={dependencies}
      {...restField}
    >
      <BaseSelect
        value={undefined}
        onChange={onChange}
        width={undefined}
        defaultValue={undefined}
        onClear={undefined}
        className={undefined}
        style={{ width }}
        name={name}
        label={label}
        keySearch={keySearch}
        required={required}
        {...rest}
      />
    </Form.Item>
  );
};

export const BaseSelect = ({
  value,
  onChange,
  required,
  label,
  keySearch = "label",
  name,
  width,
  clearIconSize = 18,
  defaultValue,
  onClear,
  className,
  options = [],
  isAllOption = false,
  fieldNames = {
    label: "label",
    value: "value",
  },
  ...rest
}) => {
  const { t } = useTranslation();
  const isMultipleMode = rest.mode === "multiple";
  const maxTagCount = isMultipleMode ? "responsive" : undefined;

  const hasValue = true;

  const suffixIcon = rest.loading ? (
    <LoadingOutlined style={{ fontSize: clearIconSize }} />
  ) : (
    <CaretDownOutlined
      aria-label="down"
      className="anticon-down ant-select-suffix"
      style={{ fontSize: clearIconSize }}
    />
  );

  const allOption = {
    [fieldNames.label]: t("categoryData.all"),
    [fieldNames.value]: null,
  };

  const realOptions = isMultipleMode
    ? [...(isAllOption ? [allOption, ...options] : options)]
    : isAllOption
    ? [allOption, ...options]
    : options;

  return (
    <Label name={`${name}`} label={label} active={hasValue} required={required}>
      <AntSelect
        style={{ width }}
        className={classNames("gt-select", className)}
        optionFilterProp={keySearch}
        filterOption={(input, option) => {
          const optionValue = String(option?.[keySearch] ?? "").toLowerCase();
          return optionValue.includes(input.trim().toLowerCase());
        }}
        allowClear={{
          clearIcon: <CloseOutlined style={{ fontSize: clearIconSize }} />,
        }}
        notFoundContent={
          <p style={{ textAlign: "center", padding: 20 }}>
            {t("table.noData")}
          </p>
        }
        suffixIcon={suffixIcon}
        value={value}
        onChange={onChange}
        onClear={onClear}
        maxTagCount={maxTagCount}
        defaultValue={defaultValue}
        fieldNames={fieldNames}
        {...rest}
        showSearch
        options={realOptions}
      />
    </Label>
  );
};
