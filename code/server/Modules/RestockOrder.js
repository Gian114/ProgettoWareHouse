'use strict'

class RestockOrder {

    constructor(db) {
        this.db = db;
    }

    getAllRestockOrder() {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM RESTOCK_ORDER';
            this.db.all(sql, [], (err, rows) => {
                if (err) {
                    reject(err);
                    return;
                }
                
                const restock_order = rows.map((r) => (
                
                    {  
                        id: r.id,
                        issue_date : r.issue_date,
                        state : r.state,
                           //products
                        supplier_id : r.supplier_id,
                        transportNote: { deliveryDate: r.TNdelivery_date },
                           //sku_items
                    }
                ));
                resolve(restock_order);
            });
        });
    }

    getAllRestockOrderIssued() {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM RESTOCK_ORDER WHERE STATE = ISSUED';
            this.db.all(sql, [], (err, rows) => {
                if (err) {
                    reject(err);
                    return;
                }
                
                const restock_order = rows.map((r) => (
                
                    {  
                        id: r.id,
                        issue_date : r.issue_date,
                        state : r.state,
                           //products
                        supplier_id : r.supplier_id,
                        transportNote: { deliveryDate: r.TNdelivery_date },
                           //sku_items
                    }
                ));
                resolve(restock_order);
            });
        });

    }

    getRestockOrderByID(id) {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM RESTOCK_ORDER WHERE ID = ?';
            this.db.get(sql, [id], (err, r) => {
                if (err) {
                    reject(err);
                    return;
                }

                if(r !== undefined) {
                    const restock_order =
                    {  
                        id: r.id,
                        issue_date : r.issue_date,
                        state : r.state,
                        //products
                        supplier_id : r.supplier_id,
                        transportNote: { deliveryDate: r.TNdelivery_date },
                        //sku_items
                    };
                    resolve(restock_order);
                } else {
                    resolve('');
                }
                
            });
        });

    }

    getItemsByID(rid){
        

    }

    ////////////////////////

    //state = ISSUE and empty List of skuitems
    createNewRestockOrder(data) {
        return new Promise((resolve, reject) => {
            const sql = 'INSERT INTO RESTOCK_ORDER(issue_date, state, supplier_id) VALUES(?, ISSUED, ?)';
            this.db.run(sql, [data.issueDate, data.supplierId], (err) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(this.lastID);
            });
        });
    }


   
}

module.exports = RestockOrder;