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

    getAllReturnOrders() {
        return new Promise((resolve, reject) => {
            let sql = 'SELECT * FROM RETURN_ORDER';
            this.db.all(sql, [], (err, rows) => {
                if (err) {
                    reject(err);
                    return;
                }
                
                const ros = rows.map((r) => (
                    {
                        id : r.id,
                        returnDate : r.return_date,
                        products : [],
                        restockOrderId : r.restock_order_id
                    }
                ));
                resolve(ros);
            });
        });
    }
   

    getReturnOrderById(id) {
        return new Promise((resolve, reject) => {
            let sql = 'SELECT * FROM RETURN_ORDER WHERE id = ?';
            this.db.get(sql, [id], (err, row) => {
                if (err) {
                    reject(err);
                    return;
                }

                if(row !== undefined){
                    const ro =
                        {
                            returnDate : row.return_date,
                            products : [],
                            restockOrderId : row.restock_order_id
                        }
                    resolve(ro);
                } else {
                    const ro = '';
                    resolve(ro);
                }
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