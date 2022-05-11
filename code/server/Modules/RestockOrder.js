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
/*
    getItemsByID(rid){
        

    }
*/
}

module.exports = RestockOrder;