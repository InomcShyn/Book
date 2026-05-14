import { CloseOutlined } from '@ant-design/icons';
import { Input as AntInput, Form } from 'antd';
import groupClassNames from 'classnames';
import Label from '../Label';
import { generateRequiredRules } from "@/utils/form/common";
import { useTranslation } from 'react-i18next';

export const InputPassword = ({
  width = '100%',
  label,
  name,
  required = false,
  clearIconSize = 18,
  rules,
  initialValue,
  validateTrigger,
  validateDebounce,
  validateFirst = true,
  dependencies,
  restField,
  ...rest
}) => {
  const { t } = useTranslation()
  return (
    <Form.Item
      validateTrigger={validateTrigger}
      validateDebounce={validateDebounce}
      name={name}
      rules={generateRequiredRules(required, rules, t)}
      className='m-0'
      initialValue={initialValue}
      validateFirst={validateFirst}
      dependencies={dependencies}
      {...restField}
    >
      <BaseInputPassword
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

export const BaseInputPassword = ({
  value,
  onChange,
  required,
  label,
  name,
  width,
  clearIconSize,
  defaultValue,
  className,
  classNames,
  ...rest
}) => {

  const hasValue = true;

  return (
    <Label name={`${name}`} label={label} active={hasValue} required={required}>
      <AntInput.Password
        style={{ width: width }}
        className={groupClassNames('gt-input', className)}
        allowClear={{ clearIcon: <CloseOutlined style={{ fontSize: clearIconSize }} /> }}
        value={value}
        onChange={onChange}
        classNames={{
          ...classNames,
          input: groupClassNames(undefined, classNames?.input)
        }}
        {...rest}
      />
    </Label>
  );
};
