import React, { useEffect, useState } from "react";
import { FlexTable } from "@/components/Atom/FlexTable";
import ShadowCard from "@/components/Atom/ShadowCard";
import { PlusOutlined } from "@ant-design/icons";
import { Flex, Form, Space } from "antd";
import { DeleteModalConfirm } from "@/components/Atom/DeleteModalConfirm";
import { addPointStatus, convertDate } from "@/utils/form/common";
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
  getActiveStatus,
  getNatcomSourceType,
  getStatusRecon,
} from "@/assets/data/categoryData";
import { ActionMenu } from "@/components/Atom/ActionMenu";
import { API_ORG_SOURCE } from "@/configs/paths/API_PATH";
import { useTableOnChange } from "@/hooks/useTableQuery";
import CommonActionIcon from "@/components/Atom/CommonActionIcon";
import {
  faEye,
  faFileAlt,
  faPenToSquare,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { showErrorMessageFromResponse } from "@/utils/form/errorHandler";
import UploadList from "./component/UploadList";

function DataSourceAssociate() {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [openDelete, setOpenDelete] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [action, setAction] = useState("");
  const actionText = getActionText(t);
  const activeStatus = getActiveStatus(t);
  const [dataTable, setDataTable] = useState([]);
  const [valueForms, setValueForms] = useState(null);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState({
    page: QUERY.PAGE,
    size: QUERY.SIZE,
  });
  const handleTableChange = useTableOnChange(setQuery);
  const [openFilter, setOpenFilter] = useState(false);
  const [selectedRec, setSelectedRec] = useState(null);
  const [openListFile, setOpenListFile] = useState(false);

  const isMobileMdPlus = useMediaQuery(
    `(max-width: ${mediaQueryPoints.mdPlus}px)`
  );
  const natcomSourceType = getNatcomSourceType(t);
  const ReconStatus = getStatusRecon(t);

  const columns = [
    { title: t("table.no"), dataIndex: "no", key: "no" },
    { title: t("data_group.code"), dataIndex: "code", key: "code" },
    { title: t("data_group.name"), dataIndex: "name", key: "name" },
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
      title: t("data_group.type_src"),
      dataIndex: "type",
      key: "type",
      render: (type) =>
        natcomSourceType.find((item) => item.value === type)?.label,
    },
    { title: "IP", dataIndex: "ip", key: "ip", width: 130 },
    { title: "Port", dataIndex: "port", key: "port", width: 80 },
    {
      title: t("data_group.user_name"),
      dataIndex: "username",
      key: "username",
    },
    {
      title: t("data_group.status_recon"),
      dataIndex: "reconStatus",
      key: "reconStatus",
      width: 138,
      render: (value) =>
        ReconStatus.find((item) => item.value === value)?.label,
    },
    {
      title: t("associate.create_time"),
      dataIndex: "createTime",
      key: "createTime",
      align: "center",
      render: (createTime) => convertDate(createTime),
    },
    {
      title: t("associate.update_time"),
      dataIndex: "updateTime",
      key: "updateTime",
      align: "center",
      render: (updateTime) => convertDate(updateTime),
      hiddenColumns: true,
    },
    {
      title: t("form.status"),
      dataIndex: "status",
      key: "status",
      render: (status) =>
        addPointStatus(
          activeStatus.find((item) => item.value === status)?.label,
          status == activeStatus[1].value
        ),
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
            key: "viewList",
            label: (
              <CommonActionIcon
                icon={faFileAlt}
                label={t("button.List_file")}
              />
            ),
            onClick: handleListFile,
            showIf: (record) => record.type === "UPLOAD",
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
      const response = await getDataApi(API_ORG_SOURCE, dataSearch);
      if (response.code == "00") setDataTable(response);
      else toast.error(t("toast.error"));
    } catch (error) {
      toast.error(t("toast.error"));
    } finally {
      setLoading(false);
    }
  };

  const onGetDetail = async (id) => {
    try {
      const response = await getDataApi(API_ORG_SOURCE + "/" + id);
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
      const response = await deleteDataApi(
        API_ORG_SOURCE + "/" + selectedRec.id
      );
      if (response.code == "00") {
        toast.success(t("toast.success"));
        onSearch();
      } else toast.error(response?.message || t("toast.error"));
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
        response = await putDataApi(API_ORG_SOURCE + "/" + value.id, data);
      } else {
        response = await postDataApi(API_ORG_SOURCE, data);
      }
      if (response.code == "00") {
        toast.success(t("toast.success"));
        setOpenModal(false);
        onSearch();
      } else {
        showErrorMessageFromResponse(response, t("toast.error"));
      }
    } catch (error) {
      console.log(error);
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
  };

  const handleDelete = (record) => {
    setSelectedRec(record);
    setOpenDelete(true);
  };

  const handleListFile = (record) => {
    setSelectedRec(record);
    setOpenListFile(true);
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

      {openModal && (
        <DetailForm
          onCancel={() => setOpenModal(false)}
          open={openModal}
          title={actionText[action]}
          handleSubmit={handleSubmitForm}
          action={action}
          disabled={action == actionCode.VIEW ? true : false}
          setValueForm={valueForms}
        />
      )}

      {openListFile && (
        <UploadList
          open={openListFile}
          recordSelected={selectedRec}
          onClose={() => setOpenListFile(false)}
        />
      )}
    </>
  );
}

export default DataSourceAssociate;
