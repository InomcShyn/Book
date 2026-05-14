import React from "react";
import {
  CheckCircleOutlined,
  DeleteOutlined,
  StopOutlined,
} from "@ant-design/icons";
import { Button, Col, Row, Space, Typography } from "antd";
import { Modal } from "../Modal";
import { useTranslation } from "react-i18next";


export const ConfirmModal = (props) => {
  const { t } = useTranslation();
  const {
    open,
    title,
    confirmText = t("form.confirm.delete"),
    onCancel,
    onConfirm,
    okText = t("button.confirm"),
  } = props;

  if (!open) {
    return <></>;
  }
  if (!open) return null;

  return (
    <Modal
      open={open}
      onCancel={onCancel}
      width="450px"
      onOk={onConfirm}
      footer={null}
    >
      <Space
        direction="vertical"
        size="middle"
        style={{ width: "100%", padding: "20px 0", alignItems: "center" }}
      >
        {/* Icon + Title */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 12,
          }}
        >
          <div
            style={{
              backgroundColor: "#F2F4F7",
              borderRadius: "50%",
              width: 40,
              height: 40,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <CheckCircleOutlined style={{ fontSize: 24 }} />
          </div>

          <Typography.Title level={4} style={{ margin: 0 }}>
            {title}
          </Typography.Title>
        </div>

        <Typography.Text style={{ color: "#475467", fontSize: 15 }}>
          {confirmText}
        </Typography.Text>
      </Space>
      <Row gutter={10}>
        <Col sm={12}>
          <Button onClick={onCancel} style={{ width: "100%" }}>
            {t("button.cancel")}
          </Button>
        </Col>
        <Col sm={12}>
          <Button onClick={onConfirm} type="primary" style={{ width: "100%" }}>
            {okText}
          </Button>
        </Col>
      </Row>
    </Modal>
  );
};
