'use strict';

class Item {

    constructor(db) {
        this.db = db;
    }

    createNewItem(data) {
        return new Promise((resolve, reject) => {
            const sql = 'INSERT INTO ITEM(id, sku_id, description, price, supplier_id) VALUES(?, ?, ?, ?, ?)';
            this.db.run(sql, [data.id, data.SKUId, data.description, data.price, data.supplierId], (err) => {
                if (err) {
                  reject(err);
                  return;
                }

                resolve(this.lastID);
            });
        });
    }

    getAllItems() {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM ITEM';
            this.db.all(sql, [], (err, rows) => {
                if (err) {
                  reject(err);
                  return;
                }

                const items = rows.map((r) => (
                    {  
                        id: r.id,
                        description : r.description,
                        price : r.price,
                        SKUId : r.sku_id,
                        suppplierId : r.supplier_id,
                    }
                ));
                resolve(items);
            });
        });
    }

    getItemByID(id) {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM ITEM WHERE id = ?';
            this.db.get(sql, [id], (err, r) => {
                if (err) {
                    reject(err);
                    return;
                }

                if(r!==undefined){
                    const item =  
                    {  
                        id: r.id,
                        description : r.description,
                        price : r.price,
                        SKUId : r.sku_id,
                        suppplierId : r.supplier_id,
                    };
                    resolve(item);
                } else {
                        const item = '';
                        resolve(item);
                    }
            });
        });
    }

    getItemBySKUIdAndSupplierId(SKUId, supplierId) {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM ITEM WHERE sku_id = ? AND supplier_id = ?';
            this.db.get(sql, [SKUId, supplierId], (err, r) => {
                if (err) {
                    reject(err);
                    return;
                }

                if(r!==undefined){
                    const item =  
                    {  
                        id: r.id,
                        description : r.description,
                        price : r.price,
                        SKUId : r.sku_id,
                        suppplierId : r.supplier_id,
                    };
                    resolve(item);
                } else {
                        const item = '';
                        resolve(item);
                    }
            });
        });
    }

    getItemByIdAndSupplierId(id, supplierId) {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM ITEM WHERE id = ? AND supplier_id = ?';
            this.db.get(sql, [id, supplierId], (err, r) => {
                if (err) {
                    reject(err);
                    return;
                }

                if(r!==undefined){
                    const item =  
                    {  
                        id: r.id,
                        description : r.description,
                        price : r.price,
                        SKUId : r.sku_id,
                        suppplierId : r.supplier_id,
                    };
                    resolve(item);
                } else {
                        const item = '';
                        resolve(item);
                    }
            });
        });
    }

    modifyItem(id, data) {
        return new Promise((resolve, reject)=>{
            const sql = 'UPDATE ITEM SET description = ?, price = ? WHERE ID = ?';
            this.db.run(sql, [data.newDescription, data.newPrice, id], (err) => {
                if (err) {
                    reject(err);
                    return;
                }

                resolve(true);
            });
        });
    }

    deleteItem(id) {
        return new Promise((resolve, reject) => {
            const sql = 'DELETE FROM ITEM WHERE id = ?';
            this.db.run(sql, [id], (err) => {
                if (err) {
                    reject(err);
                    return;
                }
               
                resolve(true);
            });
        });
    }

}

module.exports = Item;