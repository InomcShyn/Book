import React, { useEffect, useState } from "react";
import ShadowCard from "@/components/Atom/ShadowCard";
import { Button, Flex, Form } from "antd";
import FlexLine from "@/components/Atom/Line";
import { formatDataNumberToen } from "@/utils/helper/helper";
import useMediaQuery, { mediaQueryPoints } from "@/hooks/useMediaQuery";
import FilterAndSearch from "@/components/Atom/FilterAndSearch";
import { StyledSegmented } from "./component/styles";
import { SlidersHorizontalIcon } from "lucide-react";
import SearchForm from "./component/SearchForm";
import { API_DAILY_REPORT, API_MONTHLY_REPORT } from "@/configs/paths/API_PATH";
import { getDataApi } from "@/api";
import dayjs from "dayjs";
import { useTranslation } from "react-i18next";
import SearchFormBasic from "./component/SearchFormBasic";

function ChartTransaction() {
  const [form] = Form.useForm();

  const isMobileMdPlus = useMediaQuery(`(max-width: ${mediaQueryPoints.xl}px)`);
  const [openFilter, setOpenFilter] = useState(false);
  const [valueTab, setValueTab] = useState(1);
  const [typeSearch, setTypeSearch] = useState(1);
  const [chartRawData, setChartRawData] = useState([]);
  const { t } = useTranslation();

  const onGetChart = async () => {
    const value = form.getFieldsValue();
    const dataSearch = value;
    if (value?.transDateFrom && value?.transDateTo) {
      if (valueTab == 1) {
        dataSearch.transDateFrom = dayjs(value.transDateFrom)
          .startOf("day")
          .format("YYYY-MM-DDTHH:mm:ss");
        dataSearch.transDateTo = dayjs(value.transDateTo)
          .endOf("day")
          .format("YYYY-MM-DDTHH:mm:ss");
      } else {
        dataSearch.transDateFrom = dayjs(value.transDateFrom)
          .startOf("month")
          .format("YYYY-MM-DDTHH:mm:ss");
        dataSearch.transDateTo = dayjs(value.transDateTo)
          .endOf("month")
          .format("YYYY-MM-DDTHH:mm:ss");
      }
    }
    let response;
    try {
      if (valueTab == 1) {
        response = await getDataApi(API_DAILY_REPORT + "/chart", dataSearch);
      } else {
        response = await getDataApi(API_MONTHLY_REPORT + "/chart", dataSearch);
      }
      if (response.code == "00") setChartRawData(response.data);
      else toast.error(t("toast.error"));
    } catch (error) {
      toast.error(t("toast.error"));
    }
  };

  const onChangeTab = (value) => {
    setValueTab(value);
  };

  const formatDateToDDMM = (dateStr) => {
    const date = new Date(dateStr);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    return `${day}/${month}`;
  };

  const formatDateToMMYYYY = (dateStr) => {
    const date = new Date(dateStr);
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${month}/${year}`;
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
          date:
            valueTab == 1
              ? formatDateToDDMM(item?.transDate)
              : formatDateToMMYYYY(item?.transDate),
          value: item?.natcomTotalAmount,
          type: t("report_daily.natcom_total_trans"),
        },
        {
          date:
            valueTab == 1
              ? formatDateToDDMM(item?.transDate)
              : formatDateToMMYYYY(item?.transDate),
          value: item?.orgTotalAmount,
          type: t("report_daily.asso_total_trans"),
        },
        {
          date:
            valueTab == 1
              ? formatDateToDDMM(item?.transDate)
              : formatDateToMMYYYY(item?.transDate),
          value: item?.totalAmountDiff,
          type: t("report_daily.total_mm_trans"),
        },
      ])
      .flat();
  };

  const convertToChartDataMoney = (data) => {
    return data
      .map((item) => [
        {
          date:
            valueTab == 1
              ? formatDateToDDMM(item?.transDate)
              : formatDateToMMYYYY(item?.transDate),
          value: item?.natcomTotalMoney,
          type: t("report_daily.natcom_total_money"),
        },
        {
          date:
            valueTab == 1
              ? formatDateToDDMM(item?.transDate)
              : formatDateToMMYYYY(item?.transDate),
          value: item?.orgTotalMoney,
          type: t("report_daily.asso_total_money"),
        },
        {
          date:
            valueTab == 1
              ? formatDateToDDMM(item?.transDate)
              : formatDateToMMYYYY(item?.transDate),
          value: item?.totalMoneyDiff,
          type: t("report_daily.total_mm_money"),
        },
      ])
      .flat();
  };

  const convertToChartDataTotalAmount = (data) => {
    return data
      .map((item) => [
        {
          date:
            valueTab == 1
              ? formatDateToDDMM(item?.transDate)
              : formatDateToMMYYYY(item?.transDate),
          value: item?.natcomTotalTrans,
          type: t("report_daily.natcom_total_nb_trans"),
        },
        {
          date:
            valueTab == 1
              ? formatDateToDDMM(item?.transDate)
              : formatDateToMMYYYY(item?.transDate),
          value: item?.orgTotalTrans,
          type: t("report_daily.asso_total_nb_trans"),
        },
        {
          date:
            valueTab == 1
              ? formatDateToDDMM(item?.transDate)
              : formatDateToMMYYYY(item?.transDate),
          value: item?.totalTransDiff,
          type: t("report_daily.total_num_mm_trans"),
        },
        {
          date:
            valueTab == 1
              ? formatDateToDDMM(item?.transDate)
              : formatDateToMMYYYY(item?.transDate),
          value: item?.natcomTotalSuccess,
          type: t("report_daily.natcom_total_nb_trans_succ"),
        },
        {
          date:
            valueTab == 1
              ? formatDateToDDMM(item?.transDate)
              : formatDateToMMYYYY(item?.transDate),
          value: item?.orgTotalSuccess,
          type: t("report_daily.asso_total_nb_trans_succ"),
        },
      ])
      .flat();
  };

  const chartDataTransaction = convertToChartDataTransaction(chartRawData);
  const chartDataMoney = convertToChartDataMoney(chartRawData);
  const chartDataTotalAmount = convertToChartDataTotalAmount(chartRawData);

  const configChartMoney = generateChartConfig(chartDataMoney, [
    "#1890FF",
    "#52C41A",
    "#e418a7ff",
  ]);

  const configChartTransaction = generateChartConfig(chartDataTransaction, [
    "#1890FF",
    "#52C41A",
    "#e418a7ff",
  ]);

  const configChartTotalAmount = generateChartConfig(chartDataTotalAmount, [
    "#ff0000ff",
    "#52C41A",
    "#e418a7ff",
    "#e4fd04ff",
    "#1900ffff",
  ]);

  useEffect(() => {
    onGetChart();
  }, [valueTab]);

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
        <StyledSegmented
          onChange={onChangeTab}
          value={valueTab}
          options={[
            { label: t("chart.daily"), value: 1 },
            { label: t("chart.monthly"), value: 2 },
          ]}
        />
        {typeSearch == 1 && !isMobileMdPlus && (
          <div style={{ marginLeft: "auto" }}>
            <SearchFormBasic
              form={form}
              onFinish={onGetChart}
              valueTab={valueTab}
              onSetTypeSearch={() => setTypeSearch(2)}
            />
          </div>
        )}
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

      <FilterAndSearch open={openFilter} setOpen={setOpenFilter}>
        <SearchForm
          isFullWidth={true}
          form={form}
          onFinish={onGetChart}
          valueTab={valueTab}
          onSetTypeSearch={() => setTypeSearch(1)}
        />
      </FilterAndSearch>
      {typeSearch == 2 && !isMobileMdPlus && (
        <ShadowCard>
          <SearchForm
            form={form}
            onFinish={onGetChart}
            valueTab={valueTab}
            onSetTypeSearch={() => setTypeSearch(1)}
          />
        </ShadowCard>
      )}

      <ShadowCard>
        <h2>{t("chart.data_trans")}</h2>
        <div style={{ maxWidth: "100%" }}>
          <FlexLine config={configChartTransaction} />
        </div>
      </ShadowCard>

      <ShadowCard>
        <h2>{t("chart.data_money")}</h2>
        <div style={{ maxWidth: "100%" }}>
          <FlexLine config={configChartMoney} />
        </div>
      </ShadowCard>

      <ShadowCard>
        <h2>{t("chart.data_number_trans")}</h2>
        <div style={{ maxWidth: "100%" }}>
          <FlexLine config={configChartTotalAmount} />
        </div>
      </ShadowCard>
    </>
  );
}

export default ChartTransaction;
