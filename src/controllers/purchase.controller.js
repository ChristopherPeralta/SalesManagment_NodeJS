const sequelize = require('../../db.js');
const { Op } = require('sequelize');
const Purchase = require('../models/purchase.model.js');
const DetailPurchase = require('../models/detailPurchase.model.js');
const Product = require('../models/product.model');

exports.getAllPurchases = async (req, res) => {
    try {
      const purchases = await Purchase.findAll();
      res.status(200).send(purchases);
    } catch (err) {
      res.status(500).send({ message: 'Error al obtener las compras', error: err });
    }
  };

  exports.getPurchaseById = async (req, res) => {
    const { id } = req.params;
  
    try {
      const purchase = await Purchase.findOne({
          where: { id },
          paranoid: false
      });

      if (!purchase) {
          return res.status(404).json({ message: 'Compra no encontrada' });
      }

      if (purchase.deletedAt) {
          return res.json({ message: 'Esta compra fue eliminada', purchase });
      }

      res.json(purchase);
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error al obtener la compra', error: error.message });
  }
};

exports.createPurchase = async (req, res) => {
    const { products } = req.body;

    // Calcula el total de la compra
    const total = products.reduce((sum, product) => sum + product.price * product.quantity, 0);

    try {
      const purchase = await sequelize.transaction(async (t) => {
        const newPurchase = await Purchase.create({ total }, { transaction: t });

        const details = products.map((product) => ({
          purchaseId: newPurchase.id,
          productId: product.productId,
          quantity: product.quantity,
          price: product.price,
        }));

        // Actualiza el stock del producto y el costo promedio según la cantidad comprada
      for (const detail of details) {
        const product = await Product.findByPk(detail.productId, { transaction: t });
        if (product) {
          // Actualiza el purchasePrice del producto
          product.purchasePrice = detail.price;

          // Calcula el costo total del stock actual
          const currentTotalCost = product.averageCost * product.stock;

          // Calcula el costo total de los productos comprados
          const purchaseTotalCost = detail.price * detail.quantity;

          // Calcula el nuevo costo total
          const newTotalCost = currentTotalCost + purchaseTotalCost;

          // Calcula el nuevo stock
          const newStock = product.stock + detail.quantity;

          // Calcula el nuevo costo promedio
          const newAverageCost = newTotalCost / newStock;

          // Actualiza el stock y el costo promedio del producto
          product.stock = newStock;
          product.averageCost = newAverageCost;

          // Guarda los cambios en la base de datos
          await product.save();
        }
      }
//
        await DetailPurchase.bulkCreate(details, { transaction: t });

        return newPurchase;
      });

      res.status(201).send(purchase);
    } catch (err) {
      res.status(500).send({ message: 'Error al realizar la compra', error: err });
    }
  };

  exports.deletePurchase = async (req, res) => {
    const { id } = req.params;
  
    try {
      const purchase = await sequelize.transaction(async (t) => {
        const existingPurchase = await Purchase.findByPk(id, { transaction: t });
  
        if (!existingPurchase) {
          return res.status(404).json({ message: 'Compra no encontrada' });
        }
  
        const details = await DetailPurchase.findAll({ where: { purchaseId: id }, transaction: t });
  
        // Actualiza el stock del producto y el costo promedio según la cantidad comprada
        for (const detail of details) {
          const product = await Product.findByPk(detail.productId, { transaction: t });
  
          if (product) {
            // Calcula el costo total del stock actual
            const currentTotalCost = product.averageCost * product.stock;
  
            // Calcula el costo total de los productos devueltos
            const returnTotalCost = detail.price * detail.quantity;
  
            // Calcula el nuevo costo total
            const newTotalCost = currentTotalCost - returnTotalCost;
  
            // Calcula el nuevo stock
            const newStock = product.stock - detail.quantity;
  
            // Calcula el nuevo costo promedio
            const newAverageCost = newStock > 0 ? newTotalCost / newStock : 0;
  
            // Actualiza el stock y el costo promedio del producto
            product.stock = newStock;
            product.averageCost = newAverageCost;
  
            // Guarda los cambios en la base de datos
            await product.save();
          }
        }
  
        await existingPurchase.destroy({ transaction: t });
  
        return existingPurchase;
      });
  
      res.status(200).send({ message: 'Compra eliminada con éxito' });
    } catch (err) {
      res.status(500).send({ message: 'Error al eliminar la compra', error: err });
    }
  };



exports.getDeletedPurchases = async (req, res) => {
    try {
        const purchases = await Purchase.findAll({
          where: { deletedAt: { [Op.ne]: null } },
          paranoid: false
    });

        if (purchases.length === 0) {
            return res.status(404).json({ message: 'No se encontraron compras eliminadas' });
        }

        res.json(purchases);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener las compras eliminadas', error: error.message });
    }
};

