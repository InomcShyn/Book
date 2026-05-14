import { createAsyncThunk } from "@reduxjs/toolkit";
import { postDataApi } from "@/api";
import { API_LOGIN, API_REFRESH_TOKEN } from "@/configs/paths/API_PATH";
import {
  getLocalstorageData,
  removeLocalstorageData,
} from "@/utils/helper/localstorage";
import { toast } from "react-toastify";
import { MessageError } from "@/constants/constants";
import i18n from "@/configs/i18n";
import axiosClient from "@/api/axiosClient";

const t = (key) => i18n.t(key);

export const loginUserAction = createAsyncThunk(
  "auth/loginUser",
  async (credentials, { fulfillWithValue, rejectWithValue }) => {
    try {
      const response = await postDataApi(API_LOGIN, credentials);
      if (response.code == "00") {
        return fulfillWithValue(response.data, {
          showSuccessToast: true,
          successMessage: t("toast.login_success"),
          skipErrorToast: false,
        });
      } else {
        toast.error(response.message || MessageError);
      }
    } catch (error) {
      const message =
        error.response?.data?.errorMessage || t("toast.login_fail");
      return rejectWithValue(message);
    }
  }
);

export const refreshTokenAction = createAsyncThunk(
  "auth/refreshToken",
  async (_, { fulfillWithValue, rejectWithValue, dispatch }) => {
    try {
      const refreshToken = getLocalstorageData("refresh_token");
      if (!refreshToken) throw new Error("No refresh token");
      const response = await axiosClient.post(
        API_REFRESH_TOKEN,
        { refreshToken },
        {
          skipAuthInterceptor: true,
        }
      );
      return fulfillWithValue(response);
    } catch (error) {
      dispatch(logoutAction());
      const message = error.response?.data?.errorMessage || error.message;
      return rejectWithValue(message);
    }
  }
);

export const logoutAction = () => async (dispatch) => {
  try {
    removeLocalstorageData("access_token");
    removeLocalstorageData("refresh_token");
    removeLocalstorageData("user");
    window.location.href = "/login";
  } catch (error) {
    console.error("Logout failed:", error);
  }
};
