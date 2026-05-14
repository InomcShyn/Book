import { Button } from "@/components/Atom/Button";
import { DatePicker } from "@/components/Atom/Datepicker";
import { Modal } from "@/components/Atom/Modal";
import { ROLE_ACCOUNT } from "@/constants/constants";
import SelectAssociate from "@/pages/CommonCategory/SelectAssociate";
import SelectService from "@/pages/CommonCategory/SelectService";
import { DownloadOutlined } from "@ant-design/icons";
import { Col, Form, Row } from "antd";
import React from "react";
import { useTranslation } from "react-i18next";

export default function ExportReport({ open, onCancel, onFinish, roleUser }) {
  const [form] = Form.useForm();
  const { t } = useTranslation();

  return (
    <Modal
      title={t("button.export") + " " + t("result_recon.export_report")}
      open={open}
      onCancel={onCancel}
      width="30%"
      onOk={() => form.submit()}
      footer={null}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        style={{ display: "flex", flexDirection: "column", gap: 10 }}
      >
        <Row gutter={(20, 20)}>
          <Col xs={24} sm={24}>
            <DatePicker
              label={t("result_recon.month_export")}
              name="transDateFrom"
              placeholder={t("result_recon.month_export")}
              picker="month"
              format="MM/YYYY"
              required
            />
            <SelectService name="serviceId" required />
            {roleUser != ROLE_ACCOUNT.PARTNER && (
              <SelectAssociate name="orgId" />
            )}
          </Col>
        </Row>
        <Col
          xs={24}
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 8,
            justifyContent: "center",
          }}
        >
          <Button htmlType="submit" type="primary" icon={<DownloadOutlined />}>
            {t("button.export")}
          </Button>
          <Button htmlType="button" onClick={onCancel}>
            {t("button.cancel")}
          </Button>
        </Col>
      </Form>
    </Modal>
  );
}
