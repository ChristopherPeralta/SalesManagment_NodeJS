const sequelize = require('../../db.js');
const Purchase = require('../model/Purchase');
const Product = require('../model/Product');
const DetailPurchase = require('../model/DetailPurchase');

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
      const purchase = await Purchase.findByPk(id);
  
      if (!purchase) {
        return res.status(404).send({ message: 'Compra no encontrada' });
      }
  
      res.status(200).send(purchase);
    } catch (err) {
      res.status(500).send({ message: 'Error al obtener la compra', error: err });
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
      const purchase = await Purchase.findByPk(id);
  
      if (!purchase) {
        return res.status(404).send({ message: 'Compra no encontrada' });
      }
  
      await purchase.destroy();
      res.status(200).send({ message: 'Compra eliminada con éxito' });
    } catch (err) {
      res.status(500).send({ message: 'Error al eliminar la compra', error: err });
    }
  };

