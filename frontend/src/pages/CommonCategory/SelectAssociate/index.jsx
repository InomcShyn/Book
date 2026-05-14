import React from "react";
import { InfiniteSelect } from "@/components/Atom/InfiniteSelect";
import { API_ORG } from "@/configs/paths/API_PATH";
import { getDataApi } from "@/api";
import { useTranslation } from "react-i18next";

const SelectAssociate = ({ name = "orgId", label, ...props }) => {
  const { t } = useTranslation();

  const getAssociate = async (page, search) => {
    const query = {
      page,
      size: 10,
      status: "APPROVED",
      keyword: search.trim(),
    };
    const response = await getDataApi(API_ORG, query);

    if (response.code === "00") {
      return {
        data: response.data || [],
        hasMore: (response.data || []).length === 10,
      };
    }
    return { data: [], hasMore: false };
  };

  const getServiceById = async (id) => {
    const response = await getDataApi(`${API_ORG}/${id}`);
    if (response.code === "00" && response.data) {
      return response.data;
    }
    return null;
  };

  return (
    <InfiniteSelect
      name={name}
      label={label || t("data_group.org_name")}
      fetchData={getAssociate}
      fieldNames={{ label: "name", value: "id" }}
      fetchDataByValue={getServiceById}
      placeholder={t("data_group.org_name")}
      {...props}
    />
  );
};

export default SelectAssociate;
