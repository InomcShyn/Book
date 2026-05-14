import { bookApi } from "@/api/book.api";
import { categoryApi } from "@/api/category.api";
import { ActionMenu } from "@/components/Atom/ActionMenu";
import { Button } from "@/components/Atom/Button";
import CommonActionIcon from "@/components/Atom/CommonActionIcon";
import { DeleteModalConfirm } from "@/components/Atom/DeleteModalConfirm";
import { FlexTable } from "@/components/Atom/FlexTable";
import ShadowCard from "@/components/Atom/ShadowCard";
import { MessageError, QUERY } from "@/constants/constants";
import { useTableOnChange } from "@/hooks/useTableQuery";
import { actionCode, getActionText } from "@/utils/form/action";
import { convertDate } from "@/utils/form/common";
import { showErrorMessageFromResponse } from "@/utils/form/errorHandler";
import { PlusOutlined } from "@ant-design/icons";
import {
  faEye,
  faPenToSquare,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { Space, Tag } from "antd";
import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import ActionCreateEditBook from "./component/ActionCreateEdit";
import BookSearch from "./component/BookSearch.jsx";

function Book() {
  const [openDelete, setOpenDelete] = useState(false);
  const [query, setQuery] = useState({
    page: QUERY.PAGE,
    size: QUERY.SIZE,
  });
  const [recDelete, setRecDelete] = useState(null);
  const { t, i18n } = useTranslation();
  const [openModal, setOpenModal] = useState(false);
  const [action, setAction] = useState("");
  const actionText = getActionText(t);
  const [dataTable, setDataTable] = useState([]);
  const [categories, setCategories] = useState([]);
  const [valueForms, setValueForms] = useState(null);
  const [loading, setLoading] = useState(false);
  const handleTableChange = useTableOnChange(setQuery);

  // Search & Filter states
  const [searchText, setSearchText] = useState("");
  const [filterCategory, setFilterCategory] = useState(null);
  const [sortOrder, setSortOrder] = useState(null);

  const columns = [
    { title: t("table.no"), dataIndex: "no", key: "no" },
    {
      title: t("book.table.col_name"),
      dataIndex: "name",
      key: "name",
      width: 200,
    },
    {
      title: t("book.table.col_author"),
      dataIndex: "author",
      key: "author",
      width: 150,
    },
    {
      title: t("book.table.col_price"),
      dataIndex: "price",
      key: "price",
      width: 120,
      render: (price) => (
        <span>
          {price?.toLocaleString()} {i18n.language === "vi" ? "đ" : "$"}
        </span>
      ),
    },
    {
      title: t("book.table.col_category"),
      dataIndex: "categoryId",
      key: "categoryId",
      width: 150,
      render: (categoryId) => {
        if (categoryId && typeof categoryId === "object") {
          return <Tag color="blue">{categoryId.name}</Tag>;
        }
        return <Tag color="default">-</Tag>;
      },
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

  const loadCategories = async () => {
    try {
      const response = await categoryApi.getAll();
      const catsData = response?.data || response || [];
      console.log('📁 Categories Response:', response);
      console.log('📁 Categories Data:', catsData);
      setCategories(catsData);
      console.log('✅ Categories loaded successfully:', catsData.length, 'items');
    } catch (error) {
      console.error('❌ Error loading categories:', error);
    }
  };

  const onSearch = async (value) => {
    const dataSearch = {
      ...query,
      ...value,
    };
    try {
      setLoading(true);
      const response = await bookApi.getAll();
      const booksData = response?.data || response || [];

      console.log('📚 Books Response:', response);
      console.log('📚 Books Data:', booksData);

      if (response.code === "00" || Array.isArray(booksData)) {
        if (booksData.length === 0 && query.page > 0) {
          setQuery((prev) => ({ ...prev, page: query.page - 1 }));
          return;
        }
        // Format data for pagination
        const formattedData = {
          data: booksData,
          pagination: {
            totalRecords: booksData.length,
          },
        };
        setDataTable(formattedData);
        console.log('✅ Books loaded successfully:', booksData.length, 'items');
      } else {
        toast.error(response?.message || t("toast.error"));
      }
    } catch (error) {
      console.error('❌ Error loading books:', error);
      toast.error(t(MessageError));
    } finally {
      setLoading(false);
    }
  };

  // Filter and sort books based on search criteria
  const filteredBooks = useMemo(() => {
    let result = [...(dataTable?.data || [])];

    // Search by name or author
    if (searchText) {
      const queryStr = searchText.toLowerCase();
      result = result.filter(
          (book) =>
              book.name?.toLowerCase().includes(queryStr) ||
              book.author?.toLowerCase().includes(queryStr)
      );
    }

    if (filterCategory) {
      result = result.filter((book) => {
        const catId =
            typeof book.categoryId === "object"
                ? book.categoryId?._id
                : book.categoryId;
        return catId === filterCategory;
      });
    }

    result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    // Sort by price
    if (sortOrder) {
      result.sort((a, b) =>
          sortOrder === "asc" ? a.price - b.price : b.price - a.price
      );
    }

    return result;
  }, [dataTable?.data, searchText, filterCategory, sortOrder]);

  useEffect(() => {
    setQuery((prev) => ({ ...prev, page: QUERY.PAGE })); // QUERY.PAGE thường là 1 hoặc 0
  }, [searchText, filterCategory, sortOrder]);

  const handleSubmitForm = async (value) => {
    const data = {
      name: value.name,
      author: value.author,
      price: value.price,
      categoryId: value.categoryId,
    };

    try {
      let response;
      if (value?.id) {
        response = await bookApi.update(value.id, data);
      } else {
        response = await bookApi.create(data);
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
      const allBooks = await bookApi.getAll();
      const booksData = allBooks?.data || allBooks || [];
      const book = booksData.find((b) => b._id === id);
      if (book) {
        setValueForms(book);
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
      const response = await bookApi.delete(recDelete);
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

  const handleView = (record) => {
    setAction(actionCode.VIEW);
    setOpenModal(true);
    onGetDetail(record._id);
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
    loadCategories();
  }, []);

  useEffect(() => {
    onSearch(query);
  }, [query]);

  return (
      <>
        <ShadowCard style={{ marginBottom: 16 }}>
          <BookSearch
              categories={categories}
              onSearch={setSearchText}
              onFilterCategory={setFilterCategory}
              onSortPrice={setSortOrder}
          />
        </ShadowCard>

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
              // STT được tính dựa trên mảng đã được sắp xếp theo ngày tạo ở trên
              dataSource={filteredBooks?.map((e, index) => ({
                ...e,
                no: index + 1 + (query.page - (QUERY.PAGE === 1 ? 1 : 0)) * query.size,
              }))}
              columns={columns}
              pagination={{
                total: filteredBooks?.length || 0,
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
        <ActionCreateEditBook
          onCancel={() => setOpenModal(false)}
          open={openModal}
          title={actionText[action]}
          handleSubmit={handleSubmitForm}
          action={action}
          setValueForm={valueForms}
          categories={categories}
        />
      )}
    </>
  );
}

export default Book;
