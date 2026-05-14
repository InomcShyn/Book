import styled from "styled-components";
import { Layout } from "antd";

const { Header } = Layout;

export const StyledHeader = styled(({ isMobile, ...rest }) => (
  <Header {...rest} />
))`
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  top: 0;
  z-index: 11;
  background: #fff !important;
  padding-inline: 16px;
  position: ${(props) => (props.isMobile ? "sticky" : "relative")};
  width: 100%;
  left: 0;

  .menu-button {
    padding-inline: 8px !important;
  }
`;

export const HeaderGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;

  @media (min-width: 768px) {
    width: 100%;
    justify-content: flex-end;
  }

  @media (min-width: 576px) {
    gap: 8px;
  }

  .header-button {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0;
    width: 40px;
    height: 40px;
    border-radius: 99px;
  }
`;
