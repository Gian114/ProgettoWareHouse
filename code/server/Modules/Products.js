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

    insertProduct(sku_id, description, price, quantity, restock_order_id, internal_order_id) {
        return new Promise((resolve, reject) => {
            const query = `
                INSERT INTO PRODUCT(sku_id, description, price, quantity, restock_order_id, internal_order_id) 
                VALUES(?, ?, ?, ?, ?, ?)`;
            this.db.run(query, [sku_id, description, price, quantity, restock_order_id, internal_order_id], (err) => {
                if (err) {
                  reject(err);
                  return;
                }
                resolve(this.lastID);
            });
        });
    }

    async insertProductInternalOrder(sku_id, description, price, quantity, internal_order_id) {
        this.insertProduct(sku_id, description, price, quantity, 'NULL', internal_order_id);
    }


}


module.exports = Products;








