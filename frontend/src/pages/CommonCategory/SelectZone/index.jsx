import { getDataApi } from "@/api";
import { InfiniteSelect } from "@/components/Atom/InfiniteSelect";
import { API_ZONE } from "@/configs/paths/API_PATH";
import React from "react";
import { useTranslation } from "react-i18next";

const SelectZone = ({ name = "zoneId", label, ...props }) => {
  const { t } = useTranslation();

  const getZone = async (page, search) => {
    const query = {
      page,
      size: 10,
      status: "ACTIVE",
      name: search,
    };
    const response = await getDataApi(API_ZONE, query);

    if (response.code === "00") {
      return {
        data: response.data || [],
        hasMore: (response.data || []).length === 10,
      };
    }
    return { data: [], hasMore: false };
  };

  const getZoneId = async (id) => {
    const response = await getDataApi(`${API_ZONE}/${id}`);
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
      label={label || t("price_associate.price_zone_name")}
      fetchData={getZone}
      fieldNames={{ label: "name", value: "id" }}
      fetchDataByValue={getZoneId}
      placeholder={t("price_associate.price_zone_name")}
      {...props}
    />
  );
};

export default SelectZone;
