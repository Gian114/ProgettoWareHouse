'use strict'

const { skuItem } = require("../Routes/SKUItemRoutes");

class RestockOrder {

    constructor(db) {
        this.db = db;
    }

    getAllRestockOrder() {
        
    }


   //se sono issued non prendi SKUITEM, quindi come sopra ma con SKUITEM vuoto. Basterebbe solo una funzione?
    getAllRestockOrderIssued() {
        

    }

   
    //test non ok
    getRestockOrderByID(id) {
        
                
                
             
    }

    getItemsByID(rid){
        

    }

    
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