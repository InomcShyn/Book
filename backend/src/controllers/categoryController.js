import Category from '../models/Category.js';

export const getCategories = async (req, res) => {
    try {
        const categories = await Category.find();
        res.json(categories);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const createCategory = async (req, res) => {
    try {
        const category = await Category.create(req.body);
        res.status(201).json(category);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateCategory = async (req, res) => {
    try {
        const category = await Category.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        res.json(category);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const deleteCategory = async (req, res) => {
    try {
        await Category.findByIdAndDelete(req.params.id);

        res.json({ message: 'Deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};