import { CalendarOutlined, CloseOutlined } from "@ant-design/icons";
import { DatePicker, Form } from "antd";
import Label from "../Label";
import { generateRequiredRules } from "@/utils/form/common";
import "./index.scss";
import { useTranslation } from "react-i18next";

export const RangePicker = ({
  width = "100%",
  label,
  name,
  required = false,
  clearIconSize = 18,
  format = "DD-MM-YYYY",
  rules,
  ...rest
}) => {
  const { t } = useTranslation();

  return (
    <Form.Item
      name={name}
      rules={generateRequiredRules(required, rules, t)}
      className="m-0"
    >
      <BaseRangePicker
        width={width}
        name={name}
        label={label}
        required={required}
        clearIconSize={clearIconSize}
        format={format}
        {...rest}
      />
    </Form.Item>
  );
};

export const BaseRangePicker = ({
  onChange,
  required,
  label,
  name,
  width,
  clearIconSize,
  value,
  ...rest
}) => {
  const { RangePicker } = DatePicker;
  return (
    <Label name={`${name}`} label={label} active={true} required={required}>
      <RangePicker
        value={value}
        onChange={onChange}
        style={{ width }}
        className="gt-date-picker"
        allowClear={{
          clearIcon: <CloseOutlined style={{ fontSize: clearIconSize }} />,
        }}
        suffixIcon={<CalendarOutlined style={{ fontSize: clearIconSize }} />}
        {...rest}
      />
    </Label>
  );
};
