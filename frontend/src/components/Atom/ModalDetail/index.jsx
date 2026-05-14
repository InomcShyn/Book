import React, { useState } from "react";
import { Modal as AntModal, Skeleton, Spin } from "antd";
import classNames from "classnames";
import "./index.scss";

export const ModalDetail = (props) => {
  const {
    children,
    loading = false,
    okButtonProps,
    cancelButtonProps,
    className,
    titleStyle,
    title,
    afterOpenChange,
    titleIcon,
    renderChildrenAfterOpen = false,
    cancelText = "Cancel",
    okText = "Submit",
    onOk,
    onCancel,
    footer,
    width = "50%",
    centerTitle = false,
    ...rest
  } = props;

  const [isReadyToRenderChildren, setIsReadyToRenderChildren] = useState(false);
  const renderChildren = () => {
    if (renderChildrenAfterOpen && !isReadyToRenderChildren) {
      return <Skeleton paragraph={{ rows: 3 }} active round />;
    }

    return (
      <Spin
        spinning={loading}
        wrapperClassName="h-full"
        style={{ maxHeight: "100%" }}
      >
        {children}
      </Spin>
    );
  };

  return (
    <AntModal
      title={
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            ...titleStyle,
          }}
        >
          {titleIcon && <span>{titleIcon}</span>}
          <span>{title}</span>
        </div>
      }
      className={classNames("gt-modal", className, {
        "gt-modal--center-title": centerTitle,
      })}
      bodyStyle={{ maxHeight: "80vh", overflowY: "auto" }}
      centered
      width={width}
      onCancel={onCancel}
      maskClosable={false}
      footer={null}
      {...rest}
      afterOpenChange={(open) => {
        if (renderChildrenAfterOpen) setIsReadyToRenderChildren(open);
        if (afterOpenChange) afterOpenChange(open);
      }}
    >
      {renderChildren()}
    </AntModal>
  );
};
