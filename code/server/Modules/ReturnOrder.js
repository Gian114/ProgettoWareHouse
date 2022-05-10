'use strict'

class ReturnOrder {

    constructor(db) {
        this.db = db;
    }

    createNewReturnOrder(data) {
        return new Promise((resolve, reject) => {
            const sql = 'INSERT INTO RETURN_ORDER(returnDate, sku_item_rfid, restock_order_id) VALUES(?, ?, ?)';
            for(let i=0; i<data.products.length; i++) {
                console.log(data.products[i].RFID)
                this.db.run(sql, [data.returnDate, data.products[i].RFID, data.restockOrderId], (err) => {
                    if (err) {
                        reject(err);
                        return;
                    }

                    resolve(this.lastID);
                });
            }   
        });
    }
}

module.exports = ReturnOrder;