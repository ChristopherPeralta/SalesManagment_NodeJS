const sequelize = require('../../db.js');
const { Op } = require('sequelize');
const handleDatabaseOperation = require('../middlewares/errorHandler.js');
const { updateProductStockAndCost, updateProductStockAndCostOnDelete } = require('../service/purchase.service.js');
const Purchase = require('../models/purchase.model.js');
const DetailPurchase = require('../models/detailPurchase.model.js');
const Product = require('../models/product.model');

exports.getAllPurchases = handleDatabaseOperation(async (req, res) => {
  const purchases = await Purchase.findAll();
  res.status(200).send(purchases);
});

exports.getPurchaseById = handleDatabaseOperation(async (req, res) => {
  const { id } = req.params;
  const purchase = await Purchase.findOne({ 
    where: { id }, 
    paranoid: false 
  });
      
  if (!purchase) {
    return res.status(404).json({ message: 'Compra no encontrada' });
  }

  if (purchase.deletedAt) {
    return res.status(410).json({ message: 'Esta compra fue eliminada', purchase });
  }

  res.json(purchase);
});


exports.createPurchase = handleDatabaseOperation(async (req, res) => {
  const { products } = req.body;

  // Verifica si todos los productos existen
  for (const product of products) {
    const existingProduct = await Product.findByPk(product.productId);
    if (!existingProduct) {
      return res.status(404).json({ message: `El producto con id ${product.productId} no existe.` });
    }
  }

  const total = products.reduce((sum, product) => sum + product.price * product.quantity, 0);

  const purchase = await sequelize.transaction(async (t) => {
    const newPurchase = await Purchase.create({ total }, { transaction: t });

    const details = products.map((product) => ({
      purchaseId: newPurchase.id,
      productId: product.productId,
      quantity: product.quantity,
      price: product.price,
    }));

    for (const detail of details) {
      await updateProductStockAndCost(detail, t);
    }
      
    await DetailPurchase.bulkCreate(details, { transaction: t });

    return newPurchase;
  });

  res.status(201).send(purchase);
});

exports.deletePurchase = handleDatabaseOperation(async (req, res) => {
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
      await updateProductStockAndCostOnDelete(detail, t);
    }

    // Marcar los detalles de la compra como eliminados
    for (const detail of details) {
      detail.setDataValue('deletedAt', new Date());
      await detail.save({ transaction: t });
    }

    // Marcar la compra como eliminada
    existingPurchase.setDataValue('deletedAt', new Date());
    await existingPurchase.save({ transaction: t });

return existingPurchase;
    });

    res.status(200).send({ message: 'Compra eliminada con éxito' });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error del servidor');
  }
});


exports.getDeletedPurchases = handleDatabaseOperation(async (req, res) => {
  const purchases = await Purchase.findAll({
    where: { deletedAt: { [Op.ne]: null } },
    paranoid: false
  });

  if (purchases.length === 0) {
    return res.status(404).json({ message: 'No se encontraron compras eliminadas' });
  }

  res.json(purchases);
});

exports.restorePurchase = handleDatabaseOperation(async (req, res) => {
  const { id } = req.params;

  try {
    const purchase = await sequelize.transaction(async (t) => {
      const existingPurchase = await Purchase.findByPk(id, {
        include: [{ model: DetailPurchase, as: 'detailPurchases', paranoid: false }],
        paranoid: false, // Incluir registros eliminados
        transaction: t
      });

      if (!existingPurchase) {
        return res.status(404).json({ message: 'Compra no encontrada' });
      }

      if (!existingPurchase.deletedAt) {
        return res.status(400).json({ message: 'La compra no está eliminada' });
      }

      const details = existingPurchase.detailPurchases;

      // Restaurar los detalles de la compra y actualizar el stock y precio medio del producto
      for (const detail of details) {
        detail.setDataValue('deletedAt', null);
        await detail.save({ transaction: t });

        // Obtener el producto asociado
        const product = await Product.findByPk(detail.productId, { transaction: t });
      
        if (product) {
          // Calcular el nuevo stock
          const newStock = product.stock + detail.quantity;
      
          // Calcular el nuevo precio medio, asegurando que no resulte en NaN
          let newAverageCost = product.averageCost;
          if (newStock > 0) {
            const totalCost = (product.averageCost * product.stock) + (detail.price * detail.quantity);
            newAverageCost = totalCost / newStock;
          } else {
            newAverageCost = 0; // Si el nuevo stock es 0, el precio medio también debe ser 0
          }
      
          // Actualizar el producto con los nuevos valores
          product.stock = newStock;
          product.averageCost = newAverageCost;
      
          await product.save({ transaction: t });
        }
      }
      
      // Restaurar la compra
      existingPurchase.setDataValue('deletedAt', null);
      await existingPurchase.save({ transaction: t });
      
      return existingPurchase;
    });

    res.status(200).send({ message: 'Compra restaurada con éxito' });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error del servidor');
  }
});