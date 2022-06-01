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
                resolve(true);
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
                        id:r.id,
                        description : r.description,
                        weight : r.weight,
                        volume : r.volume,
                        notes : r.notes,
                        position: r.position_id,
                        availableQuantity: r.available_quantity, 
                        price: r.price,
                        //descriptors: r.TESTDESCRIPTORS
                    }
                ));
                resolve(sku);
            
            });
        });
    }


    getSKUByID(id) {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM SKU WHERE id = ?';
            this.db.get(sql, [id], (err, row) => {
                
                if (err) {
                    reject(err);
                    return;
                }
                if(row !== undefined){
                    const sku =  
                    {  
                        id: row.id,
                        description : row.description,
                        weight : row.weight,
                        volume : row.volume,
                        notes : row.notes,
                        position: row.position_id,
                        availableQuantity: row.available_quantity, 
                        price: row.price,
                    };
                    resolve(sku);
                } else {
                    const sku = '';
                    resolve(sku);
                }
                    
            });
        });
    }

    modifySKU(id, data){
        return new Promise((resolve, reject)=>{
            //gestire old values e position
        const sql = 'UPDATE SKU SET DESCRIPTION = ?, WEIGHT = ?, VOLUME = ?, NOTES = ?, AVAILABLE_QUANTITY = ?, PRICE = ? WHERE ID = ?'
        this.db.run(sql, [data.newDescription, data.newWeight, data.newVolume, data.newNotes,data.newAvailableQuantity, data.newPrice, id], (err)=>{
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
            const sql = 'DELETE FROM SKU WHERE id = ?';
            this.db.run(sql, [id], (err) => {
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
            
        const sql = 'UPDATE SKU SET position_id = ? WHERE id = ?'
        this.db.run(sql, [position, id], (err)=>{
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