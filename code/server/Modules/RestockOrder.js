'use strict'

class RestockOrder {

    constructor(db) {
        this.db = db;
    }

    getAllRestockOrder() {
        return new Promise((resolve, reject) => {

            const sql = `
                SELECT 
                    RO.id AS io_id,
                    RO.issue_date AS issue_date,
                    RO.state AS state,
                    RO.supplier_id AS supplier_id
                    RO.delivery_date AS delivery_date,
                    P.id AS p_id,
                    P.sku_id AS sku_id,
                    P.price AS price,
                    P.description AS description,
                    P.quantity AS quantity
                    SI.rfid AS rfid
                    SI.sku_id AS sku_id
                FROM INTERNAL_ORDER IO, PRODUCT P, SKU_ITEM SI
                WHERE IO.id = P.restock_order_id AND IO.id = SI.restock_order_id
                `;

            this.db.all(sql, [], (err, rows) => {

                if (err) {
                    reject(err);
                    return;
                }

                const restock_orders = rows.map(row => ({
                        id: row.io_id,
                        issueDate: row.issue_date, 
                        state: row.state,
                        product: {
                            SKUid: row.sku_id,
                            description: row.description,
                            price: row.price,
                            quantity: row.quantity
                        },
                        supplier_id: row.supplier_id,
                        transportNote: { deliveryDate: r.TNdelivery_date },
                        skuItems: {
                            SKUid: row.sku_id,
                            rfid: row.rfid
                        }
                    }))
                ;

                resolve(Object.values(restock_orders));
            });
        });
    }

   
   //se sono issued non prendi SKUITEM, quindi come sopra ma con SKUITEM vuoto. Basterebbe solo una funzione. 
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

    //forse anche qui join 
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

    //empty List of skuitem, nothing to do? 
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



    //ricorda di fare la delete di tutto 
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