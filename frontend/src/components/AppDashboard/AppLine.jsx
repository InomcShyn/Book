import React from "react";
import { Line } from "@ant-design/plots";
import { StyledLine } from "./styles";

export default function AppLine({dataChar = []}) {
  const config = {
    data: dataChar,
    padding: "auto",
    xField: "minus",
    yField: "value",
    xAxis: {
      tickCount: 5,
    },
    slider: {
      start: 0,
      end: 0.2,
    },
  };
  return (
    <StyledLine minWidth = "2000px">
      <div className="line-chart__dashboard">
        <Line {...config} />
      </div>
    </StyledLine>
  );
}
