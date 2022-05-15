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
            this.db.all(sql, [], (err, rs) => {
                if (err) {
                    reject(err);
                    return;
                }
                
                const products = '';
                for(let i=0; i<rs.length; i++){
                    sql = 'SELECT rfid, sku_id, description, price FROM SKU_ITEM INNER JOIN PRODUCT ON PRODUCT.sku_id = SKU_ITEM.sku_id WHERE return_order_id = ?';
                    this.db.all(sql, [rs[i].id], (err, rows) => {
                        if (err) {
                            reject(err);
                            return;
                        }
                        
                        products[i] = rows.map((r) => (
                            {  
                                SKUId: r.sku_id,
                                description : r.description,
                                price : r.price,
                                RFID : r.rfid,
                            }
                        ));
                    });
                }
                
                const ros = rs.map((r) => (
                    {  
                        returnDate : r.return_date,
                        products : products[i],
                        restockOrderId : r.restock_order_id
                    }
                ));
                resolve(ros);
            });
        });
    }

    getReturnOrderByID(id) {
        return new Promise((resolve, reject) => {
            let sql = 'SELECT * FROM RETURN_ORDER WHERE id = ?';
            this.db.get(sql, [id], (err, row) => {
                if (err) {
                    reject(err);
                    return;
                }

                if(row !== undefined){
                    sql = 'SELECT rfid, sku_id, description, price FROM SKU_ITEM INNER JOIN PRODUCT ON PRODUCT.sku_id = SKU_ITEM.sku_id WHERE return_order_id = ?';
                    this.db.all(sql, [row.id], (err, rows) => {
                        if (err) {
                            reject(err);
                            return;
                        }
                        
                        const products = rows.map((r) => (
                            {  
                                SKUId: r.sku_id,
                                description : r.description,
                                price : r.price,
                                RFID : r.rfid,
                            }
                        ));
                        console.log(products);
                
                        const ro =  
                        {  
                            returnDate : row.return_date,
                            products : products,
                            restockOrderId : row.restock_order_id
                        };
                        resolve(ro);
                    });
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