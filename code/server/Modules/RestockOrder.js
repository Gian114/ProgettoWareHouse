'use strict'

const { skuItem } = require("../Routes/SKUItemRoutes");

class RestockOrder {

    constructor(db) {
        this.db = db;
    }

    //no test
    getAllRestockOrder() {
        return new Promise((resolve, reject) => {

            //add skuItem join
            const sql = `
                SELECT 
                    RO.id AS ro_id,
                    RO.issue_date AS issue_date,
                    RO.state AS state,
                    RO.TNdelivery_date AS delivery_date,
                    RO.supplier_id AS supplier_id,
                    P.id AS p_id,
                    P.sku_id AS sku_id,
                    P.price AS price,
                    P.description AS description,
                    P.quantity AS quantity
                    
                FROM RESTOCK_ORDER RO, PRODUCT P
                WHERE RO.id = P.restock_order_id 
                `;

            this.db.all(sql, [], (err, rows) => {

                if (err) {
                    console.log(err);
                    reject(err);
                    return;
                }
                
                console.log(rows);

                const restock_orders_dict = rows.map(row => ({
                        id: row.ro_id,
                        issueDate: row.issue_date, 
                        state: row.state,
                        product: {
                            SKUid: row.sku_id,
                            description: row.description,
                            price: row.price,
                            quantity: row.quantity
                        },
                        supplierId: row.supplier_id,
                        transportNote: { deliveryDate: row.TNdelivery_date },
                       // skuItem: {
                        //    SKUid: row.sku_id,
                        //    rfid: row.rfid
                        //}
                    })).reduce(function (ros, obj) {
                        ros[obj.id] = 
                            ros[obj.id] || 
                            {
                                id: obj.id,
                                issueDate: obj.issueDate,
                                state: obj.state,
                                products: [],
                                supplierId:obj.supplierId,
                                transportNote: obj.transportNote,
                                //skuItems: []
                            };
                        ros[obj.id].products.push(obj.product);
                        //ros[obj.id].skuItem.push(obj.skuItem);
                        return ros
                    }, {}
                );

                //console.log(restock_orders_dict);

                resolve(Object.values(restock_orders_dict));
            });
        });
        
    }

    //test ok 
    getAllRestockOrderIssued() {
        return new Promise((resolve, reject) => {

            //add skuitem join 
            const sql = `
                SELECT 
                    RO.id AS ro_id,
                    RO.issue_date AS issue_date,
                    RO.state AS state,
                    RO.TNdelivery_date AS delivery_date,
                    RO.supplier_id AS supplier_id,
                    P.id AS p_id,
                    P.sku_id AS sku_id,
                    P.price AS price,
                    P.description AS description,
                    P.quantity AS quantity
                         
                FROM RESTOCK_ORDER RO, PRODUCT P
                WHERE RO.id = P.restock_order_id AND RO.state = ?;
                `;

            this.db.all(sql, ["ISSUED"], (err, rows) => {

                if (err) {
                    console.log(err);
                    reject(err);
                    return;
                }
                
                console.log(rows);

                const restock_orders_dict = rows.map(row => ({
                        id: row.ro_id,
                        issueDate: row.issue_date, 
                        state: row.state,
                        product: {
                            SKUid: row.sku_id,
                            description: row.description,
                            price: row.price,
                            quantity: row.quantity
                        },
                        supplierId: row.supplier_id,
                        transportNote: { deliveryDate: row.TNdelivery_date },  
                    })).reduce(function (ros, obj) {
                        ros[obj.id] = 
                            ros[obj.id] || 
                            {
                                id: obj.id,
                                issueDate: obj.issueDate,
                                state: obj.state,
                                products: [],
                                supplierId:obj.supplierId,
                                transportNote: obj.transportNote,
                                skuItems: []
                            };
                        ros[obj.id].products.push(obj.product);
                        return ros
                    }, {}
                );

                resolve(Object.values(restock_orders_dict));
            });
        });
        

    }

    //test non ok 
    getRestockOrderByID(id) {
        return new Promise((resolve, reject) => {

            const sql = `
                SELECT 
                    RO.id AS ro_id,
                    RO.issue_date AS issue_date,
                    RO.state AS state,
                    RO.TNdelivery_date AS delivery_date,
                    RO.supplier_id AS supplier_id,
                    P.id AS p_id,
                    P.sku_id AS sku_id,
                    P.price AS price,
                    P.description AS description,
                    P.quantity AS quantity
                    
                FROM RESTOCK_ORDER RO, PRODUCT P
                WHERE RO.id = P.restock_order_id AND RO.id = ?;
                `;

            this.db.all(sql, [id], (err, rows) => {

                if (err) {
                    console.log(err);
                    reject(err);
                    return;
                }
                
                console.log(rows);

                const restock_orders_dict = rows.map(row => ({
                        id: row.ro_id,
                        issueDate: row.issue_date, 
                        state: row.state,
                        product: {
                            SKUid: row.sku_id,
                            description: row.description,
                            price: row.price,
                            quantity: row.quantity
                        },
                        supplierId: row.supplier_id,
                        transportNote: { deliveryDate: row.TNdelivery_date },
                       // skuItem: {
                        //    SKUid: row.sku_id,
                        //    rfid: row.rfid
                        //}
                    })).reduce(function (ro, obj) {
                        ro = (Object.keys(ro).length !== 0 ? ro : 
                            {
                                issueDate: obj.issueDate,
                                state: obj.state,
                                products: [],
                                supplierId: obj.supplierId,
                                transportNote: obj.transportNote,
                                 //skuItems: []
                            });
                        ro.products.push(obj.product);
                        //ro.products.push(obj.skuItem)
                        return ro
                    }, {}
                );

                resolve(Object.values(restock_orders_dict));
            });
        });
                        
    }

    //change something
    getItemsByID(rid){
        return new Promise((resolve, reject) => {
            const sql = 'INSERT INTO RESTOCK_ORDER(issue_date, state, supplier_id) VALUES(?, "ISSUED", ?)';
            this.db.run(sql, [rid], (err) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(this.lastID);
            });
        });
    }

    //test ok 
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


    //test ok 
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

    //test ok 
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