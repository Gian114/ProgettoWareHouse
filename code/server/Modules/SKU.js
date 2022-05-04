'use strict';


class SKU{
    sqlite = require('sqlite3');

    constructor(dbname) {
        this.db = new this.sqlite.Database(dbname, (err) => {
            if(err) throw err;
        });
        
    }

    dropTable() {
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
    }

    newTableSKU() {
        return new Promise((resolve, reject)  => {
            const sql = 'CREATE TABLE IF NOT EXISTS SKU(ID INTEGER PRIMARY KEY AUTOINCREMENT, DESCRIPTION VARCHAR, WEIGHT DOUBLE, VOLUME DOUBLE, NOTES TEXT, POSITION INTEGER, AVAILABLE_QUANTITY INTEGER, PRICE DOUBLE)';
            this.db.run(sql, (err) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(this.lastID);
            });
        });
    }

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


    getSKUItems() {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM SKU';
            this.db.all(sql, [], (err, rows) => {
                if (err) {
                    reject(err);
                    return;
                }
                
                const names = rows.map((r) => (
                    //a
                    {  
                        id:r.ID,
                        description : r.DESCRIPTION,
                        weight : r.WEIGHT,
                        volume : r.VOLUME,
                        notes : r.NOTES,
                        position: r.POSITION,
                        quantity: r.AVAILABLE_QUANTITY, 
                        price: r.PRICE,
                        descriptors: r.TESTDESCRIPTORS
                    }
                ));
                resolve(names);
            });
        });
    }
 // fix testdescriptor thing

    getSKUByID(id) {
        
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM SKU WHERE ID = ?';
            this.db.get(sql, id, (err, r) => {
                
                if (err) {
                    reject(err);
                    return;
                }
        
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
                    
                resolve(sku);
            });
        });
    }

    modifySKU(data){
        return new Promise((resolve, reject)=>{
            //gestire old values e position
        const sql = 'UPDATE SKU SET DESCRIPTION = ?, WEIGHT = ?, VOLUME = ?, NOTES = ?, AVAILABLE_QUANTITY = ?, PRICE = ? WHERE ID = ?'
        this.db.run(sql, [data.description, data.weight, data.volume, data.notes, data.position, data.quantity, data.price, data.testdescriptors, data.id], (err, r)=>{
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