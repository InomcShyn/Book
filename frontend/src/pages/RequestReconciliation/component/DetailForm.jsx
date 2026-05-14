import React, { useEffect, useState } from "react";
import { Input } from "@/components/Atom/Input";
import { Col, Form, Row, Tooltip } from "antd";
import { useTranslation } from "react-i18next";
import { Modal } from "@/components/Atom/Modal";
import { actionCode } from "@/utils/form/action";
import dayjs from "dayjs";
import { ruleMaxLength } from "@/utils/form/rules";
import {
  API_NATCOM_DATA,
  API_ORG_DATA,
  API_ORG_DATA_2,
  API_REQUEST,
} from "@/configs/paths/API_PATH";
import { exportBlobApi, getDataApi } from "@/api";
import SelectAssociate from "@/pages/CommonCategory/SelectAssociate";
import SelectService from "@/pages/CommonCategory/SelectService";
import { RangePicker } from "@/components/Atom/RangerPicker";
import utc from "dayjs/plugin/utc";
import { FlexTable } from "@/components/Atom/FlexTable";
import ShadowCard from "@/components/Atom/ShadowCard";
import { Button } from "@/components/Atom/Button";
import { exportFileBlob } from "@/utils/form/common";
import { toast } from "react-toastify";
import FullScreenSpin from "@/components/Atom/FullScreenSpin";

