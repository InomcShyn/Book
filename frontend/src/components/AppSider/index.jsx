import { Menu } from "antd";
import React, { useEffect, useState } from "react";
import "./index.scss";
import { PanelLeftCloseIcon } from "lucide-react";
import { StyledSider, ToggleSider } from "./components/styles";
import useSider from "./hooks/useSider";
import { useTranslation } from "react-i18next";
import useMediaQuery, { mediaQueryPoints } from "@/hooks/useMediaQuery";
function AppSider() {
  const [collapsed, setCollapsed] = useState(false);
  const { menuItems, selectedKey, defaultOpenKeys } = useSider();
  const { t } = useTranslation();
  const isBreak = useMediaQuery(`(max-width: ${mediaQueryPoints.lgPlus}px)`);

  useEffect(() => {
    if (isBreak) setCollapsed(true);
    else setCollapsed(false);
  }, [isBreak]);

  return (
    <StyledSider
      collapsible
      width={270}
      theme="dark"
      breakpoint="lg"
      // onBreakpoint={(broken) => {
      //   if (isBreak) setCollapsed(true);
      // }}
      trigger={
        <ToggleSider
          onClick={() => {
            setCollapsed((prev) => !prev);
          }}
          collapsed={collapsed}
        >
          <PanelLeftCloseIcon size={16} />
        </ToggleSider>
      }
      collapsed={collapsed}
    >
      <div className="sider-logo">
        <img
          src="/logo.png"
          alt="Reconciliation"
          className={`${collapsed ? "logo-collapsed" : ""}`}
        />
        {!collapsed ? <p>{t("common.reconciliation")}</p> : null}
      </div>
      <Menu
        theme="dark"
        mode="inline"
        selectedKeys={selectedKey}
        defaultOpenKeys={defaultOpenKeys}
        {...(!collapsed && { openKeys: defaultOpenKeys })}
        items={menuItems}
        inlineCollapsed={collapsed}
      />
    </StyledSider>
  );
}

export default AppSider;
