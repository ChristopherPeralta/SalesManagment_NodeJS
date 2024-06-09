exports.buildDetailSaleResponse = function(detailSale) {
    return {

      sale: {
        id: detailSale.id,
        total: detailSale.sale.total,
      },
      product: {
        productId: detailSale.product.id,
        productName: detailSale.product.name,
        quantity: detailSale.quantity,
        price: detailSale.price,
        subtotal: detailSale.quantity * detailSale.price
        }  
    };
  }