import React from "react";
import useAuth from "@/features/Auth/useAuth";
import { StyledLogoutModal } from "./components/styles";
import { LogOutIcon } from "lucide-react";
import { useTranslation } from "react-i18next";

function LogoutModal({ openModal, setOpenModal }) {
  const { logOutUser } = useAuth();
  const { t } = useTranslation();

  return (
    <StyledLogoutModal
      open={openModal}
      onOk={logOutUser}
      onCancel={() => setOpenModal(false)}
      okText={t("common.sign_out")}
      cancelText={t("button.cancel")}
      cancelButtonProps={{}}
      centered
      style={{ maxWidth: 450, padding: "0 16px" }}
    >
      <div className="modal-content">
        <div className="header">
          <div className="icon">
            <LogOutIcon size={22} color="#ff4d4f" />
          </div>
          <h2>{t("common.sign_out")}</h2>
        </div>
        <p style={{ textAlign: "center", fontSize: "16px", marginBottom: 24 }}>
          {t("form.text_sign_out")}
        </p>
      </div>
    </StyledLogoutModal>
  );
}

export default LogoutModal;
