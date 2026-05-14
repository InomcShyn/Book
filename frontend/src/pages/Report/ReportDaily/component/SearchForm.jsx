// components/Molecule/SearchForm.jsx
import React, { useEffect, useState } from "react";
import { Row, Col, Form } from "antd";
import { Button } from "@/components/Atom/Button";
import {
  CaretDownOutlined,
  CaretUpOutlined,
  SearchOutlined,
  UndoOutlined,
} from "@ant-design/icons";
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
  roleUser,
  onReset,
}) => {
  const { t } = useTranslation();
  const TotalMismatch = getTotalMismatch(t);
  const from_transaction = Form.useWatch("from_transaction", form);
  const to_transaction = Form.useWatch("to_transaction", form);
  const [isAdvanced, setIsAdvanced] = useState(false);

  const colSpanSmall = isFullWidth ? { span: 24 } : { xs: 24, md: 4 };
  const colSpan = isFullWidth ? { span: 24 } : { xs: 24, md: 8 };

  const defaultToDate = dayjs();
  const defaultFromDate = dayjs().subtract(1, "month"); // lùi 1 tháng

  const defaultValue = {
    transDateTo: defaultToDate,
    transDateFrom: defaultFromDate,
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
        <Col xs={24} sm={12} md={6}>
          <DatePicker
            label={t("result_recon.from_transaction")}
            name="transDateFrom"
            maxDate={to_transaction}
            required
            isAllOption={true}
          />
        </Col>
        <Col xs={24} sm={12} md={6}>
          <DatePicker
            label={t("result_recon.to_transaction")}
            name="transDateTo"
            minDate={from_transaction}
            required
            isAllOption={true}
          />
        </Col>
        {isAdvanced && (
          <>
            <Col xs={24} sm={12} md={6}>
              <Select
                label={t("report_daily.total_mm_trans")}
                name="totalAmountDiff"
                options={TotalMismatch}
                isAllOption={true}
              />
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Select
                label={t("report_daily.total_mm_money")}
                name="totalMoneyDiff"
                options={TotalMismatch}
                isAllOption={true}
              />
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Select
                label={t("report_daily.total_num_mm_trans")}
                name="totalTransDiff"
                options={TotalMismatch}
                isAllOption={true}
              />
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Select
                label={t("report_daily.total_num_mm_trans_suc")}
                name="totalSuccessDiff"
                options={TotalMismatch}
                isAllOption={true}
              />
            </Col>
          </>
        )}
        <Col xs={24} sm={12} md={6}>
          <SelectService name="serviceId" />
        </Col>

        {roleUser !== ROLE_ACCOUNT.PARTNER && (
          <Col xs={24} sm={12} md={6}>
            <SelectAssociate name="orgId" />
          </Col>
        )}
        {roleUser == ROLE_ACCOUNT.PARTNER && <Col xs={24} sm={12} md={6} />}

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
            {t("button.search")}
          </Button>
          <Button htmlType="button" icon={<UndoOutlined />} onClick={onReset}>
            {t("button.reset")}
          </Button>
          {!isAdvanced && (
            <Button
              htmlType="button"
              icon={<CaretDownOutlined />}
              onClick={() => setIsAdvanced(!isAdvanced)}
            >
              {t("button.expand_search")}
            </Button>
          )}
          {isAdvanced && (
            <Button
              htmlType="button"
              icon={<CaretUpOutlined />}
              onClick={() => setIsAdvanced(!isAdvanced)}
            >
              {t("button.collapse_search")}
            </Button>
          )}
        </Col>
      </Row>
    </Form>
  );
};

export default SearchForm;
