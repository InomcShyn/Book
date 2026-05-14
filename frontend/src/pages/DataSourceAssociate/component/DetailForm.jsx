import React, { useEffect, useState } from "react";
import { Input } from "@/components/Atom/Input";
import { Col, Form, Row } from "antd";
import { useTranslation } from "react-i18next";
import { Select } from "@/components/Atom/Select";
import { Modal } from "@/components/Atom/Modal";
import { actionCode } from "@/utils/form/action";
import { getActiveStatus, orgSourceType } from "@/assets/data/categoryData";
import { InputPassword } from "@/components/Atom/InputPassword";
import { ruleIP, ruleMaxLength } from "@/utils/form/rules";
import { API_ORG_SOURCE } from "@/configs/paths/API_PATH";
import { getDataApi, postDataApi } from "@/api";
import "../../index.scss";
import SelectService from "@/pages/CommonCategory/SelectService";
import SelectAssociate from "@/pages/CommonCategory/SelectAssociate";

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
  const type = Form.useWatch("type", form);
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
      const response = await getDataApi(API_ORG_SOURCE + "/next-code");
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
    };
    setTestResult("loadding");
    try {
      const response = await postDataApi(
        API_ORG_SOURCE + "/test-connection",
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
    if (type == "FTP") form.setFieldValue("port", "21");
  }, [type]);

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

  return (
    <>
      <Modal
        title={title + t("menu.data_source_associate")}
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
          initialValues={{ type: "FTP" }}
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
                rules={[ruleMaxLength(100, t)]}
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
                    ? orgSourceType
                    : orgSourceType.filter((e) => e.value == "FTP")
                }
                placeholder={t("data_group.type_src")}
                required
              />
            </Col>
            {type == orgSourceType[0].value && (
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
                    type="number"
                    required
                    rules={[ruleMaxLength(25, t)]}
                    placeholder="Port"
                  />
                </Col>
                <Col xs={24} sm={12}>
                  <Input
                    label={t("data_group.user_name")}
                    name="username"
                    required
                    rules={[ruleMaxLength(100, t)]}
                    placeholder={t("data_group.user_name")}
                    autoComplete="new-user"
                  />
                </Col>
                <Col xs={24} sm={12}>
                  <InputPassword
                    label={t("data_group.pw")}
                    name="pass"
                    required
                    rules={[ruleMaxLength(100, t)]}
                    placeholder={t("data_group.pw")}
                    autoComplete="new-password"
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
            <Col xs={24} sm={12}>
              <Input
                label={t("data_group.folder_path")}
                name="folderPath"
                required
                rules={[ruleMaxLength(250, t)]}
                placeholder={t("data_group.folder_path")}
              />
            </Col>
            {action != actionCode.CREATE && (
              <Col xs={24} sm={12}>
                <Select
                  label={t("form.status")}
                  name="status"
                  options={activeStatus}
                  placeholder={t("data_group.status")}
                  required
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
