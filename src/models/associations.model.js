const Product = require('./product.model');
const Category = require('./category.model');
const DetailPurchase = require('./detailPurchase.model');

//PRODUCT - CATEGORY
Product.belongsTo(Category, {
    foreignKey: 'categoryId',
    as: 'category'
});

Category.hasMany(Product, {
    foreignKey: 'categoryId',
    as: 'products'
});

//product detailPurchase
DetailPurchase.belongsTo(Product, { 
    foreignKey: 'productId', 
    as: 'product' 
});

Product.hasMany(DetailPurchase, { 
    foreignKey: 'productId', 
    as: 'detailPurchases' 
});