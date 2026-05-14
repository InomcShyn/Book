import { getDataApi, postDataApi, putDataApi, deleteDataApi } from "./index";

/**
 * @typedef {Object} IBook
 * @property {string} _id - ID của sách
 * @property {string} name - Tên sách
 * @property {string} author - Tác giả
 * @property {number} price - Giá sách
 * @property {string|Object} categoryId - ID danh mục hoặc object danh mục sau khi populate
 * @property {string} [status] - Trạng thái
 * @property {boolean} [available] - Có sẵn hay không
 * @property {string} [createdAt] - Thời gian tạo
 * @property {string} [updatedAt] - Thời gian cập nhật
 */

/**
 * API endpoints cho quản lý sách
 */
export const bookApi = {
  /**
   * Lấy danh sách tất cả các sách
   * @returns {Promise<IBook[]>}
   */
  getAll: () => getDataApi("books"),

  /**
   * Thêm sách mới
   * @param {Omit<IBook, '_id' | 'createdAt' | 'updatedAt'>} data
   * @returns {Promise<any>}
   */
  create: (data) => postDataApi("books", data),

  /**
   * Cập nhật thông tin sách
   * @param {string} id - ID của sách
   * @param {Partial<IBook>} data - Dữ liệu cần cập nhật
   * @returns {Promise<any>}
   */
  update: (id, data) => putDataApi(`books/${id}`, data),

  /**
   * Xóa sách
   * @param {string} id - ID của sách
   * @returns {Promise<any>}
   */
  delete: (id) => deleteDataApi(`books/${id}`),
};
