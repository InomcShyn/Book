import {
  HouseIcon,
  SettingsIcon,
  DatabaseIcon,
  CalendarIcon,
  MessageSquareWarningIcon,
  ListCheckIcon,
  DatabaseBackupIcon,
  BookmarkPlusIcon,
  BookOpenIcon,
  FolderIcon,
} from "lucide-react";
import PATH from "@/configs/paths/PATH";
import { ROLE_ACCOUNT } from "@/constants/constants";

const getMenuItems = (t, roleUser) => {
  const allItems = [
    {
      key: "home",
      label: t("menu.home"),
      path: PATH.HOME,
      icon: <HouseIcon size={16} />,
    },
    {
      key: "configuration",
      label: t("menu.configuration"),
      icon: <SettingsIcon size={16} />,
      roles: [ROLE_ACCOUNT.ADMIN, ROLE_ACCOUNT.MONITOR],
      children: [
        {
          key: "account",
          label: t("menu.account"),
          path: PATH.CONFIGURATION.ACCOUNT,
        },
        {
          key: "zone",
          label: t("menu.zone"),
          path: PATH.CONFIGURATION.ZONE,
        },
        {
          key: "service",
          label: t("menu.service"),
          path: PATH.CONFIGURATION.SERVICE,
        },
        {
          key: "associate",
          label: t("menu.associate"),
          path: PATH.CONFIGURATION.ASSOCIATE,
        },
        {
          key: "price",
          label: t("menu.price"),
          path: PATH.CONFIGURATION.PRICE,
        },
        {
          key: "file_reconciliation",
          label: t("menu.file_reconciliation"),
          path: PATH.CONFIGURATION.FILE_RECONCILIATION,
        },
        {
          key: "file_service",
          label: t("menu.file_service"),
          path: PATH.CONFIGURATION.FILE_SERVICE,
        },
      ],
    },
    {
      key: "data_source",
      label: t("menu.data_source"),
      icon: <DatabaseBackupIcon size={16} />,
      children: [
        {
          key: "data_source_associate",
          label: t("menu.data_source_associate"),
          path: PATH.DATA_SOURCE.DATA_SOURCE_ASSOCIATE,
        },
        {
          key: "data_source_natcom",
          label: t("menu.data_source_natcom"),
          path: PATH.DATA_SOURCE.DATA_SOURCE_NATCOM,
          roles: [ROLE_ACCOUNT.ADMIN, ROLE_ACCOUNT.MONITOR],
        },
      ],
    },
    {
      key: "data",
      label: t("menu.data"),
      icon: <DatabaseIcon size={16} />,
      children: [
        {
          key: "data_associate",
          label: t("menu.data_associate"),
          path: PATH.DATA.DATA_ASSOCIATE,
        },
        {
          key: "data_natcom",
          label: t("menu.data_natcom"),
          path: PATH.DATA.DATA_NATCOM,
        },
      ],
    },
    {
      key: "request_reconciliation",
      label: t("menu.request_reconciliation"),
      path: PATH.REQUEST_RECONCILIATION,
      icon: <BookmarkPlusIcon size={16} />,
      // roles: [ROLE_ACCOUNT.ADMIN, ROLE_ACCOUNT.MONITOR],
    },
    {
      key: "schedule_reconciliation",
      label: t("menu.schedule_reconciliation"),
      path: PATH.SCHEDULE_RECONCILIATION,
      icon: <CalendarIcon size={16} />,
      roles: [ROLE_ACCOUNT.ADMIN, ROLE_ACCOUNT.MONITOR],
    },
    {
      key: "result_reconciliation",
      label: t("menu.result_reconciliation"),
      path: PATH.RESULT_RECONCILIATION,
      icon: <ListCheckIcon size={16} />,
    },
    {
      key: "report",
      label: t("menu.report"),
      icon: <MessageSquareWarningIcon size={16} />,
      children: [
        {
          key: "report_daily",
          label: t("menu.report_daily"),
          path: PATH.REPORT.DAILY,
        },
        {
          key: "report_monthly",
          label: t("menu.report_monthly"),
          path: PATH.REPORT.MONTHLY,
        },
      ],
    },
    {
      key: "book",
      label: t("book.page_title"),
      path: PATH.BOOK,
      icon: <BookOpenIcon size={16} />,
    },
    {
      key: "category",
      label: t("category.page_title"),
      path: PATH.CATEGORY,
      icon: <FolderIcon size={16} />,
    },
  ];
  const filterByRole = (items) =>
    items
      .filter((item) => !item.roles || item.roles.includes(roleUser))
      .map((item) => ({
        ...item,
        children: item.children ? filterByRole(item.children) : undefined,
      }));

  return filterByRole(allItems);
};

export default getMenuItems;
