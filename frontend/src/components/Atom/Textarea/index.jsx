import { Input as AntInput, Form, Tooltip } from "antd";
import Label from "../Label";
import { generateRequiredRules } from "@/utils/form/common";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import "./index.scss";
import { useTranslation } from "react-i18next";

export const Textarea = ({
  width = "100%",
  label,
  name,
  required = false,
  rules,
  validateFirst = true,
  allowClear = true,
  tooltipIcon,
  restField,
  ...rest
}) => {
  const { t } = useTranslation();
  return (
    <Form.Item
      name={name}
      rules={generateRequiredRules(required, rules, t)}
      className="m-0"
      validateFirst={validateFirst}
      {...restField}
    >
      <BaseTextarea
        style={{ width: width, height: 80 }}
        width={width}
        name={name}
        label={label}
        tooltipIcon={tooltipIcon}
        allowClear={allowClear}
        required={required}
        {...rest}
      />
    </Form.Item>
  );
};

export const BaseTextarea = ({
  value,
  onChange,
  required,
  label,
  name,
  width,
  defaultValue,
  onBlur,
  autoTrim = true,
  allowClear,
  tooltipIcon,
  ...rest
}) => {
  const hasValue = true;

  return (
    <Label
      name={name}
      label={
        <span style={{ display: "inline-flex", alignItems: "center" }}>
          {label}
          {tooltipIcon && (
            <Tooltip title={tooltipIcon}>
              <ExclamationCircleOutlined
                style={{ marginLeft: 6, color: "#faad14", cursor: "pointer" }}
              />
            </Tooltip>
          )}
        </span>
      }
      active={hasValue}
      required={required}
    >
      <AntInput.TextArea
        allowClear={allowClear}
        style={{ width: width || "100%", ...(rest?.style || {}) }}
        className="gt-input"
        rows={5}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        {...rest}
      />
    </Label>
  );
};
