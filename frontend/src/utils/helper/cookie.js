import Cookies from "js-cookie";

export function getItemCookie(name) {
  try {
    return Cookies.get(name);
  } catch (error) {
    console.log(`get cookie name = ${name}: ${error}`);
    return null;
  }
}

export function setItemCookie({ name, timer = 24 * 60 * 60, data }) {
  //mặc định 1 ngày
  try {
    return Cookies.set(name, data, {
      expires: timer,
      sameSite: "Strict",
    });
  } catch (error) {
    console.log(`set cookie name = ${name}: ${error}`);
    return null;
  }
}

export function removeItemCookie(name) {
  try {
    return Cookies.remove("access_token");
  } catch (error) {
    console.log(`remove cookie name = ${name}: ${error}`);
    return null;
  }
}
