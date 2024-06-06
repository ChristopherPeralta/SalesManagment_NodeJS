const DetailPurchase = require('../models/detailPurchase.model');
const Product = require('../models/product.model');

exports.getDetailPurchase = async (req, res) => {
  const { id } = req.params;

  try {
    const details = await DetailPurchase.findAll({
      where: {
        purchaseId: id,  // Filtra los detailPurchase por purchaseId
      },
    });

    if (details.length > 0) {
      res.status(200).send(details);
    } else {
      res.status(404).send({ message: 'No se encontraron detalles para esta compra' });
    }
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: 'Error al obtener los detalles de la compra', error: err });
  }
};