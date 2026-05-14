import { Dropdown, Menu } from "antd";
import { Button } from "../Button";

export const ActionMenu = ({ actions = [], record }) => {
  const menu = (
    <Menu>
      {actions
        .filter((action) =>
          typeof action.showIf === "function" ? action.showIf(record) : true
        )
        .map((action) => (
          <Menu.Item
            key={action.key}
            onClick={() => action.onClick(record)}
            disabled={
              typeof action.disabledIf === "function"
                ? !action.disabledIf(record)
                : false
            }
          >
            {action.label}
          </Menu.Item>
        ))}
    </Menu>
  );

  return (
    <Dropdown overlay={menu} trigger={["click"]}>
      <Button type="text" action="menu" />
    </Dropdown>
  );
};
