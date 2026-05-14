// components/Molecule/SearchForm.jsx
import { Button } from "@/components/Atom/Button";
import { Input } from "@/components/Atom/Input";
import { SearchOutlined, UndoOutlined } from "@ant-design/icons";
import { Col, Form, Row } from "antd";
import React from "react";
import { useTranslation } from "react-i18next";

const SearchForm = ({ form, onFinish, isFullWidth = false, onReset }) => {
  const { t } = useTranslation();
  const colSpan = isFullWidth ? { span: 24 } : { xs: 24, sm: 12, md: 6 };

  return (
    <Form form={form} onFinish={onFinish} layout="vertical">
      <Row gutter={[10, 10]}>
        <Col {...colSpan}>
          <Input
            label={t("file_reconciliation.name")}
            name="name"
            placeholder={t("data_group.keysearch_file_reconciliation")}
          />
        </Col>
        <Col
          // {...colSpan}
          flex="auto"
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
