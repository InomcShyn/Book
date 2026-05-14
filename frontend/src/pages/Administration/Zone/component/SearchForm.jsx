// components/Molecule/SearchForm.jsx
import React from "react";
import { Row, Col, Form } from "antd";
import { Input } from "@/components/Atom/Input";
import { Button } from "@/components/Atom/Button";
import { SearchOutlined, UndoOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import { Select } from "@/components/Atom/Select";
import { getActiveStatus } from "@/assets/data/categoryData";

const SearchForm = ({ form, onFinish, isFullWidth = false }) => {
  const { t } = useTranslation();
  const colSpan = isFullWidth ? { span: 24 } : { xs: 24, sm: 12, md: 6 };
  const activeStatus = getActiveStatus(t);
  const onReset = () => {
    form.resetFields();
  };

  return (
    <Form form={form} onFinish={onFinish} layout="vertical">
      <Row gutter={[10, 10]}>
        <Col {...colSpan}>
          <Input label={t("zone.code")} name="code" />
        </Col>
        <Col {...colSpan}>
          <Input label={t("zone.name")} name="name" />
        </Col>
        <Col {...colSpan}>
          <Select
            label={t("form.status")}
            name="status"
            options={activeStatus}
          />
        </Col>
        <Col
          {...colSpan}
          style={{
            display: "flex",
            gap: 8,
            marginTop: 22,
            justifyContent: "flex-end",
          }}
        >
          <Button htmlType="submit" type="primary" icon={<SearchOutlined />}>
            {t("button.search")}
          </Button>
          <Button htmlType="button" icon={<UndoOutlined />} onClick={onReset}>
            {t("button.reset")}
          </Button>
        </Col>
      </Row>
    </Form>
  );
};

export default SearchForm;
