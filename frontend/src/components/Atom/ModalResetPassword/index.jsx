import React from "react";
import { Modal } from "@/components/Atom/Modal";
import { Col, Form, Row } from "antd";
import { InputPassword } from "@/components/Atom/InputPassword";
import { rulePassword } from "@/utils/form/rules";
import { Button } from "@/components/Atom/Button";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { postDataApi } from "@/api";
import { API_CHANGE_PW } from "@/configs/paths/API_PATH";
import { toast } from "react-toastify";

export const ModalResetPassword = ({ open, onCancel, disabled, loading }) => {
  const [form] = Form.useForm();
  const { t } = useTranslation();

  const onFinish = async (values) => {
    try {
      const response = await postDataApi(API_CHANGE_PW, values);
      if (response.code == "00") {
        toast.success(t("toast.success"));
        onCancel();
      } else {
        toast.error(response?.message || t("toast.error"));
      }
    } catch (error) {
      toast.error(t("toast.error"));
    }
  };

  return (
    <Modal
      title={t("change_pw.title")}
      loading={loading}
      open={open}
      onCancel={onCancel}
      width="90%"
      style={{ maxWidth: 450, padding: "0 16px" }}
      afterClose={() => form.resetFields()}
      footer={null}
    >
      <Form
        form={form}
        disabled={disabled}
        onFinish={(values) => onFinish(values, false)}
        layout="vertical"
      >
        <Row gutter={[0, 8]}>
          <Col span={24}>
            <InputPassword
              label={t("change_pw.old_pw")}
              name="oldPassword"
              placeholder={t("change_pw.old_pw")}
              required
            />
          </Col>
          <Col span={24}>
            <InputPassword
              label={t("change_pw.new_pw")}
              name="newPassword"
              placeholder={t("change_pw.new_pw")}
              required
              rules={[rulePassword]}
            />
          </Col>
          <Col span={24}>
            <InputPassword
              label={t("change_pw.cf_pw")}
              name="confirmPassword"
              placeholder={t("change_pw.cf_pw")}
              required
              rules={[
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("newPassword") === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(t("form.validate.confirm_password"));
                  },
                }),
              ]}
            />
          </Col>
        </Row>
        <Row gutter={[16, 0]}>
          <Col span={12}>
            <CancelButton onClick={onCancel}>{t("button.cancel")}</CancelButton>
          </Col>
          <Col span={12}>
            <SubmitButton htmlType="submit" type="primary" loading={loading}>
              {t("button.submit")}
            </SubmitButton>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

const CancelButton = styled(Button)`
  width: 100%;
  margin-top: 25px;
`;

const SubmitButton = styled(Button)`
  width: 100%;
  margin-top: 25px;
  background-color: #ffa000;
`;
