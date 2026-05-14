import React, { useState } from "react";
import { Modal as AntModal, Skeleton, Spin, Button } from "antd";
import classNames from "classnames";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import "./index.scss";

export const Modal = (props) => {
  const { t } = useTranslation();
  const {
    children,
    loading = false,
    okButtonProps,
    cancelButtonProps,
    className,
    afterOpenChange,
    renderChildrenAfterOpen = false,
    cancelText = t("button.cancel"),
    okText = t("button.submit"),
    onOk,
    onCancel,
    footer,
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

  const defaultFooter = (
    <div style={{ display: "flex", justifyContent: "center", gap: 12 }}>
      <Button
        type="primary"
        icon={<PlusOutlined />}
        loading={loading}
        onClick={onOk}
        style={{ height: 32, padding: "0 15", ...(okButtonProps?.style || {}) }}
        {...okButtonProps}
      >
        {okText}
      </Button>
      <Button
        icon={<MinusCircleOutlined />}
        danger
        onClick={onCancel}
        style={{
          height: 32,
          padding: "0 15",
          color: "black",
          borderColor: "black",
          backgroundColor: "white",
          ...(cancelButtonProps?.style || {}),
        }}
        {...cancelButtonProps}
      >
        {cancelText}
      </Button>
    </div>
  );

  return (
    <AntModal
      className={classNames("gt-modal", className)}
      centered
      width="40%"
      onCancel={onCancel}
      maskClosable={false}
      footer={footer === undefined ? defaultFooter : footer}
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
