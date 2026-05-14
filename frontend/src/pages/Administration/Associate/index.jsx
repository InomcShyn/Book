import { deleteDataApi, getDataApi, postDataApi, putDataApi } from "@/api";
import { getAssociateStatus } from "@/assets/data/categoryData";
import { ActionMenu } from "@/components/Atom/ActionMenu";
import { Button } from "@/components/Atom/Button";
import { DeleteModalConfirm } from "@/components/Atom/DeleteModalConfirm";
import FilterAndSearch from "@/components/Atom/FilterAndSearch";
import { FlexTable } from "@/components/Atom/FlexTable";
import ShadowCard from "@/components/Atom/ShadowCard";
import { API_ORG } from "@/configs/paths/API_PATH";
import { MessageError, QUERY } from "@/constants/constants";
import useMediaQuery, { mediaQueryPoints } from "@/hooks/useMediaQuery";
import { useTableOnChange } from "@/hooks/useTableQuery";
import { actionCode, getActionText } from "@/utils/form/action";
import { addPointStatus, convertDate } from "@/utils/form/common";
import { PlusOutlined } from "@ant-design/icons";
import { Flex, Form, Space } from "antd";
import { SlidersHorizontalIcon } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import ActionCreateEditAssociate from "./component/ActionCreateEditAssociate";
import SearchForm from "./component/SearchForm";
import CommonActionIcon from "@/components/Atom/CommonActionIcon";
import {
  faEye,
  faPenToSquare,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { showErrorMessageFromResponse } from "@/utils/form/errorHandler";

function Associate() {
  const [form] = Form.useForm();
  const [openDelete, setOpenDelete] = useState(false);
  const [query, setQuery] = useState({
    page: QUERY.PAGE,
    size: QUERY.SIZE,
  });
  const [openFilter, setOpenFilter] = useState(false);
  const [recDelete, setRecDelete] = useState(null);
  const isMobileMdPlus = useMediaQuery(
    `(max-width: ${mediaQueryPoints.mdPlus}px)`
  );
  const { t } = useTranslation();
  const [openModal, setOpenModal] = useState(false);
  const [action, setAction] = useState("");
  const actionText = getActionText(t);
  const activeStatus = getAssociateStatus(t);
  const [dataTable, setDataTable] = useState([]);
  const [valueForms, setValueForms] = useState(null);
  const [loading, setLoading] = useState(false);
  const handleTableChange = useTableOnChange(setQuery);

  const columns = [
    { title: t("table.no"), dataIndex: "no", key: "no" },
    { title: t("associate.name"), dataIndex: "name", key: "name" },
    {
      title: t("associate.email"),
      dataIndex: "email",
      key: "email",
    },
    {
      title: t("associate.phone"),
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: t("associate.address"),
      dataIndex: "address",
      key: "address",
      hiddenColumns: true,
    },
    {
      title: t("associate.represnet"),
      dataIndex: "represent",
      key: "represent",
    },
    {
      title: t("associate.business_info"),
      dataIndex: "businessInfo",
      key: "businessInfo",
      hiddenColumns: true,
    },
    {
      title: t("form.status"),
      dataIndex: "status",
      key: "status",
      width: 160,
      render: (status) =>
        addPointStatus(
          activeStatus.find((item) => item.value === status)?.label,
          status === activeStatus[1].value
        ),
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
      align: "center",
      hiddenColumns: true,
      render: (updateTime) => convertDate(updateTime),
    },
    {
      title: t("table.action"),
      key: "action",
      width: 95,
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
      const response = await getDataApi(API_ORG, dataSearch);
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
      const response = await getDataApi(API_ORG + "/" + id);
      if (response.code == "00") {
        setValueForms(response?.data);
      } else toast.error(response?.message || t(MessageError));
    } catch (error) {
      toast.error(t("toast.error"));
    }
  };

  const handleAdd = () => {
    setAction(actionCode.CREATE);
    setOpenModal(true);
  };

  const handleView = (record) => {
    setAction(actionCode.VIEW);
    setOpenModal(true);
    onGetDetail(record.id);
  };

  const handleUpdate = (record) => {
    setAction(actionCode.UPDATE);
    setOpenModal(true);
    onGetDetail(record.id);
  };

  const handleDelete = (record) => {
    setRecDelete(record?.id);
    setOpenDelete(true);
  };

  const onDelete = async () => {
    setOpenDelete(false);
    try {
      const response = await deleteDataApi(API_ORG + "/" + recDelete);
      if (response.code == "00") {
        toast.success(t("toast.success"));
        onSearch();
      } else toast.error(response?.message || t(MessageError));
    } catch (error) {
      toast.error(t("toast.error"));
    }
  };

  const onReset = () => {
    form.resetFields();
    setQuery({
      page: QUERY.PAGE,
      size: QUERY.SIZE,
    });
  };

  const handleSubmitForm = async (value) => {
    const data = {
      ...value,
    };
    try {
      let response;
      if (value?.id) {
        response = await putDataApi(API_ORG + "/" + value.id, data);
      } else {
        response = await postDataApi(API_ORG, data);
      }
      if (response.code == "00") {
        toast.success(t("toast.success"));
        setOpenModal(false);
        onSearch();
      } else {
        showErrorMessageFromResponse(response, t("toast.error"));
      }
    } catch (error) {}
  };

  useEffect(() => {
    onSearch(query);
  }, [query]);

  const onSubmitSearch = (values) => {
    setQuery((pre) => ({ ...pre, page: QUERY.PAGE, ...values }));
  };

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
          <SearchForm form={form} onFinish={onSubmitSearch} onReset={onReset} />
        </ShadowCard>
      )}

      <FilterAndSearch open={openFilter} setOpen={setOpenFilter}>
        <SearchForm
          isFullWidth={true}
          form={form}
          onFinish={onSubmitSearch}
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
        title={t("button.delete")}
        okText={t("button.delete")}
      />

      {openModal && (
        <ActionCreateEditAssociate
          onCancel={() => setOpenModal(false)}
          open={openModal}
          title={actionText[action]}
          handleSubmit={handleSubmitForm}
          action={action}
          setValueForm={valueForms}
        />
      )}
    </>
  );
}

export default Associate;
