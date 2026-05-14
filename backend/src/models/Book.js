import mongoose from 'mongoose';

const bookSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        author: {
            type: String,
            required: true,
        },
        price: {
            type: Number,
            required: true,
        },
        // ĐIỀN VÀO ĐÂY: Đây là chìa khóa để lấy được tên danh mục
        categoryId: {
            type: mongoose.Schema.Types.ObjectId, // Kiểu dữ liệu là ID của MongoDB
            ref: 'Category',                      // PHẢI KHỚP với tên Model bạn đặt ở file Category.js
            required: true,
        },
        status: {
            type: String,
            default: 'active',
        }
    },
    {
        timestamps: true,
    }
);

const Book = mongoose.model('Book', bookSchema);

export default Book;