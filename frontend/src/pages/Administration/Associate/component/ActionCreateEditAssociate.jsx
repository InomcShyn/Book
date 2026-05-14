import { getAssociateStatus } from "@/assets/data/categoryData";
import { Input } from "@/components/Atom/Input";
import { Modal } from "@/components/Atom/Modal";
import { Select } from "@/components/Atom/Select";
import { Textarea } from "@/components/Atom/Textarea";
import { actionCode } from "@/utils/form/action";
import { email, ruleMaxLength } from "@/utils/form/rules";
import { Col, Form, Row } from "antd";
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";

export default function ActionCreateEditAssociate({
  open,
  title = "",
  onCancel,
  handleSubmit,
  setValueForm,
  action,
}) {
  const [form] = Form.useForm();
  const { t } = useTranslation();
  const activeStatus = getAssociateStatus(t);

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
      title={title + " " + t("associate.associate")}
      open={open}
      onCancel={onCancel}
      width="45%"
      onOk={() => form.submit()}
      footer={action === actionCode.VIEW ? null : undefined}
    >
      <Form
        form={form}
        onFinish={onFinish}
        layout="vertical"
        disabled={action === actionCode.VIEW}
      >
        <Row gutter={(20, 20)}>
          <Col xs={24} sm={12}>
            <Input
              label={t("associate.name")}
              name="name"
              required
              rules={[ruleMaxLength(100, t)]}
              placeholder={t("associate.name")}
            />
          </Col>
          <Col xs={24} sm={12}>
            <Input
              label={t("associate.represnet")}
              name="represent"
              required
              rules={[ruleMaxLength(100, t)]}
              placeholder={t("associate.represnet")}
            />
          </Col>
        </Row>
        <Row gutter={(20, 20)}>
          <Col xs={24} sm={12}>
            <Input
              label={t("associate.email")}
              name="email"
              required
              rules={[email]}
              placeholder={t("associate.email")}
            />
          </Col>
          <Col xs={24} sm={12}>
            <Input
              label={t("associate.phone")}
              name="phone"
              required
              type="tel"
              rules={[
                { pattern: /^[0-9]+$/, message: t("validate.phone") },
                ruleMaxLength(20, t),
              ]}
              placeholder={t("associate.phone")}
            />
          </Col>
        </Row>

        <Row gutter={(20, 20)}>
          <Col xs={24} sm={12}>
            <Textarea
              label={t("associate.address")}
              name="address"
              required
              rules={[ruleMaxLength(1000, t)]}
              placeholder={t("associate.address")}
            />
          </Col>
          <Col xs={24} sm={12}>
            <Textarea
              label={t("associate.business_info")}
              name="businessInfo"
              required
              rules={[ruleMaxLength(1000, t)]}
              placeholder={t("associate.business_info")}
            />
          </Col>
        </Row>
        {!(action === actionCode.CREATE) && (
          <Row gutter={(20, 20)}>
            <Col xs={24} sm={12}>
              <Select
                label={t("associate.status")}
                name="status"
                required
                options={activeStatus}
                placeholder={t("associate.status")}
              />
            </Col>
          </Row>
        )}
      </Form>
    </Modal>
  );
}
