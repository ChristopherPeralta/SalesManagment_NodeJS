const express = require('express');
const router = express.Router();
const employeeController = require('../controller/employeeController');

router.get('/', employeeController.getAllEmployees);
router.get('/:id', employeeController.getEmployeeById);
router.post('/', employeeController.createEmployee);
router.put('/:id', employeeController.updateEmployee);
router.delete('/:id', employeeController.deleteEmployee);
router.patch('/restore/:id', employeeController.restoreEmployee);

module.exports = router;