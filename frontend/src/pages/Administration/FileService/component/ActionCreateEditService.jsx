import { getActiveStatus, typeFileService } from "@/assets/data/categoryData";
import { InputNumber } from "@/components/Atom/InputNumber";
import { Modal } from "@/components/Atom/Modal";
import { Select } from "@/components/Atom/Select";
import SelectAssociate from "@/pages/CommonCategory/SelectAssociate";
import SelectReconTemplate from "@/pages/CommonCategory/SelectReconTemplate";
import SelectService from "@/pages/CommonCategory/SelectService";
import { actionCode } from "@/utils/form/action";
import { Col, Form, Row } from "antd";
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";

export default function ActionCreateEditService({
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
  const types = typeFileService(t);
  const type = Form.useWatch("type", form);

  const onFinish = (values) => {
    if (action === actionCode.UPDATE) values.id = setValueForm.id;
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
      title={title + t("menu.file_service")}
      open={open}
      onCancel={onCancel}
      width="40%"
      onOk={() => form.submit()}
      footer={action == actionCode.VIEW ? null : undefined}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        disabled={action == actionCode.VIEW}
      >
        <Row gutter={(20, 20)}>
          <Col xs={24} sm={12}>
            <SelectService
              name="serviceId"
              placeholder={t("file_service.service_name")}
              required
              label={t("file_service.service_name")}
              value={form.getFieldValue("serviceId")}
            />
          </Col>
          <Col xs={24} sm={12}>
            <Select
              label={t("file_service.type")}
              name="type"
              required
              options={types}
              placeholder={t("file_service.type")}
            />
          </Col>
          {type != "NATCOM_FILE" && (
            <Col xs={24} sm={12}>
              <SelectAssociate
                name="orgId"
                required
                label={t("file_service.ORG_name")}
                placeholder={t("file_service.ORG_name")}
                value={form.getFieldValue("orgId")}
              />
            </Col>
          )}
          <Col xs={24} sm={12}>
            <SelectReconTemplate
              name="reconTemplateId"
              label={t("file_service.recon_template_name")}
              required
              placeholder={t("file_service.recon_template_name")}
              value={form.getFieldValue("reconTemplateId")}
            />
          </Col>
          <Col xs={24} sm={12}>
            <InputNumber
              label={t("file_service.exchange_rate")}
              name="exchangeRate"
              required
              placeholder={t("file_service.exchange_rate")}
              min={0}
              max={100000000}
            />
          </Col>
          {!(action === actionCode.CREATE) && (
            <Col xs={24} sm={12}>
              <Select
                label={t("file_service.status")}
                name="status"
                options={activeStatus}
                placeholder={t("file_service.status")}
              />
            </Col>
          )}
        </Row>
      </Form>
    </Modal>
  );
}
