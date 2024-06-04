const Category = require('../model/Category');

exports.getAllCategories = async (req, res) => {
    const categories = await Category.findAll();
    res.json(categories);
};

exports.getCategoryById = async (req, res) => {
    const category = await Category.findByPk(req.params.id);
    res.json(category);
};

exports.createCategory = async (req, res) => {
    const category = await Category.create(req.body);
    res.json(category);
};

exports.updateCategory = async (req, res) => {
    const category = await Category.findByPk(req.params.id);
    await category.update(req.body);
    res.json(category);
};

exports.deleteCategory = async (req, res) => {
    const category = await Category.findByPk(req.params.id);
    await category.destroy();
    res.json({ message: 'Category deleted' });
};

exports.restoreCategory = async (req, res) => {
    const category = await Category.findOne({ where: { id: req.params.id }, paranoid: false });
    if (!category || !category.deletedAt) {
        return res.status(404).json({ message: 'Category not found' });
    }
    await category.restore();
    res.json({ message: 'Category restored', category });
};