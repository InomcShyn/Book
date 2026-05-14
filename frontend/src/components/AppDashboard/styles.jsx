import styled from "styled-components";

export const StyledLine = styled.div`
  overflow: auto;
  .line-chart__dashboard {
    min-width: ${(props) => (props.minWidth || "1000px")};;
    overflow: auto;
  }
`;
