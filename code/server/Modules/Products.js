'use strict';

class Products{

    constructor(db) {
        this.db = db;
    }

    insertProductByRestockId(product, roid) {
        return new Promise((resolve, reject) => {
            const query = 'INSERT INTO PRODUCT(sku_id, description, price, quantity, restock_order_id, internal_order_id) VALUES(?, ?, ?, ?, ?, ?)';
            this.db.run(query, [product.SKUId, product.description, product.price, product.qty, roid, 1], (err) => {
                if (err) {
                  reject(err);
                  return;
                }
                resolve(this.lastID);
            });
        });
    }



}


module.exports = Products;








