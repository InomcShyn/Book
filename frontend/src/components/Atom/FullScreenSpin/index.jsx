import React from "react";
import ReactDOM from "react-dom";
import { Spin } from "antd";

const FullScreenSpin = ({
  spinning,
  tip = "Loading...",
  mode = "fullscreen",
}) => {
  if (!spinning) return null;

  const overlay = (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(255,255,255,0.6)",
        zIndex: 5000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Spin spinning tip={tip} size="medium" />
    </div>
  );

  if (mode === "popup") {
    // render ra body để trùm lên cả modal
    return ReactDOM.createPortal(overlay, document.body);
  }

  return overlay;
};

export default FullScreenSpin;
