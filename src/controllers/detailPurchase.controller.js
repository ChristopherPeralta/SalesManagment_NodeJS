const DetailPurchase = require('../models/detailPurchase.model');
const Purchase = require('../models/purchase.model');
const Product = require('../models/product.model');
const { buildDetailPurchaseResponse } = require('../dto/detailPurchaseResponse');
const handleDatabaseOperation = require('../middlewares/errorHandler.js');

exports.getDetailPurchase = handleDatabaseOperation(async (req, res) => {
  const { id } = req.params;

  const details = await DetailPurchase.findAll({
      where: {
          purchaseId: id,  // Filtra los detailPurchase por purchaseId
      },
      include: [
          {
              model: Purchase,
              as: 'purchase',
              attributes: ['total', 'deletedAt'],
              paranoid: false,  // Incluye las compras eliminadas
          },
          {
              model: Product,
              as: 'product',
              attributes: ['id', 'name'],
          },
      ],
  });

  if (details.length > 0) {
      const response = details.map(buildDetailPurchaseResponse);

      // Verifica si la compra ha sido eliminada
      if (details[0].purchase.deletedAt) {
          res.status(200).json({ message: 'Esta compra fue eliminada', details: response });
      } else {
          res.status(200).json(response);
      }

  } else {
      res.status(404).send({ message: 'No se encontraron detalles para esta compra' });
  }
});