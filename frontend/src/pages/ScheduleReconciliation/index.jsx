import React, { useEffect, useState } from "react";
import { FlexTable } from "@/components/Atom/FlexTable";
import ShadowCard from "@/components/Atom/ShadowCard";
import { PlusOutlined } from "@ant-design/icons";
import { Flex, Form, Space } from "antd";
import { DeleteModalConfirm } from "@/components/Atom/DeleteModalConfirm";
import { Button } from "@/components/Atom/Button";
import FilterAndSearch from "@/components/Atom/FilterAndSearch";
import useMediaQuery, { mediaQueryPoints } from "@/hooks/useMediaQuery";
import { SlidersHorizontalIcon } from "lucide-react";
import { deleteDataApi, getDataApi, postDataApi, putDataApi } from "@/api";
import { QUERY } from "@/constants/constants";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import SearchForm from "./component/SearchForm";
import DetailForm from "./component/DetailForm";
import { actionCode, getActionText } from "@/utils/form/action";
import {
  getFrequencyType,
  getStatusSchedule,
} from "@/assets/data/categoryData";
import { ActionMenu } from "@/components/Atom/ActionMenu";
import { API_SCHEDULE, API_SERVICE } from "@/configs/paths/API_PATH";
import { useTableOnChange } from "@/hooks/useTableQuery";
import { convertDate } from "@/utils/form/common";
import { ModalConfirm } from "@/components/Atom/ModalConfirm";
import { HistoryReconciliation } from "./component/HistoryReconciliation";
import CommonActionIcon from "@/components/Atom/CommonActionIcon";
import {
  faEye,
  faPenToSquare,
  faTrash,
  faPause,
  faXmark,
  faPlay,
  faClockRotateLeft,
} from "@fortawesome/free-solid-svg-icons";
import { showErrorMessageFromResponse } from "@/utils/form/errorHandler";
import { RunningIcon } from "@/components/Atom/RunningIcon";

