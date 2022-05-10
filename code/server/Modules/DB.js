'use strict';

class DB {

    sqlite = require('sqlite3');

    constructor(dbname) {
        this.db = new this.sqlite.Database(dbname, (err) => {
            if(err) throw err;
        });
        
    }

    async startDB() {
        await this.dropTables();
        await this.createTables();
    }

    async createTables() {
        await this.createTablePosition(); //referenced by SKU so it's the first I have to create
        await this.createTableSKU();
        await this.createTableSKUItem();
        await this.createTableTestDescriptor();
        await this.createTableTestResult();
        await this.createTableReturnOrder();
        await this.createTableProduct();
    }

    async dropTables() {
        await this.dropTableSKU();
        await this.dropTableSKUItem();
        await this.dropTablePosition();
        await this.dropTableTestDescriptor();
        await this.dropTableTestResult();
        await this.dropTableReturnOrder();
        await this.dropTableProduct();
    }

    createTableSKU() {
        return new Promise((resolve, reject)  => {
            const sql = 'CREATE TABLE IF NOT EXISTS SKU (id INTEGER PRIMARY KEY AUTOINCREMENT, description TEXT, weight REAL, volume REAL, price REAL, notes TEXT, available_quantity INTEGER, position_id INTEGER NOT NULL, FOREIGN KEY(position_id) REFERENCES POSITION(id))'; 
            this.db.run(sql, (err) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(this.lastID);
            });
        });
    }

    createTableSKUItem() {
        return new Promise((resolve, reject)  => {
            const sql = 'CREATE TABLE IF NOT EXISTS SKU_ITEM (rfid TEXT PRIMARY KEY, available INTEGER, sku_id INTEGER NOT NULL, date_of_stock DATE, FOREIGN KEY(sku_id) REFERENCES SKU(id))'; 
            this.db.run(sql, (err) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(this.lastID);
            });
        });
    }

    createTablePosition() {
        return new Promise((resolve, reject)  => {
            const sql = 'CREATE TABLE IF NOT EXISTS POSITION (id INTEGER PRIMARY KEY AUTOINCREMENT, aisle INTEGER NOT NULL, row INTEGER, col INTEGER, max_weight REAL, max_volume REAL, occupied_weight REAL, occupied_volume REAL)';
            this.db.run(sql, (err) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(this.lastID);
            });
        });
    }

    createTableTestDescriptor() {
        return new Promise((resolve, reject)  => {
            const sql = 'CREATE TABLE IF NOT EXISTS TEST_DESCRIPTOR (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, procedure_description TEXT, sku_id INTEGER NOT NULL, FOREIGN KEY(sku_id) REFERENCES SKU(id))'; 
            this.db.run(sql, (err) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(this.lastID);
            });
        });
    }

    createTableTestResult() {
        return new Promise((resolve, reject)  => {
            const sql = 'CREATE TABLE IF NOT EXISTS TEST_RESULT (id INTEGER PRIMARY KEY AUTOINCREMENT, date TEXT, result INTEGER,  sku_item_rfid TEXT NOT NULL, test_descriptor_id INTEGER NOT NULL, FOREIGN KEY(test_descriptor_id) REFERENCES TEST_DESCRIPTOR(id), FOREIGN KEY (sku_item_rfid) REFERENCES SKU_ITEM(rfid))';
            this.db.run(sql, (err) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(this.lastID);
            });
        });
    }

    createTableReturnOrder() {
        return new Promise((resolve, reject)  => {
            const sql = 'CREATE TABLE IF NOT EXISTS RETURN_ORDER (id INTEGER PRIMARY KEY AUTOINCREMENT, returnDate TEXT, sku_item_rfid TEXT NOT NULL, restock_order_id INTEGER NOT NULL, FOREIGN KEY(restock_order_id) REFERENCES RESTOCK_ORDER(id), FOREIGN KEY(sku_item_rfid) REFERENCES SKU_ITEM(rfid))'; 
            this.db.run(sql, (err) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(this.lastID);
            });
        });
    }

    createTableProduct() {
        return new Promise((resolve, reject)  => {
            const sql = 'CREATE TABLE IF NOT EXISTS PRODUCT (id INTEGER PRIMARY KEY AUTOINCREMENT, sku_id INTEGER NOT NULL, description TEXT, price REAL, quantity INTEGER, FOREIGN KEY(sku_id) REFERENCES SKU(id))'; 
            this.db.run(sql, (err) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(this.lastID);
            });
        });
    }


    dropTableSKU() {
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

    dropTableSKUItem() {
        return new Promise((resolve, reject)  => {
            const sql = 'DROP TABLE IF EXISTS SKU_ITEM';
            this.db.run(sql, (err) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(this.lastID);
            });
        });
    }

    dropTablePosition() {
        return new Promise((resolve, reject)  => {
            const sql = 'DROP TABLE IF EXISTS POSITION';
            this.db.run(sql, (err) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(this.lastID);
            });
        });
    }

    dropTableTestDescriptor() {
        return new Promise((resolve, reject)  => {
            const sql = 'DROP TABLE IF EXISTS TEST_DESCRIPTOR';
            this.db.run(sql, (err) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(this.lastID);
            });
        });
    }

    dropTableTestResult() {
        return new Promise((resolve, reject)  => {
            const sql = 'DROP TABLE IF EXISTS TEST_RESULT';
            this.db.run(sql, (err) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(this.lastID);
            });
        });
    }

    dropTableReturnOrder() {
        return new Promise((resolve, reject)  => {
            const sql = 'DROP TABLE IF EXISTS RETURN_ORDER';
            this.db.run(sql, (err) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(this.lastID);
            });
        });
    }

    dropTableProduct() {
        return new Promise((resolve, reject)  => {
            const sql = 'DROP TABLE IF EXISTS PRODUCT';
            this.db.run(sql, (err) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(this.lastID);
            });
        });
    }

}


const db = new DB('EZWH.sqlite');

module.exports = db;