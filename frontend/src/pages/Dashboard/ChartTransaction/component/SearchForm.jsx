// components/Molecule/SearchForm.jsx
import React, { useEffect } from "react";
import { Row, Col, Form } from "antd";
import { Button } from "@/components/Atom/Button";
import { SearchOutlined, UndoOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import { Select } from "@/components/Atom/Select";
import { DatePicker } from "@/components/Atom/Datepicker";
import { getTotalMismatch } from "@/assets/data/categoryData";
import dayjs from "dayjs";
import SelectAssociate from "@/pages/CommonCategory/SelectAssociate";
import SelectService from "@/pages/CommonCategory/SelectService";
import { ROLE_ACCOUNT } from "@/constants/constants";

const SearchForm = ({
  form,
  onFinish,
  isFullWidth = false,
  valueTab,
  roleUser,
  onSetTypeSearch,
}) => {
  const { t } = useTranslation();
  const TotalMismatch = getTotalMismatch(t);
  const from_transaction = Form.useWatch("from_transaction", form);
  const to_transaction = Form.useWatch("to_transaction", form);
  const colSpan = isFullWidth ? { span: 24 } : { xs: 24, sm: 12, md: 6 };
  const defaultValue = {
    totalAmountDiff: null,
    totalMoneyDiff: null,
    totalTransDiff: null,
    totalSuccessDiff: null,
  };

  return (
    <Form
      form={form}
      onFinish={onFinish}
      layout="vertical"
      initialValues={defaultValue}
    >
      <Row gutter={[10, 10]}>
        {valueTab == 1 && (
          <>
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
          </>
        )}
        {valueTab == 2 && (
          <>
            <Col {...colSpan}>
              <DatePicker
                label={t("report_daily.from_trans_month")}
                name="transDateFrom"
                maxDate={to_transaction}
                picker="month"
                format="MM/YYYY"
                required
              />
            </Col>
            <Col {...colSpan}>
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

        <Col {...colSpan}>
          <Select
            label={t("report_daily.total_mm_trans")}
            name="totalAmountDiff"
            options={TotalMismatch}
            isAllOption={true}
          />
        </Col>
        <Col {...colSpan}>
          <Select
            label={t("report_daily.total_mm_money")}
            name="totalMoneyDiff"
            options={TotalMismatch}
            isAllOption={true}
          />
        </Col>
        <Col {...colSpan}>
          <Select
            label={t("report_daily.total_num_mm_trans")}
            name="totalTransDiff"
            options={TotalMismatch}
            isAllOption={true}
          />
        </Col>
        <Col {...colSpan}>
          <Select
            label={t("report_daily.total_num_mm_trans_suc")}
            name="totalSuccessDiff"
            options={TotalMismatch}
            isAllOption={true}
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
        {roleUser == ROLE_ACCOUNT.PARTNER && <Col {...colSpan} />}

        <Col
          xs={24}
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 8,
            justifyContent: "center",
          }}
        >
          <Button htmlType="submit" type="primary" icon={<SearchOutlined />}>
            {t("chart.filter")}
          </Button>
          <Button htmlType="button" onClick={onSetTypeSearch}>
            {t("chart.hide_filter")}
          </Button>
        </Col>
      </Row>
    </Form>
  );
};

export default SearchForm;
