'use strict'

const db = require('./DB');

class Product{

    constructor(db) {
        this.db = db;
    }

    getProductsByRestockOrder(id) {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM PRODUCT WHERE restock_order_id = ?';
            this.db.all(sql, [id], (err, rows) => {
                if (err) {
                  reject(err);
                  return;
                }

                const pid = rows.map((r) => (r.id));
                resolve(pid);
            });
        });
    }

    getProductsByInternalOrder(id) {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM PRODUCT WHERE internal_order_id = ?';
            this.db.all(sql, [id], (err, rows) => {
                if (err) {
                  reject(err);
                  return;
                }

                const pid = rows.map((r) => (r.id));
                resolve(pid);
            });
        });
    }

    getProductsByReturnOrder(id) {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM PRODUCT WHERE return_order_id = ?';
            this.db.all(sql, [id], (err, rows) => {
                if (err) {
                  reject(err);
                  return;
                }

                const pid = rows.map((r) => (r.id));
                resolve(pid);
            });
        });
    }

    insertProduct(sku_id, description, price, quantity, restock_order_id, internal_order_id, return_order_id) {
        return new Promise((resolve, reject) => {
            const sql = 'INSERT INTO PRODUCT(sku_id, description, price, quantity, restock_order_id, internal_order_id, return_order_id) VALUES(?, ?, ?, ?, ?, ?, ?)';
            this.db.run(sql, [sku_id, description, price, quantity, restock_order_id, internal_order_id, return_order_id], (err) => {
                if (err) {
                  reject(err);
                  return;
                }
                resolve(this.lastID);
            });
        });
    }

    async insertProductInternalOrder(sku_id, description, price, quantity, internal_order_id) {
        await this.insertProduct(sku_id, description, price, quantity, "NULL", internal_order_id, "NULL");
    }

    async insertProductReturnOrder(sku_id, description, price, return_order_id) {
        await this.insertProduct(sku_id, description, price, 1, "NULL", "NULL", return_order_id);
    }

    async insertProductRestockOrder(sku_id, description, price, quantity, restock_order_id) {
        return new Promise((resolve, reject) => {
            const sql = 'INSERT INTO PRODUCT(sku_id, description, price, quantity, restock_order_id, internal_order_id, return_order_id) VALUES(?, ?, ?, ?, ?, ?, ?)';
            this.db.run(sql, [sku_id, description, price, quantity, restock_order_id, "NULL", "NULL"], (err) => {
                if (err) {
                  reject(err);
                  return;
                }
                resolve(this.lastID);
            });
        });
    }

    deleteProduct(id) {
        return new Promise((resolve, reject) => {
            const sql = 'DELETE FROM PRODUCT WHERE id = ?';
            this.db.run(sql, [id], (err, r) => {
                if (err) {
                    reject(err);
                    return;
                }
               
                resolve(true);
            });
        });
    }

    deleteProductByInternalOrderId(internal_order_id) {
        return new Promise((resolve, reject) => {

            const sql = 'DELETE FROM PRODUCT WHERE internal_order_id = ?';

            this.db.run(sql, [internal_order_id], (err) => {

                if (err) {
                    reject(err);
                    return;
                }
                resolve(true);
            });
        });
    }

    deleteProductByRestockOrderId(restock_order_id) {
        return new Promise((resolve, reject) => {

            const sql = 'DELETE FROM PRODUCT WHERE restock_order_id = ?';

            this.db.run(sql, [restock_order_id], (err) => {

                if (err) {
                    reject(err);
                    return;
                }
                resolve(true);
            });
        });
    }

    deleteProductByReturnOrderId(return_order_id) {
        return new Promise((resolve, reject) => {

            const sql = 'DELETE FROM PRODUCT WHERE return_order_id = ?';

            this.db.run(sql, [return_order_id], (err) => {

                if (err) {
                    reject(err);
                    return;
                }
                resolve(true);
            });
        });
    }


}

const product = new Product(db.db);

module.exports = product;