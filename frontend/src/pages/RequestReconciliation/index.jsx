import React, { useEffect, useState } from "react";
import { FlexTable } from "@/components/Atom/FlexTable";
import ShadowCard from "@/components/Atom/ShadowCard";
import { PlusOutlined } from "@ant-design/icons";
import { Flex, Form, Space, Spin } from "antd";
import { DeleteModalConfirm } from "@/components/Atom/DeleteModalConfirm";
import { Button } from "@/components/Atom/Button";
import FilterAndSearch from "@/components/Atom/FilterAndSearch";
import useMediaQuery, { mediaQueryPoints } from "@/hooks/useMediaQuery";
import { SlidersHorizontalIcon } from "lucide-react";
import {
  deleteDataApi,
  exportBlobApi,
  getDataApi,
  patchDataApi,
  postDataApi,
  putDataApi,
} from "@/api";
import { QUERY, ROLE_ACCOUNT } from "@/constants/constants";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import SearchForm from "./component/SearchForm";
import DetailForm from "./component/DetailForm";
import { actionCode, getActionText } from "@/utils/form/action";
import { getStatusRequest } from "@/assets/data/categoryData";
import { ActionMenu } from "@/components/Atom/ActionMenu";
import { API_REQUEST } from "@/configs/paths/API_PATH";
import { useTableOnChange } from "@/hooks/useTableQuery";
import { convertDate, convertTime, exportExcel } from "@/utils/form/common";
import { ModalConfirm } from "@/components/Atom/ModalConfirm";
import CommonActionIcon from "@/components/Atom/CommonActionIcon";
import {
  faCheck,
  faDownload,
  faEye,
  faFileCircleCheck,
  faFileCircleXmark,
  faPenToSquare,
  faTrash,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { showErrorMessageFromResponse } from "@/utils/form/errorHandler";
import { formatNumber, formatNumber_2 } from "@/utils/formatters";
import StatusTag from "@/components/Atom/StatusTag/StatusTag";
import { useSelector } from "react-redux";
import { selectAuth } from "@/features/Auth/auth.slice";
import PATH from "@/configs/paths/PATH";
import { useNavigate } from "react-router-dom";
import Spinning from "@/components/Atom/Spinning";
import SingleActionIcon from "@/components/Atom/SingleActionIcon";
import dayjs from "dayjs";

function RequestReconciliation() {
  const { t } = useTranslation();
  const RequestStatus = getStatusRequest(t);
  const [form] = Form.useForm();
  const [openDelete, setOpenDelete] = useState(false);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [action, setAction] = useState("");
  const [titleConfirm, setTitleConfirm] = useState("");
  const actionText = getActionText(t);
  const [dataTable, setDataTable] = useState([]);
  const [valueForms, setValueForms] = useState(null);
  const [typeAction, setTypeAction] = useState(null);
  const [expandedRowKeys, setExpandedRowKeys] = useState([]);
  const [expandedData, setExpandedData] = useState({});
  const [loaddingPage, setLoaddingPage] = useState(false);
  const [loading, setLoading] = useState(false);
  const [intervals, setIntervals] = useState({});
  const [query, setQuery] = useState({
    page: QUERY.PAGE,
    size: QUERY.SIZE,
  });
  const handleTableChange = useTableOnChange(setQuery);
  const [openFilter, setOpenFilter] = useState(false);
  const [recSelect, setRecSelect] = useState(null);
  const isMobileMdPlus = useMediaQuery(
    `(max-width: ${mediaQueryPoints.mdPlus}px)`,
  );
  const { user } = useSelector(selectAuth);
  const roleUser = user?.userInfo?.role;
  const [idSelect, setIdSelect] = useState(null);
  const navigate = useNavigate();
  // const intervalsRef = useRef({});

  const columns = [
    { title: t("table.no"), dataIndex: "no", key: "no" },
    { title: t("request_recon.name"), dataIndex: "name", key: "name" },
    { title: t("request_recon.code"), dataIndex: "code", key: "code" },
    {
      title: t("schedule_recon.service"),
      dataIndex: "serviceName",
      key: "serviceName",
    },
    {
      title: t("data_group.org_name"),
      dataIndex: "orgName",
      key: "orgName",
    },
    {
      title: t("menu.schedule_reconciliation"),
      dataIndex: "scheduleName",
      key: "scheduleName",
    },
    {
      title: t("request_recon.time_data"),
      children: [
        {
          title: t("request_recon.from_time"),
          dataIndex: "fromTime",
          key: "fromTime",
          render: (value) => convertDate(value),
          align: "center",
          width: 120,
        },
        {
          title: t("request_recon.to_time"),
          dataIndex: "toTime",
          key: "toTime",
          render: (value) => convertDate(value),
          align: "center",
          width: 120,
        },
      ],
    },
    {
      title: t("form.status"),
      dataIndex: "status",
      key: "status",
      width: 200,
      align: "center",
      render: (value) => {
        const label =
          RequestStatus.find((item) => item.value === value)?.label || value;

        return <StatusTag value={value} label={label} />;
      },
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
            key: "update",
            label: (
              <CommonActionIcon
                icon={faPenToSquare}
                label={t("button.update")}
              />
            ),
            onClick: handleUpdate,
            showIf: () => roleUser != ROLE_ACCOUNT.PARTNER,
            disabledIf: (record) => record.status === "NEW",
          },
          {
            key: "delete",
            label: (
              <CommonActionIcon icon={faTrash} label={t("button.delete")} />
            ),
            onClick: handleDelete,
            showIf: () => roleUser != ROLE_ACCOUNT.PARTNER,
            disabledIf: (record) => record.status === "NEW",
          },
          {
            key: "cancel",
            label: (
              <CommonActionIcon icon={faXmark} label={t("button.cancel")} />
            ),
            onClick: () =>
              handleAction(record, "CANCEL", t("request_recon.cancel")),
            showIf: () => roleUser != ROLE_ACCOUNT.PARTNER,
            disabledIf: (record) => record.status === "NEW",
          },
          {
            key: "approve",
            label: (
              <CommonActionIcon
                icon={faCheck}
                // label={t("request_recon.approve")}
                label={
                  record?.status == "NEW"
                    ? t("result_recon.approve")
                    : t("result_recon.run_again")
                }
              />
            ),
            onClick: () =>
              handleAction(record, "APPROVED", t("request_recon.approve")),
            showIf: () => roleUser != ROLE_ACCOUNT.PARTNER,
            disabledIf: (record) =>
              ["NEW", "PROCESSED"].includes(record.status),
          },
          {
            key: "accept_result",
            label: (
              <CommonActionIcon
                icon={faFileCircleCheck}
                label={t("request_recon.accept_result")}
              />
            ),
            onClick: () =>
              handleAction(record, "ACCEPT", t("request_recon.accept_result")),
            showIf: () => roleUser != ROLE_ACCOUNT.PARTNER,
            disabledIf: (record) => record.status === "PROCESSED",
          },
          {
            key: "reject_result",
            label: (
              <CommonActionIcon
                icon={faFileCircleXmark}
                label={t("request_recon.reject_result")}
              />
            ),
            onClick: () =>
              handleAction(record, "REJECT", t("request_recon.reject_result")),
            showIf: () => roleUser != ROLE_ACCOUNT.PARTNER,
            disabledIf: (record) => record.status === "PROCESSED",
          },
          {
            key: "export_report",
            label: (
              <CommonActionIcon
                icon={faDownload}
                label={t("request_recon.export_report")}
              />
            ),
            onClick: () => onExport(record),
            disabledIf: (record) =>
              ["ACCEPT", "PROCESSED"].includes(record.status),
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
  const expandedColumns = [
    {
      title: t("request_recon.time"),
      children: [
        {
          title: t("request_recon.start_time"),
          dataIndex: "startTime",
          key: "startTime",
          align: "center",
          render: (value) => {
            return value !== null && value !== undefined ? (
              convertDate(value)
            ) : (
              <Spinning />
            );
          },
        },
        {
          title: t("request_recon.end_time"),
          dataIndex: "endTime",
          key: "endTime",
          align: "center",
          render: (value) => {
            return value !== null && value !== undefined ? (
              convertDate(value)
            ) : (
              <Spinning />
            );
          },
        },
        {
          title: t("request_recon.end_time_plan"),
          dataIndex: "planEndTime",
          key: "planEndTime",
          align: "center",
          render: (value, record) => {
            if (!value && !record?.endTime) return <Spinning />;
            if (record?.endTime) return "-";
            return convertDate(value);
          },
        },
        {
          title: t("request_recon.spent"),
          dataIndex: "processedTime",
          key: "processedTime",
          align: "center",
          render: (value) => {
            return value !== null && value !== undefined ? (
              convertTime(value)
            ) : (
              <Spinning />
            );
          },
        },
        {
          title: t("request_recon.remaining"),
          dataIndex: "timeLeft",
          key: "timeLeft",
          align: "center",
          render: (value, record) => {
            if (value || value === 0)
              return record?.endTime ? "-" : convertTime(value);
            else return record?.endTime ? "-" : <Spinning />;
          },
        },
      ],
    },
    {
      title: t("request_recon.total_trans"),
      children: [
        {
          title: t("request_recon.partner"),
          dataIndex: "orgTotalAmount",
          key: "orgTotalAmount",
          align: "right",
          width: 135,
          render: (value, record) => {
            if (value) return formatNumber_2(value);
            else return record?.endTime ? "-" : <Spinning />;
          },
        },
        {
          title: "Natcom",
          dataIndex: "natcomTotalAmount",
          key: "natcomTotalAmount",
          align: "right",
          render: (value, record) => {
            if (value) return formatNumber_2(value);
            else return record?.endTime ? "-" : <Spinning />;
          },
          width: 135,
        },
        {
          title: t("request_recon.differs"),
          dataIndex: "amountDiff",
          key: "amountDiff",
          align: "center",
          width: 78,
          render: (value, record) => {
            if (value || value === 0) return value + "%";
            else return record?.endTime ? "-" : <Spinning />;
          },
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
          render: (value, record) => {
            if (value) return formatNumber_2(value);
            else return record?.endTime ? "-" : <Spinning />;
          },
          width: 100,
        },
        {
          title: "Natcom",
          dataIndex: "natcomTotalTrans",
          key: "natcomTotalTrans",
          align: "right",
          render: (value, record) => {
            if (value) return formatNumber_2(value);
            else return record?.endTime ? "-" : <Spinning />;
          },
          width: 100,
        },
        {
          title: t("request_recon.differs"),
          dataIndex: "transDiff",
          key: "transDiff",
          align: "center",
          render: (value, record) => {
            if (value || value === 0) return value + "%";
            else return record?.endTime ? "-" : <Spinning />;
          },
          width: 78,
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
          render: (value, record) => {
            if (value) return formatNumber_2(value);
            else return record?.endTime ? "-" : <Spinning />;
          },
          width: 135,
        },
        {
          title: "Natcom",
          dataIndex: "natcomTotalMoney",
          key: "natcomTotalMoney",
          align: "right",
          render: (value, record) => {
            if (value) return formatNumber_2(value);
            else return record?.endTime ? "-" : <Spinning />;
          },
          width: 135,
        },
        {
          title: t("request_recon.differs"),
          dataIndex: "moneyDiff",
          key: "moneyDiff",
          align: "center",
          width: 78,
          render: (value, record) => {
            if (value || value === 0) return value + "%";
            else return record?.endTime ? "-" : <Spinning />;
          },
        },
      ],
    },
    {
      title: t("request_recon.result"),
      dataIndex: "pass",
      key: "pass",
      width: 80,
      render: (value, record) => {
        if (record?.endTime) {
          switch (value) {
            case true:
              return (
                <div style={{ color: "green" }}>
                  {t("request_recon.achieve")}
                </div>
              );
            case false:
              return (
                <div style={{ color: "red" }}>{t("request_recon.fail")}</div>
              );
            default:
              return "-";
          }
        } else return <Spinning />;
      },
    },
    {
      title: "",
      key: "action",
      width: 50,
      align: "center",
      render: (record) => {
        const isDisabled = record.pass != null;
        return (
          <Space>
            <SingleActionIcon
              icon={faEye}
              onClick={() => handleViewResult(record)}
              disabled={isDisabled}
            />
          </Space>
        );
      },
    },
  ];

  const onSearch = async (value) => {
    // setExpandedRowKeys([]);
    // setExpandedData({});
    const dataSearch = {
      ...query,
      ...value,
    };
    if (roleUser == ROLE_ACCOUNT.PARTNER)
      dataSearch.orgId = user?.userInfo?.orgId;
    try {
      setLoading(true);
      const response = await getDataApi(API_REQUEST, dataSearch);
      if (response.code == "00") {
        if (response.data.length === 0 && query.page > 0) {
          setQuery((prev) => ({ ...prev, page: query.page - 1 }));
          return;
        }
        setDataTable(response);
      } else toast.error(response?.message || t("toast.error"));
    } catch (error) {
      toast.error(t("toast.error"));
    } finally {
      setLoading(false);
    }
  };

  const onGetDetail = async (id) => {
    try {
      const response = await getDataApi(API_REQUEST + "/" + id);
      if (response.code == "00") {
        setValueForms(response?.data);
      } else toast.error(response?.message || t("toast.error"));
    } catch (error) {
      toast.error(t("toast.error"));
    }
  };

  const onGetStatusRequest = async (id) => {
    try {
      const response = await getDataApi(API_REQUEST + "/" + id);
      if (response.code === "00") {
        const newStatus = response.data?.status;
        if (newStatus) {
          setDataTable((prev) => {
            if (!prev?.data) return prev;
            const newData = prev.data.map((item) =>
              item.id === id ? { ...item, status: newStatus } : item,
            );
            return { ...prev, data: newData };
          });
        }
      }
    } catch (error) {}
  };

  const onDelete = async () => {
    setOpenDelete(false);
    try {
      const response = await deleteDataApi(API_REQUEST + "/" + recSelect);
      if (response.code == "00") {
        toast.success(t("toast.delete_success"));
        onSearch();
      } else {
        toast.error(response?.message || t("toast.delete_failed"));
      }
    } catch (error) {
      toast.error(t("toast.delete_failed"));
    }
  };

  const onExport = async (record) => {
    setLoaddingPage(true);
    try {
      const response = await exportBlobApi(API_REQUEST + "/report", {
        id: record.id,
      });
      if (response.type === "application/json") {
        const text = await response.text();
        const errorData = JSON.parse(text);
        toast.error(errorData?.message || t("toast.export_failed"));
        return;
      }
      if (response.size === 0) {
        console.log(response);
        toast.error(t("toast.no_data_to_export"));
        return;
      }
        console.log(response);
      const time = dayjs().format("DDMMYYYYHHmmss");
      exportExcel(response, "Confirmation_report_" + time);
      toast.success(t("toast.export_success"));
    } catch (error) {
      toast.error(t("toast.export_failed"));
    } finally {
      setLoaddingPage(false);
    }
  };

  const onAction = async () => {
    const data = {
      status: typeAction,
    };
    try {
      const response = await patchDataApi(API_REQUEST + "/" + recSelect, data);
      if (response.code == "00") {
        toast.success(t("toast.success"));
        onSearch();
        if (typeAction == "APPROVED") {
          setExpandedRowKeys((prev) =>
            prev.includes(recSelect) ? prev : [...prev, recSelect],
          );
          fetchExpandedData(recSelect);
        }
      } else {
        toast.error(response?.message || t("toast.error"));
      }
    } catch (error) {
      toast.error(t("toast.error"));
    } finally {
      setOpenConfirm(false);
    }
  };

  const handleViewResult = async (dataRequest) => {
    navigate(PATH.RESULT_RECONCILIATION, {
      state: { dataRequest, parentRecord: dataRequest.parentRecord },
    });
  };

  const handleSubmitForm = async (value) => {
    const data = {
      ...value,
    };
    try {
      let response;
      if (value?.id) {
        response = await putDataApi(API_REQUEST + "/" + value.id, data);
      } else {
        response = await postDataApi(API_REQUEST, data);
      }
      if (response.code == "00") {
        toast.success(t("toast.success"));
        setOpenModal(false);
        onSearch();
      } else {
        showErrorMessageFromResponse(response, t("toast.error"));
      }
    } catch (error) {
      toast.error(
        value?.id ? t("toast.update_failed") : t("toast.create_failed"),
      );
    }
  };

  const handleExpand = (expanded, record) => {
    if (!expanded) {
      const intervalId = intervals[record.id];
      if (intervalId) {
        clearInterval(intervalId);
      }
      setIntervals((prev) => {
        const { [record.id]: _, ...rest } = prev;
        return rest;
      });
      setExpandedRowKeys((prev) => prev.filter((id) => id !== record.id));
      return;
    }
    fetchExpandedData(record.id);
    setExpandedRowKeys((prev) => [...prev, record.id]);
  };

  const fetchExpandedData = async (id) => {
    try {
      const response = await getDataApi(`${API_REQUEST}/${id}/request-run`);
      if (response.code === "00") {
        setExpandedData((prev) => ({ ...prev, [id]: response.data }));
        const firstRecord = response?.data?.[0];
        if (firstRecord) {
          if (firstRecord?.endTime == null) {
            setIntervals((prev) => {
              if (prev[id]) return prev;
              const intervalId = setInterval(() => {
                fetchExpandedData(id);
                onGetStatusRequest(id);
              }, 1000);
              return { ...prev, [id]: intervalId };
            });
          } else {
            setIntervals((prev) => {
              const intervalId = prev[id];
              if (intervalId) {
                clearInterval(intervalId);
                const { [id]: _, ...rest } = prev;
                return rest;
              }
              return prev;
            });
          }
        }
      } else {
        toast.error(response?.message || t("toast.error"));
      }
    } catch (error) {
      toast.error(t("toast.error"));
    }
  };

  const onSubmitForm = (values) => {
    setQuery((pre) => ({ ...pre, page: QUERY.PAGE, ...values }));
  };

  const handleAdd = () => {
    setAction(actionCode.CREATE);
    setOpenModal(true);
  };

  const handleUpdate = (record) => {
    setAction(actionCode.UPDATE);
    setOpenModal(true);
    onGetDetail(record.id);
  };

  const handleView = (record) => {
    setAction(actionCode.VIEW);
    setOpenModal(true);
    onGetDetail(record.id);
    setIdSelect(record.id);
  };

  const handleDelete = (record) => {
    setRecSelect(record?.id);
    setOpenDelete(true);
  };

  const handleAction = (record, type, title) => {
    setTypeAction(type);
    setTitleConfirm(title);
    setRecSelect(record?.id);
    setOpenConfirm(true);
  };

  const onReset = () => {
    form.resetFields();
    setQuery({
      page: QUERY.PAGE,
      size: QUERY.SIZE,
    });
    setExpandedRowKeys([]);
    setExpandedData({});
  };

  useEffect(() => {
    return () => {
      Object.values(intervals).forEach((intervalId) => {
        clearInterval(intervalId);
      });
    };
  }, []);

  useEffect(() => {
    onSearch(query);
  }, [query]);

  return (
    <Spin spinning={loaddingPage}>
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
        />
      </FilterAndSearch>

      <ShadowCard>
        {roleUser != ROLE_ACCOUNT.PARTNER && (
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "center",
              marginBottom: 16,
            }}
          >
            <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
              {t("button.create")}
            </Button>
          </div>
        )}
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
          onExpand={handleExpand}
          expandedRowKeys={expandedRowKeys}
          expandedRowRender={(record) => {
            const data = (expandedData[record.id] || []).map((item) => ({
              ...item,
              parentRecord: record,
            }));
            return (
              <FlexTable
                // loading={loadingChildRows[record.id] || false}
                dataSource={data}
                columns={expandedColumns}
                pagination={false}
                rowKey="id"
                size="small"
                disableSortIcons
                hideSettingsColumn
              />
            );
          }}
          disableSortIcons
          hideSettingsColumn
        />
      </ShadowCard>

      <DeleteModalConfirm
        onConfirm={onDelete}
        onCancel={() => setOpenDelete(false)}
        open={openDelete}
      />

      <ModalConfirm
        onConfirm={onAction}
        onCancel={() => setOpenConfirm(false)}
        open={openConfirm}
        title={titleConfirm}
        confirmText={t("form.confirm.confirm")}
      />

      {openModal && (
        <DetailForm
          onCancel={() => setOpenModal(false)}
          open={openModal}
          title={actionText[action]}
          handleSubmit={handleSubmitForm}
          action={action}
          disabled={action == actionCode.VIEW ? true : false}
          setValueForm={valueForms}
          idRec={idSelect}
        />
      )}
    </Spin>
  );
}

export default RequestReconciliation;
