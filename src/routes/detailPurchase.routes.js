const express = require('express');
const router = express.Router();
const detailPurchaseController = require('../controllers/detailPurchase.controller');

router.get('/:id', detailPurchaseController.getDetailPurchase);

module.exports = router;