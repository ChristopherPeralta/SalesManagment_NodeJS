const express = require('express');
const router = express.Router();
const brandController = require('../controllers/brand.controller');

router.get('/', brandController.getAllBrands);
router.get('/deleted', brandController.getDeleteBrand);
router.get('/:id', brandController.getBrandById);
router.post('/', brandController.createBrand);
router.put('/:id', brandController.updateBrand);
router.delete('/:id', brandController.deleteBrand);
router.patch('/restore/:id', brandController.restoreBrand);

module.exports = router;