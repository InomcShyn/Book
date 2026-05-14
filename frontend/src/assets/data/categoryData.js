import { ROLE_ACCOUNT } from "@/constants/constants";

export const getActiveStatus = (t) => [
  { value: "INACTIVE", label: t("categoryData.inactive") },
  { value: "ACTIVE", label: t("categoryData.active") },
];

export const getTypeData = (t) => [
  { value: "UPLOAD", label: t("categoryData.from_direct_upload") },
  { value: "PARTNER_SOURCE", label: t("categoryData.from_data_source") },
];

export const getReconciliationStatus = (t) => [
  { value: "NOT_RECONCILED", label: t("categoryData.not_yet_reconciled") },
  { value: "RECONCILED", label: t("categoryData.reconciled") },
  { value: "CANCELED", label: t("categoryData.cancel") },
];

export const getTypeAccount = (t) => [
  {
    value: ROLE_ACCOUNT.ADMIN,
    label: t("account_CMS.administrator_account"),
  },
  {
    value: ROLE_ACCOUNT.MONITOR,
    label: t("account_CMS.monitor_account"),
  },
  {
    value: ROLE_ACCOUNT.PARTNER,
    label: t("account_CMS.partner_account"),
  },
];

export const getTypeservice = (t) => [
  {
    value: "NO_PARTNER_PRICING",
    label: t("service.no_need_to_calculate_price_for_each_partner"),
  },
  { value: "BY_PARTNER", label: t("service.calculate_price_per_partner") },
  {
    value: "BY_PARTNER_AND_ZONE",
    label: t("service.calculate_price_per_partner_on_different_zones"),
  },
];

export const getAssociateStatus = (t) => [
  { value: "PENDING", label: t("associate.pending") },
  { value: "APPROVED", label: t("associate.approved") },
  { value: "REJECTED", label: t("associate.rejected") },
  { value: "CANCELED", label: t("associate.canceled") },
];

export const getTypeFileReconciliation = (t) => [
  {
    value: "EXCEL",
    label: t("file_reconciliation.excel_file"),
  },
  {
    value: "OTHER",
    label: "Plant text",
  },
];

export const getTypeSeparator = (t) => [
  {
    value: 1,
    label: t("file_reconciliation.space"),
  },
  {
    value: 2,
    label: t("file_reconciliation.different"),
  },
];

export const getStatusSchedule = (t) => [
  {
    value: "NEW",
    label: t("categoryData.new"),
  },
  {
    value: "STARTED",
    label: t("categoryData.start"),
  },
  {
    value: "PAUSED",
    label: t("categoryData.pause"),
  },
  {
    value: "CANCELED",
    label: t("categoryData.cancel"),
  },
  {
    value: "RUNNING",
    label: t("categoryData.running"),
  },
  // {
  //   value: "COMPLETED",
  //   label: t("categoryData.completed"),
  // },
];

export const getStatusRequest = (t) => [
  {
    value: "NEW",
    label: t("categoryData.status_request.new"),
  },
  {
    value: "APPROVED",
    label: t("categoryData.status_request.approved"),
  },
  {
    value: "PROCESSING",
    label: t("categoryData.status_request.processing"),
  },
  {
    value: "PROCESSED",
    label: t("categoryData.status_request.completed"),
  },
  {
    value: "ACCEPT",
    label: t("categoryData.status_request.approve_result"),
  },
  {
    value: "REJECT",
    label: t("categoryData.status_request.reject_result"),
  },
  {
    value: "EXPORT_REPORT",
    label: t("categoryData.status_request.export_report"),
  },
  {
    value: "CANCEL",
    label: t("categoryData.status_request.cancel"),
  },
  {
    value: "ERROR",
    label: t("categoryData.status_request.failed"),
  },
];

export const getFrequencyType = (t) => [
  {
    value: "MONTHLY",
    label: t("categoryData.frequency_type.scan_month"),
  },
  {
    value: "DAILY",
    label: t("categoryData.frequency_type.scan_day"),
  },
  // {
  //   value: "HOURLY",
  //   label: t("categoryData.frequency_type.scan_hour"),
  // },
  // {
  //   value: "CONTINUOUS",
  //   label: t("categoryData.frequency_type.scan_continuously"),
  // },
];

