const express = require('express');
const router = express.Router();
const productController = require('../controllers/product.controller');

router.get('/', productController.getAllProducts);
router.get('/deleted', productController.getDeletedProducts);
router.get('/with-deleted-category', productController.findByDeletedCategory);
router.get('/:id', productController.getProductById);
router.post('/', productController.createProduct);
router.put('/:id', productController.updateProduct);
router.delete('/:id', productController.deleteProduct);
router.patch('/restore/:id', productController.restoreProduct);

module.exports = router;