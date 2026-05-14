import { Button } from "@/components/Atom/Button";
import SelectAssociate from '@/pages/CommonCategory/SelectAssociate';
import SelectReconTemplate from '@/pages/CommonCategory/SelectReconTemplate';
import SelectService from '@/pages/CommonCategory/SelectService';
import { SearchOutlined, UndoOutlined } from "@ant-design/icons";
import { Col, Form, Row } from "antd";
import React from "react";
import { useTranslation } from "react-i18next";

const SearchForm = ({
  form,
  onFinish,
  isFullWidth = false,
  onReset,
}) => {
  const { t } = useTranslation();
  const colSpan = isFullWidth ? { span: 24 } : { xs: 24, sm: 12, md: 6 };

  return (
    <Form form={form} onFinish={onFinish} layout="vertical">
      <Row gutter={[10, 10]}>
        <Col {...colSpan}>
          <SelectService name="serviceId" />
        </Col>
        <Col {...colSpan}>
          <SelectAssociate name="orgId" />
        </Col>
        <Col {...colSpan}>
          <SelectReconTemplate name="reconTemplateId" />
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
