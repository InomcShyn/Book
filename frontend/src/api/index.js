import axiosClient from "./axiosClient";
import _ from "lodash";

// Cache cho debounce functions với TTL (Time To Live)
const debounceCache = {};
const CACHE_TTL = 5000; // 5 seconds
const DEBOUNCE_DELAY = 300; // 300ms

// Cleanup cache định kỳ
setInterval(() => {
  const now = Date.now();
  Object.keys(debounceCache).forEach((key) => {
    if (debounceCache[key].timestamp < now - CACHE_TTL) {
      delete debounceCache[key];
    }
  });
}, CACHE_TTL);

const createKey = (method, url, data) => {
  return `${method}_${url}_${JSON.stringify(data)}`;
};

const debounceApiCall = (key, apiFn, shouldDebounce = true) => {
  // Nếu không cần debounce (GET requests đầu tiên), execute ngay
  if (!shouldDebounce) {
    return apiFn();
  }

  if (!debounceCache[key]) {
    debounceCache[key] = {
      fn: _.debounce(
        (resolve, reject) => {
          apiFn().then(resolve).catch(reject);
        },
        DEBOUNCE_DELAY,
        { leading: true, trailing: true } // Execute ngay lập tức và sau delay
      ),
      timestamp: Date.now(),
    };
  } else {
    // Update timestamp khi reuse
    debounceCache[key].timestamp = Date.now();
  }

  return new Promise((resolve, reject) => {
    debounceCache[key].fn(resolve, reject);
  });
};

export const getDataApi = async (url = "", params = {}) => {
  const key = createKey("GET", url, params);
  // GET requests không cần debounce mạnh, chỉ cần prevent duplicate
  return debounceApiCall(key, () => axiosClient.get(url, { params }), false).catch(
    (error) => {
      console.error(`❌ GET api: ${url} error:`, error);
      throw error;
    }
  );
};

export const exportBlobApi = async (url = "", params = {}) => {
  const key = createKey("GET", url, params);
  return debounceApiCall(key, () =>
    axiosClient.get(url, {
      params,
      responseType: "blob",
    }), false
  ).catch((error) => {
    console.error(`❌ GET blob api: ${url} error:`, error);
    throw error;
  });
};

export const postDataApi = async (url = "", body = {}) => {
  const key = createKey("POST", url, body);
  // POST cần debounce để tránh double submit
  return debounceApiCall(key, () => axiosClient.post(url, body), true).catch(
    (error) => {
      console.error(`❌ POST api: ${url} error:`, error);
      throw error;
    }
  );
};

export const putDataApi = async (url = "", body = {}) => {
  const key = createKey("PUT", url, body);
  // PUT cần debounce để tránh double submit
  return debounceApiCall(key, () => axiosClient.put(url, body), true).catch(
    (error) => {
      console.error(`❌ PUT api: ${url} error:`, error);
      throw error;
    }
  );
};

export const postFormDataApi = async (url = "", body = {}) => {
  try {
    const response = await axiosClient.post(url, body);
    return response;
  } catch (error) {
    console.error(`❌ POST form api: ${url} error:`, error);
    return error;
  }
};

export const putFormDataApi = async (url = "", body = {}) => {
  try {
    const response = await axiosClient.put(url, body);
    return response;
  } catch (error) {
    console.error(`❌ PUT form api: ${url} error:`, error);
    return error;
  }
};

export const deleteDataApi = async (url = "", body = {}) => {
  const key = createKey("DELETE", url, body);
  try {
    // DELETE cần debounce để tránh double delete
    return await debounceApiCall(key, () =>
      _.isEmpty(body)
        ? axiosClient.delete(url)
        : axiosClient.delete(url, { data: body }), true
    );
  } catch (error) {
    console.error(`❌ DELETE api: ${url} error:`, error);
    throw error;
  }
};

export const patchDataApi = async (url = "", body = {}) => {
  const key = createKey("PATCH", url, body);
  return debounceApiCall(key, () => axiosClient.patch(url, body), true).catch(
    (error) => {
      console.error(`❌ PATCH api: ${url} error:`, error);
      throw error;
    }
  );
};