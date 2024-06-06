const Product = require('../models/product.model');
const Category = require('../models/category.model');
const { buildProductResponse } = require('../dto/productResponse');

exports.getAllProducts = async (req, res) => {
    try {
        const products = await Product.findAll({
            attributes: ['id', 'name', 'price', 'stock', 'createdAt', 'updatedAt', 'deletedAt'],
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
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error al obtener los productos', error });
    }
};

exports.getProductById = async (req, res) => {
    try {
        const id = req.params.id;

        const product = await Product.findByPk(id, {
            paranoid: false,
            attributes: ['id', 'name', 'price', 'stock', 'createdAt', 'updatedAt', 'deletedAt'],
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
    } catch (error) {
        console.error(error);
        if (error instanceof Sequelize.ValidationError) {
            return res.status(400).json({ message: 'Error de validación', errors: error.errors });
        }
        res.status(500).json({ message: 'Error interno del servidor', error: error.message });
    }
};

exports.createProduct = async (req, res) => {
    try {
        const product = await Product.create(req.body);
        res.status(201).json(product);
    } catch (error) {
        console.error(error);
        if (error instanceof Sequelize.ValidationError) {
            return res.status(400).json({ message: 'Error de validación', errors: error.errors });
        }
        res.status(500).json({ message: 'Error interno del servidor', error: error.message });
    }
};

exports.updateProduct = async (req, res) => {
    try {
        const product = await Product.findByPk(req.params.id);

        if (!product) {
            return res.status(404).json({ message: `Producto con ID ${req.params.id} no encontrado` });
        }

        await product.update(req.body);
        res.json(product);
    } catch (error) {
        console.error(error);
        if (error instanceof Sequelize.ValidationError) {
            return res.status(400).json({ message: 'Error de validación', errors: error.errors });
        }
        res.status(500).json({ message: 'Error interno del servidor', error: error.message });
    }
};

exports.deleteProduct = async (req, res) => {
    try {
        const product = await Product.findByPk(req.params.id);

        if (!product) {
            return res.status(404).json({ message: `Producto con ID ${req.params.id} no encontrado` });
        }

        await product.destroy();
        res.json({ message: 'Producto eliminado' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error interno del servidor', error: error.message });
    }
};

exports.restoreProduct = async (req, res) => {
    const product = await Product.findOne({ where: { id: req.params.id }, paranoid: false });
    if (!product || !product.deletedAt) {
        return res.status(404).json({ message: 'Product not found' });
    }
    await product.restore();
    res.json({ message: 'Product restored', product });
};

exports.getDeletedProducts = async (req, res) => {
    try {
        const products = await Product.findAll({ 
            paranoid: false, 
            attributes: ['id', 'name', 'price', 'stock', 'createdAt', 'updatedAt', 'deletedAt'],
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
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error al obtener los productos eliminados', error });
    }
};

exports.findByDeletedCategory = async (req, res) => {
    try {
        const products = await Product.findAll({
            include: [{
                model: Category,
                as: 'category',
                required: false
            }],
            where: { '$category.id$': null },
            attributes: ['id', 'name', 'price', 'stock', 'createdAt', 'updatedAt', 'deletedAt']
        });

        if (products.length === 0) {
            return res.status(404).json({ message: 'No se encontraron productos con categoría eliminada' });
        }

        res.json(products);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener los productos con categoría eliminada', error: error.message });
    }
};

