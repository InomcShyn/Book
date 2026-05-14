import React, { useEffect, useState } from "react";
import { Form } from "antd";
import { DescriptionsField } from "@/components/Atom/Descriptions";
import { getDataApi } from "@/api";
import { useTranslation } from "react-i18next";
import { Modal } from "@/components/Atom/Modal";
import { API_SCHEDULE } from "@/configs/paths/API_PATH";
import { FlexTable } from "@/components/Atom/FlexTable";
import { useTableOnChange } from "@/hooks/useTableQuery";
import { QUERY } from "@/constants/constants";
import { convertDate } from "@/utils/form/common";
import {
  getCommand,
  getStatusHistorySchedule,
  getTypeTask,
} from "@/assets/data/categoryData";

export const HistoryReconciliation = ({ open, onCancel, idRec }) => {
  const [form] = Form.useForm();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [dataTable, setDataTable] = useState([]);
  const [query, setQuery] = useState({
    page: QUERY.PAGE,
    size: QUERY.SIZE,
  });
  const handleTableChange = useTableOnChange(setQuery);
  const TypeTaskList = getTypeTask(t);
  const CommandList = getCommand(t);
  const StatusList = getStatusHistorySchedule(t);

  const columns = [
    { title: t("table.no"), dataIndex: "no", key: "no" },
    {
      title: t("schedule_recon.name"),
      dataIndex: "scheduleName",
      key: "scheduleName",
    },
    {
      title: t("schedule_recon.service"),
      dataIndex: "serviceName",
      key: "serviceName",
    },
    {
      title: t("schedule_recon.source_name"),
      dataIndex: "sourceName",
      key: "sourceName",
    },
    {
      title: t("schedule_recon.type_task"),
      dataIndex: "type",
      key: "type",
      render: (value) =>
        TypeTaskList.find((item) => item.value === value)?.label,
    },
    {
      title: t("schedule_recon.command"),
      dataIndex: "command",
      key: "command",
      render: (value) =>
        CommandList.find((item) => item.value === value)?.label,
    },
    {
      title: t("schedule_recon.total_org_src"),
      dataIndex: "totalOrgSource",
      key: "totalOrgSource",
    },

    {
      title: t("schedule_recon.finish_org_src"),
      dataIndex: "finishOrgSource",
      key: "finishOrgSource",
    },
    {
      title: t("schedule_recon.total_natcom_src"),
      dataIndex: "totalNatcomSource",
      key: "totalNatcomSource",
    },
    {
      title: t("schedule_recon.finish_natcom_src"),
      dataIndex: "finishNatcomSource",
      key: "finishNatcomSource",
    },
    {
      title: t("schedule_recon.retry_count"),
      dataIndex: "retryCount",
      key: "retryCount",
    },
    {
      title: t("schedule_recon.status"),
      dataIndex: "status",
      key: "status",
      render: (value) => StatusList.find((item) => item.value === value)?.label,
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

  const onGetDetail = async () => {
    setLoading(true);
    try {
      const response = await getDataApi(
        `${API_SCHEDULE}/${idRec}/schedule-task-his`
      );
      if (response.code == "00") {
        setDataTable(response);
      } else toast.error(response?.message || t("error.general"));
    } catch (error) {
      toast.error(t("error.general"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) {
      onGetDetail();
    }
  }, [open]);

  return (
    <Modal
      title={t("schedule_recon.history_reconciliation")}
      open={open}
      onCancel={onCancel}
      width="90%"
      footer={null}
    >
      <Form form={form}>
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
      </Form>
    </Modal>
  );
};