function ScheduleReconciliation() {
  const { t } = useTranslation();
  const SchelduleStatus = getStatusSchedule(t);
  const FrequencyType = getFrequencyType(t);
  const [form] = Form.useForm();
  const [openDelete, setOpenDelete] = useState(false);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [openHistory, setOpenHistory] = useState(false);
  const [action, setAction] = useState("");
  const [titleConfirm, setTitleConfirm] = useState("");
  const actionText = getActionText(t);
  const [dataTable, setDataTable] = useState([]);
  const [valueForms, setValueForms] = useState(null);
  const [typeAction, setTypeAction] = useState(null);
  const [isNewRecord, setIsNewRecord] = useState(false);

  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState({
    page: QUERY.PAGE,
    size: QUERY.SIZE,
  });
  const handleTableChange = useTableOnChange(setQuery);
  const [openFilter, setOpenFilter] = useState(false);
  const [recSelect, setRecSelect] = useState(null);
  const isMobileMdPlus = useMediaQuery(
    `(max-width: ${mediaQueryPoints.mdPlus}px)`
  );

  const columns = [
    { title: t("table.no"), dataIndex: "no", key: "no" },
    { title: t("schedule_recon.name"), dataIndex: "name", key: "name" },
    {
      title: t("schedule_recon.service"),
      dataIndex: "serviceName",
      key: "serviceName",
    },
    // {
    //   title: t("schedule_recon.from_time"),
    //   dataIndex: "fromTime",
    //   key: "fromTime",
    //   render: (fromTime) => convertDate(fromTime),
    // },
    // {
    //   title: t("schedule_recon.to_time"),
    //   dataIndex: "toTime",
    //   key: "toTime",
    //   render: (toTime) => convertDate(toTime),
    // },
    {
      title: t("data_group.frequency_type"),
      dataIndex: "frequencyType",
      key: "frequencyType",
      render: (frequencyType) =>
        FrequencyType.find((item) => item.value === frequencyType)?.label,
    },
    {
      title: t("schedule_recon.scan_time"),
      dataIndex: "scanTime",
      key: "scanTime",
      render: (value, record) => {
        const [hour, minute, day, month] = value.split(":");
        switch (record.frequencyType) {
          case "MONTHLY":
            return (
              hour +
              ":" +
              minute +
              t("schedule_recon.sc_time.date") +
              day +
              t("schedule_recon.sc_time.date2")
            );
          case "DAILY":
            return hour + ":" + minute;
          case "HOURLY":
            return t("schedule_recon.sc_time.minute") + minute;
          case "CONTINUOUS":
            return "-";
          default:
            break;
        }
      },
    },
    {
      title: t("form.status"),
      dataIndex: "status",
      key: "status",
      width: 160,
      render: (value) => {
        const label =
          SchelduleStatus.find((item) => item.value === value)?.label || value;
        const isProcessing = value === "RUNNING";
        return (
          <span style={{ color: isProcessing ? "#12b92e" : "inherit" }}>
            {isProcessing && <RunningIcon />} {label}
          </span>
        );
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
          },
          {
            key: "delete",
            label: (
              <CommonActionIcon icon={faTrash} label={t("button.delete")} />
            ),
            onClick: handleDelete,
          },
          {
            key: "start",
            label: (
              <CommonActionIcon
                icon={faPlay}
                label={t("schedule_recon.start_recon")}
              />
            ),
            onClick: () =>
              handleAction(record, "start", t("schedule_recon.start_recon")),
            showIf: (record) => ["NEW", "PAUSED"].includes(record.status),
          },
          {
            key: "pause",
            label: (
              <CommonActionIcon
                icon={faPause}
                label={t("schedule_recon.pause_recon")}
              />
            ),
            onClick: () =>
              handleAction(record, "pause", t("schedule_recon.pause_recon")),
            showIf: (record) => ["STARTED", "RUNNING"].includes(record.status),
          },
          {
            key: "cancel",
            label: (
              <CommonActionIcon
                icon={faXmark}
                label={t("schedule_recon.cancel_recon")}
              />
            ),
            onClick: () =>
              handleAction(record, "cancel", t("schedule_recon.cancel_recon")),
            showIf: (record) =>
              ["NEW", "STARTED", "PAUSED", "RUNNING"].includes(record.status),
          },
          {
            key: "history",
            label: (
              <CommonActionIcon
                icon={faClockRotateLeft}
                label={t("schedule_recon.history_reconciliation")}
              />
            ),
            onClick: handleHistory,
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

  const onSearch = async (value) => {
    const dataSearch = {
      ...query,
      ...value,
    };
    try {
      setLoading(true);
      const response = await getDataApi(API_SCHEDULE, dataSearch);
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
      const response = await getDataApi(API_SCHEDULE + "/" + id);
      if (response.code == "00") {
        setValueForms(response?.data);
      } else toast.error(response?.message || t("toast.error"));
    } catch (error) {
      toast.error(t("toast.error"));
    }
  };

  const onDelete = async () => {
    setOpenDelete(false);
    try {
      const response = await deleteDataApi(API_SCHEDULE + "/" + recSelect);
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

  const onAction = async () => {
    setOpenConfirm(false);
    let response;
    try {
      if (typeAction == "start")
        response = await postDataApi(`${API_SCHEDULE}/${recSelect}/start`);
      else if (typeAction == "pause")
        response = await postDataApi(`${API_SCHEDULE}/${recSelect}/pause`);
      else if (typeAction == "cancel")
        response = await postDataApi(`${API_SCHEDULE}/${recSelect}/cancel`);
      if (response.code == "00") {
        toast.success(t("toast.success"));
        onSearch();
      } else {
        toast.error(response?.message || t("toast.error"));
      }
    } catch (error) {
      toast.error(t("toast.error"));
    }
  };

  const handleSubmitForm = async (value) => {
    const data = {
      ...value,
    };
    try {
      let response;
      if (value?.id) {
        response = await putDataApi(API_SCHEDULE + "/" + value.id, data);
      } else {
        response = await postDataApi(API_SCHEDULE, data);
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
        value?.id ? t("toast.update_failed") : t("toast.create_failed")
      );
    }
  };

  const onSubmitForm = (values) => {
    setQuery((pre) => ({ ...pre, page: QUERY.PAGE, ...values }));
  };

  const handleAdd = () => {
    setAction(actionCode.CREATE);
    setOpenModal(true);
    setIsNewRecord(true);
  };

  const handleUpdate = (record) => {
    setAction(actionCode.UPDATE);
    setOpenModal(true);
    onGetDetail(record.id);
    if (record.status == "NEW") setIsNewRecord(true);
    else setIsNewRecord(false);
  };

  const handleView = (record) => {
    setAction(actionCode.VIEW);
    setOpenModal(true);
    onGetDetail(record.id);
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

  const handleHistory = (record) => {
    setRecSelect(record?.id);
    setOpenHistory(true);
  };

  const onReset = () => {
    form.resetFields();
    setQuery({
      page: QUERY.PAGE,
      size: QUERY.SIZE,
    });
  };

  useEffect(() => {
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
          <SearchForm form={form} onFinish={onSubmitForm} onReset={onReset} />
        </ShadowCard>
      )}

      <FilterAndSearch open={openFilter} setOpen={setOpenFilter}>
        <SearchForm
          isFullWidth={true}
          form={form}
          onFinish={onSubmitForm}
          onReset={onReset}
        />
      </FilterAndSearch>

      <ShadowCard>
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
          isNewRecord={isNewRecord}
        />
      )}

      {openHistory && (
        <HistoryReconciliation
          onCancel={() => setOpenHistory(false)}
          open={openHistory}
          idRec={recSelect}
        />
      )}
    </>
  );
}

export default ScheduleReconciliation;
