import { getCategoryStatus } from "@/assets/data/categoryData";
import { Input } from "@/components/Atom/Input";
import { Modal } from "@/components/Atom/Modal";
import { Select } from "@/components/Atom/Select";
import { Textarea } from "@/components/Atom/Textarea";
import { actionCode } from "@/utils/form/action";
import { ruleMaxLength } from "@/utils/form/rules";
import { Form } from "antd";
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";

export default function ActionCreateEditCategory({
  open,
  title = "",
  onCancel,
  handleSubmit,
  setValueForm,
  action,
}) {
  const [form] = Form.useForm();
  const { t } = useTranslation();
  const categoryStatus = getCategoryStatus(t);

  const onFinish = (values) => {
    if (action === actionCode.UPDATE) values.id = setValueForm?._id;
    handleSubmit(values);
  };

  useEffect(() => {
    if (setValueForm) {
      const rawStatus = setValueForm.status
        ? String(setValueForm.status).trim()
        : "active";
      form.setFieldsValue({
        name: setValueForm.name,
        description: setValueForm.description,
        status: rawStatus,
      });
    }
  }, [setValueForm]);

  useEffect(() => {
    if (open) {
      form.resetFields();
      if (action === actionCode.CREATE) {
        form.setFieldsValue({ status: "active" });
      }
    }
  }, [open]);

  return (
    <Modal
      title={title + t("category.page_title")}
      open={open}
      onCancel={onCancel}
      width="40%"
      onOk={() => form.submit()}
      footer={action === actionCode.VIEW ? null : undefined}
    >
      <Form
        form={form}
        onFinish={onFinish}
        layout="vertical"
        disabled={action === actionCode.VIEW}
      >
        <Input
          label={t("category.modal.label_name")}
          name="name"
          required
          rules={[ruleMaxLength(100, t)]}
          placeholder={t("category.modal.placeholder_name")}
        />
        <Textarea
          label={t("category.modal.label_desc")}
          name="description"
          rows={3}
          placeholder={t("category.modal.placeholder_desc")}
        />
        {!(action === actionCode.CREATE) && (
          <Select
            label={t("category.modal.label_status")}
            name="status"
            required
            options={categoryStatus}
            placeholder={t("category.modal.label_status")}
          />
        )}
      </Form>
    </Modal>
  );
}
