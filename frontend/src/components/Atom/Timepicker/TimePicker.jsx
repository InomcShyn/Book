import { generateRequiredRules } from "@/utils/form/common";
import { ClockCircleOutlined, CloseOutlined } from "@ant-design/icons";
import { TimePicker as AntTimePicker, Form } from "antd";
import Label from "../Label";

export const TimePicker = ({
  width = "100%",
  label,
  name,
  required = false,
  clearIconSize = 18,
  format = "HH:mm",
  rules,
  ...rest
}) => {
  return (
    <Form.Item
      name={name}
      rules={generateRequiredRules(required, rules)}
      className="m-0"
    >
      <BaseTimePicker
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

export const BaseTimePicker = ({
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
      <AntTimePicker
        value={value}
        onChange={onChange}
        format={rest.format || "HH:mm"}
        placeholder=""
        style={{ width }}
        className="gt-time-picker"
        allowClear={{
          clearIcon: <CloseOutlined style={{ fontSize: clearIconSize }} />,
        }}
        suffixIcon={<ClockCircleOutlined style={{ fontSize: clearIconSize }} />}
        {...rest}
      />
    </Label>
  );
};
