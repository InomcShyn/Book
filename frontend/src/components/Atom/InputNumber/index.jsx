import { CloseOutlined } from "@ant-design/icons";
import { InputNumber as AntInputNumber, Form } from "antd";
import groupClassNames from "classnames";
import Label from "../Label";
import { generateRequiredRules, toCapitalize } from "@/utils/form/common";
import "./index.scss";
import { useTranslation } from "react-i18next";

export const InputNumber = ({
  width = "100%",
  label,
  name,
  required = false,
  clearIconSize = 18,
  rules,
  initialValue,
  validateFirst = true,
  dependencies,
  restField,
  ...rest
}) => {
  const { t } = useTranslation();
  return (
    <Form.Item
      name={name}
      rules={generateRequiredRules(required, rules, t)}
      className="m-0"
      initialValue={initialValue}
      validateFirst={validateFirst}
      dependencies={dependencies}
      {...restField}
    >
      <BaseInputNumber
        width={width}
        name={name}
        label={label}
        required={required}
        clearIconSize={clearIconSize}
        {...rest}
      />
    </Form.Item>
  );
};

export const BaseInputNumber = ({
  value,
  onChange = () => {},
  required,
  label,
  name,
  width,
  clearIconSize,
  defaultValue,
  onBlur = () => {},
  className,
  classNames,
  autoTrim = true,
  capitalize = false,
  type = "text",
  ...rest
}) => {
  const hasValue = true;

  return (
    <Label name={name} label={label} active={hasValue} required={required}>
      <AntInputNumber
        style={{ width }}
        className={groupClassNames("gt-input", className)}
        type={type}
        allowClear={{
          clearIcon: <CloseOutlined style={{ fontSize: clearIconSize }} />,
        }}
        value={value}
        onChange={(e) => {
          onChange(e);
        }}
        onBlur={(e) => {
          const originalValue = e.target.value;
          const trimmedValue = autoTrim ? originalValue.trim() : originalValue;
          const finalValue = capitalize
            ? toCapitalize(trimmedValue)
            : trimmedValue;

          if (finalValue !== originalValue) {
            onChange({ target: { value: finalValue } });
          }
          onBlur(e);
        }}
        {...rest}
      />
    </Label>
  );
};
