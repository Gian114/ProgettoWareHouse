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

    //state = ISSUE and empty List of skuitems, non va
    createNewRestockOrder(data) {
        return new Promise((resolve, reject) => {
            const sql = 'INSERT INTO RESTOCK_ORDER(issue_date, state, supplier_id) VALUES(?, "ISSUED", ?)';
            this.db.run(sql, [data.issueDate, data.supplierId], (err) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(this.lastID);
            });
        });
    }


    modifyState(id,newState){
        return new Promise((resolve, reject)=>{
            const sql = 'UPDATE RESTOCK_ORDER SET state = ? WHERE id = ?'
            this.db.run(sql, [newState, id], (err, r)=>{
                if (err) {
                    reject(err);
                    return;
                }
                resolve(true);
            });
    
        });

    }

    addTNdate(id,TN){
        return new Promise((resolve, reject)=>{
            const sql = 'UPDATE RESTOCK_ORDER SET TNdelivery_date = ? WHERE id = ?'
            this.db.run(sql, [TN, id], (err, r)=>{
                if (err) {
                    reject(err);
                    return;
                }
                resolve(true);
            });
    
        });

    }


    deleteReturnOrder(id){
        return new Promise((resolve, reject) => {
            const sql = 'DELETE FROM RESTOCK_ORDER WHERE id = ?';
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

module.exports = RestockOrder;