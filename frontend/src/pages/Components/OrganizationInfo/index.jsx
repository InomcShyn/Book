import React, { useEffect } from "react";
import { Form } from "antd";
import { DescriptionsField } from "@/components/Atom/Descriptions";
import { getDataApi } from "@/api";
import { useTranslation } from "react-i18next";
import { Modal } from "@/components/Atom/Modal";
import { useSelector } from "react-redux";
import { selectAuth } from "@/features/Auth/auth.slice";
import { API_ORG } from "@/configs/paths/API_PATH";

export const OrganizationInfo = ({ open, onCancel }) => {
  const [form] = Form.useForm();
  const { t } = useTranslation();
  const { user } = useSelector(selectAuth);
  const idOrg = user?.userInfo?.orgId;
  const onGetDetail = async () => {
    try {
      const response = await getDataApi(API_ORG + "/" + idOrg);
      if (response.code == "00") {
        const data = response.data;
        form.setFieldsValue({
          ...data,
        });
      } else toast.error(response?.message || t("error.general"));
    } catch (error) {
      toast.error(t("error.general"));
    }
  };

  useEffect(() => {
    if (open) {
      onGetDetail();
    }
  }, [open]);

  return (
    <Modal
      title={t("common.info_org")}
      open={open}
      onCancel={onCancel}
      width="40%"
      footer={null}
    >
      <Form form={form}>
        <DescriptionsField
          form={form}
          size="middle"
          columns={1}
          items={[
            { label: t("associate.name"), name: "name" },
            { label: t("associate.represnet"), name: "represent" },
            { label: t("associate.email"), name: "email" },
            { label: t("associate.phone"), name: "phone" },
            { label: t("associate.address"), name: "address" },
            { label: t("associate.business_info"), name: "businessInfo" },
          ]}
        />
      </Form>
    </Modal>
  );
};
