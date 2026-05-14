import React from "react";
import { InfiniteSelect } from "@/components/Atom/InfiniteSelect";
import { API_REQUEST } from "@/configs/paths/API_PATH";
import { getDataApi } from "@/api";
import { useTranslation } from "react-i18next";

const SelectRequest = ({ name = "serviceId", label, ...props }) => {
  const { t } = useTranslation();

  const getRequest = async (page, search) => {
    const query = {
      page,
      size: 10,
      keyword: search.trim(),
    };
    const response = await getDataApi(API_REQUEST, query);

    if (response.code === "00") {
      const rawData = response.data || [];
      const data = rawData.map((item) => ({
        ...item,
      }));
      return {
        data,
        hasMore: rawData.length === 10,
      };
    }

    return { data: [], hasMore: false };
  };

  const getServiceById = async (id) => {
    const response = await getDataApi(`${API_REQUEST}/${id}`);
    if (response.code === "00" && response.data) {
      const item = response.data;
      return {
        ...item,
      };
    }
    return null;
  };

  return (
    <InfiniteSelect
      name={name}
      label={label || t("menu.request_reconciliation")}
      fetchData={getRequest}
      fetchDataByValue={getServiceById}
      fieldNames={{ label: "code", value: "id" }}
      placeholder={t("menu.request_reconciliation")}
      {...props}
    />
  );
};

export default SelectRequest;
