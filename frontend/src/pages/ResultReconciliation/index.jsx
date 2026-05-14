import React, { useEffect, useRef, useState } from "react";
import { FlexTable } from "@/components/Atom/FlexTable";
import ShadowCard from "@/components/Atom/ShadowCard";
import { DownloadOutlined, DownOutlined } from "@ant-design/icons";
import {
  Col,
  Dropdown,
  Flex,
  Form,
  Menu,
  Row,
  Space,
  Statistic,
  Tooltip,
} from "antd";
import { Button } from "@/components/Atom/Button";
import FilterAndSearch from "@/components/Atom/FilterAndSearch";
import useMediaQuery, { mediaQueryPoints } from "@/hooks/useMediaQuery";
import { SlidersHorizontalIcon } from "lucide-react";
import { exportBlobApi, getDataApi, postDataApi } from "@/api";
import { QUERY, ROLE_ACCOUNT } from "@/constants/constants";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import SearchForm from "./component/SearchForm";
import DetailForm from "./component/DetailForm";
import { actionCode, getActionText } from "@/utils/form/action";
import { getStatusResultRecon } from "@/assets/data/categoryData";
import { ActionMenu } from "@/components/Atom/ActionMenu";
import {
  API_RECON_RESULT,
  API_RECON_RESULT_ALL,
  API_RECON_RESULT_NATCOM_DOWNLOAD,
  API_RECON_RESULT_ORG_DOWNLOAD,
} from "@/configs/paths/API_PATH";
import { useTableOnChange } from "@/hooks/useTableQuery";
import dayjs from "dayjs";
import {
  convertDate,
  exportExcel,
  exportFileBlob,
  formatNumber,
} from "@/utils/form/common";
import { useSelector } from "react-redux";
import { selectAuth } from "@/features/Auth/auth.slice";
import TooltipTable from "../Components/TooltipTable";
import { ModalConfirm } from "@/components/Atom/ModalConfirm";
import ExportReport from "./component/ExportReport";
import CommonActionIcon from "@/components/Atom/CommonActionIcon";
import {
  faEye,
  faCheck,
  faRotateLeft,
  faXmark,
  faFileCircleXmark,
} from "@fortawesome/free-solid-svg-icons";
import { useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styled from "styled-components";
import FullScreenSpin from "@/components/Atom/FullScreenSpin";
import { useSortTable } from "@/hooks/useSortTable";
function ResultReconciliation() {
  const { t } = useTranslation();
  const StatusResultRecon = getStatusResultRecon(t);
  const isSearchAction = useRef(false);
  const [form] = Form.useForm();
  const [openModal, setOpenModal] = useState(false);
  const [action, setAction] = useState("");
  const actionText = getActionText(t);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [dataTable, setDataTable] = useState([]);
  const [valueForms, setValueForms] = useState(null);
  const [keySearch, setKeySearch] = useState({});
  const [dataNumber, setDataNumber] = useState({});
  const [loading, setLoading] = useState(false);
  const { user } = useSelector(selectAuth);
  const roleUser = user?.userInfo?.role;
  const isFirstLoad = useRef(true);
  const [query, setQuery] = useState({
    page: QUERY.PAGE,
    size: QUERY.SIZE,
  });
  const handleTableChange = useTableOnChange(setQuery);
  const handleSortTableChange = useSortTable(setQuery, dataTable?.data);
  const [openFilter, setOpenFilter] = useState(false);
  const [typeAction, setTypeAction] = useState("");
  const [titleConfirm, setTitleConfirm] = useState("");
  const [openConfirm, setOpenConfirm] = useState(false);
  const [openExportReport, setOpenExportReport] = useState(false);
  const [loaddingPage, setLoaddingPage] = useState(false);

  const [idsToAction, setIdsToAction] = useState([]);
  const location = useLocation();
  const { dataRequest, parentRecord } = location.state || {};
  const isMobileMdPlus = useMediaQuery(
    `(max-width: ${mediaQueryPoints.mdPlus}px)`,
  );

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
      title: t("menu.request_reconciliation"),
      dataIndex: "requestCode",
      key: "requestCode",
      render: (value, record) => {
        if (!value) return "-";
        return (
          <Tooltip
            styleType="info"
            overlayStyle={{ maxWidth: 500 }}
            title={
              <TooltipTable
                fields={[
                  {
                    label: "Code",
                    value: value,
                  },
                  {
                    label: t("result_recon.run_start_time"),
                    value: convertDate(record?.runStartTime),
                  },
                  {
                    label: t("result_recon.run_end_time"),
                    value: convertDate(record?.runEndTime),
                  },
                ]}
              />
            }
          >
            <Button
              type="link"
              style={{
                padding: 0,
                height: "auto",
                whiteSpace: "normal",
                textAlign: "left",
              }}
            >
              <span
                style={{
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                }}
              >
                {value}
              </span>
            </Button>
          </Tooltip>
        );
      },
    },

    {
      title: t("result_recon.data_source"),
      children: [
        {
          title: t("request_recon.partner"),
          dataIndex: "orgSourceName",
          key: "orgSourceName",
          render: (value, record) => {
            if (!value) return "-";
            return (
              <Tooltip
                styleType="info"
                overlayStyle={{ maxWidth: 500 }}
                title={
                  <TooltipTable
                    fields={[
                      {
                        label: "ID",
                        value: record?.orgSourceId,
                      },
                      {
                        label: t("data_group.name"),
                        value: record?.orgSourceName,
                      },
                      {
                        label: t("data_group.type_src"),
                        value: record?.orgSourceType,
                      },
                      ...(record?.orgSourceType === "UPLOAD" ||
                      record?.orgSourceType === "FTP"
                        ? [
                            {
                              label: t("data_group.fileName"),
                              value: (
                                <span
                                  style={{
                                    color: "#4DA3FF",
                                    cursor: "pointer",
                                    maxWidth: 280,
                                    textDecoration: "underline",
                                    display: "inline-block",
                                    whiteSpace: "nowrap",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                  }}
                                  onClick={() => handleDownload(record)}
                                >
                                  {record?.orgFileName}
                                </span>
                              ),
                            },
                          ]
                        : []),
                    ]}
                  />
                }
              >
                <Button
                  type="link"
                  style={{
                    padding: 0,
                    height: "auto",
                    whiteSpace: "normal",
                    textAlign: "left",
                  }}
                >
                  <span
                    style={{
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                    }}
                  >
                    {value}
                  </span>
                </Button>
              </Tooltip>
            );
          },
        },
        {
          title: "Natcom",
          dataIndex: "natcomSourceName",
          key: "natcomSourceName",
          render: (value, record) => {
            if (!value) return "-";
            return (
              <Tooltip
                styleType="info"
                overlayStyle={{ maxWidth: 500 }}
                title={
                  <TooltipTable
                    fields={[
                      {
                        label: "ID",
                        value: record?.natcomSourceId,
                      },
                      {
                        label: t("data_group.name"),
                        value: record?.natcomSourceName,
                      },
                      {
                        label: t("data_group.type_src"),
                        value: record?.natcomSourceType,
                      },
                      ...(record?.natcomSourceType === "UPLOAD" ||
                      record?.natcomSourceType === "FTP"
                        ? [
                            {
                              label: t("data_group.fileName"),
                              value: (
                                <span
                                  style={{
                                    color: "#4DA3FF",
                                    cursor: "pointer",
                                    textDecoration: "underline",
                                    maxWidth: 280,
                                    display: "inline-block",
                                    whiteSpace: "nowrap",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                  }}
                                  onClick={() => handleDownloadNatcom(record)}
                                >
                                  {record?.natcomFileName}
                                </span>
                              ),
                            },
                          ]
                        : []),
                    ]}
                  />
                }
              >
                <Button
                  type="link"
                  style={{
                    padding: 0,
                    height: "auto",
                    whiteSpace: "normal",
                    textAlign: "left",
                  }}
                >
                  <span
                    style={{
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                    }}
                  >
                    {value}
                  </span>
                </Button>
              </Tooltip>
            );
          },
        },
      ],
    },
    {
      title: t("result_recon.value"),
      children: [
        {
          title: t("request_recon.partner"),
          dataIndex: "orgTxAmount",
          key: "orgTxAmount",
          align: "right",
          width: 100,
          render: (value, record) => {
            if (!value) return "-";
            return (
              <Tooltip
                styleType="info"
                overlayStyle={{ maxWidth: 500 }}
                title={
                  <TooltipTable
                    fields={[
                      {
                        label: t("data_group.id_trans"),
                        value: record?.orgTxId,
                      },
                      {
                        label: t("data_group.value_trans"),
                        value: formatNumber(record?.orgTxAmount),
                      },
                      {
                        label: t("data_group.money_trans"),
                        value: formatNumber(record?.orgMoney),
                      },
                      {
                        label: t("data_group.time_trans"),
                        value: convertDate(record?.orgTxCreateTime),
                      },
                      {
                        label: t("data_group.trans_from"),
                        value: record?.orgTxFrom,
                      },
                      {
                        label: t("data_group.trans_to"),
                        value: record?.orgTxTo,
                      },
                      {
                        label: t("data_group.status_trans"),
                        value: record?.orgTxStatus,
                      },
                      {
                        label: t("data_group.fee_trans"),
                        value: record?.txFee,
                      },
                    ]}
                  />
                }
              >
                <Button type="link">{formatNumber(value)}</Button>
              </Tooltip>
            );
          },
        },
        {
          title: "Natcom",
          dataIndex: "natcomTxAmount",
          key: "natcomTxAmount",
          align: "right",
          width: 100,
          render: (value, record) => {
            if (!value) return "-";
            return (
              <Tooltip
                styleType="info"
                overlayStyle={{ maxWidth: 500 }}
                title={
                  <TooltipTable
                    fields={[
                      {
                        label: t("data_group.id_trans"),
                        value: record?.natcomTxId,
                      },
                      {
                        label: t("data_group.value_trans"),
                        value: formatNumber(record?.natcomTxAmount),
                      },
                      {
                        label: t("data_group.money_trans"),
                        value: formatNumber(record?.natcomMoney),
                      },
                      {
                        label: t("data_group.time_trans"),
                        value: convertDate(record?.natcomTxCreateTime),
                      },
                      {
                        label: t("data_group.trans_from"),
                        value: record?.natcomTxFrom,
                      },
                      {
                        label: t("data_group.trans_to"),
                        value: record?.natcomTxTo,
                      },
                      {
                        label: t("data_group.status_trans"),
                        value: record?.natcomTxStatus,
                      },
                    ]}
                  />
                }
              >
                <Button type="link">{formatNumber(value)}</Button>
              </Tooltip>
            );
          },
        },
      ],
    },
    {
      title: t("report_daily.trans_date"),
      dataIndex: "transDate",
      key: "transDate",
      align: "center",
      render: (transDate) => convertDate(transDate),
    },
    {
      title: t("request_recon.differs"),
      children: [
        {
          title: t("request_recon.value"),
          dataIndex: "diffAmount",
          key: "diffAmount",
          align: "right",
          render: (diffAmount) => formatNumber(Math.abs(diffAmount)),
          width: 90,
        },
        {
          title: t("request_recon.money"),
          dataIndex: "diffMoney",
          key: "diffMoney",
          align: "right",
          render: (diffMoney) => formatNumber(Math.abs(diffMoney)),
          width: 95,
        },
      ],
    },
    {
      title: t("form.status"),
      dataIndex: "status",
      key: "status",
      render: (status) => {
        const statusItem = StatusResultRecon.find(
          (item) => item.value === status,
        );
        const label = statusItem?.label || status;

        const statusColorMap = {
          MATCHED: "#32bea6",
          MISMATCHED: "red",
          NATCOM_MISSING: "orange",
          PARTNER_MISSING: "#008cffff",
        };

        const color = statusColorMap[status] || "black";

        return <span style={{ color, fontWeight: 500 }}>{label}</span>;
      },
    },
    {
      title: t("associate.create_time"),
      dataIndex: "createTime",
      key: "createTime",
      hiddenColumns: true,
      align: "center",
      render: (createTime) => convertDate(createTime),
    },
    {
      title: t("associate.update_time"),
      dataIndex: "updateTime",
      key: "updateTime",
      hiddenColumns: true,
      align: "center",
      render: (updateTime) => convertDate(updateTime),
    },
    {
      title: t("table.action"),
      key: "action",
      width: 95,
      align: "center",
      render: (record) => {
        const actions = [
          {
            key: "view",
            label: <CommonActionIcon icon={faEye} label={t("button.view")} />,
            onClick: handleView,
          },
          {
            key: "approve",
            label: (
              <CommonActionIcon
                icon={faCheck}
                label={t("result_recon.approve")}
              />
            ),
            onClick: () => handleAction(record, "approve"),
            showIf: () => roleUser != ROLE_ACCOUNT.PARTNER,
            disabledIf: (record) =>
              record.natcomSourceName && record.natcomSourceType == "UPLOAD",
          },
          {
            key: "revert",
            label: (
              <CommonActionIcon
                icon={faRotateLeft}
                label={t("result_recon.revert")}
              />
            ),
            onClick: () => handleAction(record, "revert"),
            showIf: () => roleUser != ROLE_ACCOUNT.PARTNER,
            disabledIf: (record) =>
              record.natcomSourceName && record.natcomSourceType == "UPLOAD",
          },
          {
            key: "cancel",
            label: (
              <CommonActionIcon
                icon={faXmark}
                label={t("schedule_recon.cancel_recon")}
              />
            ),
            onClick: () => handleAction(record, "cancel"),
            showIf: () => roleUser != ROLE_ACCOUNT.PARTNER,
            disabledIf: (record) =>
              record.natcomSourceName && record.natcomSourceType == "UPLOAD",
          },
        ];

        return (
          <Space>
            <ActionMenu actions={actions} record={record} />
          </Space>
        );
      },
    },
  ];

  const menu = (
    <Menu>
      <Menu.Item
        key="approve"
        onClick={() => handleBatchAction("approve", t("result_recon.approve"))}
      >
        {t("result_recon.approve")}
      </Menu.Item>
      <Menu.Item
        key="revert"
        onClick={() => handleBatchAction("revert", t("result_recon.revert"))}
      >
        {t("result_recon.revert")}
      </Menu.Item>
      <Menu.Item
        key="cancel"
        onClick={() => handleBatchAction("cancel", t("result_recon.cancel"))}
      >
        {t("result_recon.cancel")}
      </Menu.Item>
    </Menu>
  );

  const handleBatchAction = (type, title) => {
    setIdsToAction(selectedRowKeys);
    setTypeAction(type);
    setTitleConfirm(title);
    setOpenConfirm(true);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: (selectedKeys) => {
      setSelectedRowKeys(selectedKeys);
    },
  };

  const onSearch = async () => {
    const value = form.getFieldsValue();
    const dataSearch = {
      ...query,
      ...value,
    };
    if (value?.transDateFrom && value?.transDateTo) {
      if (dataRequest) {
        dataSearch.transDateFrom = dayjs(value.transDateFrom)
          .startOf("day")
          .format("YYYY-MM-DDTHH:mm:ss");
        dataSearch.transDateTo = dayjs(value.transDateTo)
          .endOf("day")
          .format("YYYY-MM-DDTHH:mm:ss");
      } else {
        dataSearch.transDateFrom = dayjs(value.transDateFrom)
          .startOf("day")
          .format("YYYY-MM-DDTHH:mm:ss");
        dataSearch.transDateTo = dayjs(value.transDateTo)
          .endOf("day")
          .format("YYYY-MM-DDTHH:mm:ss");
      }
    }
    if (roleUser == ROLE_ACCOUNT.PARTNER)
      dataSearch.orgId = user?.userInfo?.orgId;
    try {
      setLoading(true);
      const response = await getDataApi(API_RECON_RESULT, dataSearch);
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

  const onGetDataNumber = async () => {
    const value = form.getFieldsValue();
    const dataSearch = {
      ...query,
      ...value,
    };
    delete dataSearch.requestId;
    if (value?.transDateFrom && value?.transDateTo) {
      dataSearch.transDateFrom = dayjs(value.transDateFrom)
        .startOf("day")
        .format("YYYY-MM-DDTHH:mm:ss");
      dataSearch.transDateTo = dayjs(value.transDateTo)
        .endOf("day")
        .format("YYYY-MM-DDTHH:mm:ss");
    }
    if (roleUser == ROLE_ACCOUNT.PARTNER)
      dataSearch.orgId = user?.userInfo?.orgId;

    try {
      const response = await getDataApi(API_RECON_RESULT_ALL, dataSearch);
      if (response.code == "00") {
        setDataNumber(response.data);
      }
    } catch (error) {}
  };

  const onGetDetail = async (id) => {
    try {
      const response = await getDataApi(API_RECON_RESULT + "/" + id);
      if (response.code == "00") {
        setValueForms(response?.data);
      } else toast.error(response?.message || t("toast.error"));
    } catch (error) {
      toast.error(t("toast.error"));
    }
  };

  const onAction = async (actionType, ids) => {
    setOpenConfirm(false);
    let response;
    setLoaddingPage(true);
    try {
      if (!Array.isArray(ids)) ids = [ids];

      const endpoint = `${API_RECON_RESULT}/${actionType}`;
      response = await postDataApi(endpoint, ids);

      if (response.code === "00") {
        toast.success(t("toast.success"));
        onSearch();
      } else {
        toast.error(response?.message || t("toast.error"));
      }
    } catch (error) {
      toast.error(t("toast.error"));
    } finally {
      setLoaddingPage(false);
    }
  };

  const handleDownload = async (record) => {
    setLoaddingPage(true);
    try {
      const response = await exportBlobApi(
        `${API_RECON_RESULT_ORG_DOWNLOAD}/download/${record.orgDataId}`,
      );
      if (response.type == "application/json") {
        toast.error(t("toast.export_failed"));
        return;
      }
      exportFileBlob(response, record.orgFileName);
      toast.success(t("toast.success"));
    } catch (error) {
      toast.error(t("toast.export_failed"));
    } finally {
      setLoaddingPage(false);
    }
  };

  const handleDownloadNatcom = async (record) => {
    setLoaddingPage(true);
    try {
      const response = await exportBlobApi(
        `${API_RECON_RESULT_NATCOM_DOWNLOAD}/download/${record.natcomDataId}`,
      );
      if (response.type == "application/json") {
        toast.error(t("toast.export_failed"));
        return;
      }
      exportFileBlob(response, record.natcomFileName);
      toast.success(t("toast.success"));
    } catch (error) {
      toast.error(t("toast.export_failed"));
    } finally {
      setLoaddingPage(false);
    }
  };

  const onExport = async () => {
    setLoaddingPage(true);
    try {
      const response = await exportBlobApi(
        API_RECON_RESULT + "/excel",
        keySearch,
      );

      if (response.type === "application/json") {
        const text = await response.text();
        const errorData = JSON.parse(text);
        toast.error(errorData?.message || t("toast.export_failed"));
        return;
      }

      const time = dayjs().format("DDMMYYYYHHmmss");
      exportExcel(response, "Result_recon_" + time);
      toast.success(t("toast.export_success"));
    } catch (error) {
      toast.error(t("toast.export_failed"));
    } finally {
      setLoaddingPage(false);
    }
  };

  const onExportReport = async (values) => {
    const keySearch = {
      transDateFrom: dayjs(values?.transDateFrom)
        .startOf("month")
        .startOf("day")
        .format("YYYY-MM-DDTHH:mm:ss"),
      transDateTo: dayjs(values?.transDateFrom)
        .endOf("month")
        .endOf("day")
        .format("YYYY-MM-DDTHH:mm:ss"),
      serviceId: values.serviceId,
      orgId: values.orgId,
    };

    try {
      const response = await exportBlobApi(
        API_RECON_RESULT + "/report",
        keySearch,
      );

      if (response.type === "application/json") {
        const text = await response.text();
        const errorData = JSON.parse(text);
        toast.error(errorData?.message || t("toast.export_failed"));
        return;
      }

      exportExcel(response, "result_reconciliation");
      toast.success(t("toast.export_success"));
    } catch (error) {
      toast.error(t("toast.export_failed"));
    }
  };

  const onSubmitForm = (values) => {
    isSearchAction.current = true;
    setQuery((pre) => ({
      ...pre,
      page: QUERY.PAGE,
      ...values,
    }));
  };

  const handleView = (record) => {
    setAction(actionCode.VIEW);
    setOpenModal(true);
    onGetDetail(record.id);
  };

  const handleAction = (record, type) => {
    onAction(type, [record.id]);
  };

  const handleExportReport = () => {
    setOpenExportReport(true);
  };

  const onReset = () => {
    form.resetFields();
    // setQuery({
    //   page: QUERY.PAGE,
    //   size: QUERY.SIZE,
    // });
    setDataTable([]);
  };

  useEffect(() => {
    if (!dataRequest) return;

    if (dataRequest) {
      form.setFieldsValue({
        transDateFrom: dayjs(parentRecord?.fromTime),
        transDateTo: dayjs(parentRecord?.toTime),
        requestRunId: dataRequest?.id,
        orgId: dataRequest.orgId,
        serviceId: dataRequest.serviceId,
        // scheduleId: dataRequest.requestId,
        requestId: dataRequest.requestId,
      });
    }
    setTimeout(() => {
      onSearch();
      onGetDataNumber();
    }, 0);
  }, [dataRequest]);

  useEffect(() => {
    if (isFirstLoad.current) {
      isFirstLoad.current = false;
      return;
    }
    onSearch();

    if (isSearchAction.current) {
      onGetDataNumber();
      isSearchAction.current = false;
    }
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
            onFinish={onSubmitForm}
            onReset={onReset}
            roleUser={roleUser}
            dataRequest={dataRequest}
          />
        </ShadowCard>
      )}

      <FilterAndSearch open={openFilter} setOpen={setOpenFilter}>
        <SearchForm
          isFullWidth={true}
          form={form}
          onFinish={onSubmitForm}
          onReset={onReset}
          roleUser={roleUser}
          dataRequest={dataRequest}
        />
      </FilterAndSearch>
      <Row gutter={16}>
        <Col xs={24} sm={12} md={12} lg={6}>
          <ShadowCard bordered>
            <Statistic
              title={
                <StatisticTitle>
                  {t("result_recon.total_matched_trans")}
                </StatisticTitle>
              }
              value={dataNumber?.matchedTransactionCount || 0}
              prefix={
                <IconContainer color="#32bea6">
                  <FontAwesomeIcon icon={faCheck} color="white" fontSize={16} />
                </IconContainer>
              }
            />
          </ShadowCard>
        </Col>
        <Col xs={24} sm={12} md={12} lg={6}>
          <ShadowCard bordered>
            <Statistic
              title={
                <StatisticTitle>
                  {t("result_recon.total_unmatched_trans")}
                </StatisticTitle>
              }
              value={dataNumber?.misMatchedTransactionCount || 0}
              prefix={
                <IconContainer color="#fde9e7">
                  <FontAwesomeIcon icon={faXmark} color="red" fontSize={16} />
                </IconContainer>
              }
            />
          </ShadowCard>
        </Col>
        <Col xs={24} sm={12} md={12} lg={6}>
          <ShadowCard bordered>
            <Statistic
              title={
                <StatisticTitle>
                  {t("result_recon.partner_no_trans")}
                </StatisticTitle>
              }
              value={dataNumber?.partnerMissingTransactionCount || 0}
              prefix={
                <IconContainer color="#d0e5f5ff">
                  <FontAwesomeIcon
                    icon={faFileCircleXmark}
                    color="#1677ff"
                    fontSize={16}
                  />
                </IconContainer>
              }
            />
          </ShadowCard>
        </Col>
        <Col xs={24} sm={12} md={12} lg={6}>
          <ShadowCard bordered>
            <Statistic
              title={
                <StatisticTitle>
                  {t("result_recon.natcom_no_trans")}
                </StatisticTitle>
              }
              value={dataNumber?.natcomMissingTransactionCount || 0}
              prefix={
                <IconContainer color="#f5ecbeff">
                  <FontAwesomeIcon
                    icon={faFileCircleXmark}
                    color="#faad14"
                    fontSize={16}
                  />
                </IconContainer>
              }
            />
          </ShadowCard>
        </Col>
      </Row>

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
          {/* <Button icon={<DownloadOutlined />} onClick={handleExportReport}>
            {t("result_recon.export_report")}
          </Button> */}

          <Button icon={<DownloadOutlined />} onClick={onExport}>
            {t("button.export")}
          </Button>
          {selectedRowKeys.length ? (
            <>
              <Dropdown overlay={menu} trigger={["click"]}>
                <Button type="primary" htmlType="button">
                  {t("table.action")} <DownOutlined />
                </Button>
              </Dropdown>
            </>
          ) : null}
        </div>
        <FlexTable
          loading={loading}
          dataSource={dataTable?.data?.map((e, index) => ({
            ...e,
            no: index + 1 + query.page * query.size,
          }))}
          columns={columns}
          rowSelection={rowSelection}
          pagination={{
            total: dataTable?.pagination?.totalRecords,
            current: query.page,
            pageSize: query.size,
            onChange(page, size) {
              setQuery((prevValue) => ({ ...prevValue, page, size }));
            },
          }}
          onChange={handleSortTableChange}
        />
      </ShadowCard>

      <ModalConfirm
        onConfirm={() => onAction(typeAction, idsToAction)}
        onCancel={() => setOpenConfirm(false)}
        open={openConfirm}
        title={titleConfirm}
        confirmText={t("form.confirm.confirm")}
      />

      {openExportReport && (
        <ExportReport
          onFinish={onExportReport}
          onCancel={() => setOpenExportReport(false)}
          open={openExportReport}
          roleUser={roleUser}
        />
      )}

      {openModal && (
        <DetailForm
          onCancel={() => setOpenModal(false)}
          open={openModal}
          title={actionText[action]}
          action={action}
          disabled={action == actionCode.VIEW ? true : false}
          setValueForm={valueForms}
        />
      )}
      <FullScreenSpin spinning={loaddingPage} />
    </>
  );
}

export default ResultReconciliation;

const IconContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px;
  border-radius: 50%;
  background-color: ${(props) => props.color || "transparent"};
  margin-right: 12px;
`;

const StatisticTitle = styled.span`
  color: "#000";
  font-size: 14px;
  font-weight: 600;
`;
