import React from "react";
import { Button as AntButton, Tooltip } from "antd";
import {
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  StopOutlined,
  MenuOutlined,
} from "@ant-design/icons";
import "./index.scss";

const getIconByAction = (action) => {
  switch (action) {
    case "menu":
      return <MenuOutlined style={{ color: "#888", fontSize: "18px" }} />;
    case "view":
      return <EyeOutlined style={{ color: "blue", fontSize: "18px" }} />;
    case "edit":
      return <EditOutlined style={{ color: "#FF8B06", fontSize: "18px" }} />;
    case "delete":
      return <DeleteOutlined style={{ color: "#FF0000", fontSize: "18px" }} />;
    case "cancel":
      return <StopOutlined style={{ color: "#888", fontSize: "18px" }} />;
    default:
      return undefined;
  }
};

export const Button = ({
  permissionKey,
  tooltip,
  action,
  icon,
  children,
  ...props
}) => {
  const tooltipTitle = tooltip;

  const button = (
    <AntButton
      key={permissionKey}
      icon={icon ?? getIconByAction(action)}
      {...props}
    >
      {children}
    </AntButton>
  );

  return tooltipTitle ? (
    <Tooltip title={tooltipTitle}>{button}</Tooltip>
  ) : (
    button
  );
};
