import { Row, Col } from "antd";
import { useTranslation } from "react-i18next";
import { Input } from "@/components/Atom/Input/index.jsx";
import { Select } from "@/components/Atom/Select/index.jsx";

const BookSearch = ({ categories, onSearch, onFilterCategory, onSortPrice }) => {
  const { t } = useTranslation();

  const sortOptions = [
    { value: "", label: t("common.all") },
    { value: "asc", label: t("book.search.sort_asc") },
    { value: "desc", label: t("book.search.sort_desc") },
  ];

  const categoryOptions = [
    { value: "", label: t("book.search.all_categories") },
    ...(categories || []).map((cat) => ({
      value: cat._id,
      label: cat.name,
    })),
  ];

  return (
    <div className="book-search">
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} md={8}>
          <Input
            placeholder={t("book.search.placeholder")}
            onChange={(e) => onSearch(e.target.value)}
            allowClear
          />
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Select
            placeholder={t("book.search.filter_category")}
            options={categoryOptions}
            onChange={onFilterCategory}
            allowClear
            style={{ width: "100%" }}
          />
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Select
            placeholder={t("book.search.sort_price")}
            options={sortOptions}
            onChange={onSortPrice}
            allowClear
            style={{ width: "100%" }}
          />
        </Col>
      </Row>
    </div>
  );
};

export default BookSearch;
