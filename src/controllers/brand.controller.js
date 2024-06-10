const Brand = require('../models/brand.model');
const handleDatabaseOperation = require('../middlewares/errorHandler.js');

exports.getAllBrands = handleDatabaseOperation(async (req, res) => {
    const brands = await Brand.findAll();
    res.json(brands);
});

exports.getBrandById = handleDatabaseOperation(async (req, res) => {
    const brand = await Brand.findOne({ 
        where: { 
            id: req.params.id 
        },
        paranoid: false
    });
    if (!brand) {
        return res.status(404).json({ message: 'Brand not found' });
    }
    if (brand.deletedAt) {
        return res.json({ message: 'This brand was deleted', brand });
    }
    res.json(brand);
});

exports.createBrand = handleDatabaseOperation(async (req, res) => {
    const brand = await Brand.create(req.body);
    res.json(brand);
});

exports.updateBrand = handleDatabaseOperation(async (req, res) => {
    const brand = await Brand.findByPk(req.params.id);
    if (!brand) {
        return res.status(404).json({ message: 'Brand not found' });
    }
    await brand.update(req.body);
    res.json(brand);
});

exports.deleteBrand = handleDatabaseOperation(async (req, res) => {
    const brand = await Brand.findByPk(req.params.id);
    if (!brand) {
        return res.status(404).json({ message: 'Brand not found' });
    }
    await brand.destroy();
    res.json({ message: 'Brand deleted' });
});

exports.restoreBrand = handleDatabaseOperation(async (req, res) => {
    const brand = await Brand.findOne({ where: { id: req.params.id }, paranoid: false });
    if (!brand || !brand.deletedAt) {
        return res.status(404).json({ message: 'Brand not found' });
    }
    await brand.restore();
    res.json({ message: 'Brand restored', brand });
});

exports.getDeleteBrand = handleDatabaseOperation(async (req, res) =>
{
    const brands = await Brand.findAll({ 
        paranoid: false 
    });
    const deletedBrands = brands.filter(brand => brand.deletedAt);
    res.json(deletedBrands);
});