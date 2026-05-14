import { generateRequiredRules } from "@/utils/form/common";
import Label from "../Label";
import { Checkbox as AntCheckbox, Form } from "antd";
import groupClassNames from "classnames";
import styled from "styled-components";

export const Checkbox = ({
  rules,
  label,
  name,
  required = false,
  initialValue,
  validateTrigger,
  validateDebounce,
  validateFirst = true,
  dependecies,
  restField,
  valuePropName = "checked",
  value,
  ...rest
}) => {
  return (
    <Form.Item
      validateTrigger={validateTrigger}
      validateDebounce={validateDebounce}
      validateFirst={validateFirst}
      name={name}
      rules={generateRequiredRules(required, rules)}
      className="m-0"
      initialValue={initialValue}
      dependecies={dependecies}
      valuePropName={valuePropName}
      {...restField}
    >
      <BaseCheckbox
        name={name}
        label={label}
        required={required}
        {...rest}
        value={value}
      />
    </Form.Item>
  );
};

export const BaseCheckbox = ({
  label,
  name,
  required = false,
  value,
  className,
  ...rest
}) => {
  return (
    <Label name={name} label={label} required={required}>
      <StyledAntCheckbox
        name={name}
        value={value}
        className={groupClassNames("gt-checkbox", className)}
        {...rest}
      />
    </Label>
  );
};

const StyledAntCheckbox = styled(AntCheckbox)`
  display: flex;
`;
