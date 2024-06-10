
exports.buildProductResponse = function(product) {
    return {
        id: product.id,
        name: product.name,
        weight: `${product.weight} ${product.unit}`,
        price: product.price,
        stock: product.stock,
        purchasePrice: product.purchasePrice,
        averageCost: product.averageCost,
        category: product.category,
        brand: product.brand,
        createdAt: product.createdAt,
        updatedAt: product.updatedAt,
        deletedAt: product.deletedAt
    };
}