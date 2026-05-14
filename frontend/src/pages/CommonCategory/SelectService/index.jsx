import React from "react";
import { InfiniteSelect } from "@/components/Atom/InfiniteSelect";
import { API_SERVICE } from "@/configs/paths/API_PATH";
import { getDataApi } from "@/api";
import { useTranslation } from "react-i18next";

const SelectService = ({ name = "serviceId", label, ...props }) => {
  const { t } = useTranslation();

  const getService = async (page, search) => {
    const query = {
      page,
      size: 10,
      status: "ACTIVE",
      serviceName: search.trim(),
    };
    const response = await getDataApi(API_SERVICE, query);

    if (response.code === "00") {
      const rawData = response.data || [];
      const data = rawData.map((item) => ({
        ...item,
        displayLabel: `[${item.serviceCode}] ${item.serviceName}`,
      }));
      return {
        data,
        hasMore: rawData.length === 10,
      };
    }

    return { data: [], hasMore: false };
  };

  const getServiceById = async (id) => {
    const response = await getDataApi(`${API_SERVICE}/${id}`);
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
      label={label || t("data_group.service_name")}
      fetchData={getService}
      fetchDataByValue={getServiceById}
      fieldNames={{ label: "displayLabel", value: "id" }}
      placeholder={t("data_group.service_name")}
      {...props}
    />
  );
};

export default SelectService;
