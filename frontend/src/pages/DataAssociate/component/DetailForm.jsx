import React, { useEffect } from "react";
import { Input } from "@/components/Atom/Input";
import { Col, Form, Row } from "antd";
import { useTranslation } from "react-i18next";
import { Select } from "@/components/Atom/Select";
import { Modal } from "@/components/Atom/Modal";
import { actionCode } from "@/utils/form/action";
import { getReconciliationStatus } from "@/assets/data/categoryData";
import { DatePicker } from "@/components/Atom/Datepicker";
import { Textarea } from "@/components/Atom/Textarea";
import dayjs from "dayjs";
import { ruleMaxLength } from "@/utils/form/rules";
import SelectAssociate from "@/pages/CommonCategory/SelectAssociate";
import SelectService from "@/pages/CommonCategory/SelectService";
import SelectSourceAssociate from "@/pages/CommonCategory/SelectSourceAssociate";
import { ROLE_ACCOUNT } from "@/constants/constants";

function DetailForm(props) {
  const {
    open,
    title,
    onCancel,
    handleSubmit,
    setValueForm,
    action,
    disabled,
    roleUser,
  } = props;
  const [form] = Form.useForm();
  const { t } = useTranslation();
  const ReconciliationStatus = getReconciliationStatus(t);

  const onFinish = (values) => {
    if (action === actionCode.UPDATE) values.id = setValueForm?.id;
    handleSubmit(values);
  };

  useEffect(() => {
    if (setValueForm) {
      form.setFieldsValue({
        ...setValueForm,
        txCreateTime: setValueForm?.txCreateTime
          ? dayjs(setValueForm?.txCreateTime)
          : null,
      });
    }
  }, [setValueForm]);

  useEffect(() => {
    if (open) {
      form.resetFields();
    }
  }, [open]);

  return (
    <>
      <Modal
        title={title + t("menu.data_associate")}
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
          disabled={disabled}
        >
          <Row gutter={(20, 20)}>
            <Col xs={24} sm={12}>
              <SelectService
                name="serviceId"
                value={form.getFieldValue("serviceId")}
                required
              />
            </Col>
            <Col xs={24} sm={12}>
              <SelectAssociate
                name="orgId"
                value={form.getFieldValue("orgId")}
                required
              />
            </Col>
          </Row>

          <Row gutter={(20, 20)}>
            <Col xs={24} sm={12}>
              <SelectSourceAssociate
                name="orgSourceId"
                value={form.getFieldValue("orgSourceId")}
                isAssociate={roleUser == ROLE_ACCOUNT.PARTNER}
                required
              />
            </Col>
            <Col xs={24} sm={12}>
              <Input
                label={t("data_group.folder_path")}
                name="filePath"
                required
                rules={[ruleMaxLength(500, t)]}
              />
            </Col>
          </Row>

          <Row gutter={(20, 20)}>
            <Col xs={24} sm={12}>
              <Input
                label={t("data_group.trans")}
                name="txId"
                required
                rules={[ruleMaxLength(100, t)]}
              />
            </Col>
            <Col xs={24} sm={12}>
              <Input
                label={t("data_group.value_trans")}
                name="txAmount"
                required
              />
            </Col>
          </Row>

          <Row gutter={(20, 20)}>
            <Col xs={24} sm={12}>
              <DatePicker
                label={t("data_group.time_trans")}
                name="txCreateTime"
                required
                format="YYYY-MM-DD HH:mm:ss"
                showTime
              />
            </Col>
            <Col xs={24} sm={12}>
              <Input
                label={t("data_group.type_trans")}
                name="txType"
                required
                rules={[ruleMaxLength(200, t)]}
              />
            </Col>
          </Row>

          <Row gutter={(20, 20)}>
            <Col xs={24} sm={12}>
              <Input
                label={t("data_group.trans_from")}
                name="txFrom"
                required
                rules={[ruleMaxLength(200, t)]}
              />
            </Col>
            <Col xs={24} sm={12}>
              <Input
                label={t("data_group.trans_to")}
                name="txTo"
                required
                rules={[ruleMaxLength(200, t)]}
              />
            </Col>
          </Row>

          <Row gutter={(20, 20)}>
            <Col xs={24} sm={12}>
              <Input
                label={t("data_group.status_trans")}
                name="txStatus"
                required
                rules={[ruleMaxLength(200, t)]}
              />
            </Col>
            <Col xs={24} sm={12}>
              <Input
                label={t("data_group.money_trans")}
                name="money"
                required
              />
            </Col>
            {/* <Col xs={12} sm={4}>
              <Input label={t("data_group.unit")} name="unit" required />
            </Col> */}
          </Row>
          <Row gutter={(20, 20)}>
            <Col span={24}>
              <Textarea
                label={t("data_group.full_data")}
                name="fullData"
                required
                rules={[ruleMaxLength(4000, t)]}
              />
            </Col>
          </Row>

          <Row gutter={(20, 20)}>
            <Col xs={24} sm={12}>
              <Select
                label={t("form.status")}
                name="status"
                options={ReconciliationStatus}
                required
              />
            </Col>
          </Row>
        </Form>
      </Modal>
    </>
  );
}

export default DetailForm;
