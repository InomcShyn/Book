import _ from "lodash";
import { toast } from "react-toastify";

export const showErrorMessageFromResponse = (
  response,
  fallbackMessage = "An error occurred"
) => {
  if (response?.code === "01" && typeof response.data === "object") {
    const message = Object.entries(response.data)
      .map(([key, value]) => `${_.capitalize(key)}: ${value}`)
      .join(" and ");

    toast.error(message || fallbackMessage);
  } else {
    toast.error(response?.message || fallbackMessage);
  }
};
