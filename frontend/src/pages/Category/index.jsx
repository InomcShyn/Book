import { categoryApi } from "@/api/category.api";
import { getCategoryStatus } from "@/assets/data/categoryData";
import { ActionMenu } from "@/components/Atom/ActionMenu";
import { Button } from "@/components/Atom/Button";
import CommonActionIcon from "@/components/Atom/CommonActionIcon";
import { DeleteModalConfirm } from "@/components/Atom/DeleteModalConfirm";
import { FlexTable } from "@/components/Atom/FlexTable";
import ShadowCard from "@/components/Atom/ShadowCard";
import { MessageError, QUERY } from "@/constants/constants";
import { useTableOnChange } from "@/hooks/useTableQuery";
import { actionCode, getActionText } from "@/utils/form/action";
import { addPointStatus, convertDate } from "@/utils/form/common";
import { showErrorMessageFromResponse } from "@/utils/form/errorHandler";
import { PlusOutlined } from "@ant-design/icons";
import { faPenToSquare, faTrash } from "@fortawesome/free-solid-svg-icons";
import { Space, Tag, Tooltip } from "antd";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import ActionCreateEditCategory from "./component/ActionCreateEdit";

function Category() {
  const [openDelete, setOpenDelete] = useState(false);
  const [query, setQuery] = useState({
    page: QUERY.PAGE,
    size: QUERY.SIZE,
  });
  const [recDelete, setRecDelete] = useState(null);
  const { t } = useTranslation();
  const [openModal, setOpenModal] = useState(false);
  const [action, setAction] = useState("");
  const actionText = getActionText(t);
  const categoryStatus = getCategoryStatus(t);
  const [dataTable, setDataTable] = useState([]);
  const [valueForms, setValueForms] = useState(null);
  const [loading, setLoading] = useState(false);
  const handleTableChange = useTableOnChange(setQuery);

  const columns = [
    { title: t("table.no"), dataIndex: "no", key: "no" },
    {
      title: t("category.table.col_id"),
      key: "_id",
      width: 120,
      render: (_, record) => (
        <Tooltip title={record._id}>
          <Tag color="blue">{(record._id || "").slice(-6).toUpperCase()}</Tag>
        </Tooltip>
      ),
    },
    {
      title: t("category.table.col_name"),
      dataIndex: "name",
      key: "name",
      width: 200,
    },
    {
      title: t("category.table.col_status"),
      dataIndex: "status",
      key: "status",
      width: 120,
      render: (status) =>
        addPointStatus(
          categoryStatus.find((item) => item.value === status)?.label,
          status === "active"
        ),
    },
    {
      title: t("data_group.create_time"),
      dataIndex: "createdAt",
      key: "createdAt",
      align: "center",
      hiddenColumns: true,
      render: (createdAt) => convertDate(createdAt),
    },
    {
      title: t("data_group.update_time"),
      dataIndex: "updatedAt",
      key: "updatedAt",
      align: "center",
      hiddenColumns: true,
      render: (updatedAt) => convertDate(updatedAt),
    },
    {
      title: t("table.action"),
      key: "action",
      width: 95,
      render: (record) => {
        const actions = [
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
      const response = await categoryApi.getAll();
      const catsData = response?.data || response || [];

      console.log('📁 Categories Response:', response);
      console.log('📁 Categories Data:', catsData);

      if (response.code === "00" || Array.isArray(catsData)) {
        if (catsData.length === 0 && query.page > 0) {
          setQuery((prev) => ({ ...prev, page: query.page - 1 }));
          return;
        }
        // Format data for pagination
        const formattedData = {
          data: catsData,
          pagination: {
            totalRecords: catsData.length,
          },
        };
        setDataTable(formattedData);
        console.log('✅ Categories loaded successfully:', catsData.length, 'items');
      } else {
        toast.error(response?.message || t("toast.error"));
      }
    } catch (error) {
      console.error('❌ Error loading categories:', error);
      toast.error(t(MessageError));
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitForm = async (value) => {
    const data = {
      name: value.name,
      description: value.description,
      status: value.status,
    };

    try {
      let response;
      if (value?.id) {
        response = await categoryApi.update(value.id, data);
      } else {
        response = await categoryApi.create(data);
      }

      if (response?.code === "00" || response?._id) {
        toast.success(t("toast.success"));
        setOpenModal(false);
        onSearch();
      } else {
        showErrorMessageFromResponse(response, t("toast.error"));
      }
    } catch (error) {
      toast.error(t("toast.error"));
    }
  };

  const onGetDetail = async (id) => {
    try {
      const allCategories = await categoryApi.getAll();
      const catsData = allCategories?.data || allCategories || [];
      const category = catsData.find((c) => c._id === id);
      if (category) {
        setValueForms(category);
      } else {
        toast.error(t(MessageError));
      }
    } catch (error) {
      toast.error(t(MessageError));
    }
  };

  const onDelete = async () => {
    setOpenDelete(false);
    try {
      const response = await categoryApi.delete(recDelete);
      if (response?.code === "00" || response?.message) {
        toast.success(t("toast.delete_success"));
        onSearch();
      } else {
        toast.error(response?.message || t(MessageError));
      }
    } catch (error) {
      toast.error(t("toast.error"));
    }
  };

  const handleAdd = () => {
    setAction(actionCode.CREATE);
    setValueForms(null);
    setOpenModal(true);
  };

  const handleUpdate = (record) => {
    setAction(actionCode.UPDATE);
    setOpenModal(true);
    onGetDetail(record._id);
  };

  const handleDelete = (record) => {
    setRecDelete(record?._id);
    setOpenDelete(true);
  };

  useEffect(() => {
    onSearch(query);
  }, [query]);

  return (
    <>
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
        <ActionCreateEditCategory
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

export default Category;
