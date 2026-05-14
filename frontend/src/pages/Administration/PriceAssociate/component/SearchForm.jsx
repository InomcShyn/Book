// components/Molecule/SearchForm.jsx
import { getActiveStatus } from "@/assets/data/categoryData";
import { Button } from "@/components/Atom/Button";
import { Select } from "@/components/Atom/Select";
import SelectAssociate from "@/pages/CommonCategory/SelectAssociate";
import SelectService from "@/pages/CommonCategory/SelectService";
import SelectZone from "@/pages/CommonCategory/SelectZone";
import { SearchOutlined, UndoOutlined } from "@ant-design/icons";
import { Col, Form, Row } from "antd";
import React from "react";
import { useTranslation } from "react-i18next";

const SearchForm = ({ form, onFinish, isFullWidth = false, onReset }) => {
  const { t } = useTranslation();
  const activeStatus = getActiveStatus(t);

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
      initialValues={{ status: null }}
    >
      <Row gutter={[10, 10]}>
        <Col {...colSpan}>
          <SelectService name="serviceId" />
        </Col>
        <Col {...colSpan}>
          <SelectAssociate name="orgId" />
        </Col>
        <Col {...colSpan}>
          <SelectZone name="zoneId" />
        </Col>
        <Col {...colSpan}>
          <Select
            label={t("price_associate.price_status")}
            name="status"
            options={activeStatus}
            placeholder={t("price_associate.price_status")}
            isAllOption={true}
          />
        </Col>
        <Col
          {...colSpanBtn}
          style={{
            display: "flex",
            gap: 8,
            justifyContent: "center",
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
