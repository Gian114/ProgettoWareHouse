'use strict'

class Product {

    constructor(db) {
        this.db = db;
    }

    getProducts() {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM PRODUCT';
            this.db.all(sql, [], (err, rows) => {
                if (err) {
                    reject(err);
                    return;
                }

                const products = rows.map((r) => (
                    {
                        id: r.id,
                        SKUId: r.sku_id,
                        description: r.description,
                        price: r.price
                    }
                ));

                resolve(products)
            });
        });
    }

    /*getProductsByRestockOrder(id) {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM PRODUCT WHERE restock_order_id = ?';
            this.db.all(sql, [id], (err, rows) => {
                if (err) {
                  reject(err);
                  return;
                }

                const products = rows.map((r) => (
                    {  
                        SKUId: r.sku_id,
                        description : r.description,
                        price : r.price,
                        qty : r.quantity,
                    }
                ));

                resolve(products);
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

                const products = rows.map((r) => (
                    {  
                        SKUId: r.sku_id,
                        description : r.description,
                        price : r.price,
                        qty : r.quantity,
                    }
                ));

                resolve(products);
            });
        });
    }*/

    getProductsByReturnOrder(id) {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT DISTINCT PRODUCT.sku_id, description, price, rfid FROM PRODUCT, SKU_ITEM WHERE PRODUCT.return_order_id = SKU_ITEM.return_order_id AND PRODUCT.sku_id = SKU_ITEM.sku_id AND SKU_ITEM.return_order_id = ?';
            this.db.all(sql, [id], (err, rows) => {
                if (err) {
                    reject(err);
                    return;
                }

                const products = rows.map((r) => (
                    {
                        SKUId: r.sku_id,
                        description: r.description,
                        price: r.price,
                        RFID: r.rfid
                    }
                ));
                resolve(products);
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
                resolve(true);
            });
        });
    }

    async insertProductInternalOrder(sku_id, description, price, quantity, internal_order_id) {
        await this.insertProduct(sku_id, description, price, quantity, null, internal_order_id, null);
    }

    async insertProductReturnOrder(sku_id, description, price, return_order_id) {
        await this.insertProduct(sku_id, description, price, 1, null, null, return_order_id);
    }

    async insertProductRestockOrder(sku_id, description, price, quantity, restock_order_id) {
        await this.insertProduct(sku_id, description, price, quantity, restock_order_id, null, null);
    }

    /*deleteProduct(id) {
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
    }*/

    deleteProductsByInternalOrderId(internal_order_id) {
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

    deleteProductsByRestockOrderId(restock_order_id) {
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

    deleteProductsByReturnOrderId(return_order_id) {
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

    deleteProductsBySKUId(SKUId) {
        return new Promise((resolve, reject) => {

            const sql = 'DELETE FROM PRODUCT WHERE sku_id = ?';

            this.db.run(sql, [SKUId], (err) => {

                if (err) {
                    reject(err);
                    return;
                }
                resolve(true);
            });
        });
    }

}

module.exports = Product;