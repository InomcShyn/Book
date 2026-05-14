import { Modal } from "antd";
import React, { useEffect } from "react";

function AppModal({ children, open, ...props }) {
  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = previousOverflow;
    }
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  return (
    <Modal maskClosable={false} open={open} {...props}>
      {children}
    </Modal>
  );
}

export default AppModal;
