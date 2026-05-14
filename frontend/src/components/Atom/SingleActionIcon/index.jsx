import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const SingleActionIcon = ({
  icon,
  label,
  color = "#ffa000",
  style = {},
  disabled = false,
  ...props
}) => {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        cursor: !disabled ? "not-allowed" : "pointer",
        opacity: !disabled ? 0.5 : 1,
        ...style,
      }}
      {...props}
    >
      <FontAwesomeIcon
        icon={icon}
        style={{
          marginRight: 10,
          color: !disabled ? "#ccc" : color,
          fontSize: 16,
        }}
      />
      {label}
    </span>
  );
};

export default SingleActionIcon;
