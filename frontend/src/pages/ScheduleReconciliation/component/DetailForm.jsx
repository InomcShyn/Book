import React, { useEffect, useState } from "react";
import { Input } from "@/components/Atom/Input";
import { Col, Form, Row } from "antd";
import { useTranslation } from "react-i18next";
import { Select } from "@/components/Atom/Select";
import { Modal } from "@/components/Atom/Modal";
import { actionCode } from "@/utils/form/action";
import { getFrequencyType } from "@/assets/data/categoryData";
import dayjs from "dayjs";
import { ruleMaxLength } from "@/utils/form/rules";
import SelectService from "@/pages/CommonCategory/SelectService";

function DetailForm(props) {
  const {
    open,
    title,
    onCancel,
    handleSubmit,
    setValueForm,
    action,
    disabled,
    isNewRecord,
  } = props;
  const [form] = Form.useForm();
  const { t } = useTranslation();
  const FrequencyType = getFrequencyType(t);

  const hours = Array.from({ length: 24 }, (_, i) => i);
  const minutes = Array.from({ length: 60 }, (_, i) => i);
  const date = Array.from({ length: 31 }, (_, i) => i + 1);

  const [scanTime, setScanTime] = useState(null);

  const [hour, setHour] = useState(null);
  const [minute, setMinute] = useState(null);
  const [day, setDay] = useState(null);

  const [hourDisabled, setHourDisabled] = useState(false);
  const [minuteDisabled, setMinuteDisabled] = useState(false);
  const [dayDisabled, setDayDisabled] = useState(false);

  const [hourRequired, setHourRequired] = useState(false);
  const [minuteRequired, setMinuteRequired] = useState(false);
  const [dayRequired, setDayRequired] = useState(false);

  const onFinish = () => {
    const values = form.getFieldsValue();
    const data = {
      ...values,
      scanTime: scanTime,
    };
    delete data.day;
    delete data.hour;
    delete data.minute;
    if (action === actionCode.UPDATE) data.id = setValueForm?.id;
    handleSubmit(data);
  };

  const onChangeFrequencyType = (value) => {
    form.setFieldsValue({ hour: null, minute: null, day: null }); // optional nếu bạn có name trong form
    setHour(null);
    setMinute(null);
    setDay(null);

    switch (value) {
      case "MONTHLY":
        setHourDisabled(false);
        setMinuteDisabled(false);
        setDayDisabled(false);
        setHourRequired(true);
        setMinuteRequired(true);
        setDayRequired(true);
        break;
      case "DAILY":
        setHourDisabled(false);
        setMinuteDisabled(false);
        setDayDisabled(true);
        setHourRequired(true);
        setMinuteRequired(true);
        setDayRequired(false);
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    if (setValueForm) {
      form.setFieldsValue({
        ...setValueForm,
        time: [dayjs(setValueForm?.fromTime), dayjs(setValueForm?.toTime)],
      });

      if (setValueForm.frequencyType) {
        onChangeFrequencyType(setValueForm.frequencyType);
      }

      if (setValueForm.scanTime) {
        const [h, m, d] = setValueForm.scanTime.split(":");
        const hourVal = h !== "*" ? parseInt(h) : null;
        const minuteVal = m !== "*" ? parseInt(m) : null;
        const dayVal = d !== "*" ? parseInt(d) : null;

        form.setFieldsValue({
          day: dayVal,
          hour: hourVal,
          minute: minuteVal,
        });
        setDay(dayVal);
        setHour(hourVal);
        setMinute(minuteVal);
      } else {
        setHour(null);
        setMinute(null);
        setDay(null);
      }
    } else {
      form.resetFields();
      setHour(null);
      setMinute(null);
      setDay(null);
    }
  }, [setValueForm]);

  useEffect(() => {
    const scan = `${hourRequired && hour !== null ? hour : "*"}:${
      minuteRequired && minute !== null ? minute : "*"
    }:${dayRequired && day !== null ? day : "*"}:*`;
    setScanTime(scan);
  }, [hour, minute, day, hourRequired, minuteRequired, dayRequired]);

  useEffect(() => {
    if (open) {
      form.resetFields();
    }
  }, [open]);

  return (
    <>
      <Modal
        title={title + t("menu.schedule_reconciliation")}
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
              <Input
                label={t("schedule_recon.name")}
                name="name"
                rules={[ruleMaxLength(100, t)]}
                required
                placeholder={t("schedule_recon.name")}
              />
            </Col>
            <Col xs={24} sm={12}>
              <SelectService
                name="serviceId"
                value={form.getFieldValue("serviceId")}
                required
                disabled={disabled || !isNewRecord}
              />
            </Col>
            <Col xs={24} sm={12}>
              <Select
                label={t("data_group.frequency_type")}
                name="frequencyType"
                options={FrequencyType}
                required
                placeholder={t("data_group.frequency_type")}
                onChange={onChangeFrequencyType}
                disabled={disabled || !isNewRecord}
              />
            </Col>

            <Col xs={24} sm={12}>
              <Row gutter={(10, 10)}>
                <Col xs={8} sm={8}>
                  <Select
                    label="Ngày"
                    name="day"
                    required={dayRequired}
                    disabled={disabled || !isNewRecord || dayDisabled}
                    value={day}
                    onChange={(val) => setDay(val)}
                    options={date.map((d) => ({ label: d, value: d }))}
                  />
                </Col>
                <Col xs={8} sm={8}>
                  <Select
                    label="Giờ"
                    name="hour"
                    required={hourRequired}
                    disabled={disabled || !isNewRecord || hourDisabled}
                    value={hour}
                    onChange={(val) => setHour(val)}
                    options={hours.map((h) => ({ label: h, value: h }))}
                  />
                </Col>
                <Col xs={8} sm={8}>
                  <Select
                    label="Phút"
                    name="minute"
                    required={minuteRequired}
                    disabled={disabled || !isNewRecord || minuteDisabled}
                    value={minute}
                    onChange={(val) => setMinute(val)}
                    options={minutes.map((m) => ({ label: m, value: m }))}
                  />
                </Col>
              </Row>
            </Col>
          </Row>
        </Form>
      </Modal>
    </>
  );
}

export default DetailForm;
