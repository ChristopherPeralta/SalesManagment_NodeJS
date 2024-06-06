exports.buildDetailPurchaseResponse = function(detail) {
    return {
        id: detail.id,
        product: {
        productId: detail.product.id,
        productName: detail.product.name,
        quantity: detail.quantity,
        price: detail.product.price,
        subtotal: detail.quantity * detail.product.price
        }
    };
}