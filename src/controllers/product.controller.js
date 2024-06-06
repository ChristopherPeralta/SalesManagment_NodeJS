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
        const id = req.params.id; // Aquí es donde obtienes el id del producto

        const product = await Product.findByPk(id, {
            attributes: ['id', 'name', 'price', 'stock', 'createdAt', 'updatedAt', 'deletedAt'], // Incluye solo estos campos
            include: [{
                model: Category,
                as: 'category',
                attributes: ['id', 'name']
            }]
        });
        if (!product) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }

        // Crear el objeto de respuesta con las propiedades en el orden deseado
        const response = buildProductResponse(product);

        res.json(response);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error al obtener el producto', error });
    }
};

exports.createProduct = async (req, res) => {
    const product = await Product.create(req.body);
    res.json(product);
};

exports.updateProduct = async (req, res) => {
    const product = await Product.findByPk(req.params.id);
    await product.update(req.body);
    res.json(product);
};

exports.deleteProduct = async (req, res) => {
    const product = await Product.findByPk(req.params.id);
    await product.destroy();
    res.json({ message: 'Product deleted' });
};

exports.restoreProduct = async (req, res) => {
    const product = await Product.findOne({ where: { id: req.params.id }, paranoid: false });
    if (!product || !product.deletedAt) {
        return res.status(404).json({ message: 'Product not found' });
    }
    await product.restore();
    res.json({ message: 'Product restored', product });
};