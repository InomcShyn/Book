import { getActiveStatus, getTypeAccount } from "@/assets/data/categoryData";
import { Input } from "@/components/Atom/Input";
import { InputPassword } from "@/components/Atom/InputPassword";
import { Modal } from "@/components/Atom/Modal";
import { Select } from "@/components/Atom/Select";
import SelectAssociate from "@/pages/CommonCategory/SelectAssociate";
import { actionCode } from "@/utils/form/action";
import { ruleMaxLength, ruleNewPassword } from "@/utils/form/rules";
import { Form } from "antd";
import React, { useEffect } from "react";
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
  const typeAccount = getTypeAccount(t);
  const orgId = Form.useWatch("orgId", form);

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
      title={title + t("menu.account")}
      open={open}
      onCancel={onCancel}
      width="30%"
      onOk={() => form.submit()}
      footer={action == actionCode.VIEW ? null : undefined}
    >
      <Form
        form={form}
        onFinish={onFinish}
        layout="vertical"
        disabled={action === actionCode.VIEW}
      >
        <Input
          label={t("account_CMS.full_name")}
          name="fullname"
          required
          rules={[ruleMaxLength(100, t)]}
          placeholder={t("account_CMS.full_name")}
        />
        <Input
          label={t("account_CMS.user_name")}
          name="username"
          required
          rules={[
            ruleMaxLength(100, t),
            {
              pattern: /^[a-zA-Z0-9]+$/,
              message: t("validate.username_invalid"),
            },
          ]}
          placeholder={t("account_CMS.user_name")}
          autoComplete="new-user"
        />
        <SelectAssociate
          name="orgId"
          required
          value={orgId}
          disabled={action === actionCode.VIEW || action === actionCode.UPDATE}
        />
        {action === actionCode.CREATE && (
          <InputPassword
            label={t("account_CMS.pass")}
            name="pass"
            required
            type="password"
            rules={[ruleMaxLength(100, t), ruleNewPassword(t)]}
            placeholder={t("account_CMS.pass")}
            autoComplete="new-password"
          />
        )}
        <Select
          label={t("account_CMS.type")}
          name="type"
          required
          options={typeAccount}
          placeholder={t("account_CMS.type")}
        />
        {!(action === actionCode.CREATE) && (
          <Select
            label={t("service.status")}
            name="status"
            options={activeStatus}
            placeholder={t("service.status")}
          />
        )}
      </Form>
    </Modal>
  );
}
