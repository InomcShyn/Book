import React, { useEffect, useRef, useState } from "react";
import { FlexTable } from "@/components/Atom/FlexTable";
import ShadowCard from "@/components/Atom/ShadowCard";
import { Flex, Form } from "antd";
import { Button } from "@/components/Atom/Button";
import FilterAndSearch from "@/components/Atom/FilterAndSearch";
import useMediaQuery, { mediaQueryPoints } from "@/hooks/useMediaQuery";
import { SlidersHorizontalIcon } from "lucide-react";
import { exportBlobApi, getDataApi } from "@/api";
import { QUERY, ROLE_ACCOUNT } from "@/constants/constants";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import SearchForm from "./component/SearchForm";
import { DownloadOutlined } from "@ant-design/icons";
import { useTableOnChange } from "@/hooks/useTableQuery";
import { API_DAILY_REPORT } from "@/configs/paths/API_PATH";
import { convertDate, exportExcel, formatNumber } from "@/utils/form/common";
import dayjs from "dayjs";
import { useSelector } from "react-redux";
import { selectAuth } from "@/features/Auth/auth.slice";
import FullScreenSpin from "@/components/Atom/FullScreenSpin";

function ReportDaily() {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [query, setQuery] = useState({
    page: QUERY.PAGE,
    size: QUERY.SIZE,
  });
  const [loading, setLoading] = useState(false);
  const handleTableChange = useTableOnChange(setQuery);
  const [openFilter, setOpenFilter] = useState(false);
  const [dataTable, setDataTable] = useState([]);
  const [keySearch, setKeySearch] = useState({});
  const { user } = useSelector(selectAuth);
  const roleUser = user?.userInfo?.role;
  const isFirstLoad = useRef(true);
  const isMobileMdPlus = useMediaQuery(
    `(max-width: ${mediaQueryPoints.mdPlus}px)`
  );
  const [loaddingPage, setLoaddingPage] = useState(false);

  const columns = [
    { title: t("table.no"), dataIndex: "no", key: "no" },
    {
      title: t("report_daily.service"),
      dataIndex: "serviceName",
      key: "serviceName",
    },
    {
      title: t("report_daily.associate"),
      dataIndex: "orgName",
      key: "orgName",
    },
    {
      title: t("report_daily.trans_date"),
      dataIndex: "transDate",
      key: "transDate",
      render: (transDate) => convertDate(transDate, "YYYY-MM-DD"),
    },

    {
      title: t("request_recon.total_trans"),
      children: [
        {
          title: t("request_recon.partner"),
          dataIndex: "orgTotalAmount",
          key: "orgTotalAmount",
          align: "right",
          render: (value) => formatNumber(value),
          width: 120,
        },
        {
          title: "Natcom",
          dataIndex: "natcomTotalAmount",
          key: "natcomTotalAmount",
          align: "right",
          render: (value) => formatNumber(value),
          width: 120,
        },
      ],
    },
    {
      title: t("request_recon.total_trans_number"),
      children: [
        {
          title: t("request_recon.partner"),
          dataIndex: "orgTotalTrans",
          key: "orgTotalTrans",
          align: "right",
          render: (value) => formatNumber(value),
          width: 120,
        },
        {
          title: "Natcom",
          dataIndex: "natcomTotalTrans",
          key: "natcomTotalTrans",
          align: "right",
          render: (value) => formatNumber(value),
          width: 120,
        },
      ],
    },
    {
      title: t("request_recon.total_money"),
      children: [
        {
          title: t("request_recon.partner"),
          dataIndex: "orgTotalMoney",
          key: "orgTotalMoney",
          align: "right",
          render: (value) => formatNumber(value),
          width: 120,
        },
        {
          title: "Natcom",
          dataIndex: "natcomTotalMoney",
          key: "natcomTotalMoney",
          align: "right",
          render: (value) => formatNumber(value),
          width: 120,
        },
      ],
    },
    {
      title: t("request_recon.total_trans_success"),
      children: [
        {
          title: t("request_recon.partner"),
          dataIndex: "orgTotalSuccess",
          key: "orgTotalSuccess",
          align: "right",
          render: (value) => formatNumber(value),
          width: 120,
        },
        {
          title: "Natcom",
          dataIndex: "natcomTotalSuccess",
          key: "natcomTotalSuccess",
          align: "right",
          render: (value) => formatNumber(value),
          width: 120,
        },
      ],
    },
    {
      title: t("associate.create_time"),
      dataIndex: "createTime",
      key: "createTime",
      hiddenColumns: true,
      render: (createTime) => convertDate(createTime),
    },
    {
      title: t("associate.update_time"),
      dataIndex: "updateTime",
      key: "updateTime",
      hiddenColumns: true,
      render: (updateTime) => convertDate(updateTime),
    },
  ];

  const onSearch = async () => {
    const value = form.getFieldsValue();
    const dataSearch = {
      ...query,
      ...value,
    };
    if (roleUser == ROLE_ACCOUNT.PARTNER)
      dataSearch.orgId = user?.userInfo?.orgId;
    if (value?.transDateFrom && value?.transDateTo) {
      dataSearch.transDateFrom = dayjs(value.transDateFrom)
        .startOf("day")
        .format("YYYY-MM-DDTHH:mm:ss");
      dataSearch.transDateTo = dayjs(value.transDateTo)
        .endOf("day")
        .format("YYYY-MM-DDTHH:mm:ss");
    }
    try {
      setLoading(true);
      const response = await getDataApi(API_DAILY_REPORT, dataSearch);
      if (response.code == "00") {
        setDataTable(response);
        setKeySearch(dataSearch);
      } else toast.error(t("toast.error"));
    } catch (error) {
      toast.error(t("toast.error"));
    } finally {
      setLoading(false);
    }
  };

  const onExport = async () => {
    setLoaddingPage(true);
    try {
      const response = await exportBlobApi(
        API_DAILY_REPORT + "/excel",
        keySearch
      );

      if (response.type === "application/json") {
        const text = await response.text();
        const errorData = JSON.parse(text);
        toast.error(errorData?.message || t("toast.export_failed"));
        return;
      }

      const time = dayjs().format("DDMMYYYY");
      exportExcel(response, "Report_daily_" + time);
      toast.success(t("toast.export_success"));
    } catch (error) {
      toast.error(t("toast.export_failed"));
    } finally {
      setLoaddingPage(false);
    }
  };

  const onReset = () => {
    form.resetFields();
    setQuery({
      page: QUERY.PAGE,
      size: QUERY.SIZE,
    });
  };

  useEffect(() => {
    if (isFirstLoad.current) {
      isFirstLoad.current = false;
      return;
    }
    onSearch(query);
  }, [query]);

  return (
    <>
      {isMobileMdPlus ? (
        <Flex justify="flex-end" style={{ marginBottom: 10 }}>
          <Button
            type="text"
            icon={<SlidersHorizontalIcon size={14} />}
            onClick={() => setOpenFilter(true)}
          >
            {t("button.filter_search")}
          </Button>
        </Flex>
      ) : (
        <ShadowCard>
          <SearchForm
            form={form}
            onFinish={onSearch}
            onReset={onReset}
            roleUser={roleUser}
          />
        </ShadowCard>
      )}

      <FilterAndSearch open={openFilter} setOpen={setOpenFilter}>
        <SearchForm
          isFullWidth={true}
          form={form}
          onFinish={onSearch}
          onReset={onReset}
          roleUser={roleUser}
        />
      </FilterAndSearch>

      <ShadowCard>
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
            marginBottom: 16,
            gap: 8,
          }}
        >
          <Button icon={<DownloadOutlined />} onClick={onExport}>
            {t("button.export")}
          </Button>
        </div>
        <FlexTable
          loading={loading}
          dataSource={dataTable?.data?.map((e, index) => ({
            ...e,
            no: index + 1 + query.page * query.size,
          }))}
          columns={columns}
          pagination={{
            total: dataTable?.pagination?.totalRecords,
            current: query.page,
            pageSize: query.size,
            onChange(page, size) {
              setQuery((prevValue) => ({ ...prevValue, page, size }));
            },
          }}
          onChange={handleTableChange}
        />
      </ShadowCard>
      <FullScreenSpin spinning={loaddingPage} />
    </>
  );
}

export default ReportDaily;
