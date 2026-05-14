import React from "react";
import { Button, Dropdown } from "antd";
import { useTranslation } from "react-i18next";
import { ChevronDownIcon } from "lucide-react";
import styled from "styled-components";
import { getLocalstorageData } from "@/utils/helper/localstorage";

const languages = [
  { key: "en", label: "English", flag: "/GB.svg" },
  { key: "vi", label: "Tiếng Việt", flag: "/VN.svg" },
];

function LanguageSwitcher({ showLabel = false }) {
  const { i18n } = useTranslation();
  const raw = getLocalstorageData("i18nextLng");
  const languageActive = raw?.split("-")[0];

  const currentLang =
    languages.find((lang) => lang.key === languageActive) || languages[0];

  const handleLanguageChange = ({ key }) => {
    i18n.changeLanguage(key);
  };

  const menuItems = languages.map((lang) => ({
    key: lang.key,
    label: (
      <LabelContainer>
        <img src={lang.flag} alt={`${lang.label} flag`} />
        <span>{lang.label}</span>
      </LabelContainer>
    ),
  }));

  return (
    <Dropdown
      menu={{
        items: menuItems,
        onClick: handleLanguageChange,
        selectedKeys: [currentLang.key], // <-- highlight full width
      }}
      trigger={["click"]}
      placement="bottomRight"
    >
      <ButtonContainer type="text">
        <div className="language-switcher">
          <img src={currentLang.flag} alt={`${currentLang.label} flag`} />
          {showLabel && <span>{currentLang.label}</span>}
          <ChevronDownIcon size={14} color="#6c737f" />
        </div>
      </ButtonContainer>
    </Dropdown>
  );
}

export default LanguageSwitcher;

const LabelContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;

  img {
    width: 20px;
    height: 20px;
  }
`;

const ButtonContainer = styled(Button)`
  padding: 0 4px;

  .language-switcher {
    display: flex;
    align-items: center;
    gap: 4px;
  }

  img {
    width: 20px;
    height: 20px;
  }
`;
