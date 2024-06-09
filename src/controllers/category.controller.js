const Category = require('../models/category.model');
const handleDatabaseOperation = require('../middlewares/errorHandler.js');

exports.getAllCategories = handleDatabaseOperation(async (req, res) => {
    const categories = await Category.findAll();
    res.json(categories);
});


exports.getCategoryById = handleDatabaseOperation(async (req, res) => {
    const category = await Category.findOne({ 
        where: { 
            id: req.params.id 
        },
        paranoid: false
    });
    if (!category) {
        return res.status(404).json({ message: 'Category not found' });
    }
    if (category.deletedAt) {
        return res.json({ message: 'This category was deleted', category });
    }
    res.json(category);
});

exports.createCategory = handleDatabaseOperation(async (req, res) => {
    const category = await Category.create(req.body);
    res.json(category);
});

exports.updateCategory = handleDatabaseOperation(async (req, res) => {
    const category = await Category.findByPk(req.params.id);
    if (!category) {
        return res.status(404).json({ message: 'Category not found' });
    }
    await category.update(req.body);
    res.json(category);
});

exports.deleteCategory = handleDatabaseOperation(async (req, res) => {
    const category = await Category.findByPk(req.params.id);
    if (!category) {
        return res.status(404).json({ message: 'Category not found' });
    }
    await category.destroy();
    res.json({ message: 'Category deleted' });
});

exports.restoreCategory = handleDatabaseOperation(async (req, res) => {
    const category = await Category.findOne({ where: { id: req.params.id }, paranoid: false });
    if (!category || !category.deletedAt) {
        return res.status(404).json({ message: 'Category not found' });
    }
    await category.restore();
    res.json({ message: 'Category restored', category });
});

exports.getDeletedCategories = handleDatabaseOperation(async (req, res) => {
    const categories = await Category.findAll({ 
        paranoid: false 
    });
    const deletedCategories = categories.filter(category => category.deletedAt);
    res.json(deletedCategories);
});