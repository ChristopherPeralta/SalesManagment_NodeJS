const sequelize = require('../../db.js');
const { Op } = require('sequelize');
const handleDatabaseOperation = require('../middlewares/errorHandler.js');
const Sale = require('../models/sale.model.js');
const DetailSale = require('../models/detailSale.model.js');
const Product = require('../models/product.model');

exports.getAllSales = handleDatabaseOperation(async (req, res) => {
    const sales = await Sale.findAll();
    res.status(200).send(sales);
});

exports.getSaleById = handleDatabaseOperation(async (req, res) => {
    const { id } = req.params;
    const sale = await Sale.findByPk(id, { paranoid: false });
    if (sale) {
        if (sale.deletedAt) {
            res.status(200).send({ message: 'Esta venta fue eliminada', sale });
        } else {
            res.status(200).send(sale);
        }
    } else {
        res.status(404).send({ message: 'Venta no encontrada' });
    }
});

// Crear una nueva venta
exports.createSale = async (req, res) => {
  const { products } = req.body; // asumimos que 'products' es un array de objetos { productId, quantity, price }

  const transaction = await sequelize.transaction();

  try {
    let total = 0;

    // Calcula el total sumando el precio de cada producto multiplicado por su cantidad
    for (const { productId, quantity, price } of products) {
      const product = await Product.findByPk(productId, { transaction });

      if (!product) {
        await transaction.rollback();
        return res.status(404).json({ message: `Producto con id ${productId} no encontrado` });
      }

      if (product.stock < quantity) {
        await transaction.rollback();
        return res.status(400).json({ message: `No hay suficiente stock del producto con id ${productId}` });
      }

      product.stock -= quantity;
      await product.save({ transaction });

      total += price * quantity;
    }

    const sale = await Sale.create({ total }, { transaction });

    // Crear una entrada en DetailSale para cada producto vendido
    for (const { productId, quantity, price } of products) {
      await DetailSale.create({ saleId: sale.id, productId, quantity, price }, { transaction });
    }

    await transaction.commit();
    res.status(201).json(sale);
  } catch (error) {
    await transaction.rollback();
    res.status(500).json({ message: 'Hubo un error al crear la venta', error });
  }
};

// Eliminar una venta
exports.deleteSale = handleDatabaseOperation(async (req, res) => {
  const { id } = req.params;

  const sale = await sequelize.transaction(async (t) => {
    const existingSale = await Sale.findByPk(id, { transaction: t });

    if (!existingSale) {
      res.status(404).json({ message: 'Venta no encontrada' });
      return;
    }

    const saleDetails = await DetailSale.findAll({ where: { saleId: id }, transaction: t });

    for (const detail of saleDetails) {
      const product = await Product.findByPk(detail.productId, { transaction: t });

      if (!product) {
        res.status(404).json({ message: `Producto con id ${detail.productId} no encontrado` });
        return;
      }

      // Actualiza el stock del producto según la cantidad vendida
      product.stock += detail.quantity;
      await product.save({ transaction: t });
    }

    // Marcar la venta como eliminada
    await existingSale.destroy({ transaction: t });

    return existingSale;
  });

  if (sale) {
    res.status(200).send({ message: 'Venta eliminada con éxito' });
  }
});

exports.getDeletedSales = handleDatabaseOperation(async (req, res) => {
    const sales = await Sale.findAll({
      where: { deletedAt: { [Op.ne]: null } },
      paranoid: false
    });
  
    if (sales.length === 0) {
      return res.status(404).json({ message: 'No se encontraron ventas eliminadas' });
    }
  
    res.json(sales);
  });