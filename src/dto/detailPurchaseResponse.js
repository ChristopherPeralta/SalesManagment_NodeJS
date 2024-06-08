exports.buildDetailPurchaseResponse = function(detail) {
    return {
        
        purchase: {
            id: detail.id,
            total: detail.purchase.total,
        },
        product: {
        productId: detail.product.id,
        productName: detail.product.name,
        quantity: detail.quantity,
        price: detail.price,
        subtotal: detail.quantity * detail.price
        }
    };
}