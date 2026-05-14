// components/Atom/FileUpload.jsx
import React from "react";
import { Upload, Button, Row } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import "./index.scss";

const FileUpload = ({ label, fileList, setFileList, action = "" }) => {
  const handleChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };

  return (
    <div style={{ marginBottom: 16 }}>
      {label && <div style={{ marginBottom: 8, fontWeight: 500 }}>{label}</div>}

      <Upload
        listType="picture"
        accept="image/jpeg,image/png,image/jpg"
        fileList={fileList}
        onChange={handleChange}
        maxCount={1}
        action={action}
      >
        <div className="upload-wrapper">
          <span className="upload-note">
            <em>Only accept formats image/jpeg, image/png, image/jpg</em>
          </span>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            className="upload-button"
          >
            Image
          </Button>
        </div>
      </Upload>
    </div>
  );
};

export default FileUpload;
