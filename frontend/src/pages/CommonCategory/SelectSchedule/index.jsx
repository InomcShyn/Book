import React from "react";
import { InfiniteSelect } from "@/components/Atom/InfiniteSelect";
import { API_SCHEDULE } from "@/configs/paths/API_PATH";
import { getDataApi } from "@/api";
import { useTranslation } from "react-i18next";

const SelectSchedule = ({ name = "serviceId", label, ...props }) => {
  const { t } = useTranslation();

  const getService = async (page, search) => {
    const query = {
      page,
      size: 10,
      // status: "ACTIVE",
      name: search.trim(),
    };
    const response = await getDataApi(API_SCHEDULE, query);

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
    const response = await getDataApi(`${API_SCHEDULE}/${id}`);
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
      label={label || t("schedule_recon.category")}
      fetchData={getService}
      fetchDataByValue={getServiceById}
      fieldNames={{ label: "name", value: "id" }}
      placeholder={t("data_group.service_name")}
      {...props}
    />
  );
};

export default SelectSchedule;
