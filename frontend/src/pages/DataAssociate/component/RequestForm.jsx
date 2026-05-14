import React, { useEffect } from "react";
import { Form, Row, Col } from "antd";
import { useTranslation } from "react-i18next";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

import { Modal } from "@/components/Atom/Modal";
import { Input } from "@/components/Atom/Input";
import { RangePicker } from "@/components/Atom/RangerPicker";
import { actionCode } from "@/utils/form/action";
import { ruleMaxLength } from "@/utils/form/rules";
import { getDataApi } from "@/api";
import { API_REQUEST } from "@/configs/paths/API_PATH";

dayjs.extend(utc);

function RequestForm(props) {
  const {
    open,
    title,
    onCancel,
    handleSubmit,
    setValueForm,
    action,
    disabled,
    orgId,
    serviceId,
  } = props;

  const [form] = Form.useForm();
  const { t } = useTranslation();

  const onGetCode = async () => {
    try {
      const res = await getDataApi(API_REQUEST + "/next-code");
      if (res?.code === "00") {
        form.setFieldValue("code", res.data);
        form.setFieldValue("name", res.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const onFinish = () => {
    const values = form.getFieldsValue();
    const [start, end] = values.time || [];

    const payload = {
      ...values,
      fromTime: dayjs.utc(start.format("YYYY-MM-DD HH:mm:ss")).toISOString(),
      toTime: dayjs.utc(end.format("YYYY-MM-DD HH:mm:ss")).toISOString(),
    };

    delete payload.time;

    if (action === actionCode.UPDATE) {
      payload.id = setValueForm?.id;
    }

    handleSubmit(payload);
  };

  useEffect(() => {
    if (!open) return;

    form.resetFields();

    onGetCode();
    form.setFieldsValue({
      orgId,
      serviceId,
      time: [
        dayjs().subtract(1, "month").startOf("month"),
        dayjs().subtract(1, "month").endOf("month"),
      ],
    });

    // if (
    //   (action === actionCode.UPDATE || action === actionCode.VIEW) &&
    //   setValueForm
    // ) {
    //   form.setFieldsValue({
    //     ...setValueForm,
    //     time: [dayjs(setValueForm.fromTime), dayjs(setValueForm.toTime)],
    //   });
    // }
  }, [open, action, orgId, serviceId, setValueForm]);

  return (
    <Modal
      open={open}
      title={title + t("menu.request_reconciliation")}
      onCancel={onCancel}
      width={action === actionCode.VIEW ? "80%" : "45%"}
      onOk={() => form.submit()}
      footer={action === actionCode.VIEW ? null : undefined}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        disabled={disabled}
      >
        <Row gutter={20}>
          <Col xs={24} sm={12}>
            <Input
              label={t("data_group.code")}
              name="code"
              required={action !== actionCode.VIEW}
              rules={[ruleMaxLength(25, t)]}
              placeholder={t("data_group.code")}
            />
          </Col>

          <Col xs={24} sm={12}>
            <Input
              label={t("data_group.name")}
              name="name"
              required={action !== actionCode.VIEW}
              rules={[ruleMaxLength(100, t)]}
              placeholder={t("data_group.name")}
            />
          </Col>

          <Col xs={24} sm={12} style={{ display: "none" }}>
            <Input name="serviceId" />
          </Col>

          <Col xs={24} sm={12} style={{ display: "none" }}>
            <Input name="orgId" />
          </Col>

          <Col xs={24} sm={12}>
            <RangePicker
              label={t("request_recon.time_data")}
              name="time"
              showTime
              format="YYYY-MM-DD HH:mm:ss"
              placeholder={[
                t("schedule_recon.from_time"),
                t("schedule_recon.to_time"),
              ]}
              required={action !== actionCode.VIEW}
            />
          </Col>
        </Row>
      </Form>
    </Modal>
  );
}

export default RequestForm;
