import { Line } from "@ant-design/plots";
import styled from "styled-components";

const FlexLine = ({ config }) => {
  return (
    <Container>
      <div className="line-chart__dashboard">
        <Line {...config} />
      </div>
    </Container>
  );
};

const Container = styled.div`
  overflow: auto;
  .line-chart__dashboard {
    min-width: 1000px;
    overflow: auto;
  }
`;
export default FlexLine;
