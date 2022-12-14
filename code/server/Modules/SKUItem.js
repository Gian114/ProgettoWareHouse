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

    setRestockOrderId(rfid, restockid) {
        return new Promise((resolve, reject)=>{
            const sql = 'UPDATE SKU_ITEM SET restock_order_id = ? WHERE rfid = ?'
            this.db.run(sql, [restockid, rfid], (err, r)=>{
                if (err) {
                    reject(err);
                    return;
                }
                resolve(true)
            });
        });
    }
    

    setInternalOrderId(rfid, returnOrderId) {
        return new Promise((resolve, reject)=>{
            const sql = 'UPDATE SKU_ITEM SET internal_order_id = ? WHERE rfid = ?'
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
                resolve(true);
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
                        RFID: r.rfid,
                        Available: r.available,
                        SKUId: r.sku_id,
                        DateOfStock: r.date_of_stock,
                        ret_o: r.return_order_id
                    }
                ));
                resolve(skuitems);
            });
        });
    }

    getSKUItemByRFID(rfid) {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM SKU_ITEM WHERE rfid = ?';
            this.db.get(sql, [rfid], (err, r) => {
                
                if (err) {
                    reject(err);
                    return;
                }
                if(r !== undefined){
                    const skuitem =  
                    {  
                        RFID: r.rfid,
                        SKUId: r.sku_id,
                        Available: r.available,
                        DateOfStock: r.date_of_stock
                    };
                    
                    resolve(skuitem);

                } else {
                    const none = '';
                    resolve(none);
                }
                
            });
        });
    }

    getSKUItemsBySKUId(id) {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM SKU_ITEM WHERE sku_id = ? AND available = 1';
            this.db.all(sql, [id], (err, rows) => {
                if (err) {
                    reject(err);
                    return;
                }
                
                if(rows.length !==0){
                const skuitems = rows.map((r) => (
                
                    {  
                        RFID: r.rfid,
                        SKUId: r.sku_id,
                        Available: r.available,
                        DateOfStock: r.date_of_stock
                    }
                ));
                resolve(skuitems);
            } else {
                const skuitems = ''
                resolve(skuitems)
            }
            
            });
        });
    }

    getSKUItemByRestockID(id){
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM SKU_ITEM WHERE restock_order_id = ?';
            this.db.all(sql, [id], (err, rows) => {
                if (err) {
                    reject(err);
                    return;
                }

                    const skuitem = rows.map((r) => (
                    
                        {  
                            SKUid: r.sku_id,
                            rfid: r.rfid
                        }
                    ));

              resolve(skuitem);
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
               
                resolve(true)
            });
        });
    }

}

module.exports = SKUItem;
















