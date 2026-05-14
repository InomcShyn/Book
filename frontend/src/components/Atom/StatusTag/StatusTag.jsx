import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import {
  faCheck,
  faDownload,
  faFile,
  faFileCircleCheck,
  faFileCircleXmark,
  faSpinner,
  faXmark,
  faExclamation,
  faCircleCheck,
} from "@fortawesome/free-solid-svg-icons";

const DEFAULT_ICON_STYLE = {
  color: "#ffa000",
  fontSize: "20px",
};

const STATUS_CONFIG = {
  PROCESSING: {
    color: "#12b92e",
    icon: <FontAwesomeIcon icon={faSpinner} spin />,
  },
  NEW: { icon: <FontAwesomeIcon icon={faFile} /> },
  PROCESSED: { icon: <FontAwesomeIcon icon={faCircleCheck} /> },
  APPROVED: { icon: <FontAwesomeIcon icon={faCheck} /> },
  ACCEPT: { icon: <FontAwesomeIcon icon={faFileCircleCheck} /> },
  REJECT: { icon: <FontAwesomeIcon icon={faFileCircleXmark} /> },
  EXPORT_REPORT: { icon: <FontAwesomeIcon icon={faDownload} /> },
  CANCEL: { icon: <FontAwesomeIcon icon={faXmark} /> },
  ERROR: { icon: <FontAwesomeIcon icon={faExclamation} /> },
};

export const StatusTag = ({ value, label }) => {
  const { color, icon } = STATUS_CONFIG[value] || {
    color: "inherit",
    icon: null,
  };

  const styledIcon = icon
    ? React.cloneElement(icon, {
        style: { ...DEFAULT_ICON_STYLE, ...icon.props.style },
      })
    : null;

  return (
    <span
      style={{
        color,
        display: "flex",
        alignItems: "center",
        gap: 8,
      }}
    >
      {styledIcon} {label || value}
    </span>
  );
};

export default StatusTag;
