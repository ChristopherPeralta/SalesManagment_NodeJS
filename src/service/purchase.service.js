const Product = require('../models/product.model');

const updateProductStockAndCost = async (detail, transaction) => {
    const product = await Product.findOne({ where: { id: detail.productId }, paranoid: false, transaction });
  
    if (!product || product.deletedAt) {
      throw new Error(`El producto con id ${detail.productId} no existe o ha sido eliminado.`);
    }
  
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
  };

  const updateProductStockAndCostOnDelete = async (detail, transaction) => {
    const product = await Product.findOne({ where: { id: detail.productId }, paranoid: false, transaction });
  
    if (!product || product.deletedAt) {
      throw new Error(`El producto con id ${detail.productId} no existe o ha sido eliminado.`);
    }
  
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
  };

module.exports = {
  updateProductStockAndCost,
  updateProductStockAndCostOnDelete,
};