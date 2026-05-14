// components/Molecule/SearchForm.jsx
import React, { useEffect } from "react";
import { Row, Col, Form } from "antd";
import { Button } from "@/components/Atom/Button";
import { SearchOutlined, UndoOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import { DatePicker } from "@/components/Atom/Datepicker";
import dayjs from "dayjs";
import SelectService from "@/pages/CommonCategory/SelectService";

const SearchFormBasic = ({
  form,
  onFinish,
  roleUser,
  onReset,
  isFullWidth,
}) => {
  const { t } = useTranslation();
  const from_transaction = Form.useWatch("from_transaction", form);
  const to_transaction = Form.useWatch("to_transaction", form);

  const defaultToDate = dayjs();
  const defaultFromDate = dayjs().subtract(1, "month");
  const defaultValue = {
    transDateTo: defaultToDate,
    transDateFrom: defaultFromDate,
  };

  const colSpan = isFullWidth
    ? { span: 24 }
    : { xs: 24, sm: 12, md: 8, lg: 6, xl: 6 };

  return (
    <Form
      form={form}
      onFinish={onFinish}
      layout="vertical"
      initialValues={defaultValue}
    >
      <Row gutter={[10, 10]}>
        <Col {...colSpan}>
          <DatePicker
            label={t("result_recon.from_transaction")}
            name="transDateFrom"
            maxDate={to_transaction}
            required
          />
        </Col>
        <Col {...colSpan}>
          <DatePicker
            label={t("result_recon.to_transaction")}
            name="transDateTo"
            minDate={from_transaction}
            required
          />
        </Col>
        <Col {...colSpan}>
          <SelectService name="serviceId" />
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
            {t("chart.filter")}
          </Button>
          <Button htmlType="button" icon={<UndoOutlined />} onClick={onReset}>
            {t("button.reset")}
          </Button>
        </Col>
      </Row>
    </Form>
  );
};

export default SearchFormBasic;
