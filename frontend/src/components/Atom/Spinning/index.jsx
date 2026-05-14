import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";

export const Spinning = () => {
  return <FontAwesomeIcon icon={faSpinner} spin style={{ color: "#ffa000" }} />;
};

export default Spinning;
