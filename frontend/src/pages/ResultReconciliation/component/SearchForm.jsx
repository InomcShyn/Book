// components/Molecule/SearchForm.jsx
import React, { useEffect, useState } from "react";
import { Row, Col, Form } from "antd";
import { Input } from "@/components/Atom/Input";
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
import { getStatusResultRecon } from "@/assets/data/categoryData";
import { CompareValidator } from "@/utils/form/validators";
import { numberGreater0 } from "@/utils/form/rules";
import dayjs from "dayjs";
import SelectService from "@/pages/CommonCategory/SelectService";
import SelectAssociate from "@/pages/CommonCategory/SelectAssociate";
import { ROLE_ACCOUNT } from "@/constants/constants";
import SelectSchedule from "@/pages/CommonCategory/SelectSchedule";
import SelectRequest from "@/pages/CommonCategory/SelectRequest";
import { API_REQUEST } from "@/configs/paths/API_PATH";
import { getDataApi } from "@/api";
import { convertDate } from "@/utils/form/common";

const SearchForm = ({
  form,
  onFinish,
  isFullWidth = false,
  onReset,
  roleUser,
  dataRequest,
}) => {
  const { t } = useTranslation();
  const StatusResultRecon = getStatusResultRecon(t);
  const transDateFrom = Form.useWatch("transDateFrom", form);
  const transDateTo = Form.useWatch("transDateTo", form);
  const scheduleId = Form.useWatch("scheduleId", form);
  const [loadingRequestRun, setLoadingRequestRun] = useState(false);
  const [isAdvanced, setIsAdvanced] = useState(false);
  const [listRequest, setListRequest] = useState(false);

  const colSpanSmall = isFullWidth
    ? { span: 24 }
    : { xs: 24, sm: 12, md: 8, lg: 6, xl: 4 };

  const colSpan = isFullWidth
    ? { span: 24 }
    : {
        xs: 24,
        sm: 12,
        md: isAdvanced ? 12 : 12,
        lg: isAdvanced ? 12 : 12,
        xl: isAdvanced ? 4 : 8,
      };

  const defaultToDate = dayjs();
  const defaultFromDate = dayjs().subtract(1, "month"); // lùi 1 tháng

  const onChangePartner = async (value) => {
    form.setFieldsValue({
      requestRunId: undefined,
    });
    setListRequest([]);
    if (!value) return;
    try {
      const response = await getDataApi(`${API_REQUEST}/${value}/request-run`);
      if (response.code === "00") {
        const arr = response?.data.map((item, index) => ({
          ...item,
          name: `${t("result_recon.number_run")} ${
            response.data.length - index
          } (${convertDate(item.startTime)})`,
        }));
        setListRequest(arr);
      } else {
        toast.error(response?.message || t("toast.error"));
      }
    } catch (error) {
      toast.error(t("toast.error"));
    } finally {
      setLoadingRequestRun(false);
    }
  };

  useEffect(() => {
    if (dataRequest) {
      setIsAdvanced(true);
      onChangePartner(dataRequest.requestId);
    }
  }, [dataRequest]);

  return (
    <Form
      form={form}
      onFinish={onFinish}
      layout="vertical"
      initialValues={{
        transDateFrom: defaultFromDate,
        transDateTo: defaultToDate,
      }}
    >
      <Row gutter={[10, 10]}>
        <Col {...colSpan}>
          <Input
            label={t("form.keysearch")}
            name="txId"
            placeholder={t("result_recon.search_transactionId")}
          />
        </Col>
        <Col {...colSpanSmall}>
          <DatePicker
            label={t("result_recon.from_transaction")}
            name="transDateFrom"
            maxDate={transDateTo}
            placeholder={t("result_recon.from_transaction")}
            required
          />
        </Col>
        <Col {...colSpanSmall}>
          <DatePicker
            label={t("result_recon.to_transaction")}
            name="transDateTo"
            minDate={transDateFrom}
            placeholder={t("result_recon.to_transaction")}
            required
          />
        </Col>
        <Col {...colSpanSmall}>
          <SelectRequest
            name="requestId"
            onChange={onChangePartner}
            required
            value={form.getFieldValue("scheduleId")}
            rules={[
              {
                required: true,
                message: t("result_recon.select_reconciliation_request"),
              },
            ]}
          />
        </Col>
        <Col {...colSpanSmall}>
          <Select
            label={t("result_recon.request_run")}
            name="requestRunId"
            options={listRequest}
            placeholder={t("result_recon.request_run")}
            fieldNames={{ label: "name", value: "id" }}
            loading={loadingRequestRun}
            required
          />
        </Col>
        {/* <Col {...colSpanSmall}>
          <SelectService
            name="serviceId"
            value={form.getFieldValue("serviceId")}
          />
        </Col>
        {roleUser != ROLE_ACCOUNT.PARTNER && (
          <Col {...colSpanSmall}>
            <SelectAssociate name="orgId" value={form.getFieldValue("orgId")} />
          </Col>
        )} */}
        {isAdvanced && (
          <>
            {/* <Col {...colSpanSmall}>
              <SelectRequest
                name="scheduleId"
                onChange={onChangePartner}
                value={form.getFieldValue("scheduleId")}
              />
            </Col>
            <Col {...colSpanSmall}>
              <Select
                label={t("result_recon.request_run")}
                name="requestRunId"
                options={listRequest}
                placeholder={t("result_recon.request_run")}
                fieldNames={{ label: "name", value: "id" }}
              />
            </Col> */}
            <Col {...colSpanSmall}>
              <SelectService
                name="serviceId"
                value={form.getFieldValue("serviceId")}
              />
            </Col>
            {roleUser != ROLE_ACCOUNT.PARTNER && (
              <Col {...colSpanSmall}>
                <SelectAssociate
                  name="orgId"
                  value={form.getFieldValue("orgId")}
                />
              </Col>
            )}
            <Col {...colSpanSmall}>
              <Input
                label={t("result_recon.from_deviation_value")}
                name="diffAmountFrom"
                type="number"
                rules={numberGreater0(t)}
                placeholder={t("result_recon.from_deviation_value")}
              />
            </Col>
            <Col {...colSpanSmall}>
              <Input
                label={t("result_recon.to_deviation_value")}
                name="diffAmountTo"
                type="number"
                dependencies={["diffAmountFrom"]}
                placeholder={t("result_recon.to_deviation_value")}
                rules={[
                  ...numberGreater0(t),
                  ({ getFieldValue }) => ({
                    validator: CompareValidator({
                      getFieldValue,
                      compareField: "diffAmountFrom",
                      operator: ">",
                      t,
                      currentLabel: t("result_recon.to_deviation_value"),
                      compareLabel: t("result_recon.from_deviation_value"),
                    }),
                  }),
                ]}
              />
            </Col>

            <Col {...colSpanSmall}>
              <Input
                label={t("result_recon.from_deviation_money")}
                name="diffMoneyFrom"
                type="number"
                rules={numberGreater0(t)}
                placeholder={t("result_recon.from_deviation_money")}
              />
            </Col>
            <Col {...colSpanSmall}>
              <Input
                label={t("result_recon.to_deviation_money")}
                name="diffMoneyTo"
                type="number"
                dependencies={["diffMoneyFrom"]}
                placeholder={t("result_recon.to_deviation_money")}
                rules={[
                  ...numberGreater0(t),
                  ({ getFieldValue }) => ({
                    validator: CompareValidator({
                      getFieldValue,
                      compareField: "diffMoneyFrom",
                      operator: ">",
                      t,
                      currentLabel: t("result_recon.to_deviation_money"),
                      compareLabel: t("result_recon.from_deviation_money"),
                    }),
                  }),
                ]}
              />
            </Col>
            <Col {...colSpanSmall}>
              <Select
                label={t("form.status")}
                name="statusList"
                options={StatusResultRecon}
                placeholder={t("form.status")}
                mode="multiple"
              />
            </Col>
          </>
        )}

        {roleUser == ROLE_ACCOUNT.PARTNER && <Col {...colSpan} />}
        <Col
          xs={24}
          style={{
            display: "flex",
            justifyContent: "center",
            gap: 8,
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
