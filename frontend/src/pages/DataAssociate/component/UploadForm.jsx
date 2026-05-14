import React, { useEffect, useState } from "react";
import { Col, Form, Row, Upload } from "antd";
import { useTranslation } from "react-i18next";
import { Modal } from "@/components/Atom/Modal";
import { UploadOutlined } from "@ant-design/icons";
import { Button } from "@/components/Atom/Button";
import SelectService from "@/pages/CommonCategory/SelectService";
import SelectAssociate from "@/pages/CommonCategory/SelectAssociate";
import { ROLE_ACCOUNT } from "@/constants/constants";
import CustomUpload from "@/components/Atom/CustomUpload";

function UploadForm(props) {
  const { open, onCancel, handleSubmit, roleUser } = props;
  const [form] = Form.useForm();
  const { t } = useTranslation();
  const [fileList, setFileList] = useState([]);

  const onFinish = (values) => {
    handleSubmit(values, fileList);
  };

  useEffect(() => {
    if (open) {
      form.resetFields();
    }
  }, [open]);

  return (
    <>
      <Modal
        title={"Upload File " + t("menu.data_associate")}
        open={open}
        onCancel={onCancel}
        width={roleUser != ROLE_ACCOUNT.PARTNER ? "45%" : "30%"}
        onOk={() => form.submit()}
      >
        <Form form={form} onFinish={onFinish} layout="vertical">
          <Row gutter={(20, 20)}>
            <Col xs={24} sm={roleUser != ROLE_ACCOUNT.PARTNER ? 12 : 24}>
              <SelectService name="serviceId" required />
            </Col>
            {roleUser != ROLE_ACCOUNT.PARTNER && (
              <Col xs={24} sm={12}>
                <SelectAssociate name="orgId" required />
              </Col>
            )}
          </Row>
          <Row gutter={(20, 20)}>
            <CustomUpload
              fileList={fileList}
              onChange={({ fileList }) => setFileList(fileList)}
              maxSizeMB={150}
              label="Click to Upload"
              multiple
              style={{ margin: "10px 0 0 10px" }}
            />
          </Row>
        </Form>
      </Modal>
    </>
  );
}

export default UploadForm;
