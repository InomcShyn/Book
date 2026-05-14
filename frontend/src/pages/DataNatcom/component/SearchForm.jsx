import React, { useState } from "react";
import { Row, Col, Form } from "antd";
import { Button } from "@/components/Atom/Button";
import { SearchOutlined, UndoOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import { Select } from "@/components/Atom/Select";
import SelectAssociate from "@/pages/CommonCategory/SelectAssociate";
import SelectService from "@/pages/CommonCategory/SelectService";
import { ROLE_ACCOUNT } from "@/constants/constants";
import { typeData } from "@/assets/data/categoryData";
import SelectSourceNatcom from "@/pages/CommonCategory/SelectSourceNatcom";
import { RangePicker } from "@/components/Atom/RangerPicker";
import dayjs from "dayjs";
import SelectRequest from "@/pages/CommonCategory/SelectRequest";
import { getDataApi } from "@/api";
import { toast } from "react-toastify";
import { API_REQUEST } from "@/configs/paths/API_PATH";
import { convertDate } from "@/utils/form/common";
const SearchForm = ({
  form,
  onFinish,
  isFullWidth = false,
  onReset,
  roleUser,
  onChangeErrorData,
}) => {
  const { t } = useTranslation();
  const optionTypeData = typeData(t);
  const [listRequest, setListRequest] = useState(false);
  const [loadingRequestRun, setLoadingRequestRun] = useState(false);
  const [errorDataValue, setErrorDataValue] = useState(false);
  const colSpan = isFullWidth
    ? { span: 24 }
    : { xs: 24, sm: 12, md: 8, lg: 5, xl: 5 };
  const colSpanSmall = isFullWidth
    ? { span: 24 }
    : { xs: 24, sm: 12, md: 8, lg: 4, xl: 4 };

  const defaultToDate = dayjs();
  const defaultFromDate = dayjs().subtract(7, "day");

  const onChangePartner = async (value) => {
    form.setFieldsValue({
      requestRunId: undefined,
    });
    setListRequest([]);
    if (!value) return;
    try {
      setLoadingRequestRun(true);
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

  return (
    <Form
      form={form}
      onFinish={onFinish}
      layout="vertical"
      initialValues={{
        errorData: false,
        time: [defaultFromDate, defaultToDate],
      }}
    >
      <Row gutter={[10, 10]}>
        {!errorDataValue && (
          <Col {...colSpan}>
            <RangePicker
              label={t("request_recon.time_data")}
              name="time"
              format="YYYY-MM-DD"
              placeholder={[
                t("schedule_recon.from_time"),
                t("schedule_recon.to_time"),
              ]}
              required
            />
          </Col>
        )}
        <Col {...colSpanSmall}>
          <SelectRequest
            name="requestRun"
            onChange={onChangePartner}
            value={form.getFieldValue("scheduleId")}
            required
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
        <Col {...colSpan}>
          <SelectService name="serviceId" />
        </Col>
        {roleUser != ROLE_ACCOUNT.PARTNER && (
          <Col {...colSpan}>
            <SelectAssociate name="orgId" />
          </Col>
        )}
        <Col {...colSpan}>
          <SelectSourceNatcom
            name="natcomSourceId"
            isAssociate={roleUser == ROLE_ACCOUNT.PARTNER}
          />
        </Col>
        <Col {...colSpanSmall}>
          <Select
            label={t("data_group.type_data")}
            name="errorData"
            options={optionTypeData}
            onChange={(value) => {
              setErrorDataValue(value);
              onChangeErrorData?.(value);
            }}
            allowClear={false}
          />
        </Col>
        {roleUser == ROLE_ACCOUNT.PARTNER && <Col {...colSpan} />}
        <Col
          span={24}
          style={{
            display: "flex",
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
        </Col>
      </Row>
    </Form>
  );
};

export default SearchForm;
