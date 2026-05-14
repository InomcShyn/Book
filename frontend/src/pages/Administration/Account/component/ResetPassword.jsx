import { InputPassword } from "@/components/Atom/InputPassword";
import { Modal } from "@/components/Atom/Modal";
import {
  ruleConfirmPassword,
  ruleMaxLength,
  ruleNewPassword,
} from "@/utils/form/rules";
import { Form } from "antd";
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";

export default function ResetPassword({
  open,
  title = "",
  onCancel,
  handleSubmit,
}) {
  const [form] = Form.useForm();
  const { t } = useTranslation();

  useEffect(() => {
    if (open) {
      form.resetFields();
    }
  }, [open]);

  return (
    <Modal
      title={title}
      open={open}
      onCancel={onCancel}
      width="20%"
      onOk={() => form.submit()}
    >
      <Form form={form} onFinish={handleSubmit} layout="vertical">
        <InputPassword
          label={t("account_CMS.new_password")}
          name="newPassword"
          required
          type="password"
          rules={[ruleNewPassword(t)]}
        />
        <InputPassword
          label={t("account_CMS.confirm_Password")}
          name="confirmPassword"
          required
          type="password"
          validateTrigger="onSubmit"
          dependencies={["newPassword"]}
          rules={[
            ruleMaxLength(100, t),
            ruleConfirmPassword(t),
            ruleNewPassword(t),
          ]}
        />
      </Form>
    </Modal>
  );
}
