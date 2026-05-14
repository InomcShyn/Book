import React from "react";
import { Tabs } from "antd";
import ChartTransaction from "./ChartTransaction";
import { useTranslation } from "react-i18next";
import "./index.scss";
import ChartRequest from "./ChartRequest";
import { useSelector } from "react-redux";
import { selectAuth } from "@/features/Auth/auth.slice";
import { ROLE_ACCOUNT } from "@/constants/constants";

const { TabPane } = Tabs;

const Dashboard = () => {
  const { user } = useSelector(selectAuth);
  const roleUser = user?.userInfo?.role;
  const { t } = useTranslation();
  return (
    <>
      {roleUser == ROLE_ACCOUNT.PARTNER ? (
        <ChartTransaction />
      ) : (
        <Tabs defaultActiveKey="1" className="custom-tabs">
          <TabPane tab={t("chart.request")} key="1">
            <ChartRequest />
          </TabPane>
          <TabPane tab={t("chart.reconciliation")} key="2">
            <ChartTransaction />
          </TabPane>
        </Tabs>
      )}
    </>
  );
};

export default Dashboard;
