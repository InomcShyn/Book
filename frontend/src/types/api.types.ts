// ============================================
// Base Types
// ============================================

/**
 * MongoDB ObjectId as string
 */
export type ObjectId = string;

/**
 * Timestamp có thể là string ISO hoặc Date object
 */
export type Timestamp = string | Date;

/**
 * Generic API Response wrapper
 */
export interface ApiResponse<T = unknown> {
  code?: string;
  message?: string;
  data?: T;
  success?: boolean;
}

/**
 * Pagination metadata
 */
export interface PaginationResponse {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

/**
 * API request body type
 */
export type ApiBody = Record<string, unknown>;

/**
 * API query parameters
 */
export type ApiParams = Record<string, string | number | boolean | undefined>;

// ============================================
// Enums
// ============================================

/**
 * Trạng thái của Category
 */
export enum CategoryStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

/**
 * Trạng thái của Book
 */
export enum BookStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  OUT_OF_STOCK = 'out_of_stock',
}

// ============================================
// Entity Interfaces
// ============================================

/**
 * Category Entity
 */
export interface ICategory {
  _id: ObjectId;
  name: string;
  description?: string;
  status: CategoryStatus | 'active' | 'inactive';
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

/**
 * Book Entity (categoryId là ObjectId)
 */
export interface IBook {
  _id: ObjectId;
  name: string;
  author: string;
  price: number;
  categoryId: ObjectId;
  status: BookStatus | 'active' | 'inactive' | 'out_of_stock';
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

/**
 * Book Entity với Category đã được populate
 */
export interface IBookPopulated extends Omit<IBook, 'categoryId'> {
  categoryId: ICategory;
  category?: ICategory; // Alias
}

// ============================================
// DTO Types (Data Transfer Objects)
// ============================================

/**
 * DTO để tạo Category mới
 * Loại bỏ _id và timestamps vì được tạo tự động
 */
export type CreateCategoryDto = Omit<ICategory, '_id' | 'createdAt' | 'updatedAt'>;

/**
 * DTO để cập nhật Category
 * Tất cả fields đều optional
 */
export type UpdateCategoryDto = Partial<Omit<ICategory, '_id' | 'createdAt' | 'updatedAt'>>;

/**
 * DTO để tạo Book mới
 * categoryId phải là ObjectId (không nhận object)
 */
export type CreateBookDto = Omit<IBook, '_id' | 'createdAt' | 'updatedAt'>;

/**
 * DTO để cập nhật Book
 * Tất cả fields đều optional
 */
export type UpdateBookDto = Partial<Omit<IBook, '_id' | 'createdAt' | 'updatedAt'>>;

// ============================================
// Search/Filter Parameters
// ============================================

/**
 * Query parameters cho Category search
 */
export interface CategorySearchParams extends ApiParams {
  search?: string;
  status?: CategoryStatus | 'active' | 'inactive';
  page?: number;
  limit?: number;
}

/**
 * Query parameters cho Book search
 */
export interface BookSearchParams extends ApiParams {
  search?: string;
  categoryId?: ObjectId;
  minPrice?: number;
  maxPrice?: number;
  status?: BookStatus | 'active' | 'inactive' | 'out_of_stock';
  page?: number;
  limit?: number;
}
