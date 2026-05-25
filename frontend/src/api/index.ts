import axiosClient from "./axiosClient";
import _ from "lodash";
import type { ApiParams, ApiBody } from "@/types/api.types";

// ============================================
// Types & Interfaces
// ============================================

/**
 * Debounce function type
 */
type DebouncedFunction = (resolve: (value: unknown) => void, reject: (reason?: unknown) => void) => void;

/**
 * Cache entry structure
 */
interface CacheEntry {
  fn: DebouncedFunction;
  timestamp: number;
}

// ============================================
// Cache Configuration
// ============================================

const debounceCache: Record<string, CacheEntry> = {};
const CACHE_TTL = 5000; // 5 seconds
const DEBOUNCE_DELAY = 300; // 300ms

// Cleanup cache định kỳ để tránh memory leak
const cacheCleanupInterval = setInterval(() => {
  const now = Date.now();
  Object.keys(debounceCache).forEach((key) => {
    if (debounceCache[key].timestamp < now - CACHE_TTL) {
      delete debounceCache[key];
    }
  });
}, CACHE_TTL);

// Cleanup khi module bị unload (optional, for better memory management)
if (typeof window !== 'undefined') {
  window.addEventListener('beforeunload', () => {
    clearInterval(cacheCleanupInterval);
  });
}

// ============================================
// Helper Functions
// ============================================

/**
 * Tạo unique key cho cache dựa trên method, url và data
 */
const createKey = (method: string, url: string, data: unknown): string => {
  return `${method}_${url}_${JSON.stringify(data)}`;
};

/**
 * Debounce API call với cache
 * @param key - Cache key
 * @param apiFn - API function to execute
 * @param shouldDebounce - Whether to debounce the call
 * @returns Promise with API response
 */
