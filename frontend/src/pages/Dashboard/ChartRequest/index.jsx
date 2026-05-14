import React, { useEffect, useState } from "react";
import ShadowCard from "@/components/Atom/ShadowCard";
import { Button, Flex, Form } from "antd";
import FlexLine from "@/components/Atom/Line";
import { formatDataNumberToen } from "@/utils/helper/helper";
import useMediaQuery, { mediaQueryPoints } from "@/hooks/useMediaQuery";
import FilterAndSearch from "@/components/Atom/FilterAndSearch";
import { SlidersHorizontalIcon } from "lucide-react";
import { API_REQUEST } from "@/configs/paths/API_PATH";
import { getDataApi } from "@/api";
import dayjs from "dayjs";
import { useTranslation } from "react-i18next";
import SearchFormBasic from "./component/SearchFormBasic";

function ChartRequest() {
  const [form] = Form.useForm();

  const isMobileMdPlus = useMediaQuery(`(max-width: ${mediaQueryPoints.xl}px)`);
  const [openFilter, setOpenFilter] = useState(false);
  const [chartRawData, setChartRawData] = useState([]);
  const { t } = useTranslation();

  const onGetChart = async () => {
    const value = form.getFieldsValue();
    const dataSearch = value;
    dataSearch.transDateFrom = dayjs(value.transDateFrom)
      .startOf("day")
      .format("YYYY-MM-DDTHH:mm:ss");
    dataSearch.transDateTo = dayjs(value.transDateTo)
      .endOf("day")
      .format("YYYY-MM-DDTHH:mm:ss");

    try {
      const response = await getDataApi(API_REQUEST + "/chart", dataSearch);
      if (response.code == "00") setChartRawData(response.data);
      else toast.error(t("toast.error"));
    } catch (error) {
      toast.error(t("toast.error"));
    }
  };

  const formatDateToDDMM = (dateStr) => {
    const date = new Date(dateStr);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    return `${day}/${month}`;
  };

  const generateChartConfig = (data, colors) => {
    const baseConfig = {
      data,
      xField: "date",
      yField: "value",
      seriesField: "type",
      color: colors,
      point: {
        shapeField: "square",
        sizeField: 4,
      },
      yAxis: {
        label: {
          formatter: (v) => ` ${formatDataNumberToen(+v)}`,
        },
      },
      tooltip: {
        formatter: (datum) => ({
          name: datum.type,
          value: `${formatDataNumberToen(+datum.value)}`,
        }),
      },
      lineStyle: {
        lineWidth: 2,
        lineDash: [4, 4],
      },
      legend: {
        itemName: {
          style: {
            fontSize: 14,
          },
        },
        marker: {
          symbol: "circle",
          style: {
            r: 3,
          },
        },
        position: "top",
      },
    };
    return baseConfig;
  };

  const convertToChartDataTransaction = (data) => {
    return data
      .map((item) => [
        {
          date: formatDateToDDMM(item?.createTime),
          value: item?.totalRequestCount,
          type: t("chart.total_rq"),
        },
        {
          date: formatDateToDDMM(item?.createTime),
          value: item?.newRequestCount,
          type: t("chart.total_rq_new"),
        },
        {
          date: formatDateToDDMM(item?.createTime),
          value: item?.processingRequestCount,
          type: t("chart.total_rq_inprogress"),
        },
        {
          date: formatDateToDDMM(item?.createTime),
          value: item?.completedRequestCount,
          type: t("chart.total_rq_success"),
        },
        {
          date: formatDateToDDMM(item?.createTime),
          value: item?.errorRequestCount,
          type: t("chart.total_rq_failed"),
        },
      ])
      .flat();
  };

  const chartDataTransaction = convertToChartDataTransaction(chartRawData);

  const configChartTransaction = generateChartConfig(chartDataTransaction, [
    "#00ffddff",
    "#52C41A",
    "#fbff00ff",
    "#1900ffff",
    "#ff0000ff",
  ]);

  useEffect(() => {
    onGetChart();
  }, []);

  return (
    <>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 12,
        }}
      >
        {isMobileMdPlus && (
          <div style={{ marginLeft: "auto" }}>
            <Button
              type="text"
              icon={<SlidersHorizontalIcon size={14} />}
              onClick={() => setOpenFilter(true)}
            >
              {t("button.filter_search")}
            </Button>
          </div>
        )}
      </div>

      {!isMobileMdPlus && (
        <ShadowCard>
          <SearchFormBasic form={form} onFinish={onGetChart} />
        </ShadowCard>
      )}

      <FilterAndSearch open={openFilter} setOpen={setOpenFilter}>
        <SearchFormBasic isFullWidth={true} form={form} onFinish={onGetChart} />
      </FilterAndSearch>

      <ShadowCard>
        <h2>{t("chart.data_request")}</h2>
        <div style={{ maxWidth: "100%" }}>
          <FlexLine config={configChartTransaction} />
        </div>
      </ShadowCard>
    </>
  );
}

export default ChartRequest;
