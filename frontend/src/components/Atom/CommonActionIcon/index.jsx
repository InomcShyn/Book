import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const CommonActionIcon = ({
  icon,
  label,
  color = "#ffa000",
  style = {},
  ...props
}) => {
  return (
    <>
      <FontAwesomeIcon
        icon={icon}
        style={{ marginRight: 10, color, fontSize: 16, ...style }}
        {...props}
      />
      {label}
    </>
  );
};

export default CommonActionIcon;
