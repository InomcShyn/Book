import { getDataApi } from "@/api";
import { getActiveStatus, getTypeservice } from "@/assets/data/categoryData";
import { Input } from "@/components/Atom/Input";
import { InputNumber } from "@/components/Atom/InputNumber";
import { Modal } from "@/components/Atom/Modal";
import { Select } from "@/components/Atom/Select";
import { API_SERVICE_NEXT_CODE } from "@/configs/paths/API_PATH";
import { actionCode } from "@/utils/form/action";
import { ruleMaxLength, rulePercent } from "@/utils/form/rules";
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
  const typeservice = getTypeservice(t);

  const onFinish = (values) => {
    if (action === actionCode.UPDATE) values.id = setValueForm.id;
    handleSubmit(values);
  };

  useEffect(() => {
    form.setFieldsValue(setValueForm);
  }, [setValueForm]);

  useEffect(() => {
    if (open) {
      form.resetFields();
      if (action === actionCode.CREATE) {
        onGetServiceNextCode();
      }
    }
  }, [open]);

  const onGetServiceNextCode = async () => {
    try {
      const response = await getDataApi(API_SERVICE_NEXT_CODE);
      if (response.code === "00") {
        form.setFieldsValue({
          serviceCode: response?.data,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Modal
      title={title + t("service.service")}
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
              label={t("service.service_name")}
              name="serviceName"
              required
              placeholder={t("service.service_name")}
              rules={[ruleMaxLength(100, t)]}
            />
            <Input
              label={t("service.service_code")}
              name="serviceCode"
              required
              // disabled={true}
              placeholder={t("service.service_code")}
            />
            <Input
              label={t("service.default_currency")}
              name="defaultCurrency"
              required
              placeholder={t("service.default_currency")}
              rules={[ruleMaxLength(20, t)]}
            />
            <InputNumber
              label={t("service.max_deviation_percentage")}
              name="maxDeviationPercentage"
              required
              placeholder={t("service.max_deviation_percentage")}
              min={0}
              max={100}
              rules={[rulePercent(t)]}
            />
            <Select
              label={t("service.type")}
              name="type"
              required
              options={typeservice}
              placeholder={t("service.type")}
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
