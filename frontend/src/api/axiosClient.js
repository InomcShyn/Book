import axios from "axios";
import { getStore } from "@/app/storeRef";
import {
  getLocalstorageData,
  setLocalstorageData,
} from "@/utils/helper/localstorage";
import { logoutAction, refreshTokenAction } from "@/features/Auth/auth.action";
import { handleUnauthorized } from "@/utils/helper/helper";
import qs from "qs";

const { VITE_API_BASE_URL } = import.meta.env;

const axiosClient = axios.create({
  baseURL: `${VITE_API_BASE_URL}/api/`,
  timeout: 30000, // 30 seconds timeout
  withCredentials: true, // Enable sending cookies with cross-origin requests
  paramsSerializer: {
    serialize: (params) => qs.stringify(params, { indices: false }),
  },
});

axiosClient.interceptors.request.use((config) => {
  if (config.skipAuthInterceptor) {
    return config; // Bỏ qua thêm header Authorization cho request refresh token
  }
  config.headers = {
    ...config.headers,
    Authorization: `Bearer ${getLocalstorageData("access_token") || ""}`,
    lang: getLocalstorageData("i18nextLng") || "en",
  };
  return config;
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) reject(error);
    else resolve(token);
  });
  failedQueue = [];
};

axiosClient.interceptors.response.use(
  async (response) => {
    const responseData = response?.data;

    if (responseData?.code === "03") {
      const originalRequest = response.config;
      const store = getStore();

      if (
        !originalRequest._retry &&
        getLocalstorageData("refresh_token") &&
        store
      ) {
        if (isRefreshing) {
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          })
            .then((token) => {
              originalRequest.headers["Authorization"] = `Bearer ${token}`;
              return axiosClient(originalRequest);
            })
            .catch((err) => Promise.reject(err));
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
          const res = await store.dispatch(refreshTokenAction());
          if (res.error) {
            handleUnauthorized();
            return Promise.reject(res.error);
          }

          const { accessToken, refreshToken } = res.payload.data;

          setLocalstorageData({ key: "access_token", data: accessToken });
          setLocalstorageData({ key: "refresh_token", data: refreshToken });

          axiosClient.defaults.headers.common[
            "Authorization"
          ] = `Bearer ${accessToken}`;
          originalRequest.headers["Authorization"] = `Bearer ${accessToken}`;

          processQueue(null, accessToken);
          return axiosClient(originalRequest);
        } catch (err) {
          processQueue(err, null);
          store.dispatch(logoutAction());
          return Promise.reject(err);
        } finally {
          isRefreshing = false;
        }
      }

      // Trường hợp không thể refresh token
      handleUnauthorized();
      return Promise.reject({ ...responseData, _handled: true });
    }

    return responseData;
  },

  async (error) => {
    return Promise.reject(error);
  }
);

export default axiosClient;