const debounceApiCall = <T>(
  key: string,
  apiFn: () => Promise<T>,
  shouldDebounce: boolean = true
): Promise<T> => {
  // Nếu không cần debounce (GET requests), execute ngay
  if (!shouldDebounce) {
    return apiFn();
  }

  if (!debounceCache[key]) {
    debounceCache[key] = {
      fn: _.debounce(
        (resolve: (value: unknown) => void, reject: (reason?: unknown) => void) => {
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

  return new Promise<T>((resolve, reject) => {
    debounceCache[key].fn(resolve, reject);
  });
};

// ============================================
// API Functions with Generic Types
// ============================================

/**
 * GET request - Lấy dữ liệu từ API
 * @template T - Kiểu dữ liệu trả về
 * @param url - API endpoint
 * @param params - Query parameters
 * @returns Promise với dữ liệu kiểu T
 *
 * @example
 * const books = await getDataApi<IBook[]>('books');
 * const book = await getDataApi<IBook>('books/123');
 */
export const getDataApi = async <T = unknown>(
  url: string,
  params: ApiParams = {}
): Promise<T> => {
  const key = createKey("GET", url, params);

  try {
    // GET requests không cần debounce mạnh, chỉ cần prevent duplicate
    return await debounceApiCall<T>(
      key,
      // ✅ axiosClient interceptor already returns unwrapped data
      () => axiosClient.get<T>(url, { params }).then(res => res as T),
      false
    );
  } catch (error) {
    console.error(`❌ GET api: ${url} error:`, error);
    throw error;
  }
};

/**
 * GET request để export file (blob)
 * @param url - API endpoint
 * @param params - Query parameters
 * @returns Promise với Blob data
 *
 * @example
 * const blob = await exportBlobApi('books/export', { format: 'xlsx' });
 */
export const exportBlobApi = async (
  url: string,
  params: ApiParams = {}
): Promise<Blob> => {
  const key = createKey("GET", url, params);

  try {
    return await debounceApiCall<Blob>(
      key,
      // ✅ For blob, we still need res.data because blob is not unwrapped
      () => axiosClient.get<Blob>(url, {
        params,
        responseType: "blob",
      }).then(res => res.data),
      false
    );
  } catch (error) {
    console.error(`❌ GET blob api: ${url} error:`, error);
    throw error;
  }
};

/**
 * POST request - Tạo mới dữ liệu
 * @template T - Kiểu dữ liệu trả về
 * @template D - Kiểu dữ liệu body
 * @param url - API endpoint
 * @param body - Request body data
 * @returns Promise với dữ liệu kiểu T
 *
 * @example
 * const newBook = await postDataApi<IBook, CreateBookDto>('books', bookData);
 */
export const postDataApi = async <T = unknown, D extends ApiBody = ApiBody>(
  url: string,
  body: D
): Promise<T> => {
  const key = createKey("POST", url, body);

  try {
    // POST cần debounce để tránh double submit
    const result = await debounceApiCall<T>(
      key,
      () => {
        // ✅ axiosClient already returns unwrapped data via interceptor
        // So we return it directly, NOT res.data
        return axiosClient.post<T>(url, body).then(res => {
          // ✅ res is already the unwrapped data from interceptor
          return res as T;
        });
      },
      true
    );
    
    return result;
  } catch (error) {
    console.error(`❌ POST api: ${url} error:`, error);
    console.error(`❌ Error details:`, {
      message: error.message,
      response: error.response,
      status: error.response?.status,
      data: error.response?.data,
    });
    throw error;
  }
};

/**
 * PUT request - Cập nhật dữ liệu
 * @template T - Kiểu dữ liệu trả về
 * @template D - Kiểu dữ liệu body
 * @param url - API endpoint
 * @param body - Request body data
 * @returns Promise với dữ liệu kiểu T
 *
 * @example
 * const updatedBook = await putDataApi<IBook, UpdateBookDto>('books/123', updateData);
 */
export const putDataApi = async <T = unknown, D extends ApiBody = ApiBody>(
  url: string,
  body: D
): Promise<T> => {
  const key = createKey("PUT", url, body);

  try {
    // PUT cần debounce để tránh double submit
    return await debounceApiCall<T>(
      key,
      // ✅ axiosClient interceptor already returns unwrapped data
      () => axiosClient.put<T>(url, body).then(res => res as T),
      true
    );
  } catch (error) {
    console.error(`❌ PUT api: ${url} error:`, error);
    throw error;
  }
};

/**
 * POST request với FormData (upload file)
 * @template T - Kiểu dữ liệu trả về
 * @param url - API endpoint
 * @param body - FormData object
 * @returns Promise với dữ liệu kiểu T hoặc Error
 *
 * @example
 * const formData = new FormData();
 * formData.append('file', file);
 * const result = await postFormDataApi<UploadResponse>('upload', formData);
 */
export const postFormDataApi = async <T = unknown>(
  url: string,
  body: FormData
): Promise<T | Error> => {
  try {
    const response = await axiosClient.post<T>(url, body, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    // ✅ axiosClient interceptor already returns unwrapped data
    return response as T;
  } catch (error) {
    console.error(`❌ POST form api: ${url} error:`, error);
    return error as Error;
  }
};

/**
 * PUT request với FormData (upload file)
 * @template T - Kiểu dữ liệu trả về
 * @param url - API endpoint
 * @param body - FormData object
 * @returns Promise với dữ liệu kiểu T hoặc Error
 */
export const putFormDataApi = async <T = unknown>(
  url: string,
  body: FormData
): Promise<T | Error> => {
  try {
    const response = await axiosClient.put<T>(url, body, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    // ✅ axiosClient interceptor already returns unwrapped data
    return response as T;
  } catch (error) {
    console.error(`❌ PUT form api: ${url} error:`, error);
    return error as Error;
  }
};

/**
 * DELETE request - Xóa dữ liệu
 * @template T - Kiểu dữ liệu trả về
 * @param url - API endpoint
 * @param body - Optional request body (for bulk delete)
 * @returns Promise với dữ liệu kiểu T
 *
 * @example
 * await deleteDataApi<{ success: boolean }>('books/123');
 * await deleteDataApi<{ deleted: number }>('books/bulk', { ids: ['1', '2'] });
 */
export const deleteDataApi = async <T = unknown>(
  url: string,
  body: ApiBody = {}
): Promise<T> => {
  const key = createKey("DELETE", url, body);

  try {
    // DELETE cần debounce để tránh double delete
    return await debounceApiCall<T>(
      key,
      () => {
        const isEmpty = Object.keys(body).length === 0;
        // ✅ axiosClient interceptor already returns unwrapped data
        return isEmpty
          ? axiosClient.delete<T>(url).then(res => res as T)
          : axiosClient.delete<T>(url, { data: body }).then(res => res as T);
      },
      true
    );
  } catch (error) {
    console.error(`❌ DELETE api: ${url} error:`, error);
    throw error;
  }
};

/**
 * PATCH request - Cập nhật một phần dữ liệu
 * @template T - Kiểu dữ liệu trả về
 * @template D - Kiểu dữ liệu body
 * @param url - API endpoint
 * @param body - Request body data (partial update)
 * @returns Promise với dữ liệu kiểu T
 *
 * @example
 * const updated = await patchDataApi<IBook, Partial<IBook>>('books/123', { price: 100 });
 */
export const patchDataApi = async <T = unknown, D extends ApiBody = ApiBody>(
  url: string,
  body: D
): Promise<T> => {
  const key = createKey("PATCH", url, body);

  try {
    return await debounceApiCall<T>(
      key,
      // ✅ axiosClient interceptor already returns unwrapped data
      () => axiosClient.patch<T>(url, body).then(res => res as T),
      true
    );
  } catch (error) {
    console.error(`❌ PATCH api: ${url} error:`, error);
    throw error;
  }
};

// ============================================
// Export all functions
// ============================================

export default {
  getDataApi,
  exportBlobApi,
  postDataApi,
  putDataApi,
  postFormDataApi,
  putFormDataApi,
  deleteDataApi,
  patchDataApi,
};
