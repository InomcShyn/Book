import { getDataApi, postDataApi, putDataApi, deleteDataApi } from "./index";

/**
 * @typedef {Object} ICategory
 * @property {string} _id - ID của danh mục
 * @property {string} name - Tên danh mục
 * @property {string} [description] - Mô tả
 * @property {'active'|'inactive'} status - Trạng thái
 * @property {string} [createdAt] - Thời gian tạo
 * @property {string} [updatedAt] - Thời gian cập nhật
 */

/**
 * API endpoints cho quản lý danh mục
 */
export const categoryApi = {
  /**
   * Lấy danh sách tất cả các danh mục
   * @returns {Promise<ICategory[]>}
   */
  getAll: () => getDataApi("categories"),

  /**
   * Thêm danh mục mới
   * @param {Omit<ICategory, '_id' | 'createdAt' | 'updatedAt'>} data
   * @returns {Promise<any>}
   */
  create: (data) => postDataApi("categories", data),

  /**
   * Cập nhật thông tin danh mục
   * @param {string} id - ID của danh mục
   * @param {Partial<ICategory>} data - Dữ liệu cần cập nhật
   * @returns {Promise<any>}
   */
  update: (id, data) => putDataApi(`categories/${id}`, data),

  /**
   * Xóa danh mục
   * @param {string} id - ID của danh mục
   * @returns {Promise<any>}
   */
  delete: (id) => deleteDataApi(`categories/${id}`),
};
