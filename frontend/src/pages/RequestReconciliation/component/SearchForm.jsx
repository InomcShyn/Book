import React from "react";
import { Row, Col, Form } from "antd";
import { Input } from "@/components/Atom/Input";
import { Button } from "@/components/Atom/Button";
import { SearchOutlined, UndoOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import { Select } from "@/components/Atom/Select";
import { getStatusRequest } from "@/assets/data/categoryData";
import SelectService from "@/pages/CommonCategory/SelectService";
import SelectSchedule from "@/pages/CommonCategory/SelectSchedule";
import SelectAssociate from "@/pages/CommonCategory/SelectAssociate";
import { ROLE_ACCOUNT } from "@/constants/constants";

const SearchForm = ({
  form,
  onFinish,
  isFullWidth = false,
  onReset,
  roleUser,
}) => {
  const { t } = useTranslation();
  const RequestStatus = getStatusRequest(t);

  const colSpan = isFullWidth
    ? { span: 24 }
    : { xs: 24, sm: 12, md: 8, lg: 5, xl: 5 };
  const colSpanSmall = isFullWidth
    ? { span: 24 }
    : { xs: 24, sm: 12, md: 8, lg: 4, xl: 4 };
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
          <Input
            label={t("form.keysearch")}
            name="keyword"
            placeholder={t("request_recon.keysearch_name")}
          />
        </Col>
        <Col {...colSpan}>
          <SelectService name="serviceId" />
        </Col>
        {roleUser != ROLE_ACCOUNT.PARTNER && (
          <Col {...colSpan}>
            <SelectAssociate name="orgId" />
          </Col>
        )}

        <Col {...colSpan}>
          <SelectSchedule name="scheduleId" />
        </Col>
        <Col {...colSpanSmall}>
          <Select
            label={t("form.status")}
            name="status"
            options={RequestStatus}
            isAllOption={true}
            placeholder={t("form.status")}
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
