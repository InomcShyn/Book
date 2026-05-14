import React from "react";
import { InfiniteSelect } from "@/components/Atom/InfiniteSelect";
import { API_ORG_SOURCE } from "@/configs/paths/API_PATH";
import { getDataApi } from "@/api";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { selectAuth } from "@/features/Auth/auth.slice";

const SelectSourceAssociate = ({
  name = "orgId",
  label,
  isAssociate = false,
  ...props
}) => {
  const { t } = useTranslation();
  const { user } = useSelector(selectAuth);

  const getSrcAssociate = async (page, search) => {
    const query = {
      page,
      size: 10,
      status: "ACTIVE",
      keyword: search.trim(),
      orgId: isAssociate ? user?.userInfo?.orgId : null,
    };
    const response = await getDataApi(API_ORG_SOURCE, query);

    if (response.code === "00") {
      return {
        data: response.data || [],
        hasMore: (response.data || []).length === 10,
      };
    }
    return { data: [], hasMore: false };
  };

  const getServiceById = async (id) => {
    const response = await getDataApi(`${API_ORG_SOURCE}/${id}`);
    if (response.code === "00" && response.data) {
      if (response.code === "00" && response.data) {
        return response.data;
      }
    }
    return null;
  };

  return (
    <InfiniteSelect
      name={name}
      label={label || t("menu.data_source_associate")}
      fetchData={getSrcAssociate}
      fieldNames={{ label: "name", value: "id" }}
      fetchDataByValue={getServiceById}
      placeholder={t("menu.data_source_associate")}
      {...props}
    />
  );
};

export default SelectSourceAssociate;
