import { Input } from "@/components/Atom/Input";
import { InputNumber } from "@/components/Atom/InputNumber";
import { Modal } from "@/components/Atom/Modal";
import { Select } from "@/components/Atom/Select";
import { actionCode } from "@/utils/form/action";
import { ruleMaxLength } from "@/utils/form/rules";
import { Form } from "antd";
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";

export default function ActionCreateEditBook({
  open,
  title = "",
  onCancel,
  handleSubmit,
  setValueForm,
  action,
  categories = [],
}) {
  const [form] = Form.useForm();
  const { t } = useTranslation();

  const onFinish = (values) => {
    if (action === actionCode.UPDATE) values.id = setValueForm?._id;
    handleSubmit(values);
  };

  useEffect(() => {
    if (setValueForm) {
      const formData = {
        ...setValueForm,
        categoryId:
          typeof setValueForm.categoryId === "object"
            ? setValueForm.categoryId?._id
            : setValueForm.categoryId,
      };
      form.setFieldsValue(formData);
    }
  }, [setValueForm]);

  useEffect(() => {
    if (open) {
      form.resetFields();
    }
  }, [open]);

  return (
    <Modal
      title={title + t("book.page_title")}
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
          label={t("book.modal.label_name")}
          name="name"
          required
          rules={[ruleMaxLength(200, t)]}
          placeholder={t("book.modal.placeholder_name")}
        />
        <Input
          label={t("book.modal.label_author")}
          name="author"
          required
          rules={[ruleMaxLength(100, t)]}
          placeholder={t("book.modal.placeholder_author")}
        />
        <InputNumber
          label={t("book.modal.label_price")}
          name="price"
          required
          placeholder={t("book.modal.label_price")}
          style={{ width: "100%" }}
          min={0}
          formatter={(value) =>
            `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
          }
          parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
        />
        <Select
          label={t("book.modal.label_category")}
          name="categoryId"
          required
          options={categories.map((c) => ({
            label: c.name,
            value: c._id,
          }))}
          placeholder={t("book.modal.placeholder_category")}
        />
      </Form>
    </Modal>
  );
}
