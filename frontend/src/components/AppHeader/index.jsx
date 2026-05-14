import { Button } from "antd";
import React, { useState } from "react";
import LogoutModal from "../AppModal/LogoutModal";
import "./index.scss";
import { HeaderGroup, StyledHeader } from "./components/styles";
import useMediaQuery, { mediaQueryPoints } from "@/hooks/useMediaQuery";
import { MenuIcon } from "lucide-react";
import AccountActions from "./components/AccountActions";
import LanguageSwitcher from "../common/LanguageSwitcher";
import { ModalResetPassword } from "../Atom/ModalResetPassword";
import AppBreadcrumb from "../AppBreadcrumb";
import { OrganizationInfo } from "@/pages/Components/OrganizationInfo";

function AppHeader({ setOpenDrawer }) {
  const [openLogoutModal, setOpenLogoutModal] = useState(false);
  const [openResetModal, setOpenResetModal] = useState(false);
  const [openModalOrg, setOpenModalOrg] = useState(false);
  const isMobile = useMediaQuery(`(max-width: ${mediaQueryPoints.mdPlus}px)`);

  return (
    <StyledHeader theme="light" isMobile={isMobile}>
      {isMobile && (
        <Button
          type="text"
          className="menu-button"
          onClick={() => setOpenDrawer(true)}
        >
          <MenuIcon size={20} color="#6c737f" />
        </Button>
      )}
      <div className="header-left">
        <AppBreadcrumb />
      </div>

      <div className="header-right">
        <HeaderGroup>
          <LanguageSwitcher />

          <AccountActions
            setOpenModal={setOpenLogoutModal}
            setOpenModalReset={setOpenResetModal}
            setOpenModalOrg={setOpenModalOrg}
          />
        </HeaderGroup>
      </div>

      {openLogoutModal && (
        <LogoutModal
          openModal={openLogoutModal}
          setOpenModal={setOpenLogoutModal}
        />
      )}

      {openResetModal && (
        <ModalResetPassword
          open={openResetModal}
          setOpenModalReset={setOpenResetModal}
          onCancel={() => setOpenResetModal(false)}
        />
      )}

      {openModalOrg && (
        <OrganizationInfo
          open={openModalOrg}
          setOpenModalOrg={setOpenModalOrg}
          onCancel={() => setOpenModalOrg(false)}
        />
      )}
    </StyledHeader>
  );
}

export default AppHeader;
