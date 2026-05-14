import { Layout } from "antd";
import React, { useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import "./index.scss";
import AppHeader from "@/components/AppHeader";
import AppSider from "@/components/AppSider";
import useMediaQuery, { mediaQueryPoints } from "@/hooks/useMediaQuery";
import AppSiderMobile from "@/components/AppSider/AppSiderMobile";
import useAuth from "@/features/Auth/useAuth";
import PATH from "@/configs/paths/PATH";

const { Content } = Layout;

function MainLayout() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(`(max-width: ${mediaQueryPoints.md}px)`);
  const [openDrawer, setOpenDrawer] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setTimeout(() => {
      window.dispatchEvent(new Event("resize"));
      document.body.style.overflow = "auto";
    }, 200);
  }, []);

  // useEffect(() => {
  //   if (!isAuthenticated) {
  //     navigate(PATH.LOGIN);
  //   }
  // }, [isAuthenticated]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <Layout>
      {isMobile ? (
        <AppSiderMobile openDrawer={openDrawer} setOpenDrawer={setOpenDrawer} />
      ) : (
        <AppSider />
      )}
      <Layout>
        <AppHeader setOpenDrawer={setOpenDrawer} />
        <Content className="site-layout-content">
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}

export default MainLayout;
