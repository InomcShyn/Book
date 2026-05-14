import React from "react";
import { Row, Col, Form } from "antd";
import { Input } from "@/components/Atom/Input";
import { Button } from "@/components/Atom/Button";
import { SearchOutlined, UndoOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import { Select } from "@/components/Atom/Select";
import { getStatusSchedule } from "@/assets/data/categoryData";
import SelectService from "@/pages/CommonCategory/SelectService";

const SearchForm = ({ form, onFinish, isFullWidth = false, onReset }) => {
  const { t } = useTranslation();
  const SchelduleStatus = getStatusSchedule(t);
  const colSpan = isFullWidth
    ? { span: 24 }
    : { xs: 24, sm: 12, md: 8, lg: 6, xl: 6 };

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
            label={t("schedule_recon.name")}
            name="name"
            placeholder={t("schedule_recon.name")}
          />
        </Col>
        <Col {...colSpan}>
          <SelectService name="serviceId" />
        </Col>
        <Col {...colSpan}>
          <Select
            label={t("form.status")}
            name="status"
            options={SchelduleStatus}
            isAllOption={true}
            placeholder={t("form.status")}
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
