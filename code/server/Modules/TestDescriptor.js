'use strict';

class TestDescriptor {

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
                
                resolve(true);
            });
        });
    }

    getAllTestDescriptors() {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM TEST_DESCRIPTOR';
            this.db.all(sql, [], (err, rows) => {
                if (err) {
                  reject(err);
                  return;
                }

                const tds = rows.map((r) => (
                    {  
                        id: r.id,
                        name : r.name,
                        procedureDescription : r.procedure_description,
                        idSKU : r.sku_id,
                    }
                ));
                resolve(tds);
            });
        });
    }

    getTestDescriptorById(id) {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM TEST_DESCRIPTOR WHERE id = ?';
            this.db.get(sql, [id], (err, row) => {
                if (err) {
                    reject(err);
                    return;
                }

                if(row !== undefined){
                    const td =  
                    {  
                        id: row.id,
                        name : row.name,
                        procedureDescription : row.procedure_description,
                        idSKU : row.sku_id
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
            const sql = 'UPDATE TEST_DESCRIPTOR SET name = ?, procedure_description = ?, sku_id = ? WHERE ID = ?';
            this.db.run(sql, [data.newName, data.newProcedureDescription, data.newIdSKU, id], (err) => {
                if (err) {
                    reject(err);
                    return;
                }

                resolve(true);
            });
        });
    }

    deleteTestDescriptor(id) {
        return new Promise((resolve, reject) => {
            const sql = 'DELETE FROM TEST_DESCRIPTOR WHERE id = ?';
            this.db.run(sql, [id], (err) => {
                if (err) {
                    reject(err);
                    return;
                }
               
                resolve(true);
            });
        });
    }

}

module.exports = TestDescriptor;