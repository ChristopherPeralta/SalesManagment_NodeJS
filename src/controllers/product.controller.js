const Product = require('../models/product.model');
const Category = require('../models/category.model');
const { buildProductResponse } = require('../dto/productResponse');
const handleDatabaseOperation = require('../middlewares/errorHandler.js');

const productAttributes = ['id', 'name', 'stock', 'price', 'purchasePrice', 'averageCost', 'createdAt', 'updatedAt', 'deletedAt'];

exports.getAllProducts = handleDatabaseOperation(async (req, res) => {
    const products = await Product.findAll({
        attributes: productAttributes,
        include: [{
            model: Category,
            as: 'category',
            attributes: ['id', 'name']
        }]
    });

    if (!products) {
        return res.status(404).json({ message: 'No se encontraron productos' });
    }

    // Mapear sobre los productos y crear un nuevo objeto para cada uno
    const response = products.map(buildProductResponse);

    res.status(200).json(response);
});

exports.getProductById = handleDatabaseOperation(async (req, res) => {
    const id = req.params.id;

    const product = await Product.findByPk(id, {
        paranoid: false,
        attributes: productAttributes,
        include: [{
            model: Category,
            as: 'category',
            attributes: ['id', 'name']
        }]
    });

    if (!product) {
        return res.status(404).json({ message: `Producto con ID ${id} no encontrado` });
    }

    if (product.deletedAt) {
        return res.status(410).json({ message: 'This product was deleted', product });
    }

    const response = buildProductResponse(product);

    res.json(response);
});

exports.createProduct = handleDatabaseOperation(async (req, res) => {
    const { name, price, categoryId } = req.body;
    const stock = 0; // Establecer el stock en 0, independientemente de lo que se haya proporcionado
    const purchasePrice = 0;
    const averageCost = 0;

    const category = await Category.findOne({
        where: { id: categoryId },
        paranoid: false
    });

    if (!category) {
        return res.status(404).json({ message: 'Categoría no encontrada' });
    }

    if (category.deletedAt) {
        return res.status(400).json({ message: 'No se puede crear un producto con una categoría eliminada' });
    }

    const product = await Product.create({
        name,
        price,
        stock,
        purchasePrice,
        averageCost,
        categoryId
    });

    res.status(201).json(product);
});

exports.updateProduct = handleDatabaseOperation(async (req, res) => {
    const product = await Product.findByPk(req.params.id);

    if (!product) {
        return res.status(404).json({ message: `Producto con ID ${req.params.id} no encontrado` });
    }

    await product.update(req.body);
    res.json(product);
});

exports.deleteProduct = handleDatabaseOperation(async (req, res) => {
    const product = await Product.findByPk(req.params.id);

    if (!product) {
        return res.status(404).json({ message: `Producto con ID ${req.params.id} no encontrado` });
    }

    await product.destroy();
    res.json({ message: 'Producto eliminado' });
});

exports.restoreProduct = handleDatabaseOperation(async (req, res) => {
    const product = await Product.findOne({ where: { id: req.params.id }, paranoid: false });
    if (!product || !product.deletedAt) {
        return res.status(404).json({ message: 'Product not found' });
    }
    await product.restore();
    res.json({ message: 'Product restored', product });
});

exports.getDeletedProducts = handleDatabaseOperation(async (req, res) => {
    const products = await Product.findAll({ 
        paranoid: false, 
        attributes: productAttributes,
        include: [{
            model: Category,
            as: 'category',
            attributes: ['id', 'name']
        }]
    });

    const deletedProducts = products.filter(product => product.deletedAt);

    if (deletedProducts.length === 0) {
        return res.status(404).json({ message: 'No se encontraron productos eliminados' });
    }

    res.json(deletedProducts);
});

exports.findByDeletedCategory = handleDatabaseOperation(async (req, res) => {
    const products = await Product.findAll({
        include: [{
            model: Category,
            as: 'category',
            required: false
        }],
        where: { '$category.id$': null },
        attributes: productAttributes,
    });

    if (products.length === 0) {
        return res.status(404).json({ message: 'No se encontraron productos con categoría eliminada' });
    }

    res.json(products);
});

