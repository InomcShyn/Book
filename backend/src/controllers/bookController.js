import Book from '../models/Book.js';
import Category from '../models/Category.js'; // Phải import vào để Mongoose đăng ký Schema này
import mongoose from 'mongoose';

// backend/src/controllers/bookController.js

export const getBooks = async (req, res) => {
    try {
        const { search, categoryId, sort } = req.query;
        let query = {};

        // Tìm kiếm text
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { author: { $regex: search, $options: 'i' } }
            ];
        }

        // Lọc danh mục
        if (categoryId) query.categoryId = categoryId;

        // Sắp xếp
        let sortQuery = {};
        if (sort === 'asc') sortQuery.price = 1;
        if (sort === 'desc') sortQuery.price = -1;

        const books = await Book.find(query).populate('categoryId').sort(sortQuery);
        res.json(books);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const createBook = async (req, res) => {
    try {
        if (!req.body || Object.keys(req.body).length === 0) {
            return res.status(400).json({ message: "Dữ liệu không được để trống" });
        }

        const book = await Book.create(req.body);
        // SỬA TẠI ĐÂY: 'category' -> 'categoryId'
        const fullBook = await Book.findById(book._id).populate('categoryId').exec();

        res.status(201).json(fullBook);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateBook = async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "ID không hợp lệ" });
        }

        // SỬA TẠI ĐÂY: 'category' -> 'categoryId'
        const book = await Book.findByIdAndUpdate(
            id,
            req.body,
            { new: true }
        ).populate('categoryId');

        if (!book) {
            return res.status(404).json({ message: "Không tìm thấy sách" });
        }

        res.json(book);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const deleteBook = async (req, res) => {
    try {
        const { id } = req.params;

        // FIX LỖI UNDEFINED: Ngăn chặn việc gọi xóa khi id là chuỗi "undefined"
        if (!id || id === 'undefined' || !mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "ID không hợp lệ hoặc bị thiếu" });
        }

        const result = await Book.findByIdAndDelete(id);

        if (!result) {
            return res.status(404).json({ message: "Không tìm thấy sách để xóa" });
        }

        res.json({ message: 'Xóa thành công', id });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};