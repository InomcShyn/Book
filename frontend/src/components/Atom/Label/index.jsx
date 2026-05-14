import React, { useState } from 'react';

const Label = ({ children, label, active = false, required = false, name, className = '' }) => {
  const [focus, setFocus] = useState(false);

  const labelClass = focus || active ? 'gt-label gt-label-float' : 'gt-label';

  return (
    <div
      className={`gt-label-wrapper ${className}`}
      onBlur={() => setFocus(false)}
      onFocus={() => setFocus(true)}
    >
      {label && (
        <label className={labelClass} title={label} htmlFor={name}>
          {label} {required && <span style={{color: "red"}}>*</span>}
        </label>
      )}
      {children}
    </div>
  );
};

export default Label;
