export const actionCode = {
  CREATE: "CREATE",
  UPDATE: "UPDATE",
  DELETE: "DELETE",
  ATTACH: "ATTACH",
  DOWNLOAD: "DOWNLOAD",
  VIEW: "VIEW",
  CANCEL: "CANCEL",
  RESET_PASSWORD: "RESET_PASSWORD",
};

export const getActionText = (t) => ({
  CREATE: t("button.create") + " ",
  UPDATE: t("button.update") + " ",
  VIEW: t("button.view") + " ",
});
