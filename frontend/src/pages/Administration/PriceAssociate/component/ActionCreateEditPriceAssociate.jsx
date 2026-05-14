import { getActiveStatus } from "@/assets/data/categoryData";
import { Input } from "@/components/Atom/Input";
import { InputNumber } from "@/components/Atom/InputNumber";
import { Modal } from "@/components/Atom/Modal";
import { Select } from "@/components/Atom/Select";
import SelectAssociate from "@/pages/CommonCategory/SelectAssociate";
import SelectService from "@/pages/CommonCategory/SelectService";
import SelectZone from "@/pages/CommonCategory/SelectZone";
import { actionCode } from "@/utils/form/action";
import { ruleMaxLength } from "@/utils/form/rules";
import { Col, Form, Row } from "antd";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

export default function ActionCreateEditPriceAssociate({
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
  const [valueTypeService, setValueTypeService] = useState("");

  const onFinish = (values) => {
    if (action === actionCode.UPDATE) values.id = setValueForm.id;
    handleSubmit(values);
  };

  useEffect(() => {
    if (setValueForm) {
      form.setFieldsValue(setValueForm);
    } else {
      form.resetFields();
    }
  }, [setValueForm]);

  useEffect(() => {
    if (open) {
      form.resetFields();
    }
  }, [open]);

  useEffect(() => {
    if (valueTypeService !== "BY_PARTNER_AND_ZONE") {
      form.setFields([{ name: "zoneId", errors: [] }]);
      form.setFieldValue("zoneId", undefined);
    }
  }, [valueTypeService]);

  return (
    <Modal
      title={title + t("menu.price")}
      open={open}
      onCancel={onCancel}
      width="30%"
      onOk={() => form.submit()}
      footer={action == actionCode.VIEW ? null : undefined}
    >
      <Form form={form} onFinish={onFinish} layout="vertical">
        <Row gutter={(20, 20)}>
          <Col xs={24} sm={24}>
            <SelectService
              label={t("price_associate.price_service_name")}
              name="serviceId"
              required
              placeholder={t("price_associate.price_service_name")}
              disabled={action == actionCode.VIEW ? true : false}
              value={form.getFieldValue("serviceId")}
              onChange={(val, option) => {
                setValueTypeService(option?.type);
              }}
            />
            <SelectAssociate
              label={t("price_associate.price_org_name")}
              name="orgId"
              required
              placeholder={t("price_associate.price_org_name")}
              disabled={action == actionCode.VIEW ? true : false}
              value={form.getFieldValue("serviceId")}
            />

            <SelectZone
              name="zoneId"
              required={
                valueTypeService === "BY_PARTNER_AND_ZONE" ? true : false
              }
              label={t("price_associate.price_zone_name")}
              placeholder={t("price_associate.price_zone_name")}
              disabled={
                action == actionCode.VIEW ||
                valueTypeService !== "BY_PARTNER_AND_ZONE"
                  ? true
                  : false
              }
              value={form.getFieldValue("serviceId")}
            />
            <InputNumber
              label={t("price_associate.price_price")}
              name="price"
              required
              placeholder={t("price_associate.price_price")}
              disabled={action == actionCode.VIEW ? true : false}
              type="number"
              min={0}
              max={1000000000}
            />
            {!(action === actionCode.CREATE) && (
              <Select
                label={t("form.status")}
                name="status"
                // required
                options={activeStatus}
                placeholder={t("form.status")}
                disabled={action == actionCode.VIEW ? true : false}
              />
            )}
          </Col>
        </Row>
      </Form>
    </Modal>
  );
}
