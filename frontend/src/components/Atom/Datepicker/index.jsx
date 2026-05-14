import { CalendarOutlined, CloseOutlined } from "@ant-design/icons";
import { DatePicker as AntDatePicker, Form } from "antd";
import Label from "../Label";
import { generateRequiredRules } from "@/utils/form/common";
import { useTranslation } from 'react-i18next';

export const DatePicker = ({
  width = "100%",
  label,
  name,
  required = false,
  clearIconSize = 18,
  format = "DD-MM-YYYY",
  rules,
  minDate,
  maxDate,
  ...rest
}) => {
  const { t } = useTranslation();
  const disabledDate = (current) => {
    if (minDate && current < minDate.startOf("day")) return true;
    if (maxDate && current > maxDate.endOf("day")) return true;
    return false;
  };

  return (
    <Form.Item
      name={name}
      rules={generateRequiredRules(required, rules, t)}
      className="m-0"
    >
      <BaseDatePicker
        disabledDate={disabledDate}
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

export const BaseDatePicker = ({
  onChange,
  required,
  label,
  name,
  width,
  clearIconSize,
  value,
  ...rest
}) => {
  return (
    <Label name={`${name}`} label={label} active={true} required={required}>
      <AntDatePicker
        value={value}
        placeholder=""
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
