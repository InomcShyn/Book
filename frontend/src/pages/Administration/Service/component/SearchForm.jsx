// components/Molecule/SearchForm.jsx
import { getActiveStatus, getTypeservice } from "@/assets/data/categoryData";
import { Button } from "@/components/Atom/Button";
import { Input } from "@/components/Atom/Input";
import { Select } from "@/components/Atom/Select";
import { SearchOutlined, UndoOutlined } from "@ant-design/icons";
import { Col, Form, Row } from "antd";
import React from "react";
import { useTranslation } from "react-i18next";

const SearchForm = ({ form, onFinish, isFullWidth = false, onReset }) => {
  const { t } = useTranslation();
  const activeStatus = getActiveStatus(t);
  const types = getTypeservice(t);
  const colSpan = isFullWidth ? { span: 24 } : { xs: 24, sm: 12, md: 6 };

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
            label={t("service.service_name")}
            name="serviceName"
            placeholder={t("service.service_name")}
          />
        </Col>
        <Col {...colSpan}>
          <Select
            label={t("service.type")}
            name="type"
            options={types}
            placeholder={t("service.type")}
          />
        </Col>
        <Col {...colSpan}>
          <Select
            label={t("form.status")}
            name="status"
            options={activeStatus}
            placeholder={t("form.status")}
            isAllOption={true}
          />
        </Col>
        <Col
          {...colSpan}
          style={{
            display: "flex",
            gap: 20,
            marginTop: 22,
            justifyContent: "flex-end",
          }}
        >
          <Button htmlType="submit" type="primary" icon={<SearchOutlined />}>
            {t("button.search")}
          </Button>
          <Button
            htmlType="button"
            icon={<UndoOutlined />}
            onClick={onReset}
            style={{ flexShrink: 0 }}
          >
            {t("button.reset")}
          </Button>
        </Col>
      </Row>
    </Form>
  );
};

export default SearchForm;