export const getStatusResultRecon = (t) => [
  {
    value: "MATCHED",
    label: t("categoryData.status_result_recon.match"),
  },
  {
    value: "PARTNER_MISSING",
    label: t("categoryData.status_result_recon.partner_no_transactions"),
  },
  {
    value: "NATCOM_MISSING",
    label: t("categoryData.status_result_recon.natcom_no_transactions"),
  },
  {
    value: "MISMATCHED",
    label: t("categoryData.status_result_recon.offset"),
  },
];

export const typeFileService = (t) => [
  { value: "PARTNER_FILE", label: t("file_service.partner_files") },
  { value: "NATCOM_FILE", label: t("file_service.files_of_natcom_systems") },
];

export const getTotalMismatch = (t) => [
  { value: true, label: t("categoryData.total_mm_trans.yes") },
  { value: false, label: t("categoryData.total_mm_trans.no") },
];

export const typeService = (t) => [
  { value: 0, label: t("service.no_need_to_charge_for_each_task") },
  { value: 1, label: t("service.calculate_price_per_partner") },
];

export const orgSourceType = [
  { value: "FTP", label: "File FTP" },
  { value: "UPLOAD", label: "Upload" },
];

export const getNatcomSourceType = (t) => [
  { value: "FTP", label: "File FTP" },
  { value: "DATABASE", label: "Database" },
  { value: "UPLOAD", label: "Upload" },
];

/**
 * @typedef {Object} IBook
 * @property {string} _id - ID của sách
 * @property {string} name - Tên sách
 * @property {string} author - Tác giả
 * @property {number} price - Giá sách
 * @property {string|Object} categoryId - ID danh mục hoặc object danh mục sau khi populate
 * @property {string} [status] - Trạng thái
 * @property {boolean} [available] - Có sẵn hay không
 * @property {string} [createdAt] - Thời gian tạo
 * @property {string} [updatedAt] - Thời gian cập nhật
 */

/**
 * @typedef {Object} ICategory
 * @property {string} _id - ID của danh mục
 * @property {string} name - Tên danh mục
 * @property {string} [description] - Mô tả
 * @property {'active'|'inactive'} status - Trạng thái
 * @property {string} [createdAt] - Thời gian tạo
 * @property {string} [updatedAt] - Thời gian cập nhật
 */

export const getCategoryStatus = (t) => [
  { value: "active", label: t("category.modal.status_active") },
  { value: "inactive", label: t("category.modal.status_inactive") },
];

export const getStatusRecon = (t) => [
  { value: "NOT_RECONCILED", label: t("categoryData.status_recon.not_recon") },
  { value: "RECONCILED", label: t("categoryData.status_recon.recon") },
];

export const typeData = (t) => [
  { value: true, label: t("categoryData.type_data.error") },
  { value: false, label: t("categoryData.type_data.no_error") },
];

export const getTypeTask = (t) => [
  { value: "DIVIDE_WORK", label: t("categoryData.type_task.work_allocation") },
  {
    value: "FETCH_PARTNER_DATA",
    label: t("categoryData.type_task.data_partner_src"),
  },
  {
    value: "FETCH_NATCOM_DATA",
    label: t("categoryData.type_task.data_natcom_src"),
  },
  {
    value: "RECONCILIATION_PROCESS",
    label: t("categoryData.type_task.reconciliation_process"),
  },
];

export const getCommand = (t) => [
  { value: "START", label: t("categoryData.command.start") },
  { value: "PAUSE", label: t("categoryData.command.pause") },
  { value: "CANCEL", label: t("categoryData.command.cancel") },
];

export const getStatusHistorySchedule = (t) => [
  { value: "NEW", label: t("categoryData.status_schedule.new") },
  { value: "PROCESSING", label: t("categoryData.status_schedule.processing") },
  { value: "COMPLETED", label: t("categoryData.status_schedule.success") },
  { value: "ERROR", label: t("categoryData.status_schedule.failed") },
];
