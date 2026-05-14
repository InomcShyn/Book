import React, { useEffect, useState } from "react";
import { Input } from "@/components/Atom/Input";
import { Col, Form, Row } from "antd";
import { useTranslation } from "react-i18next";
import { Select } from "@/components/Atom/Select";
import { Modal } from "@/components/Atom/Modal";
import { getStatusResultRecon } from "@/assets/data/categoryData";
import { DatePicker } from "@/components/Atom/Datepicker";
import { API_NATCOM_SOURCE, API_ORG_SOURCE } from "@/configs/paths/API_PATH";
import { getDataApi } from "@/api";
import dayjs from "dayjs";
import SelectService from "@/pages/CommonCategory/SelectService";
import SelectAssociate from "@/pages/CommonCategory/SelectAssociate";
import SelectSourceNatcom from "@/pages/CommonCategory/SelectSourceNatcom";
import { ROLE_ACCOUNT } from "@/constants/constants";
import SelectSourceAssociate from "@/pages/CommonCategory/SelectSourceAssociate";

function DetailForm(props) {
  const { open, title, onCancel, setValueForm, disabled } = props;
  const [form] = Form.useForm();
  const { t } = useTranslation();
  const StatusResultRecon = getStatusResultRecon(t);
  const [listSourceAsso, setListSourceAsso] = useState([]);
  const [listSourceNatcom, setListSourceNatcom] = useState([]);

  // const onGetSrcAssociate = async () => {
  //   const query = {
  //     page: 0,
  //     size: 100,
  //   };
  //   try {
  //     const response = await getDataApi(API_ORG_SOURCE, query);
  //     if (response.code == "00") setListSourceAsso(response?.data);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  // const onGetSrcNatcom = async () => {
  //   const query = {
  //     page: 0,
  //     size: 100,
  //   };
  //   try {
  //     const response = await getDataApi(API_NATCOM_SOURCE, query);
  //     if (response.code == "00") setListSourceNatcom(response?.data);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  useEffect(() => {
    if (setValueForm) {
      form.setFieldsValue({
        ...setValueForm,
        transDate: setValueForm?.transDate
          ? dayjs(setValueForm?.transDate)
          : null,
      });
    }
  }, [setValueForm]);

  useEffect(() => {
    if (open) {
      form.resetFields();
    }
  }, [open]);

  useEffect(() => {
    // onGetSrcAssociate();
    // onGetSrcNatcom();
  }, []);

  return (
    <>
      <Modal
        title={title + t("menu.result_reconciliation")}
        open={open}
        onCancel={onCancel}
        width="45%"
        footer={null}
      >
        <Form form={form} layout="vertical">
          <Row gutter={(20, 20)}>
            <Col xs={24} sm={12}>
              <SelectService
                name="serviceId"
                value={form.getFieldValue("serviceId")}
                required
              />
            </Col>
            <Col xs={24} sm={12}>
              <SelectAssociate
                name="orgId"
                value={form.getFieldValue("orgId")}
                required
              />
            </Col>
          </Row>
          <Row gutter={(20, 20)}>
            <Col xs={24} sm={12}>
              <SelectSourceAssociate
                name="orgSourceId"
                value={form.getFieldValue("orgSourceId")}
                required
              />
            </Col>
            <Col xs={24} sm={12}>
              <SelectSourceNatcom
                name="natcomSourceId"
                value={form.getFieldValue("natcomSourceId")}
                required
              />
            </Col>
          </Row>
          <Row gutter={(20, 20)}>
            <Col xs={24} sm={12}>
              <DatePicker
                label={t("result_recon.trans_date")}
                name="transDate"
                showTime
                format="YYYY-MM-DD HH:mm:ss"
                required
              />
            </Col>
            <Col xs={24} sm={12}>
              <Input
                label={t("result_recon.diff_value")}
                name="diffAmount"
                type="number"
                required
              />
            </Col>
          </Row>
          <Row gutter={(20, 20)}>
            <Col xs={24} sm={12}>
              <Input
                label={t("result_recon.diff_money")}
                name="diffMoney"
                type="number"
                required
              />
            </Col>
            <Col xs={24} sm={12}>
              <Select
                label={t("form.status")}
                name="status"
                options={StatusResultRecon}
                required
              />
            </Col>
          </Row>
        </Form>
      </Modal>
    </>
  );
}

export default DetailForm;
