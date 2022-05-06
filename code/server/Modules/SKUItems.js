'use strict';

class SKUItem{

    constructor(db) {
        this.db = db;
    }



    createNewSKUItem(item){
        return new Promise((resolve, reject) => {
            const sql = 'INSERT INTO SKU_ITEM(rfid, available, sku_id, date_of_stock) VALUES(?, 0, ?, ?)';
            this.db.run(sql, [item.rfid, item.sku, item.date], (err) => {
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
                
                const skuitem = rows.map((r) => (
                
                    {  
                        rfid: r.rfid,
                        available: r.available,
                        sku: r.sku_id,
                        date: r.date_of_stock
                    }
                ));
                resolve(skuitem);
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
                    }
                    
                    resolve(skuitem);

                } else {
                    const none = ''
                    resolve(none)
                }
                
            });
        });
    }

    getSKUItemsBySKUID(sku) {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM SKU_ITEM WHERE sku_id = ? AND available = 1';
            this.db.all(sql, [sku], (err, rows) => {
                if (err) {
                    reject(err);
                    return;
                }
                
                const skuitem = rows.map((r) => (
                
                    {  
                        rfid: r.rfid,
                        available: r.available,
                        sku: r.sku_id,
                        date: r.date_of_stock
                    }
                ));
                resolve(skuitem);
            });
        });
    }

    modifySKUItem(data){
        return new Promise((resolve, reject)=>{
            //gestire old values e position
        const sql = 'UPDATE SKU_ITEM SET rfid = ?, available = ?, date_of_stock = ?'
        this.db.run(sql, [data.rfid, data.available, data.date], (err, r)=>{
            if (err) {
                reject(err);
                return;
            }
            resolve(true)
        })

        })
    }

    deleteSKUItem(rfid) {
        return new Promise((resolve, reject) => {
            const sql = 'DELETE FROM SKU_ITEM WHERE rfid = ?';
            this.db.run(sql, [rfid], (err, r) => {
                if (err) {
                    reject(err);
                    return;
                }
               
                resolve(true);
            });
        });
    }





}

module.exports = SKUItem;








