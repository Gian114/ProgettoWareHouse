'use strict';

const db = require('./DB');

class Product{

    constructor(db) {
        this.db = db;
    }

    insertProduct(sku_id, description, price, quantity, restock_order_id, internal_order_id, return_order_id) {
        return new Promise((resolve, reject) => {
            const query = `
                INSERT INTO PRODUCT(sku_id, description, price, quantity, restock_order_id, internal_order_id, return_order_id) 
                VALUES(?, ?, ?, ?, ?, ?)`;
            this.db.run(query, [sku_id, description, price, quantity, restock_order_id, internal_order_id, return_order_id], (err) => {
                if (err) {
                  reject(err);
                  return;
                }
                resolve(this.lastID);
            });
        });
    }

    async insertProductInternalOrder(sku_id, description, price, quantity, internal_order_id) {
        await this.insertProduct(sku_id, description, price, quantity, 'NULL', internal_order_id, 'NULL');
    }

    async insertProductReturnOrder(sku_id, description, price, return_order_id) {
        await this.insertProduct(sku_id, description, price, 1, 'NULL', 'NULL', return_order_id);
    }

    async insertProductRestockOrder(sku_id, description, price, quantity, restock_order_id) {
        await this.insertProduct(sku_id, description, price, quantity, restock_order_id, 'NULL', 'NULL');
    }


}

const product = new Product(db);

module.exports = product;








