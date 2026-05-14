// components/Atom/UploadFile.jsx
import React from "react";
import { Upload, Button, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import "./index.scss";

const UploadFile = ({ label = "Upload File", onUpload }) => {
  const beforeUpload = async (file, fileList) => {
    try {
      await onUpload(fileList); // 👉 Gọi callback ngoài component
      message.success("Upload thành công!");
    } catch (error) {
      message.error("Upload thất bại!");
      console.error("Upload error:", error);
    }

    return false; // Ngăn Ant Design tự upload
  };

  return (
    <div>
      <Upload multiple showUploadList={false} beforeUpload={beforeUpload}>
        <div className="upload-wrapper">
          <Button
            type="primary"
            icon={<UploadOutlined />}
            className="upload-button"
          >
            {label}
          </Button>
        </div>
      </Upload>
    </div>
  );
};

export default UploadFile;
