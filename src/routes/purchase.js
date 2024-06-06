const express = require('express');
const router = express.Router();
const purchaseController = require('../controller/purchaseController');

router.post('/', purchaseController.createPurchase);
router.get('/', purchaseController.getAllPurchases);
router.get('/:id', purchaseController.getPurchaseById);
router.delete('/:id', purchaseController.deletePurchase);

module.exports = router;