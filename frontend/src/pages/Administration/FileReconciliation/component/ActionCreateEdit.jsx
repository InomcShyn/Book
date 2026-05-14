import {
  getActiveStatus,
  getTypeFileReconciliation,
  getTypeSeparator,
} from "@/assets/data/categoryData";
import { DatePicker } from "@/components/Atom/Datepicker";
import { Input } from "@/components/Atom/Input";
import { Modal } from "@/components/Atom/Modal";
import { Select } from "@/components/Atom/Select";
import { actionCode } from "@/utils/form/action";
import { ruleMaxLength } from "@/utils/form/rules";
import { Col, Form, Row } from "antd";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

export default function ActionCreateEditAccount({
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
  const types = getTypeFileReconciliation(t);
  const typeSeparator = getTypeSeparator(t);
  const type = Form.useWatch("type", form);
  const separatorType = Form.useWatch("separatorType", form);

  const onFinish = (values) => {
    if (action === actionCode.UPDATE) values.id = setValueForm.id;
    handleSubmit(values);
  };

  useEffect(() => {
    if (setValueForm) {
      form.setFieldsValue({
        ...setValueForm,
        separatorType: setValueForm?.separator == " " ? 1 : 2,
      });
    } else {
      form.resetFields();
    }
  }, [setValueForm]);

  useEffect(() => {
    if (open) {
      form.resetFields();
    }
  }, [open]);

  return (
    <Modal
      title={title + t("menu.file_reconciliation")}
      open={open}
      onCancel={onCancel}
      width="45%"
      onOk={() => form.submit()}
      footer={action == actionCode.VIEW ? null : undefined}
    >
      <Form
        form={form}
        onFinish={onFinish}
        layout="vertical"
        disabled={action == actionCode.VIEW}
      >
        <Row gutter={(20, 20)}>
          <Col xs={24} sm={12}>
            <Input
              label={t("file_reconciliation.name")}
              name="name"
              required
              placeholder={t("file_reconciliation.name")}
              rules={[ruleMaxLength(100, t)]}
            />
          </Col>
          <Col xs={24} sm={12}>
            <Select
              label={t("file_reconciliation.type")}
              name="type"
              required
              options={types}
              placeholder={t("file_reconciliation.type")}
            />
          </Col>
          {type == "OTHER" && (
            <>
              <Col xs={24} sm={separatorType != 2 ? 12 : 6}>
                <Select
                  label={t("file_reconciliation.type_separator")}
                  name="separatorType"
                  required
                  options={typeSeparator}
                  placeholder={t("file_reconciliation.type_separator")}
                />
              </Col>
              {separatorType == 2 && (
                <Col xs={24} sm={6}>
                  <Input
                    label={t("file_reconciliation.separator")}
                    name="separator"
                    placeholder={t("file_reconciliation.separator")}
                    rules={[ruleMaxLength(5, t)]}
                    required
                  />
                </Col>
              )}
            </>
          )}
          <Col xs={24} sm={12}>
            <Input
              label={t("file_reconciliation.num_row_title")}
              name="numRowTitle"
              required
              type="number"
              min={1}
              placeholder={t("file_reconciliation.num_row_title")}
            />
          </Col>
          <Col xs={24} sm={12}>
            <Input
              label={t("file_reconciliation.CL_Id")}
              name="clId"
              required
              type="number"
              min={0}
              placeholder={t("file_reconciliation.CL_Id")}
            />
          </Col>
          <Col xs={24} sm={12}>
            <Input
              label={t("file_reconciliation.CL_amount")}
              name="clAmount"
              required
              type="number"
              min={1}
              placeholder={t("file_reconciliation.CL_amount")}
            />
          </Col>
          <Col xs={24} sm={12}>
            <Input
              label={t("file_reconciliation.CL_from")}
              name="clFrom"
              required
              type="number"
              min={0}
              placeholder={t("file_reconciliation.CL_from")}
            />
          </Col>
          <Col xs={24} sm={12}>
            <Input
              label={t("file_reconciliation.CL_to")}
              name="clTo"
              required
              type="number"
              min={0}
              placeholder={t("file_reconciliation.CL_to")}
            />
          </Col>
          <Col xs={24} sm={12}>
            <Input
              label={t("file_reconciliation.CL_type")}
              name="clType"
              required
              type="number"
              min={0}
              placeholder={t("file_reconciliation.CL_type")}
            />
          </Col>
          <Col xs={24} sm={12}>
            <Input
              label={t("file_reconciliation.CL_status")}
              name="clStatus"
              required
              type="number"
              min={0}
              placeholder={t("file_reconciliation.CL_status")}
            />
          </Col>
           <Col xs={24} sm={12}>
            <Input
              label={t("file_reconciliation.CL_fee")}
              name="clFee"
              required
              type="number"
              min={0}
              placeholder={t("file_reconciliation.CL_fee")}
            />
          </Col>
          <Col xs={24} sm={12}>
            <Input
              label={t("file_reconciliation.CL_create_time")}
              name="clCreateTime"
              required
              type="number"
              min={0}
              placeholder={t("file_reconciliation.CL_create_time")}
            />
          </Col>
          <Col xs={24} sm={12}>
            <Input
              label={t("file_reconciliation.date_format")}
              name="dateFormat"
              required
              placeholder={t("file_reconciliation.date_format")}
            />
          </Col>
          <Col xs={24} sm={12}>
            <Input
              label={t("file_reconciliation.currency_unit")}
              name="currencyUnit"
              required
              placeholder={t("file_reconciliation.currency_unit")}
              rules={[ruleMaxLength(100, t)]}
            />
          </Col>
          {!(action === actionCode.CREATE) && (
            <Col xs={24} sm={12}>
              <Select
                label={t("file_reconciliation.status")}
                name="status"
                required
                options={activeStatus}
                placeholder={t("file_reconciliation.status")}
              />
            </Col>
          )}
        </Row>
      </Form>
    </Modal>
  );
}
