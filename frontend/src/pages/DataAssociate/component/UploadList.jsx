import React, { useEffect, useState } from "react";
import { Space, Form } from "antd";
import { Button } from "@/components/Atom/Button";
import { getDataApi, deleteDataApi, exportBlobApi } from "@/api";
import { API_ORG_DATA_2 } from "@/configs/paths/API_PATH";
import { ReloadOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import { FlexTable } from "@/components/Atom/FlexTable";
import { exportFileBlob } from "@/utils/form/common";
import { useTableOnChange } from "@/hooks/useTableQuery";
import { DeleteModalConfirm } from "@/components/Atom/DeleteModalConfirm";
import { toast } from "react-toastify";
import { actionCode } from "@/utils/form/action";
import { QUERY } from "@/constants/constants";
import { Modal } from "@/components/Atom/Modal";
import CommonActionIcon from "@/components/Atom/CommonActionIcon";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { ActionMenu } from "@/components/Atom/ActionMenu";
import FullScreenSpin from "@/components/Atom/FullScreenSpin";

const UploadList = ({ open, onClose, recordId }) => {
  const { t } = useTranslation();
  const [data, setDataTable] = useState([]);
  const [loading, setLoading] = useState(false);
  const [actionDC, setActionDC] = useState("");
  const [openDelete, setOpenDelete] = useState(false);
  const [loaddingPage, setLoaddingPage] = useState(false);
  const [query, setQuery] = useState({
    page: QUERY.PAGE,
    size: QUERY.SIZE,
  });
  const handleTableChange = useTableOnChange(setQuery);
  const [recDelete, setRecDelete] = useState(null);

  const onSearch = async () => {
    const dataSearch = {
      sort: "id",
      ...query,
    };
    try {
      setLoading(true);
      const response = await getDataApi(
        `${API_ORG_DATA_2}/${recordId}/files`,
        dataSearch
      );
      if (response.code == "00") setDataTable(response);
      else toast.error(t("toast.error"));
    } catch (error) {
      toast.error(t("toast.error"));
    } finally {
      setLoading(false);
    }
  };

  const onDelete = async () => {
    setOpenDelete(false);
    try {
      const response = await deleteDataApi(
        API_ORG_DATA_2 + "/files/" + recDelete
      );

      if (response.code === "00") {
        toast.success(t("toast.success"));
        onSearch();
      } else {
        toast.error(response?.message || t("toast.error"));
      }
    } catch (error) {
      toast.error(error?.response?.data?.detail || t("toast.error"));
    }
  };

  const handleDownload = async (record) => {
    setLoaddingPage(true);
    try {
      const response = await exportBlobApi(
        `${API_ORG_DATA_2}/download/${record.id}`
      );
      if (response.type == "application/json") {
        toast.error(t("toast.export_failed"));
        return;
      }
      exportFileBlob(response, record.uploadFileName);
    } catch (error) {
      toast.error(t("toast.export_failed"));
    } finally {
      setLoaddingPage(false);
    }
  };

  useEffect(() => {
    if (query) {
      onSearch(query);
    }
  }, [query]);

  const onReset = () => {
    setQuery({
      page: QUERY.PAGE,
      size: QUERY.SIZE,
    });
  };

  const columns = [
    { title: t("table.no"), dataIndex: "no", key: "no" },
    {
      title: t("data_group.service_name"),
      dataIndex: "serviceName",
      key: "serviceName",
    },
    {
      title: t("data_group.org_name"),
      dataIndex: "orgName",
      key: "orgName",
    },
    {
      title: t("menu.data_source_associate"),
      dataIndex: "orgSourceName",
      key: "orgSourceName",
    },
    {
      title: t("data_group.upload_file_name"),
      dataIndex: "uploadFileName",
      key: "uploadFileName",
      render: (text, record) => {
        return (
          <span
            style={{
              color: "#0f5bf3ff",
              cursor: "pointer",
              textDecoration: "underline",
            }}
            onClick={() => handleDownload(record)}
          >
            {text}
          </span>
        );
      },
    },
    {
      title: t("data_group.folder_path"),
      dataIndex: "uploadFilePath",
      key: "uploadFilePath",
      hiddenColumns: true,
    },
    {
      title: t("table.action"),
      key: "action",
      width: 95,
      align: "center",
      render: (_, record) => {
        const actions = [
          {
            key: "delete",
            label: (
              <CommonActionIcon icon={faTrash} label={t("button.delete")} />
            ),
            onClick: () => {
              setRecDelete(record.id);
              setOpenDelete(true);
              setActionDC(actionCode.DELETE);
            },
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

  return (
    <>
      <Modal
        title={t("button.List_file")}
        open={open}
        onCancel={onClose}
        footer={null}
        width="80%"
      >
        <Space
          style={{
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
            margin: 5,
          }}
        >
          <Button onClick={onReset} icon={<ReloadOutlined />}>
            {t("button.reset")}
          </Button>
        </Space>

        <FlexTable
          loading={loading}
          dataSource={data?.data?.map((e, index) => ({
            ...e,
            no: index + 1 + query.page * query.size,
          }))}
          columns={columns}
          pagination={{
            total: data?.pagination?.totalRecords,
            current: query.page,
            pageSize: query.size,
            onChange(page, size) {
              setQuery((prev) => ({ ...prev, page, size }));
            },
          }}
          onChange={handleTableChange}
        />
      </Modal>
      <DeleteModalConfirm
        onConfirm={onDelete}
        onCancel={() => setOpenDelete(false)}
        open={openDelete}
        actionDC={actionDC}
      />
      <FullScreenSpin spinning={loaddingPage} />
    </>
  );
};

export default UploadList;