function DetailForm(props) {
  const {
    open,
    title,
    onCancel,
    handleSubmit,
    setValueForm,
    action,
    disabled,
    idRec,
  } = props;
  const [form] = Form.useForm();
  const { t } = useTranslation();
  dayjs.extend(utc);
  const [dataTable, setDataTable] = useState([]);
  const [dataNatCom, setDataNatCom] = useState([]);
  const [loaddingPage, setLoaddingPage] = useState(false);

  const getColumns = (srcType) => [
    { title: t("table.no"), dataIndex: "no", key: "no" },
    { title: t("data_group.name"), dataIndex: "name", key: "name" },
    { title: t("data_group.code"), dataIndex: "code", key: "code", width: 180 },
    {
      title: t("data_group.org_name"),
      dataIndex: "orgName",
      key: "orgName",
    },
    {
      title: t("data_group.type_src"),
      dataIndex: "type",
      key: "type",
      width: 150,
    },
    { title: "IP", dataIndex: "ip", key: "ip", width: 150 },
    { title: "Port", dataIndex: "port", key: "port", width: 100 },
    {
      title: t("button.List_file"),
      dataIndex: "details",
      key: "details",
      width: 300,
      render: (files) => (
        <>
          <div
            style={{
              maxHeight: 75,
              overflowY: "auto",
              paddingRight: 4, 
            }}
          >
            {files?.map((file, index) => {
              return (
                <div key={index} style={{ marginBottom: 4 }}>
                  <Tooltip
                    styleType="info"
                    overlayStyle={{ maxWidth: 300 }}
                    title={file.uploadFileName}
                  >
                    <Button
                      type="link"
                      onClick={() => onDownload(file, srcType)}
                      style={{
                        padding: 0,
                        height: "auto",
                        textAlign: "left",
                        color: "#0f5bf3ff",
                        cursor: "pointer",
                        textDecoration: "underline",
                        maxWidth: 280,
                        display: "inline-block",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {file.uploadFileName}
                    </Button>
                  </Tooltip>
                </div>
              );
            })}
          </div>
        </>
      ),
    },
  ];

  const onGetCode = async () => {
    try {
      const response = await getDataApi(API_REQUEST + "/next-code");
      if (response.code == "00") form.setFieldValue("code", response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const onGetOrgSource = async () => {
    try {
      const response = await getDataApi(
        API_REQUEST + "/" + idRec + "/org-sources?page=0&size=100",
      );
      if (response.code == "00") setDataTable(response);
    } catch (error) {
      console.log(error);
    }
  };

  const onDownload = async (file, type) => {
    let response;
    setLoaddingPage(true);
    try {
      if (type == "NATCOM") {
        response = await exportBlobApi(
          `${API_NATCOM_DATA}/download/${file.id}`,
        );
      } else {
        response = await exportBlobApi(`${API_ORG_DATA_2}/download/${file.id}`);
      }
      if (response.type == "application/json") {
        toast.error(t("toast.export_failed"));
        return;
      }
      exportFileBlob(response, file.uploadFileName);
    } catch (error) {
      toast.error(t("toast.export_failed"));
    } finally {
      setLoaddingPage(false);
    }
  };

  const onGetNatcomSource = async () => {
    try {
      const response = await getDataApi(
        API_REQUEST + "/" + idRec + "/natcom-sources?page=0&size=100",
      );
      if (response.code == "00") setDataNatCom(response);
    } catch (error) {
      console.log(error);
    }
  };

  const onFinish = () => {
    const values = form.getFieldsValue();
    const [start, end] = values?.time || [];

    const data = {
      ...values,
      fromTime: dayjs.utc(start.format("YYYY-MM-DD HH:mm:ss")).toISOString(),
      toTime: dayjs.utc(end.format("YYYY-MM-DD HH:mm:ss")).toISOString(),
    };

    delete data.time;

    if (action === actionCode.UPDATE) data.id = setValueForm?.id;

    handleSubmit(data);
  };

  useEffect(() => {
    if (action === actionCode.CREATE) {
      onGetCode();
    } else if (setValueForm) {
      form.setFieldsValue({
        ...setValueForm,
        time: [dayjs(setValueForm?.fromTime), dayjs(setValueForm?.toTime)],
      });
    }
  }, [setValueForm, action]);

  useEffect(() => {
    if (open) {
      form.resetFields();
      if (action === actionCode.VIEW) {
        onGetOrgSource();
        onGetNatcomSource();
      }
    }
  }, [open]);

  return (
    <>
      <Modal
        title={title + t("menu.request_reconciliation")}
        open={open}
        onCancel={onCancel}
        width={action == actionCode.VIEW ? "80%" : "45%"}
        onOk={() => form.submit()}
        footer={action == actionCode.VIEW ? null : undefined}
      >
        <Form
          form={form}
          onFinish={onFinish}
          layout="vertical"
          disabled={disabled}
        >
          <Row gutter={(20, 20)}>
            <Col xs={24} sm={action == actionCode.VIEW ? 8 : 12}>
              <Input
                label={t("data_group.code")}
                name="code"
                required={action != actionCode.VIEW}
                rules={[ruleMaxLength(25, t)]}
                placeholder={t("data_group.code")}
              />
            </Col>
            <Col xs={24} sm={action == actionCode.VIEW ? 8 : 12}>
              <Input
                label={t("data_group.name")}
                name="name"
                required={action != actionCode.VIEW}
                rules={[ruleMaxLength(100, t)]}
                placeholder={t("data_group.name")}
              />
            </Col>
            <Col xs={24} sm={action == actionCode.VIEW ? 8 : 12}>
              <SelectService
                name="serviceId"
                value={form.getFieldValue("serviceId")}
                required={action != actionCode.VIEW}
              />
            </Col>
            <Col xs={24} sm={action == actionCode.VIEW ? 8 : 12}>
              <SelectAssociate
                name="orgId"
                value={form.getFieldValue("orgId")}
                required={action != actionCode.VIEW}
              />
            </Col>
            <Col xs={24} sm={action == actionCode.VIEW ? 8 : 12}>
              <RangePicker
                label={t("request_recon.time_data")}
                name="time"
                showTime
                format="YYYY-MM-DD HH:mm:ss"
                placeholder={[
                  t("schedule_recon.from_time"),
                  t("schedule_recon.to_time"),
                ]}
                required={action != actionCode.VIEW}
              />
            </Col>
          </Row>
        </Form>
        {action === actionCode.VIEW && (
          <>
            <ShadowCard title={t("menu.data_source_associate")}>
              <FlexTable
                dataSource={dataTable?.data?.map((e, index) => ({
                  ...e,
                  no: index + 1,
                }))}
                columns={getColumns("ORG")}
                pagination={{
                  total: dataTable?.pagination?.totalRecords,
                  current: 1,
                  pageSize: 1000,
                  showSizeChanger: false,
                }}
              />
            </ShadowCard>

            <ShadowCard title={t("menu.data_source_natcom")}>
              <FlexTable
                dataSource={dataNatCom?.data?.map((e, index) => ({
                  ...e,
                  no: index + 1,
                }))}
                columns={getColumns("NATCOM")}
                pagination={{
                  total: dataNatCom?.pagination?.totalRecords,
                  current: 1,
                  pageSize: 1000,
                  showSizeChanger: false,
                }}
              />
            </ShadowCard>
            <FullScreenSpin spinning={loaddingPage} mode="popup" />
          </>
        )}
      </Modal>
    </>
  );
}

export default DetailForm;
