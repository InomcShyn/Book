import { Badge } from "antd";
import { ruleRequired } from "./rules";
import dayjs from "dayjs";

export const generateRequiredRules = (required, rules, t) => {
  const newRules = rules ? [...rules] : [];
  if (required && newRules.filter((item) => "required" in item).length === 0) {
    newRules.push(ruleRequired(t));
  }
  return newRules;
};

export const toCapitalize = (stringSource) => {
  const stringArr = stringSource.split(" ");
  return stringArr
    .map((item) => item.charAt(0).toUpperCase() + item.slice(1).toLowerCase())
    .join(" ");
};

export const addPointStatus = (value, status) => {
  return <Badge status={status ? "success" : "error"} text={value} />;
};

export const findByKeyInChildren = (items, targetKey) => {
  for (const item of items) {
    if (item.key === targetKey) {
      return item;
    }
    if (item.children) {
      const found = findByKeyInChildren(item.children, targetKey);
      if (found) return found;
    }
  }
  return null;
};

export const generateSorter = (dataIndex) => (a, b) =>
  (a[dataIndex] || "").localeCompare(b[dataIndex] || "");

export const textCompare = (t, a, b) => {
  return a + t("form.validate.bigger") + b;
};

export const convertDate = (value, type = "YYYY-MM-DD HH:mm:ss") => {
  return value ? dayjs(value).format(type) : null;
};

export const convertTime = (ms) => {
  if (!ms) return "00:00:00";
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600)
    .toString()
    .padStart(2, "0");
  const minutes = Math.floor((totalSeconds % 3600) / 60)
    .toString()
    .padStart(2, "0");
  const seconds = (totalSeconds % 60).toString().padStart(2, "0");

  return `${hours}:${minutes}:${seconds}`;
};

export const formatNumber = (value) => {
  if (value === null || value === undefined || value === "") return "";
  const num = Number(value);
  if (isNaN(num)) return value;
  return num.toLocaleString("en-US");
};

export const exportExcel = (res, fileName = "exported_file.xlsx") => {
  const blob = new Blob([res], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });

  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
};

export const exportFileBlob = (res, fileName = "exported_file.xlsx") => {
  // Lấy đuôi file (extension) từ fileName
  const ext = fileName.split(".").pop().toLowerCase();

  // Map đuôi file sang MIME type
  const mimeTypes = {
    xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    xls: "application/vnd.ms-excel",
    pdf: "application/pdf",
    txt: "text/plain",
    csv: "text/csv",
    png: "image/png",
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    gif: "image/gif",
    json: "application/json",
    xml: "application/xml",
  };

  const type = mimeTypes[ext] || "application/octet-stream";

  const blob = new Blob([res], { type });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
};
