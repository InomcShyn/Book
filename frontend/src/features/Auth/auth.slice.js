import { createSlice } from "@reduxjs/toolkit";
import { Modal } from "antd";
import { jwtDecode } from "jwt-decode";
import { loginUserAction, refreshTokenAction } from "./auth.action";
import {
  getLocalstorageData,
  setLocalstorageData,
  removeLocalstorageData,
} from "@/utils/helper/localstorage";

const initialState = {
  user: getLocalstorageData("user") || null,
  isAuthenticated: !!getLocalstorageData("access_token"),
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      Modal.destroyAll();
      removeLocalstorageData("access_token");
      removeLocalstorageData("refresh_token");
      removeLocalstorageData("user");

      state.user = null;
      state.isAuthenticated = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUserAction.fulfilled, (state, action) => {
        if (!action.payload) return;

        const { accessToken, refreshToken, ...restValues } = action.payload;

        const decoded = jwtDecode(accessToken);
        setLocalstorageData({ key: "access_token", data: accessToken });
        setLocalstorageData({ key: "refresh_token", data: refreshToken });
        setLocalstorageData({ key: "user", data: { userInfo: decoded } });
        state.isAuthenticated = true;
        state.user = {
          ...restValues,
          userInfo: decoded,
        };
      })
      .addCase(loginUserAction.rejected, (state) => {
        state.isAuthenticated = false;
      })
      .addCase(refreshTokenAction.fulfilled, (state, action) => {
        if (!action.payload || !action.payload.data) return;
        const { accessToken, refreshToken } = action.payload.data;
        const decoded = jwtDecode(accessToken);

        setLocalstorageData({ key: "access_token", data: accessToken });
        setLocalstorageData({ key: "refresh_token", data: refreshToken });
        setLocalstorageData({ key: "user", data: { userInfo: decoded } });

        state.isAuthenticated = true;
      })
      .addCase(refreshTokenAction.rejected, (state) => {
        state.user = null;
        state.isAuthenticated = false;

        removeLocalstorageData("access_token");
        removeLocalstorageData("refresh_token");
        removeLocalstorageData("user");
      });
  },
});

export const { logout: logoutAction } = authSlice.actions;
export const selectAuth = (state) => state.auth;
export default authSlice.reducer;
