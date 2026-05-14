import React, { useEffect, useRef, useState } from "react";
import UploadList from "./component/UploadList";
import { FlexTable } from "@/components/Atom/FlexTable";
import ShadowCard from "@/components/Atom/ShadowCard";
import {
  DownloadOutlined,
  DownOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { Dropdown, Flex, Form, Menu, Space } from "antd";
import { DeleteModalConfirm } from "@/components/Atom/DeleteModalConfirm";
import { convertDate, exportExcel, formatNumber } from "@/utils/form/common";
import { Button } from "@/components/Atom/Button";
import FilterAndSearch from "@/components/Atom/FilterAndSearch";
import useMediaQuery, { mediaQueryPoints } from "@/hooks/useMediaQuery";
import { SlidersHorizontalIcon } from "lucide-react";
import {
  deleteDataApi,
  exportBlobApi,
  getDataApi,
  postDataApi,
  postFormDataApi,
  putDataApi,
} from "@/api";
import { QUERY, ROLE_ACCOUNT } from "@/constants/constants";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import SearchForm from "./component/SearchForm";
import DetailForm from "./component/DetailForm";
import { actionCode, getActionText } from "@/utils/form/action";
import { getReconciliationStatus } from "@/assets/data/categoryData";
import { ActionMenu } from "@/components/Atom/ActionMenu";
import {
  API_ORG_DATA,
  API_ORG_DATA_2,
  API_REQUEST,
} from "@/configs/paths/API_PATH";
import { useTableOnChange } from "@/hooks/useTableQuery";
import UploadForm from "./component/UploadForm";
import { useSelector } from "react-redux";
import { selectAuth } from "@/features/Auth/auth.slice";
import CommonActionIcon from "@/components/Atom/CommonActionIcon";
import {
  faEye,
  faPenToSquare,
  faTrash,
  faXmark,
  faFileAlt,
} from "@fortawesome/free-solid-svg-icons";
import { showErrorMessageFromResponse } from "@/utils/form/errorHandler";
import FullScreenSpin from "@/components/Atom/FullScreenSpin";
import dayjs from "dayjs";
import { useSortTable } from "@/hooks/useSortTable";
import RequestForm from "./component/RequestForm";
import { ConfirmModal } from "@/components/Atom/Confirm/Confirm";

function DataAssociate() {
  const { t } = useTranslation();
  const ReconciliationStatus = getReconciliationStatus(t);
  const actionText = getActionText(t);
  const [form] = Form.useForm();
  const [openDelete, setOpenDelete] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [openUpload, setOpenUpload] = useState(false);
  const [action, setAction] = useState("");
  const [actionDC, setActionDC] = useState("");
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [query, setQuery] = useState({
    page: QUERY.PAGE,
    size: QUERY.SIZE,
  });
  const [lastId, setLastId] = useState(null);
  const [dataTable, setDataTable] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [open, setOpen] = useState(false);
  const [valueForms, setValueForms] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isErrorData, setIsErrorData] = useState(false);
  const handleTableChange = useTableOnChange(setQuery);
  const handleSortTableChange = useSortTable(setQuery, dataTable?.data);
  const { user } = useSelector(selectAuth);
  const roleUser = user?.userInfo?.role;
  const isFirstLoad = useRef(true);
  const [openFilter, setOpenFilter] = useState(false);
  const [recDelete, setRecDelete] = useState(null);
  const [loaddingPage, setLoaddingPage] = useState(false);
  const [keySearch, setKeySearch] = useState({});
  const [openRequest, setOpenRequest] = useState(false);
  const [openConfirm, setOpenConfirm] = useState(false);
  const isMobileMdPlus = useMediaQuery(
    `(max-width: ${mediaQueryPoints.mdPlus}px)`,
  );
  const [popupData, setPopupData] = useState({
    orgId: null,
    serviceId: null,
  });

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
      title: t("data_group.folder_path"),
      dataIndex: "filePath",
      key: "filePath",
      hiddenColumns: true,
    },
    {
      title: t("data_group.value_trans"),
      dataIndex: "txAmount",
      key: "txAmount",
      hiddenColumns: isErrorData,
      align: "right",
      render: (txAmount) => formatNumber(txAmount),
      width: 95,
    },
    {
      title: t("data_group.trans"),
      children: [
        {
          title: "ID",
          dataIndex: "txId",
          key: "txId",
          hiddenColumns: isErrorData,
          width: 130,
        },
        {
          title: t("data_group.type_trans"),
          dataIndex: "txType",
          key: "txType",
          hiddenColumns: isErrorData,
          width: 95,
        },
        {
          title: t("data_group.status_trans"),
          dataIndex: "txStatus",
          key: "txStatus",
          width: 120,
        },
        {
          title: t("data_group.money_trans"),
          dataIndex: "money",
          key: "money",
          render: (value) => formatNumber(value),
          align: "right",
          width: 100,
        },
        {
          title: t("data_group.fee_trans"),
          dataIndex: "txFee",
          key: "txFee",
          render: (value) => formatNumber(value),
          align: "right",
          width: 100,
        },
      ],
    },
    {
      title: t("data_group.time_trans"),
      dataIndex: "txCreateTime",
      key: "txCreateTime",
      render: (txCreateTime) => convertDate(txCreateTime),
      hiddenColumns: isErrorData,
      align: "center",
      width: 120,
    },
    {
      title: t("data_group.trans_from"),
      dataIndex: "txFrom",
      key: "txFrom",
      hiddenColumns: true,
    },
    {
      title: t("data_group.trans_to"),
      dataIndex: "txTo",
      key: "txTo",
      hiddenColumns: true,
    },
    {
      title: t("data_group.error_reason"),
      dataIndex: "errorReason",
      key: "errorReason",
      hiddenColumns: !isErrorData,
    },

    {
      title: t("form.status"),
      dataIndex: "status",
      key: "status",
      align: "center",
      render: (status) =>
        ReconciliationStatus.find((item) => item.value === status)?.label,
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
            showIf: (record) => record.status === ReconciliationStatus[0].value,
          },
          {
            key: "cancel",
            label: (
              <CommonActionIcon icon={faXmark} label={t("button.cancel")} />
            ),
            onClick: (record) =>
              handleDeleteOrCancel(record, actionCode.CANCEL),
            showIf: (record) => record.status === ReconciliationStatus[0].value,
          },
          {
            key: "delete",
            label: (
              <CommonActionIcon icon={faTrash} label={t("button.delete")} />
            ),
            onClick: (record) =>
              handleDeleteOrCancel(record, actionCode.DELETE),
            showIf: (record) => record.status === ReconciliationStatus[0].value,
          },
          {
            key: "viewList",
            label: (
              <CommonActionIcon
                icon={faFileAlt}
                label={t("button.List_file")}
              />
            ),
            onClick: (record) => {
              setSelectedId(record.orgSourceId);
              setOpen(true);
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

  const menu = (
    <Menu>
      <Menu.Item
        key="1"
        onClick={() => handleDeleteOrCancel(selectedRowKeys, actionCode.CANCEL)}
      >
        {t("button.cancel")}
      </Menu.Item>
      <Menu.Item
        key="2"
        onClick={() => handleDeleteOrCancel(selectedRowKeys, actionCode.DELETE)}
      >
        {t("button.delete")}
      </Menu.Item>
    </Menu>
  );

  const rowSelection = {
    selectedRowKeys,
    onChange: (selectedKeys) => {
      setSelectedRowKeys(selectedKeys);
    },
  };

  const onSearch = async () => {
    const value = form.getFieldsValue();
    const [fromTime, toTime] = value?.time || [];
    const dataSearch = {
      ...query,
      ...value,
      ...(lastId ? { lastId } : {}),
      fromTime: fromTime
        ? fromTime.startOf("day").format("YYYY-MM-DDTHH:mm:ss")
        : undefined,
      toTime: toTime
        ? toTime.endOf("day").format("YYYY-MM-DDTHH:mm:ss")
        : undefined,
    };
    delete dataSearch.time;
    delete dataSearch.errorData;
    delete dataSearch.requestRun;
    if (query.page == 0) {
      delete dataSearch.lastId;
    }
    if (!query.sort) {
      // delete dataSearch.lastId;
      delete dataSearch.lastPrimaryValue;
    }
    if (roleUser == ROLE_ACCOUNT.PARTNER)
      dataSearch.orgId = user?.userInfo?.orgId;

    const apiUrl = value?.errorData ? API_ORG_DATA : API_ORG_DATA_2;

    try {
      setLoading(true);
      const response = await getDataApi(apiUrl, dataSearch);
      if (response.code == "00") {
        setDataTable(response);
        setKeySearch(dataSearch);
        const list = response?.data || [];
        if (list.length) {
          setLastId(list[list.length - 1].id);
        }
      } else toast.error(t("toast.error"));
    } catch (error) {
      toast.error(t("toast.error"));
    } finally {
      setLoading(false);
    }
  };

  const onGetDetail = async (id) => {
    const query = {
      errorData: form.getFieldValue("errorData"),
    };
    try {
      const response = await getDataApi(API_ORG_DATA_2 + "/" + id, query);
      if (response.code == "00") {
        setValueForms(response?.data);
      } else toast.error(response?.message || t("toast.error"));
    } catch (error) {
      toast.error(t("toast.error"));
    }
  };

  const handleCreatRequest = async (value) => {
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
        setOpenConfirm(false);
        // onSearch();
      } else {
        showErrorMessageFromResponse(response, t("toast.error"));
      }
    } catch (error) {
      toast.error(
        value?.id ? t("toast.update_failed") : t("toast.create_failed"),
      );
    }
  };

  const handleConfirmUpload = () => {
    setOpenRequest(false);
    setOpenConfirm(true);
  };

  const onDeleteOrCancel = async () => {
    if (actionDC === actionCode.DELETE) await onDelete();
    else await onCancel();
  };

  const onDelete = async () => {
    setOpenDelete(false);
    try {
      const response = await deleteDataApi(API_ORG_DATA_2, recDelete);
      if (response.code === "00") {
        toast.success(t("toast.success"));
        onSearch();
        setSelectedRowKeys([]);
      } else {
        toast.error(response?.message || t("toast.error"));
      }
    } catch (error) {
      toast.error(error?.response?.data?.detail || t("toast.error"));
    }
  };

  const onCancel = async () => {
    setOpenDelete(false);
    try {
      const response = await postDataApi(API_ORG_DATA_2 + "/cancel", recDelete);
      if (response.code === "00") {
        toast.success(t("toast.success"));
        onSearch();
        setSelectedRowKeys([]);
      } else {
        toast.error(response?.message || t("toast.error"));
      }
    } catch (error) {
      toast.error(error?.response?.data?.detail || t("toast.error"));
    }
  };

  const onSubmitForm = () => {
    const values = form.getFieldsValue();
    setQuery((pre) => ({ ...pre, page: QUERY.PAGE, ...values }));
  };

  const onChangeTypeData = (value) => {
    setIsErrorData(value);
    // onSearch();
    setDataTable([]);
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

  const OnUpload = async (values, fileList) => {
    const formData = new FormData();
    formData.append("serviceId", values.serviceId);
    fileList.forEach((file) => {
      formData.append("files", file.originFileObj);
    });
    const resolvedOrgId =
      roleUser === ROLE_ACCOUNT.PARTNER ? user?.userInfo?.orgId : values.orgId;

    formData.append("orgId", resolvedOrgId);
    setPopupData({
      orgId: resolvedOrgId,
      serviceId: values.serviceId,
    });
    setLoaddingPage(true);
    try {
      const response = await postFormDataApi(
        API_ORG_DATA_2 + "/upload",
        formData,
      );
      if (response.code === "00") {
        toast.success(t("toast.success"));
        setOpenUpload(false);

        setOpenRequest(true);
      } else {
        toast.error(response?.message || t("toast.error"));
      }
    } catch (error) {
      toast.error(error?.response?.data?.detail || t("toast.error"));
    } finally {
      setLoaddingPage(false);
    }
  };

  const onExport = async () => {
    setLoaddingPage(true);
    const param = keySearch;
    delete param.size;
    delete param.page;
    delete param.errorData;
    try {
      const response = await exportBlobApi(API_ORG_DATA_2 + "/excel", param);

      if (response.type === "application/json") {
        const text = await response.text();
        const errorData = JSON.parse(text);
        toast.error(errorData?.message || t("toast.export_failed"));
        return;
      }
      const time = dayjs().format("DDMMYYYYHHmmss");
      exportExcel(response, "Data_ORG_" + time);
      toast.success(t("toast.export_success"));
    } catch (error) {
      toast.error(t("toast.export_failed"));
    } finally {
      setLoaddingPage(false);
    }
  };

  const handleDeleteOrCancel = (records, actionType) => {
    if (Array.isArray(records)) {
      setRecDelete(records);
    } else {
      setRecDelete([records?.id]);
    }
    setOpenDelete(true);
    setActionDC(actionType);
  };
  const onReset = () => {
    form.resetFields([
      "time",
      "requestRun",
      "requestRunId",
      "serviceId",
      "orgId",
      "orgSourceId",
    ]);
    // setQuery({
    //   page: QUERY.PAGE,
    //   size: QUERY.SIZE,
    // });
    setDataTable([]);
  };

  const handleSubmitForm = async (value) => {
    const data = {
      ...value,
    };
    try {
      let response;
      if (value?.id) {
        response = await putDataApi(API_ORG_DATA_2 + "/" + value.id, data);
      } else {
        response = await postDataApi(API_ORG_DATA_2, data);
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

  useEffect(() => {
    if (isFirstLoad.current) {
      isFirstLoad.current = false;
      return;
    }
    console.log(query, lastId);
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
            onFinish={onSubmitForm}
            onReset={onReset}
            roleUser={roleUser}
            onChangeErrorData={onChangeTypeData}
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
          onChangeErrorData={onChangeTypeData}
        />
      </FilterAndSearch>

      <ShadowCard>
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
            marginBottom: 16,
            gap: 20,
          }}
        >
          {selectedRowKeys.length ? (
            <>
              <Dropdown overlay={menu} trigger={["click"]}>
                <Button type="primary" htmlType="button">
                  {t("table.action")} <DownOutlined />
                </Button>
              </Dropdown>
            </>
          ) : null}
          <Button icon={<DownloadOutlined />} onClick={onExport}>
            {t("button.export")}
          </Button>
          <Button
            type="primary"
            icon={<UploadOutlined />}
            onClick={() => setOpenUpload(true)}
          >
            Upload File
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
              setQuery((prev) => ({
                ...prev,
                page,
                size,
              }));
            },
          }}
          onChange={handleSortTableChange}
          rowSelection={rowSelection}
          isChangeColumns={isErrorData}
        />
      </ShadowCard>

      {open && (
        <UploadList
          open={open}
          recordId={selectedId}
          onClose={() => setOpen(false)}
        />
      )}
      {openRequest && (
        <ConfirmModal
          open={openRequest}
          title={t("associate.create")}
          confirmText={t("associate.confirm")}
          okText={t("associate.OK")}
          onCancel={() => setOpenRequest(false)}
          onConfirm={handleConfirmUpload}
        />
      )}

      <DeleteModalConfirm
        onConfirm={onDeleteOrCancel}
        onCancel={() => setOpenDelete(false)}
        open={openDelete}
        actionDC={actionDC}
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
          roleUser={roleUser}
        />
      )}

      {openUpload && (
        <UploadForm
          onCancel={() => setOpenUpload(false)}
          open={openUpload}
          handleSubmit={OnUpload}
          roleUser={roleUser}
        />
      )}

      {openConfirm && (
        <RequestForm
          open={openConfirm}
          title={""}
          onCancel={() => setOpenConfirm(false)}
          handleSubmit={handleCreatRequest}
          action={action}
          orgId={popupData.orgId}
          serviceId={popupData.serviceId}
        />
      )}
      <FullScreenSpin spinning={loaddingPage} />
    </>
  );
}

export default DataAssociate;
