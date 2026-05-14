import { Menu } from "antd";
import React, { useEffect } from "react";
import "./index.scss";
import { StyledDrawer } from "./components/styles";
import useSider from "./hooks/useSider";
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";

function AppSiderMobile({ openDrawer, setOpenDrawer }) {
  const { menuItems, selectedKey, defaultOpenKeys } = useSider();
  const location = useLocation();
  const { t } = useTranslation();

  useEffect(() => {
    if (openDrawer) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [openDrawer]);

  useEffect(() => {
    const handleLocationChange = () => {
      if (openDrawer) {
        setOpenDrawer(false);
      }
    };

    return () => {
      handleLocationChange();
    };
  }, [location.pathname, openDrawer]);

  return (
    <StyledDrawer
      open={openDrawer}
      placement="left"
      width={270}
      closable
      onClose={() => setOpenDrawer(false)}
      title={
        <div className="sider-logo">
          <img src="/logo.png" alt="Reconciliation" />
          <p>{t("common.reconciliation")}</p>
        </div>
      }
      closeIcon={false}
    >
      <Menu
        theme="dark"
        mode="inline"
        selectedKeys={selectedKey}
        defaultOpenKeys={defaultOpenKeys}
        openKeys={defaultOpenKeys}
        items={menuItems}
      />
    </StyledDrawer>
  );
}

export default AppSiderMobile;
