import React from "react";
import { Upload, Button } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

const CustomUpload = ({
  acceptedTypes = [
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // xlsx
    "application/vnd.ms-excel", // xls
    "text/csv", // csv
    "text/plain", // txt
  ],
  maxSizeMB = 5,
  multiple = false,
  label = "Click to Upload",
  fileList = [],
  ...props
}) => {
  const { t } = useTranslation();

  const typeFileMap = {
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": "xlsx",
    "application/vnd.ms-excel": "xls",
    "text/csv": "csv",
    "text/plain": "txt",
    "application/pdf": "pdf",
    "application/msword": "doc",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
      "docx",
    "application/vnd.ms-powerpoint": "ppt",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation":
      "pptx",
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/gif": "gif",
  };

  const beforeUpload = (file, batchFileList) => {
    if (!acceptedTypes.includes(file.type)) {
      const validExtensions = acceptedTypes
        .map((type) => typeFileMap[type])
        .join(", ");
      toast.error(`${t("validate.type_file")} ${validExtensions}`);
      return Upload.LIST_IGNORE;
    }

    const fileSizeMB = file.size / 1024 / 1024;
    if (fileSizeMB > maxSizeMB) {
      toast.error(`${t("validate.size")} ${maxSizeMB}MB`);
      return Upload.LIST_IGNORE;
    }

    const currentSize = fileList.reduce((sum, f) => sum + f.size, 0);
    const batchSize = batchFileList.reduce((sum, f) => sum + f.size, 0);
    const totalSizeMB = (currentSize + batchSize) / 1024 / 1024;

    if (totalSizeMB > maxSizeMB) {
      const isLastFile =
        file.uid === batchFileList[batchFileList.length - 1].uid;

      if (isLastFile) {
        toast.error(t("validate.total_size", { maxSize: maxSizeMB }));
      }

      return Upload.LIST_IGNORE;
    }

    return false;
  };

  return (
    <Upload
      beforeUpload={beforeUpload}
      multiple={multiple}
      fileList={fileList}
      {...props}
    >
      <Button icon={<UploadOutlined />}>{label}</Button>
    </Upload>
  );
};

export default CustomUpload;
