import styled from "styled-components";
import { Segmented } from "antd";

const StyledSegmented = styled(Segmented)`
  background: #f8f8ff;
  border-radius: 15px;
  color: #9291a5;

  .ant-segmented-item {
    border-radius: 15px;
    &:active,
    &:hover {
      color: #9291a5 !important;
    }
    &.ant-segmented-item-selected {
      background-color: #ffa000 !important;
      color: #fff !important;
      &:hover {
        background-color: darken(#ffa000, 5%) !important;
      }
    }

    padding: 4px 12px;
    .ant-segmented-item-label {
      font-size: 12px;
    }
  }

  @media (min-width: 992px) {
    padding: 8px 14px;

    .ant-segmented-item {
      padding: 8px 16px;
      .ant-segmented-item-label {
        font-size: 14px;
      }
    }
  }

  @media (min-width: 768px) {
    padding: 8px 12px;

    .ant-segmented-item {
      padding: 8px 14px;
      .ant-segmented-item-label {
        font-size: 14px;
      }
    }
  }

  .ant-segmented-thumb {
    background-color: #ffa000;
    border-radius: 15px;
  }
`;

export { StyledSegmented };
