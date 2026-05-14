import { removeLocalstorageData } from "./localstorage";

export const formatDataNumberToen = (number = 0) => {
  return number.toLocaleString("en-US");
};

export const handleUnauthorized = () => {
  try {
    removeLocalstorageData("access_token");
    removeLocalstorageData("refresh_token");
    removeLocalstorageData("user");
    window.location.replace("/login");
  } catch (error) {
    console.log("Error logout", error);
  }
};
