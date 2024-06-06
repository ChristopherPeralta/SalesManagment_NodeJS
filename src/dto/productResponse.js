exports.buildProductResponse = function(product) {
    return {
        id: product.id,
        name: product.name,
        price: product.price,
        stock: product.stock,
        category: product.category,
        createdAt: product.createdAt,
        updatedAt: product.updatedAt,
        deletedAt: product.deletedAt
    };
}