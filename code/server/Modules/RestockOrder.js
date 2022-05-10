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
                        products : r.product_id, //dovresti prendere tutti i prodotti
                        supplier_id : r.supplier_id,
                        delivery_date: r.delivery_date, //not 
                        sku_items: r.sku_item_rfid, //dovresti prendere tutti gli skuitems
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
                        products : r.product_id, //dovresti prendere tutti i prodotti
                        supplier_id : r.supplier_id,
                        delivery_date: r.delivery_date, //not 
                        sku_items: r.sku_item_rfid, //dovresti prendere tutti gli skuitems
                    }
                ));
                resolve(restock_order);
            });
        });

    }

    getAllRestockOrderByID(rid) {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM RESTOCK_ORDER WHERE ID = ?';
            this.db.all(sql, [rid], (err, rows) => {
                if (err) {
                    reject(err);
                    return;
                }
                
                const restock_order = rows.map((r) => (
                
                    {  
                        id: r.id,
                        issue_date : r.issue_date,
                        state : r.state,
                        products : r.product_id, //dovresti prendere tutti i prodotti
                        supplier_id : r.supplier_id,
                        delivery_date: r.delivery_date, //not 
                        sku_items: r.sku_item_rfid, //dovresti prendere tutti gli skuitems
                    }
                ));
                resolve(restock_order);
            });
        });

    }
/*
    getItemsByID(rid){
        

    }
*/
}

module.exports = RestockOrder;