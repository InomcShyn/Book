import dayjs from "dayjs";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx-js-style";
import axiosClient from "@/api/axiosClient";

export function getPathUrl(pathname) {
  let accumulatedPath = "";

  return pathname
    .split("/")
    .filter(Boolean)
    .map((segment) => {
      accumulatedPath += `/${segment}`;
      return {
        name: segment,
        url: accumulatedPath,
        isDynamicSegment: /^\d+$/.test(segment),
      };
    });
}

export function parseKeyword(str) {
  try {
    const parsed = JSON.parse(str);
    if (Array.isArray(parsed)) {
      return parsed.join("");
    }
  } catch (e) {
    // Do nothing if parsing fails
  }
  return str;
}

export function exportToCSV(data, filename = "export.csv") {
  const csv = [
    Object.keys(data[0]).join(","), // header row
    ...data.map((row) => Object.values(row).join(",")), // data rows
  ].join("\n");

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function exportToExcel(
  data,
  options = {
    fileName: "download.xlsx",
    sheetName: "Sheet1",
    columnMapping: null,
  }
) {
  if (!data || data.length === 0) return;

  let processedData = data;

  // Apply column mapping if provided
  if (options.columnMapping) {
    processedData = data.map((row) => {
      const newRow = {};
      Object.keys(options.columnMapping).forEach((key) => {
        if (row.hasOwnProperty(key)) {
          newRow[options.columnMapping[key]] = row[key];
        }
      });
      return newRow;
    });
  }

  const worksheet = XLSX.utils.json_to_sheet(processedData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, options.sheetName);

  const excelBuffer = XLSX.write(workbook, {
    bookType: "xlsx",
    type: "array",
  });

  const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
  saveAs(blob, options.fileName);
}

export async function saveFile(url, fileName, config = {}) {
  try {
    const response = await axiosClient.get(url, {
      ...config,
      responseType: "blob",
    });

    saveAs(response, fileName);
  } catch (error) {
    // Optionally handle error globally or rethrow
    console.error("File download failed:", error);
    throw error;
  }
}

export const defaultPresets = [
  { label: "Current", value: [dayjs().startOf("month"), dayjs()] },
  { label: "Last 7 Days", value: [dayjs().add(-7, "day"), dayjs()] },
  { label: "Last 14 Days", value: [dayjs().add(-14, "day"), dayjs()] },
  { label: "Last 1 Month", value: [dayjs().add(-30, "day"), dayjs()] },
];
