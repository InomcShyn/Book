import { getDataApi } from "@/api";
import { InfiniteSelect } from "@/components/Atom/InfiniteSelect";
import { API_RECON_TEMPLATES } from "@/configs/paths/API_PATH";
import React from "react";
import { useTranslation } from "react-i18next";

const SelectReconTemplate = ({ name = "reconTemplateId", label, ...props }) => {
  const { t } = useTranslation();

  const getFileReconciliation = async (page, search) => {
    const query = {
      page,
      size: 10,
      status: "ACTIVE",
      keyword: search.trim(),
    };
    const response = await getDataApi(API_RECON_TEMPLATES, query);

    if (response.code === "00") {
      return {
        data: response.data || [],
        hasMore: (response.data || []).length === 10,
      };
    }
    return { data: [], hasMore: false };
  };

  const getFileReconciliationId = async (id) => {
    const response = await getDataApi(`${API_RECON_TEMPLATES}/${id}`);
    if (response.code === "00" && response.data) {
      const item = response.data;
      return {
        ...item,
        displayLabel: `[${item.serviceCode}] ${item.serviceName}`,
      };
    }
    return null;
  };

  return (
    <InfiniteSelect
      name={name}
      label={label || t("file_service.recon_template_name")}
      fetchData={getFileReconciliation}
      fieldNames={{ label: "name", value: "id" }}
      fetchDataByValue={getFileReconciliationId}
      placeholder={t("file_service.recon_template_name")}
      {...props}
    />
  );
};

export default SelectReconTemplate;
