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

    await existingPurchase.destroy({ transaction: t });

    return existingPurchase;
  });

  res.status(200).send({ message: 'Compra eliminada con éxito' });
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
