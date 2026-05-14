import AppDropdown from "@/components/AppDropdown";
import {
  ChevronDownIcon,
  InfoIcon,
  LogOutIcon,
  RotateCcwKeyIcon,
} from "lucide-react";
import React from "react";
import avatarDefault from "@/assets/images/avatar.png";
import { Avatar as AntAvatar, Badge } from "antd";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import useAuth from "@/features/Auth/useAuth";
function AccountActions({
  setOpenModal,
  setOpenModalReset,
  setOpenModalOrg,
  options,
  avatarSize = 40,
  props,
}) {
  const { t } = useTranslation();
  const { user } = useAuth();
  const DEFAULT_OPTIONS = [
    {
      key: "0",
      label: (
        <UserLabel>
          {user?.userInfo?.sub} - {user?.userInfo?.role}
        </UserLabel>
      ),
      disabled: true,
    },
    {
      key: "1",
      label: t("common.info_org"),
      icon: <InfoIcon size={14} />,
      onClick: () => setOpenModalOrg(true),
    },
    {
      key: "2",
      label: t("common.change_pw"),
      icon: <RotateCcwKeyIcon size={14} />,
      onClick: () => setOpenModalReset(true),
    },
    {
      key: "3",
      label: t("common.sign_out"),
      icon: <LogOutIcon size={14} />,
      onClick: () => setOpenModal(true),
    },
  ];

  // const { user } = useAuth();

  // const [srcAvt, setSrcAvt] = useState("");

  // useEffect(() => {
  //   if (user?.userInfo?.avatar) {
  //     setSrcAvt(user.userInfo.avatar);
  //   }
  // }, [user]);

  return (
    <AppDropdown
      options={options ? options : DEFAULT_OPTIONS}
      onChange={(item) => item.onClick()}
      overlayStyle={{ minWidth: "150px" }}
      {...props}
    >
      <Badge
        count={
          <ArrowDownContainer>
            <ChevronDownIcon size={14} color="#fff" />
          </ArrowDownContainer>
        }
        color="#6c737f"
        offset={[-7, 33]}
      >
        <Avatar
          src={avatarDefault}
          size={avatarSize}
          style={{ cursor: "pointer" }}
          onError={(event) => {
            event.target.src = avatarDefault;
          }}
        />
      </Badge>
    </AppDropdown>
  );
}

export default AccountActions;

const Avatar = styled(AntAvatar)`
  cursor: pointer;
`;

const ArrowDownContainer = styled.div`
  background-color: #6c737f;
  border-radius: 50%;
`;

const UserLabel = styled.div`
  font-weight: bold;
  color: #ffa000;
  cursor: default;
`;
