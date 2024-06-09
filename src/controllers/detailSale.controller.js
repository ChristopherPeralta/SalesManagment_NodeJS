const DetailSale = require('../models/detailSale.model');
const Sale = require('../models/sale.model');
const Product = require('../models/product.model');
const { buildDetailSaleResponse } = require('../dto/buildDetailSaleResponse.js');
const handleDatabaseOperation = require('../middlewares/errorHandler.js');

exports.getDetailSale = handleDatabaseOperation(async (req, res) => {
    const { id } = req.params;
  
    const details = await DetailSale.findAll({
        where: {
            saleId: id,  // Filtra los detailSale por saleId
        },
        include: [
            {
                model: Sale,
                as: 'sale',
                attributes: ['total', 'deletedAt'],
                paranoid: false,  // Incluye las ventas eliminadas
            },
            {
                model: Product,
                as: 'product',
                attributes: ['id', 'name'],
            },
        ],
    });
  
    if (details.length > 0) {
        const response = details.map(buildDetailSaleResponse);
  
        // Verifica si la venta ha sido eliminada
        if (details[0].sale.deletedAt) {
            res.status(200).json({ message: 'Esta venta fue eliminada', details: response });
        } else {
            res.status(200).json(response);
        }
  
    } else {
        res.status(404).send({ message: 'No se encontraron detalles para esta venta' });
    }
});