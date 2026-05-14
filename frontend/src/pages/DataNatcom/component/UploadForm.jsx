import React, { useEffect, useState } from "react";
import { Col, Form, Row, Upload } from "antd";
import { useTranslation } from "react-i18next";
import { Select } from "@/components/Atom/Select";
import { Modal } from "@/components/Atom/Modal";
import { UploadOutlined } from "@ant-design/icons";
import { Button } from "@/components/Atom/Button";
import SelectService from "@/pages/CommonCategory/SelectService";
import SelectAssociate from "@/pages/CommonCategory/SelectAssociate";
import CustomUpload from "@/components/Atom/CustomUpload";

function UploadForm(props) {
  const { open, onCancel, handleSubmit } = props;
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
        title={"Upload File " + t("menu.data_natcom")}
        open={open}
        onCancel={onCancel}
        width="45%"
        onOk={() => form.submit()}
      >
        <Form form={form} onFinish={onFinish} layout="vertical">
          <Row gutter={(20, 20)}>
            <Col xs={24} sm={12}>
              <SelectService name="serviceId" required />
            </Col>
            <Col xs={24} sm={12}>
              <SelectAssociate name="orgId" required />
            </Col>
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
