import styled from "styled-components";
import { Layout, Drawer } from "antd";
const { Sider } = Layout;

export const StyledDrawer = styled(Drawer)`
  overflow-y: auto;
  overflow-x: hidden;
  height: 100vh;
  scrollbar-width: thin;
  background: #1c2536 !important;
  z-index: 12;

  .ant-drawer-body {
    padding: 0;
  }

  .ant-drawer-header {
    background: #1c2536;
    padding: 16px 8px 16px 8px;

    .ant-drawer-header-title {
      flex-direction: row-reverse;
    }
  }

  .ant-drawer-close {
    color: white;
  }

  .ant-layout-sider-trigger {
    background-color: #1c2536;
    max-width: 260px;
  }
  .ant-menu {
    border-inline-end: none !important;
    padding-bottom: 20px;
    background-color: #1c2536 !important;
    .ant-menu-item-selected {
      background-color: #ffffff0a !important;
      &::before {
        content: "";
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        right: 8px;
        width: 7px;
        height: 7px;
        background-color: #57f800;
        box-shadow: 0 0 5px #57f800;
        border-radius: 99px;
      }
    }
  }

  .sider-logo {
    display: flex;
    padding: 0;
    gap: 14px;
    align-items: center;
    img {
      max-width: 54px;
      max-height: 54px;
      transition: max-width 0.2s ease, max-height 0.2s ease;

      &.logo-collapsed {
        max-width: 45px;
        max-height: 45px;
      }
    }
    p {
      color: white;
      font-weight: bold;
      font-size: 16px;
      margin: 0;
      span {
        display: block;
      }
    }
  }
`;

export const StyledSider = styled(Sider)`
  overflow-y: auto;
  overflow-x: hidden;
  height: 100vh;
  position: sticky;
  inset-inline-start: 0;
  top: 0;
  bottom: 0;
  scrollbar-width: thin;
  background-color: #1c2536;
  z-index: 12;

  .ant-layout-sider-trigger {
    background-color: #1c2536;
    max-width: ${(props) => (props.collapsed ? "70px" : "260px")};
  }
  .ant-menu {
    border-inline-end: none !important;
    padding-bottom: 60px;
    background-color: #1c2536 !important;
    .ant-menu-item-selected {
      background-color: inherit !important;

      .active {
        &::before {
          background-color: #ffffff0a;
          margin: 0 2px;
          border-radius: 8px;
        }
      }
      &::before {
        content: "";
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        right: 8px;
        width: 7px;
        height: 7px;
        background-color: #57f800;
        box-shadow: 0 0 5px #57f800;
        border-radius: 99px;
      }
    }
  }

  .sider-logo {
    display: flex;
    padding: 16px;
    gap: 14px;
    align-items: center;
    img {
      max-width: 54px;
      max-height: 54px;
      transition: max-width 0.2s ease, max-height 0.2s ease;

      &.logo-collapsed {
        max-width: 45px;
        max-height: 45px;
      }
    }
    p {
      color: white;
      font-weight: bold;
      font-size: 20px;
      margin: 0;
      span {
        display: block;
      }
    }
  }
`;

export const ToggleSider = styled.div.withConfig({
  shouldForwardProp: (prop) => prop !== "collapsed",
})`
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 48px;
  background: #1c2536;
  color: white;
  width: 100%;

  svg {
    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    transform: ${(props) =>
      props.collapsed ? "rotate(180deg)" : "rotate(0deg)"};
  }

  &:hover svg {
    transform: ${(props) =>
      props.collapsed
        ? "rotate(180deg) scale(1.1)"
        : "rotate(0deg) scale(1.1)"};
  }
`;

export const LabelUppercase = styled.span`
  font-size: 14px;
  text-transform: uppercase;
  font-weight: 600;
  letter-spacing: 0.5px;
  color: rgba(255, 255, 255, 0.65);
  transition: font-size 0.2s ease;

  .ant-layout-sider-collapsed & {
    font-size: 10px;
  }
`;

export const Label = styled.span`
  font-weight: 500;
`;
