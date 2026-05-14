import React, { useEffect, useState } from "react";
import { Input } from "@/components/Atom/Input";
import { Col, Form, Row } from "antd";
import { useTranslation } from "react-i18next";
import {
  getActiveStatus,
  getNatcomSourceType,
} from "@/assets/data/categoryData";
import { Select } from "@/components/Atom/Select";
import { Modal } from "@/components/Atom/Modal";
import { actionCode } from "@/utils/form/action";
import { Textarea } from "@/components/Atom/Textarea";
import { InputPassword } from "@/components/Atom/InputPassword";
import { ruleIP, ruleMaxLength } from "@/utils/form/rules";
import { getDataApi, postDataApi } from "@/api";
import { API_NATCOM_SOURCE } from "@/configs/paths/API_PATH";
import "../../index.scss";
import SelectAssociate from "@/pages/CommonCategory/SelectAssociate";
import SelectService from "@/pages/CommonCategory/SelectService";

function DetailForm(props) {
  const {
    open,
    title,
    onCancel,
    handleSubmit,
    setValueForm,
    action,
    disabled,
  } = props;
  const [form] = Form.useForm();
  const { t } = useTranslation();
  const activeStatus = getActiveStatus(t);
  const natcomSourceType = getNatcomSourceType(t);
  const type_src = Form.useWatch("type", form);
  const ip = Form.useWatch("ip", form);
  const port = Form.useWatch("port", form);
  const username = Form.useWatch("username", form);
  const pass = Form.useWatch("pass", form);
  const [testResult, setTestResult] = useState(null);

  const onFinish = (values) => {
    if (action === actionCode.UPDATE) values.id = setValueForm?.id;
    handleSubmit(values);
  };

  const onGetCode = async () => {
    try {
      const response = await getDataApi(API_NATCOM_SOURCE + "/next-code");
      if (response.code == "00") form.setFieldValue("code", response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const onTestConnect = async () => {
    const data = {
      ip: ip,
      port: port,
      username: username,
      password: pass,
      type_src: type_src,
      dbName: form.getFieldValue("dbName"),
      isFtp: type_src == "FTP",
    };
    setTestResult("loadding");
    try {
      const response = await postDataApi(
        API_NATCOM_SOURCE + "/test-connection",
        data
      );
      if (response.code == "00" && response.data) {
        setTestResult("success");
      } else setTestResult("error");
    } catch (error) {
      setTestResult("error");
      console.log(error);
    }
  };

  useEffect(() => {
    setTestResult(null);
  }, [ip, port, username, pass]);

  useEffect(() => {
    if (type_src == "FTP") form.setFieldValue("port", "21");
  }, [type_src]);

  useEffect(() => {
    if (action === actionCode.CREATE) {
      onGetCode();
    } else if (setValueForm) {
      form.setFieldsValue(setValueForm);
    }
  }, [setValueForm, action]);

  useEffect(() => {
    if (open) {
      form.resetFields();
    }
  }, [open]);

  const tooltip_SqlGet = (
    <div>
      {t("data_group.tootip1")}
      <ul style={{ margin: "4px 0", paddingLeft: 18 }}>
        <li>- ID</li>
        <li>- AMOUNT {t("data_group.tootip2")}</li>
        <li>- CREATE_TIME (dd/MM/yyyy HH:mm:ss)</li>
        <li>- TYPE</li>
        <li>- FROM</li>
        <li>- TO</li>        
        <li>- FEE</li>        
        <li>- STATUS {t("data_group.tootip3")}</li>
      </ul>
    </div>
  );

  return (
    <>
      <Modal
        title={title + t("menu.data_source_natcom")}
        open={open}
        onCancel={onCancel}
        width="45%"
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
            <Col xs={24} sm={12}>
              <Input
                label={t("data_group.code")}
                name="code"
                required
                rules={[ruleMaxLength(25, t)]}
                placeholder={t("data_group.code")}
              />
            </Col>
            <Col xs={24} sm={12}>
              <Input
                label={t("data_group.name")}
                name="name"
                required
                rules={[ruleMaxLength(200, t)]}
                placeholder={t("data_group.name")}
              />
            </Col>
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
            <Col xs={24} sm={12}>
              <Select
                label={t("data_group.type_src")}
                name="type"
                options={
                  action === actionCode.UPDATE
                    ? natcomSourceType
                    : natcomSourceType.filter((e) =>
                        ["FTP", "DATABASE"].includes(e.value)
                      )
                }
                placeholder={t("data_group.type_src")}
                required
              />
            </Col>
            {(type_src == "FTP" || type_src == "DATABASE") && (
              <>
                <Col xs={24} sm={12}>
                  <Input
                    label="IP"
                    name="ip"
                    required
                    rules={[ruleIP(t), ruleMaxLength(200, t)]}
                    placeholder="IP"
                  />
                </Col>
                <Col xs={24} sm={12}>
                  <Input
                    label="Port"
                    name="port"
                    required
                    rules={[ruleMaxLength(50, t)]}
                    placeholder="Port"
                    type="number"
                    onInput={(e) => {
                      e.target.value = e.target.value.replace(/[^0-9]/g, "");
                    }}
                  />
                </Col>
                <Col xs={24} sm={12}>
                  <Input
                    label={t("data_group.user_name")}
                    name="username"
                    required
                    rules={[ruleMaxLength(200, t)]}
                    placeholder={t("data_group.user_name")}
                    autoComplete="new-user"
                  />
                </Col>
                <Col xs={24} sm={12}>
                  <InputPassword
                    label={t("data_group.pw")}
                    name="pass"
                    required
                    placeholder={t("data_group.pw")}
                    autoComplete="new-password"
                    onKeyDown={(e) => {
                      if (e.key === " ") {
                        e.preventDefault();
                      }
                    }}
                    onInput={(e) => {
                      e.target.value = e.target.value.replace(/\s/g, "");
                    }}
                  />
                  {ip && port && username && pass && (
                    <div>
                      <button
                        type="button"
                        onClick={onTestConnect}
                        class="button-connect"
                        disabled={testResult == "loadding"}
                      >
                        {t("data_group.test_connect")}
                      </button>
                      {testResult == "success" && (
                        <span class="text-connect-success">
                          {t("data_group.success")}
                        </span>
                      )}
                      {testResult == "error" && (
                        <span class="text-connect-failed">
                          {t("data_group.failed")}
                        </span>
                      )}
                      {testResult == "loadding" && (
                        <span class="text-connect-loadding">
                          {t("data_group.connectting")}
                        </span>
                      )}
                    </div>
                  )}
                </Col>
              </>
            )}
            {type_src == "DATABASE" && (
              <>
                <Col xs={24} sm={12}>
                  <Input
                    label={t("data_group.db_name")}
                    name="dbName"
                    required
                    rules={[ruleMaxLength(500, t)]}
                    placeholder={t("data_group.db_name")}
                  />
                </Col>
                <Col span={24}>
                  <Textarea
                    label="SQL GET"
                    name="sqlGet"
                    tooltipIcon={tooltip_SqlGet}
                    required
                    rules={[ruleMaxLength(4000, t)]}
                  />
                </Col>
                <Col span={24}>
                  <Textarea
                    label="SQL APPROVE"
                    name="sqlApprove"
                    tooltipIcon={t("data_group.tootip_sql_apr")}
                    rules={[ruleMaxLength(4000, t)]}
                  />
                </Col>
                <Col span={24}>
                  <Textarea
                    label="SQL REVERT"
                    name="sqlRevert"
                    tooltipIcon={t("data_group.tootip_sql_revert")}
                    rules={[ruleMaxLength(4000, t)]}
                  />
                </Col>
                <Col span={24}>
                  <Textarea
                    label="SQL CANCEL"
                    name="sqlCancel"
                    tooltipIcon={t("data_group.tootip_sql_cancel")}
                    rules={[ruleMaxLength(4000, t)]}
                  />
                </Col>
              </>
            )}
            {(type_src == "FTP" || type_src == "UPLOAD") && (
              <Col xs={24} sm={12}>
                <Input
                  label={t("data_group.folder_path")}
                  name="folderPath"
                  required
                  rules={[ruleMaxLength(250, t)]}
                  placeholder={t("data_group.folder_path")}
                />
              </Col>
            )}
            {action != actionCode.CREATE && (
              <Col xs={24} sm={12}>
                <Select
                  label={t("form.status")}
                  name="status"
                  options={activeStatus}
                  required
                  placeholder={t("data_group.status")}
                />
              </Col>
            )}
          </Row>
        </Form>
      </Modal>
    </>
  );
}

export default DetailForm;
