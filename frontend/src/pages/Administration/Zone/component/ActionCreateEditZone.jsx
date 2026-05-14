import { getActiveStatus } from "@/assets/data/categoryData";
import { Input } from "@/components/Atom/Input";
import { Modal } from "@/components/Atom/Modal";
import { Select } from "@/components/Atom/Select";
import { actionCode } from "@/utils/form/action";
import { ruleMaxLength } from "@/utils/form/rules";
import { Col, Form, Row } from "antd";
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";

export default function ActionCreateEditZone({
  open,
  title = "",
  onCancel,
  handleSubmit,
  setValueForm,
  action,
}) {
  const [form] = Form.useForm();
  const { t } = useTranslation();
  const activeStatus = getActiveStatus(t);

  const onFinish = (values) => {
    if (action === actionCode.UPDATE) values.id = setValueForm?.id;
    handleSubmit(values);
  };

  useEffect(() => {
    if (setValueForm) {
      form.setFieldsValue(setValueForm);
    }
  }, [setValueForm]);

  useEffect(() => {
    if (open) {
      form.resetFields();
    }
  }, [open]);

  return (
    <Modal
      title={title + t("zone.zone")}
      open={open}
      onCancel={onCancel}
      width="30%"
      onOk={() => form.submit()}
      footer={action == actionCode.VIEW ? null : undefined}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        style={{ display: "flex", flexDirection: "column", gap: 10 }}
        disabled={action === actionCode.VIEW}
      >
        <Row gutter={(20, 20)}>
          <Col xs={24} sm={24}>
            <Input
              label={t("zone.name")}
              name="name"
              placeholder={t("zone.name")}
              required
              rules={[ruleMaxLength(100, t)]}
            />
            <Input
              label={t("zone.code")}
              name="code"
              required
              placeholder={t("zone.code")}
              rules={[ruleMaxLength(100, t)]}
            />
            <Input
              label={t("zone.prefix")}
              name="prefix"
              required
              placeholder={t("zone.prefix")}
              rules={[ruleMaxLength(100, t)]}
            />
            {!(action === actionCode.CREATE) && (
              <Select
                label={t("service.status")}
                name="status"
                // required
                options={activeStatus}
                placeholder={t("service.status")}
                disabled={action == actionCode.VIEW ? true : false}
              />
            )}
          </Col>
        </Row>
      </Form>
    </Modal>
  );
}
