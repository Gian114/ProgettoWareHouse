'use strict'

class ReturnOrder {

    constructor(db) {
        this.db = db;
    }

    createNewReturnOrder(data) {
        return new Promise((resolve, reject) => {
            const sql = 'INSERT INTO RETURN_ORDER(return_date, restock_order_id) VALUES(?, ?)';
            this.db.run(sql, [data.returnDate, data.restockOrderId], (err) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(this.lastID);
            });
        });
    }

    deleteReturnOrder(id) {
        return new Promise((resolve, reject) => {
            const sql = 'DELETE FROM RETURN_ORDER WHERE id = ?';
            this.db.run(sql, [id], (err, r) => {
                if (err) {
                    reject(err);
                    return;
                }
               
                resolve(true);
            });
        });
    }

}

module.exports = ReturnOrder;