import React from "react";
import { Tabs } from "antd";
import styled from "styled-components";

export default function AppTabs({items = [], setTabActive, setSearchParams, activeKey, defaultActiveKey, props}) {
  const onChangeTabs = (key) => {
    setTabActive(key);
    setSearchParams && setSearchParams({ tab: key });
  };

  return (
    <ContainerTabs>
      <Tabs defaultActiveKey={defaultActiveKey} items={items} onChange={onChangeTabs} activeKey={activeKey} {...props} />
    </ContainerTabs>
  );
}

const ContainerTabs = styled.div`
  .ant-tabs-tab {
    font-size: 15px;
    padding: 5px 20px;
  }

  .ant-tabs .ant-tabs-tab.ant-tabs-tab-active .ant-tabs-tab-btn{
    color: #6366F1;
  }

  .ant-tabs .ant-tabs-ink-bar {
    background: #6366F1;
  }

  .ant-tabs .ant-tabs-tab:hover{
    color: #7F56D9;
  }
`;
