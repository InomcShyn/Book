// components/Molecule/SearchForm.jsx
import React, { useEffect } from "react";
import { Row, Col, Form } from "antd";
import { Button } from "@/components/Atom/Button";
import { SearchOutlined, UndoOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import { DatePicker } from "@/components/Atom/Datepicker";
import dayjs from "dayjs";

const SearchFormBasic = ({
  form,
  onFinish,
  valueTab,
  roleUser,
  onSetTypeSearch,
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

  return (
    <Form
      form={form}
      onFinish={onFinish}
      layout="vertical"
      initialValues={defaultValue}
    >
      <Row gutter={[10, 10]}>
        <>
          {valueTab == 1 && (
            <>
              <Col>
                <DatePicker
                  label={t("result_recon.from_transaction")}
                  name="transDateFrom"
                  maxDate={to_transaction}
                  required
                />
              </Col>
              <Col>
                <DatePicker
                  label={t("result_recon.to_transaction")}
                  name="transDateTo"
                  minDate={from_transaction}
                  required
                />
              </Col>
            </>
          )}
          {valueTab == 2 && (
            <>
              <Col>
                <DatePicker
                  label={t("report_daily.from_trans_month")}
                  name="transDateFrom"
                  maxDate={to_transaction}
                  picker="month"
                  format="MM/YYYY"
                  required
                />
              </Col>
              <Col>
                <DatePicker
                  label={t("report_daily.to_trans_month")}
                  name="transDateTo"
                  minDate={from_transaction}
                  picker="month"
                  format="MM/YYYY"
                  required
                />
              </Col>
            </>
          )}
          <Col
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 8,
              justifyContent: "center",
              marginTop: 22,
            }}
          >
            <Button htmlType="submit" type="primary" icon={<SearchOutlined />}>
              {t("chart.filter")}
            </Button>
            <Button htmlType="button" onClick={onSetTypeSearch}>
              {t("chart.filter_advanced")}
            </Button>
          </Col>
        </>
      </Row>
    </Form>
  );
};

export default SearchFormBasic;
