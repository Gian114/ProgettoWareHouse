'use strict';

class SKUItem{

    constructor(db) {
        this.db = db;
    }

    setReturnOrderId(rfid, returnOrderId) {
        return new Promise((resolve, reject)=>{
            const sql = 'UPDATE SKU_ITEM SET return_order_id = ? WHERE rfid = ?'
            this.db.run(sql, [returnOrderId, rfid], (err, r)=>{
                if (err) {
                    reject(err);
                    return;
                }
                resolve(true)
            });
        });
    }

    createNewSKUItem(item){
        return new Promise((resolve, reject) => {
            const sql = 'INSERT INTO SKU_ITEM(rfid, available, sku_id, date_of_stock) VALUES(?, 0, ?, ?)';
            this.db.run(sql, [item.RFID, item.SKUId, item.DateOfStock], (err) => {
                if (err) {
                  reject(err);
                  return;
                }
                resolve(this.lastID);
            });
        });
    }

    getAllSKUItems() {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM SKU_ITEM';
            this.db.all(sql, [], (err, rows) => {
                if (err) {
                    reject(err);
                    return;
                }
                
                const skuitems = rows.map((r) => (
                    {  
                        rfid: r.rfid,
                        available: r.available,
                        sku: r.sku_id,
                        dateOfStock: r.date_of_stock
                    }
                ));
                resolve(skuitems);
            });
        });
    }

    getSKUItemByRFID(rfid) {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM SKU_ITEM WHERE rfid = ?';
            this.db.get(sql, rfid, (err, r) => {
                
                if (err) {
                    reject(err);
                    return;
                }
                if(r !== undefined){
                    const skuitem =  
                    {  
                        rfid: r.rfid,
                        available: r.available,
                        sku: r.sku_id,
                        date: r.date_of_stock
                    };
                    
                    resolve(skuitem);

                } else {
                    const none = '';
                    resolve(none);
                }
                
            });
        });
    }

    getSKUItemsBySKUID(id) {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM SKU_ITEM WHERE sku_id = ? AND available = 1';
            this.db.all(sql, [id], (err, rows) => {
                if (err) {
                    reject(err);
                    return;
                }
                if(rows !== undefined){

                
                const skuitem = rows.map((r) => (
                
                    {  
                        rfid: r.rfid,
                        available: r.available,
                        sku: r.sku_id,
                        date: r.date_of_stock
                    }
                ));
                resolve(skuitem);
            } else {
                const skuitem = []
                resolve(skuitem);
            }
            });
        });
    }

    modifySKUItem(rfid, data){
        return new Promise((resolve, reject)=>{   
            const sql = 'UPDATE SKU_ITEM SET rfid = ?, available = ?, date_of_stock = ? WHERE rfid = ?'
            this.db.run(sql, [data.newRFID, data.newAvailable, data.newDateOfStock, rfid], (err, r)=>{
                if (err) {
                    reject(err);
                    return;
                }
                resolve(true)
            });
        });
    }

    deleteSKUItem(rfid) {
        return new Promise((resolve, reject) => {
            const sql = 'DELETE FROM SKU_ITEM WHERE rfid = ?';
            this.db.run(sql, [rfid], (err, r) => {
                if (err) {
                    reject(err);
                    return;
                }
               
                if(r!==undefined){
                resolve(true);
                } else {
                    resolve(false)
                }
            });
        });
    }





}

module.exports = SKUItem;













