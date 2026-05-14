import { getAssociateStatus } from "@/assets/data/categoryData";
import { Button } from "@/components/Atom/Button";
import { Input } from "@/components/Atom/Input";
import { Select } from "@/components/Atom/Select";
import { SearchOutlined, UndoOutlined } from "@ant-design/icons";
import { Col, Form, Row } from "antd";
import React from "react";
import { useTranslation } from "react-i18next";

const SearchForm = ({ form, onFinish, isFullWidth = false, onReset }) => {
  const { t } = useTranslation();
  const activeStatus = getAssociateStatus(t);

  const colSpan = isFullWidth ? { span: 24 } : { xs: 24, sm: 12, md: 8, lg: 6 };

  return (
    <Form
      form={form}
      onFinish={onFinish}
      layout="vertical"
      initialValues={{ status: null }}
    >
      <Row gutter={[10, 10]}>
        <Col {...colSpan}>
          <Input
            label={t("form.keysearch")}
            name="keyword"
            placeholder={t("associate.keysearch_placeholder")}
          />
        </Col>
        <Col {...colSpan}>
          <Select
            label={t("associate.status")}
            name="status"
            options={activeStatus}
            placeholder={t("associate.status")}
            isAllOption={true}
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
