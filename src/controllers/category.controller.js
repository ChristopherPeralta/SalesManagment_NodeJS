const Category = require('../models/category.model');

exports.getAllCategories = async (req, res) => {
    try {
        const categories = await Category.findAll();
        res.json(categories);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getCategoryById = async (req, res) => {
    try {
        const category = await Category.findByPk(req.params.id);
        res.json(category);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.createCategory = async (req, res) => {
    try {
        const category = await Category.create(req.body);
        res.json(category);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateCategory = async (req, res) => {
    try {
        const category = await Category.findByPk(req.params.id);
        await category.update(req.body);
        res.json(category);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.deleteCategory = async (req, res) => {
    try {
        const category = await Category.findByPk(req.params.id);
        await category.destroy();
        res.json({ message: 'Category deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.restoreCategory = async (req, res) => {
    try {
        const category = await Category.findOne({ where: { id: req.params.id }, paranoid: false });
        if (!category || !category.deletedAt) {
            return res.status(404).json({ message: 'Category not found' });
        }
        await category.restore();
        res.json({ message: 'Category restored', category });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};