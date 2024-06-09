const express = require('express');
const router = express.Router();
const detailSaleController = require('../controllers/detailSale.controller');

router.get('/:id', detailSaleController.getDetailSale);

module.exports = router;