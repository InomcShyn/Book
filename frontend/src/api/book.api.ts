import { getDataApi, postDataApi, putDataApi, deleteDataApi } from "./index";
import type {
  IBook,
  IBookPopulated,
  CreateBookDto,
  UpdateBookDto,
  BookSearchParams,
  ApiResponse,
  ObjectId,
} from "@/types/api.types";

// ============================================
// Book API Response Types
// ============================================

/**
 * Response khi lấy danh sách books
 */
export interface GetBooksResponse extends ApiResponse<IBook[]> {
  data: IBook[];
}

/**
 * Response khi lấy một book (có thể có category populated)
 */
export interface GetBookResponse extends ApiResponse<IBookPopulated> {
  data: IBookPopulated;
}

/**
 * Response khi tạo/cập nhật book
 */
export interface BookMutationResponse extends ApiResponse<IBook> {
  data: IBook;
  message: string;
}

/**
 * Response khi xóa book
 */
export interface DeleteBookResponse extends ApiResponse {
  success: boolean;
  message: string;
}

// ============================================
// Book API Functions
// ============================================

/**
 * API endpoints cho quản lý sách (Book)
 */
export const bookApi = {
  /**
   * Lấy danh sách tất cả các sách
   * @param params - Query parameters (search, filter, pagination)
   * @returns Promise với mảng IBook[]
   * 
   * @example
   * const books = await bookApi.getAll();
   * const filteredBooks = await bookApi.getAll({ 
   *   categoryId: '507f1f77bcf86cd799439011',
   *   minPrice: 50000,
   *   maxPrice: 200000
   * });
   */
  getAll: async (params?: BookSearchParams): Promise<IBook[]> => {
    try {
      const response = await getDataApi<GetBooksResponse>("books", params);
      
      // Xử lý response có thể có nhiều format khác nhau
      if (Array.isArray(response)) {
        return response as unknown as IBook[];
      }
      
      if (response && typeof response === 'object' && 'data' in response && Array.isArray(response.data)) {
        return response.data;
      }
      
      // Chỉ log nếu response không phải null/undefined
      if (response) {
        console.warn("⚠️ Unexpected response format from getAll books:", response);
      }
      
      return [];
    } catch (error) {
      console.error("❌ Error fetching books:", error);
      // Return empty array thay vì throw để không crash UI
      return [];
    }
  },

  /**
   * Lấy thông tin chi tiết một sách theo ID
   * @param id - ID của sách
   * @param populate - Có populate category hay không
   * @returns Promise với IBook hoặc IBookPopulated
   * 
   * @example
   * const book = await bookApi.getById('507f1f77bcf86cd799439011');
   * const bookWithCategory = await bookApi.getById('507f1f77bcf86cd799439011', true);
   */
  getById: async (id: ObjectId, populate: boolean = false): Promise<IBook | IBookPopulated> => {
    try {
      const url = populate ? `books/${id}?populate=category` : `books/${id}`;
      const response = await getDataApi<GetBookResponse>(url);
      
      if (!response) {
        throw new Error(`No response from server when fetching book ${id}`);
      }
      
      // Check if response has .data property (wrapped response)
      if (response && typeof response === 'object' && 'data' in response && response.data) {
        return response.data;
      }
      
      // Check if response has _id (direct object from backend)
      if (response && typeof response === 'object' && '_id' in response) {
        return response as unknown as IBook;
      }
      
      // Fallback
      return response as unknown as IBook;
    } catch (error) {
      console.error(`❌ Error fetching book ${id}:`, error);
      throw error;
    }
  },

  /**
   * Tạo sách mới
   * @param data - Dữ liệu sách (không bao gồm _id, timestamps)
   * @returns Promise với IBook đã được tạo
   * 
   * @example
   * const newBook = await bookApi.create({
   *   name: 'Đắc Nhân Tâm',
   *   author: 'Dale Carnegie',
   *   price: 100000,
   *   categoryId: '507f1f77bcf86cd799439011',
   *   status: BookStatus.ACTIVE
   * });
   */
  create: async (data: CreateBookDto): Promise<IBook> => {
    try {
      const response = await postDataApi<BookMutationResponse, CreateBookDto>(
        "books",
        data
      );
      
      if (!response) {
        throw new Error('No response from server when creating book');
      }
      
      // Check if response has .data property (wrapped response)
      if (response && typeof response === 'object' && 'data' in response && response.data) {
        return response.data;
      }
      
      // Check if response has _id (direct object from backend)
      if (response && typeof response === 'object' && '_id' in response) {
        return response as unknown as IBook;
      }
      
      // Fallback
      return response as unknown as IBook;
    } catch (error) {
      console.error("❌ Error creating book:", error);
      throw error;
    }
  },

  /**
   * Cập nhật thông tin sách
   * @param id - ID của sách
   * @param data - Dữ liệu cần cập nhật (partial)
   * @returns Promise với IBook đã được cập nhật
   * 
   * @example
   * const updated = await bookApi.update('507f1f77bcf86cd799439011', {
   *   price: 120000,
   *   status: BookStatus.INACTIVE
   * });
   */
  update: async (id: ObjectId, data: UpdateBookDto): Promise<IBook> => {
    try {
      const response = await putDataApi<BookMutationResponse, UpdateBookDto>(
        `books/${id}`,
        data
      );
      
      if (!response) {
        throw new Error(`No response from server when updating book ${id}`);
      }
      
      // Check if response has .data property (wrapped response)
      if (response && typeof response === 'object' && 'data' in response && response.data) {
        return response.data;
      }
      
      // Check if response has _id (direct object from backend)
      if (response && typeof response === 'object' && '_id' in response) {
        return response as unknown as IBook;
      }
      
      // Fallback
      return response as unknown as IBook;
    } catch (error) {
      console.error(`❌ Error updating book ${id}:`, error);
      throw error;
    }
  },

  /**
   * Xóa sách
   * @param id - ID của sách
   * @returns Promise với kết quả xóa
   * 
   * @example
   * const result = await bookApi.delete('507f1f77bcf86cd799439011');
   * if (result.success) {
   *   console.log('Deleted successfully');
   * }
   */
  delete: async (id: ObjectId): Promise<DeleteBookResponse> => {
    try {
      const response = await deleteDataApi<DeleteBookResponse>(`books/${id}`);
      return response;
    } catch (error) {
      console.error(`❌ Error deleting book ${id}:`, error);
      throw error;
    }
  },

  /**
   * Tìm kiếm sách theo tên hoặc tác giả
   * @param searchTerm - Từ khóa tìm kiếm
   * @returns Promise với mảng IBook[] phù hợp
   * 
   * @example
   * const results = await bookApi.search('đắc nhân tâm');
   */
  search: async (searchTerm: string): Promise<IBook[]> => {
    try {
      return await bookApi.getAll({ search: searchTerm });
    } catch (error) {
      console.error("❌ Error searching books:", error);
      throw error;
    }
  },

  /**
   * Lấy sách theo category
   * @param categoryId - ID của category
   * @returns Promise với mảng IBook[] thuộc category đó
   * 
   * @example
   * const booksInCategory = await bookApi.getByCategory('507f1f77bcf86cd799439011');
   */
  getByCategory: async (categoryId: ObjectId): Promise<IBook[]> => {
    try {
      return await bookApi.getAll({ categoryId });
    } catch (error) {
      console.error(`❌ Error fetching books by category ${categoryId}:`, error);
      throw error;
    }
  },

  /**
   * Lấy sách trong khoảng giá
   * @param minPrice - Giá tối thiểu
   * @param maxPrice - Giá tối đa
   * @returns Promise với mảng IBook[] trong khoảng giá
   * 
   * @example
   * const affordableBooks = await bookApi.getByPriceRange(50000, 150000);
   */
  getByPriceRange: async (minPrice: number, maxPrice: number): Promise<IBook[]> => {
    try {
      return await bookApi.getAll({ minPrice, maxPrice });
    } catch (error) {
      console.error("❌ Error fetching books by price range:", error);
      throw error;
    }
  },
};

// ============================================
// Export default
// ============================================

export default bookApi;
