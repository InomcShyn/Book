import { getDataApi, postDataApi, putDataApi, deleteDataApi } from "./index";
import type {
  ICategory,
  CreateCategoryDto,
  UpdateCategoryDto,
  CategorySearchParams,
  ApiResponse,
  PaginationResponse,
  ObjectId,
} from "@/types/api.types";

// ============================================
// Category API Response Types
// ============================================

/**
 * Response khi lấy danh sách categories
 */
export interface GetCategoriesResponse extends ApiResponse<ICategory[]> {
  data: ICategory[];
}

/**
 * Response khi lấy một category
 */
export interface GetCategoryResponse extends ApiResponse<ICategory> {
  data: ICategory;
}

/**
 * Response khi tạo/cập nhật category
 */
export interface CategoryMutationResponse extends ApiResponse<ICategory> {
  data: ICategory;
  message: string;
}

/**
 * Response khi xóa category
 */
export interface DeleteCategoryResponse extends ApiResponse {
  success: boolean;
  message: string;
}

// ============================================
// Category API Functions
// ============================================

/**
 * API endpoints cho quản lý danh mục (Category)
 */
export const categoryApi = {
  /**
   * Lấy danh sách tất cả các danh mục
   * @param params - Query parameters (search, pagination, filter)
   * @returns Promise với mảng ICategory[]
   * 
   * @example
   * const categories = await categoryApi.getAll();
   * const activeCategories = await categoryApi.getAll({ status: 'active' });
   */
  getAll: async (params?: CategorySearchParams): Promise<ICategory[]> => {
    try {
      const response = await getDataApi<GetCategoriesResponse>("categories", params);
      
      // Xử lý response có thể có nhiều format khác nhau
      if (Array.isArray(response)) {
        return response as unknown as ICategory[];
      }
      
      if (response && typeof response === 'object' && 'data' in response && Array.isArray(response.data)) {
        return response.data;
      }
      
      // Chỉ log nếu response không phải null/undefined
      if (response) {
        console.warn("⚠️ Unexpected response format from getAll categories:", response);
      }
      
      return [];
    } catch (error) {
      console.error("❌ Error fetching categories:", error);
      // Return empty array thay vì throw để không crash UI
      return [];
    }
  },

  /**
   * Lấy thông tin chi tiết một danh mục theo ID
   * @param id - ID của danh mục
   * @returns Promise với ICategory
   * 
   * @example
   * const category = await categoryApi.getById('507f1f77bcf86cd799439011');
   */
  getById: async (id: ObjectId): Promise<ICategory> => {
    try {
      const response = await getDataApi<GetCategoryResponse>(`categories/${id}`);
      
      if (!response) {
        throw new Error(`No response from server when fetching category ${id}`);
      }
      
      // Check if response has .data property (wrapped response)
      if (response && typeof response === 'object' && 'data' in response && response.data) {
        return response.data;
      }
      
      // Check if response has _id (direct object from backend)
      if (response && typeof response === 'object' && '_id' in response) {
        return response as unknown as ICategory;
      }
      
      // Fallback
      return response as unknown as ICategory;
    } catch (error) {
      console.error(`❌ Error fetching category ${id}:`, error);
      throw error;
    }
  },

  /**
   * Tạo danh mục mới
   * @param data - Dữ liệu danh mục (không bao gồm _id, timestamps)
   * @returns Promise với ICategory đã được tạo
   * 
   * @example
   * const newCategory = await categoryApi.create({
   *   name: 'Văn học',
   *   description: 'Sách văn học',
   *   status: CategoryStatus.ACTIVE
   * });
   */
  create: async (data: CreateCategoryDto): Promise<ICategory> => {
    try {
      
      const response = await postDataApi<CategoryMutationResponse, CreateCategoryDto>(
        "categories",
        data
      );
      
      if (!response) {
        throw new Error('No response from server when creating category');
      }
      
      // Check if response has .data property (wrapped response)
      if (response && typeof response === 'object' && 'data' in response && response.data) {
        return response.data;
      }
      
      // Check if response has _id (direct object from backend)
      if (response && typeof response === 'object' && '_id' in response) {
        return response as unknown as ICategory;
      }
      
      // Fallback
      return response as unknown as ICategory;
    } catch (error) {
      console.error("❌ Error creating category:", error);
      throw error;
    }
  },

  /**
   * Cập nhật thông tin danh mục
   * @param id - ID của danh mục
   * @param data - Dữ liệu cần cập nhật (partial)
   * @returns Promise với ICategory đã được cập nhật
   * 
   * @example
   * const updated = await categoryApi.update('507f1f77bcf86cd799439011', {
   *   name: 'Văn học Việt Nam',
   *   status: CategoryStatus.INACTIVE
   * });
   */
  update: async (id: ObjectId, data: UpdateCategoryDto): Promise<ICategory> => {
    try {
      const response = await putDataApi<CategoryMutationResponse, UpdateCategoryDto>(
        `categories/${id}`,
        data
      );
      
      if (!response) {
        throw new Error(`No response from server when updating category ${id}`);
      }
      
      // Check if response has .data property (wrapped response)
      if (response && typeof response === 'object' && 'data' in response && response.data) {
        return response.data;
      }
      
      // Check if response has _id (direct object from backend)
      if (response && typeof response === 'object' && '_id' in response) {
        return response as unknown as ICategory;
      }
      
      // Fallback
      return response as unknown as ICategory;
    } catch (error) {
      console.error(`❌ Error updating category ${id}:`, error);
      throw error;
    }
  },

  /**
   * Xóa danh mục
   * @param id - ID của danh mục
   * @returns Promise với kết quả xóa
   * 
   * @example
   * const result = await categoryApi.delete('507f1f77bcf86cd799439011');
   * if (result.success) {
   *   console.log('Deleted successfully');
   * }
   */
  delete: async (id: ObjectId): Promise<DeleteCategoryResponse> => {
    try {
      const response = await deleteDataApi<DeleteCategoryResponse>(`categories/${id}`);
      return response;
    } catch (error) {
      console.error(`❌ Error deleting category ${id}:`, error);
      throw error;
    }
  },

  /**
   * Lấy danh sách categories đang active (để dùng trong dropdown)
   * @returns Promise với mảng ICategory[] chỉ có status = 'active'
   * 
   * @example
   * const activeCategories = await categoryApi.getActiveCategories();
   */
  getActiveCategories: async (): Promise<ICategory[]> => {
    try {
      const allCategories = await categoryApi.getAll({ status: 'active' as any });
      return allCategories.filter(cat => cat.status === 'active');
    } catch (error) {
      console.error("❌ Error fetching active categories:", error);
      throw error;
    }
  },

  /**
   * Tìm kiếm categories theo tên
   * @param searchTerm - Từ khóa tìm kiếm
   * @returns Promise với mảng ICategory[] phù hợp
   * 
   * @example
   * const results = await categoryApi.search('văn học');
   */
  search: async (searchTerm: string): Promise<ICategory[]> => {
    try {
      return await categoryApi.getAll({ search: searchTerm });
    } catch (error) {
      console.error("❌ Error searching categories:", error);
      throw error;
    }
  },
};

// ============================================
// Export default
// ============================================

export default categoryApi;
