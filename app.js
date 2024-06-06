const express = require('express');
const employeeRouter = require('./src/routes/employee.routes');
const productRouter = require('./src/routes/product.routes');
const categoryRouter = require('./src/routes/category.routes');
const purchaseRouter = require('./src/routes/purchase.routes');
const detailPurchaseRouter = require('./src/routes/detailPurchase.routes');
require('./src/models/associations.model');

const app = express();

app.use(express.json()); // para poder parsear JSON
app.use('/employee', employeeRouter);
app.use('/product', productRouter);
app.use('/category', categoryRouter);
app.use('/purchase', purchaseRouter);
app.use('/detailspurchase', detailPurchaseRouter);

module.exports = app;

