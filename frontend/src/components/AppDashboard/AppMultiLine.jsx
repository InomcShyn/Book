import { Line } from "@ant-design/plots";
import { formatDataNumberToen } from "@/utils/helper/helper";
import { StyledLine } from "./styles";

const AppMultiLine = ({ dataChart, field = {}, startDate = '2025-08-12', endDate = '2025-08-13' }) => {
  const config = {
    data: dataChart,
    xField: field.x,
    yField: field.y,
    seriesField: field.series,
    color: ["#5B8FF9", "#5AD8A6"],
    point: {
      shapeField: "square",
      sizeField: 4,
    },
    yAxis: {
      label: {
        formatter: (v) => ` ${formatDataNumberToen(+v)}` ,
      },
    },
    tooltip: {
      formatter: (datum) => ({
        name: 'Total',
        value: `${formatDataNumberToen(+datum[field.y])}`, // chiều cao o-y là giá trị
      }),
    },
    lineStyle: ({ category }) => {
      return {
        lineDash: category === endDate ? [4, 4] : null,
        opacity: category === startDate ? 0.6 : 1,
      };
    },
  };

  return (
    <StyledLine>
      <div className="line-chart__dashboard">
        <Line {...config} />
      </div>
    </StyledLine>
  );
};

export default AppMultiLine;
