const express = require('express');
const employeeRouter = require('./src/routes/employee');
const productRouter = require('./src/routes/product');
const categoryRouter = require('./src/routes/category');
require('./src/model/Associations'); 

const app = express();

app.use(express.json()); // para poder parsear JSON
app.use('/employee', employeeRouter);
app.use('/product', productRouter);
app.use('/category', categoryRouter);

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});