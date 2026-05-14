import i18n from "@/configs/i18n";
const t = (key) => i18n.t(key);

export const ruleRequired = (t) => ({
  required: true,
  message: () => t("form.required"),
});

export const ruleUsername = {
  type: "string",
  pattern: /^\s*[a-zA-Z0-9_]+\s*$/,
  message: t("form.validate.user_name"),
};

export const rulePhone = {
  type: "string",
  pattern: /^\s*\+?\d+\s*$/,
  message: t("form.validate.phone"),
};

export const rulePassword = {
  type: "string",
  pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).{8,100}$/,
  message: t("form.validate.password"),
};

// Email
export const email = {
  validator: (_, value) => {
    const regex = new RegExp(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
    const regex2 = new RegExp(
      /^[a-zA-Z0-9.+\-_]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
    );
    return !value || (regex.test(value) && regex2.test(value))
      ? Promise.resolve()
      : Promise.reject(new Error(i18n.t("validate.email_invalid")));
  },
};

export const numberGreater0 = (t) => [
  {
    validator: (_, value) => {
      if (value === undefined || value === null || value === "") {
        return Promise.resolve();
      }
      const number = Number(value);
      if (number <= 0) {
        return Promise.reject(t("form.validate.bigger0"));
      }
      return Promise.resolve();
    },
  },
];

export const ruleMaxLength = (maxLength, t) => ({
  validator: (_, value) => {
    return `${value}`.length <= maxLength
      ? Promise.resolve()
      : Promise.reject(
        new Error(
          `${t("rules.max_length1")} ${maxLength} ${t("rules.max_length2")}`
        ),
      );
  },
});

export const rulePercent = (t) => ({
  validator: (_, value) => {
    if (value === undefined || value === null || value === "") {
      return Promise.resolve();
    }
    const num = Number(value);
    if (!/^\d{1,3}(\.\d{1,2})?$/.test(value)) {
      return Promise.reject(new Error(t("rules.two_decimal")));
    }

    return Promise.resolve();
  },
});

export const ruleIP = (t) => ({
  pattern:
    /^\s*(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}\s*$/,
  message: t("rules.ip_invalid"),
});

export const ruleScanTime = (t) => ({
  pattern:
    /^(?:[01]?\d|2[0-3]):[0-5]?\d:(?:[1-9]|[12]\d|3[01]):(?:1[0-2]|0?[1-9]|\*)$/,
  message: t("rules.scan_time"),
});

export const ruleConfirmPassword =
  (t) =>
    ({ getFieldValue }) => ({
      validator(_, value) {
        if (!value || getFieldValue("newPassword") === value) {
          return Promise.resolve();
        }
        return Promise.reject(
          new Error(t("validate.confirm_password_not_match"))
        );
      },
    });
export const ruleValidateNumber = (t) => ({
  pattern: /^[0-9]+$/,
  message: t('validate.only_number'),
});

export const ruleNewPassword = (t) => ({
  type: "string",
  pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).{8,100}$/,
  message: t("form.validate.password"),
});
