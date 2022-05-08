'use strict';

class SKU{

    constructor(db) {
        this.db = db;
    }

    createNewTestDescriptor(data) {
        return new Promise((resolve, reject) => {
            const sql = 'INSERT INTO TEST_DESCRIPTOR(name, procedure_description, sku_id) VALUES(?, ?, ?)';
            this.db.run(sql, [data.name, data.procedureDescription, data.idSKU], (err) => {
                if (err) {
                  reject(err);
                  return;
                }
                
                resolve(this.lastID);
            });
        });
    }

    getAllTestDescriptors() {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM TEST_DESCRIPTOR';
            this.db.all(sql, [data.name, data.procedureDescription, data.idSKU], (err) => {
                if (err) {
                  reject(err);
                  return;
                }

                const tds = rows.map((r) => (
                
                    {  
                        id:r.id,
                        name : r.name,
                        procedureDescription : r.procedureDescription,
                        idSKU : r.sku_id,
                    }
                ));
                resolve(tds);
            });
        });
    }

    getTestDescriptorByID(id) {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM TEST_DESCRIPTOR WHERE id = ?';
            this.db.get(sql, id, (err, r) => {
                if (err) {
                    reject(err);
                    return;
                }

                if(r!==undefined){
                    const td =  
                    {  
                        id: r.id,
                        name : r.name,
                        procedureDescription : r.procedureDescription,
                        idSKU : r.sku_id
                    };
                    resolve(td);
                } else {
                        const td = '';
                        resolve(td);
                    }
            });
        });
    }

    modifyTestDescriptor(id, data) {
        return new Promise((resolve, reject)=>{
            const sql = 'UPDATE TEST_DESCRIPTOR SET name = ?, procedureDescription = ? WHERE ID = ?';
            this.db.run(sql, [data.newName, data.newProcedureDescription, data.newIdSKU, id], (err, r)=>{
                if (err) {
                    reject(err);
                    return;
                }

                resolve(true);
            });
        });
    }

    deleteTestDescriptor(id, newvalues) {
        return new Promise((resolve, reject) => {
            const sql = 'DELETE FROM TEST_DESCRIPTOR WHERE id = ?';
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