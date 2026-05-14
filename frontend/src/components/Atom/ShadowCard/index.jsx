import { mediaQueryPoints } from "@/hooks/useMediaQuery";
import React from "react";
import styled from "styled-components";

const ShadowCard = ({
  children,
  className = "",
  title = "",
  icon = null,
  bordered = false,
}) => {
  return (
    <ContainerShadowCard className={`${className}`} bordered={bordered}>
      <span className="item-detail">
        {icon && <span className="item-icon">{icon}</span>}
        {title}
      </span>
      {children}
    </ContainerShadowCard>
  );
};

export default ShadowCard;

const ContainerShadowCard = styled.div.withConfig({
  shouldForwardProp: (prop) => prop !== "bordered",
})`
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  padding: 10px 12px;
  margin-bottom: 8px;
  border-radius: 8px;
  border: ${(props) => (props.bordered ? "1px solid #e8e8e8" : "none")};
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;

  .item-detail {
    font-size: 16px;
    font-weight: bold;
    display: flex;
    align-items: center;
  }

  .item-icon {
    margin: 15px 15px 15px 0;
    display: inline-block;
  }

  @media (min-width: ${mediaQueryPoints.md}px) {
    padding: 16px;
    margin-bottom: 16px;
  }

  @media (min-width: ${mediaQueryPoints.lg}px) {
    padding: 20px;
    margin-bottom: 24px;
  }
`;
