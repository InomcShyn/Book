// components/Molecule/SearchForm.jsx
import React from "react";
import { Row, Col, Form } from "antd";
import { Input } from "@/components/Atom/Input";
import { Button } from "@/components/Atom/Button";
import { SearchOutlined, UndoOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import { Select } from "@/components/Atom/Select";
import { getNatcomSourceType } from "@/assets/data/categoryData";
import SelectService from "@/pages/CommonCategory/SelectService";
import SelectAssociate from "@/pages/CommonCategory/SelectAssociate";

const SearchForm = ({ form, onFinish, isFullWidth = false, onReset }) => {
  const { t } = useTranslation();
  const natcomSourceType = getNatcomSourceType(t);
  const colSpan = isFullWidth
    ? { span: 24 }
    : { xs: 24, sm: 12, md: 8, lg: 6, xl: 6 };
  const colSpanBtn = isFullWidth
    ? { span: 24 }
    : { xs: 24, sm: 24, md: 24, lg: 24, xl: 24 };

  return (
    <Form
      form={form}
      onFinish={onFinish}
      layout="vertical"
      initialValues={{
        type: null,
      }}
    >
      <Row gutter={[16, 16]}>
        <Col {...colSpan}>
          <Input
            label={t("form.keysearch")}
            name="keyword"
            placeholder={t("data_group.keysearch_placeholder")}
          />
        </Col>
        <Col {...colSpan}>
          <SelectService name="serviceId" />
        </Col>
        <Col {...colSpan}>
          <SelectAssociate name="orgId" />
        </Col>
        <Col {...colSpan}>
          <Select
            label={t("data_group.type_src")}
            name="type"
            options={natcomSourceType}
            isAllOption={true}
          />
        </Col>

        <Col {...colSpanBtn}>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 10,
              justifyContent: "center",
              marginTop: 4,
            }}
          >
            <Button htmlType="submit" type="primary" icon={<SearchOutlined />}>
              {t("button.search")}
            </Button>
            <Button htmlType="button" icon={<UndoOutlined />} onClick={onReset}>
              {t("button.reset")}
            </Button>
          </div>
        </Col>
      </Row>
    </Form>
  );
};

export default SearchForm;
