import React from "react";
import { CloseOutlined, DeleteOutlined, StopOutlined } from "@ant-design/icons";
import { Button, Col, Row, Space, Typography } from "antd";
import { Modal } from "../Modal";
import { useTranslation } from "react-i18next";
import { actionCode } from "@/utils/form/action";

export const DeleteModalConfirm = (props) => {
  const { t } = useTranslation();
  const {
    open,
    title = t("button.delete"),
    confirmText = t("form.confirm.delete"),
    onCancel,
    onConfirm,
    okText = t("button.confirm"),
    actionDC = actionCode.DELETE,
  } = props;

  if (!open) {
    return <></>;
  }

  return (
    <Modal
      open={open}
      onCancel={onCancel}
      width="350px"
      onOk={onConfirm}
      footer={null}
    >
      <Space
        direction="vertical"
        size="middle"
        style={{ width: "100%", padding: "20px 0" }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 10, // khoảng cách giữa icon và title
          }}
        >
          <div
            style={{
              backgroundColor: "#FEE4E2",
              borderRadius: "50%",
              width: 40,
              height: 40,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {actionDC === actionCode.DELETE ? (
              <DeleteOutlined style={{ fontSize: 24, color: "red" }} />
            ) : (
              <StopOutlined style={{ fontSize: 24, color: "red" }} />
            )}
          </div>

          <Typography.Title level={4} style={{ margin: 0 }}>
            {actionDC === actionCode.DELETE ? title : t("button.cancel")}
          </Typography.Title>
        </div>

        <Typography.Text style={{ color: "#475467", fontSize: 15 }}>
          {actionDC == actionCode.DELETE
            ? confirmText
            : t("form.confirm.cancel")}
        </Typography.Text>

        <Row gutter={10}>
          <Col sm={12}>
            <Button onClick={onCancel} style={{ width: "100%" }}>
              {t("button.cancel")}
            </Button>
          </Col>
          <Col sm={12}>
            <Button
              onClick={onConfirm}
              type="primary"
              danger
              style={{ width: "100%" }}
            >
              {okText}
            </Button>
          </Col>
        </Row>
      </Space>
    </Modal>
  );
};
