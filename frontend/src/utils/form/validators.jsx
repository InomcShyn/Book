export const CompareValidator = ({
  getFieldValue,
  compareField,
  operator = ">",
  t,
  currentLabel,
  compareLabel,
}) => {
  return (_, value) => {
    const otherValue = getFieldValue(compareField);

    console.log("VALIDATOR DEBUG", {
      value,
      otherValue,
      typeofValue: typeof value,
    });

    if (value == null || otherValue == null || value === "") {
      return Promise.resolve();
    }

    const valNum = Number(value);
    const otherValNum = Number(otherValue);

    if (isNaN(valNum) || isNaN(otherValNum)) {
      return Promise.resolve();
    }

    let isValid = false;

    switch (operator) {
      case ">":
        isValid = valNum > otherValNum;
        break;
      // case ">=":
      //   isValid = value >= otherValue;
      //   break;
      // case "<":
      //   isValid = value < otherValue;
      //   break;
      // case "<=":
      //   isValid = value <= otherValue;
      //   break;
      // case "===":
      //   isValid = value === otherValue;
      //   break;
      // case "!==":
      //   isValid = value !== otherValue;
      //   break;
      default:
        return Promise.resolve();
    }

    if (isValid) {
      return Promise.resolve();
    }

    const operatorTextMap = {
      ">": t("form.validate.bigger"),
    };

    const message = `${currentLabel} ${operatorTextMap[operator]} ${compareLabel}`;

    return Promise.reject(new Error(message));
  };
};
