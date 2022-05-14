'use strict';


class SKU{

    constructor(db) {
        this.db = db;
    }

 


    createSKU(data) {
        return new Promise((resolve, reject) => {
            const sql = 'INSERT INTO SKU(DESCRIPTION, WEIGHT, VOLUME, NOTES, AVAILABLE_QUANTITY, PRICE) VALUES(?, ?, ?, ?, ?, ?)';
            this.db.run(sql, [data.description, data.weight, data.volume, data.notes, data.availableQuantity, data.price], (err) => {
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
                
                if(rows !== undefined){
                const sku = rows.map((r) => (
                
                    {  
                        id:r.id,
                        description : r.description,
                        weight : r.weight,
                        volume : r.volume,
                        notes : r.notes,
                        position: r.position,
                        quantity: r.availableQuantity, 
                        price: r.price,
                        //descriptors: r.TESTDESCRIPTORS
                    }
                ));
                resolve(sku);
            } else {
                const sku = ""
                resolve(sku)
            }
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
                        id: r.id,
                        description : r.description,
                        weight : r.weight,
                        volume : r.volume,
                        notes : r.notes,
                        position: r.position,
                        quantity: r.available_quantity, 
                        price: r.price,
                    }
                    resolve(sku)
                } else {
                        const sku = ''
                        resolve(sku)
                    }
                    
            });
        });
    }

    modifySKU(id, data){
        return new Promise((resolve, reject)=>{
            //gestire old values e position
        const sql = 'UPDATE SKU SET DESCRIPTION = ?, WEIGHT = ?, VOLUME = ?, NOTES = ?, AVAILABLE_QUANTITY = ?, PRICE = ? WHERE ID = ?'
        this.db.run(sql, [data.newDescription, data.newWeight, data.newVolume, data.newNotes,data.newAvailableQuantity, data.newPrice, id], (err, r)=>{
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

    modifyPosition(id, position){

        return new Promise((resolve, reject)=>{
            
        const sql = 'UPDATE SKU SET POSITION = ? WHERE ID = ?'
        this.db.run(sql, [position, id], (err, r)=>{
            if (err) {
                reject(err);
                return;
            }
            resolve(true)
        })

        })

    }
}

module.exports = SKU;