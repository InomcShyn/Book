import React from "react";
import { Dropdown } from "antd";

function AppDropdown({ options, onChange, children, disabled, ...props }) {
  // Flatten options into a key-object map for lookup
  const keyMap = {};
  const items = options.map((opt) => {
    if (opt.child) {
      return {
        key: opt.key,
        label: opt.label,
        icon: opt.icon,
        type: "group",
        children: opt.child.map((child) => {
          keyMap[child.key] = child;
          return {
            key: child.key,
            label: child.label,
          };
        }),
        disabled: opt.disabled,
      };
    } else {
      keyMap[opt.key] = opt;
      return {
        key: opt.key,
        icon: opt.icon,
        label: opt.label,
        disabled: opt.disabled,
      };
    }
  });

  const menu = {
    items,
    danger: options.some((opt) => opt.danger),
    onClick: ({ key }) => {
      const selected = keyMap[key];
      if (selected && !selected.disabled) {
        onChange(selected);
      }
    },
  };

  return (
    <Dropdown menu={menu} trigger={["click"]} disabled={disabled} {...props}>
      {children}
    </Dropdown>
  );
}

export default AppDropdown;
