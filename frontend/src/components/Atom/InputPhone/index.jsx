import { CloseOutlined } from '@ant-design/icons';
import { Input as AntInput, Form } from 'antd';
import groupClassNames from 'classnames';
import Label from '../Label';
// import './index.less';
// import { useControllableValue } from '@/hooks';
import { generateRequiredRules } from "@/utils/form/common";
// import { omitNil } from '@/utilities/object';

export const InputPhone = ({
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
  return (
    <Form.Item
      validateTrigger={validateTrigger}
      validateDebounce={validateDebounce}
      name={name}
      rules={generateRequiredRules(required, rules)}
      className='m-0'
      initialValue={initialValue}
      validateFirst={validateFirst}
      dependencies={dependencies}
      {...restField}
    >
      <BaseInputPhone
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

export const BaseInputPhone = ({
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

const handleKeyPress = (e) => {
    const allowedChars = /[0-9+]/;
    if (!allowedChars.test(e.key)) {
      e.preventDefault();
    }
  };
  const hasValue = true;

  return (
    <Label name={`${name}`} label={label} active={hasValue} required={required}>
      <AntInput
        style={{ width: width }}
        className={groupClassNames('gt-input', className)}
        allowClear={{ clearIcon: <CloseOutlined style={{ fontSize: clearIconSize }} /> }}
        value={value}
        onChange={onChange}
        onKeyPress={handleKeyPress}
        classNames={{
          ...classNames,
          input: groupClassNames(undefined, classNames?.input)
        }}
        {...rest}
      />
    </Label>
  );
};
