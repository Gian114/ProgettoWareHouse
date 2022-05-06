'use strict';


class SKU{
    //sqlite = require('sqlite3');

    constructor(db) {
        this.db = db;
    }

    /*dropTable() {
        return new Promise((resolve, reject)  => {
            const sql = 'DROP TABLE IF EXISTS SKU';
            this.db.run(sql, (err) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(this.lastID);
            });
        });
    }*/


    createSKU(data) {
        return new Promise((resolve, reject) => {
            const sql = 'INSERT INTO SKU(DESCRIPTION, WEIGHT, VOLUME, NOTES, POSITION, AVAILABLE_QUANTITY, PRICE) VALUES(?, ?, ?, ?, ?, ?, ?)';
            this.db.run(sql, [data.description, data.weight, data.volume, data.notes, data.position, data.quantity, data.price], (err) => {
                if (err) {
                  reject(err);
                  return;
                }
                resolve(this.lastID);
            });
        });
    }


    getListofSKU() {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM SKU';
            this.db.all(sql, [], (err, rows) => {
                if (err) {
                    reject(err);
                    return;
                }
                
                const sku = rows.map((r) => (
                
                    {  
                        id:r.ID,
                        description : r.DESCRIPTION,
                        weight : r.WEIGHT,
                        volume : r.VOLUME,
                        notes : r.NOTES,
                        position: r.POSITION,
                        quantity: r.AVAILABLE_QUANTITY, 
                        price: r.PRICE,
                        //descriptors: r.TESTDESCRIPTORS
                    }
                ));
                resolve(sku);
            });
        });
    }


    getSKUByID(id) {
        
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM SKU WHERE ID = ?';
            this.db.get(sql, id, (err, r) => {
                
                if (err) {
                    reject(err);
                    return;
                }
                if(r!==undefined){
                    const sku =  
                    {  
                        id: r.ID,
                        description : r.DESCRIPTION,
                        weight : r.WEIGHT,
                        volume : r.VOLUME,
                        notes : r.NOTES,
                        position: r.POSITION,
                        quantity: r.AVAILABLE_QUANTITY, 
                        price: r.PRICE,
                    }
                    resolve(sku)
                } else {
                        const sku = ''
                        resolve(sku)
                    }
                    
            });
        });
    }

    modifySKU(data){
        return new Promise((resolve, reject)=>{
            //gestire old values e position
        const sql = 'UPDATE SKU SET DESCRIPTION = ?, WEIGHT = ?, VOLUME = ?, NOTES = ?, AVAILABLE_QUANTITY = ?, PRICE = ? WHERE ID = ?'
        this.db.run(sql, [data.description, data.weight, data.volume, data.notes, data.position, data.quantity, data.price, data.id], (err, r)=>{
            if (err) {
                reject(err);
                return;
            }
            resolve(true)
        })

        })
    }

    deleteSKU(id) {
        return new Promise((resolve, reject) => {
            const sql = 'DELETE FROM SKU WHERE SKU.ID = ?';
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
module.exports = SKU;