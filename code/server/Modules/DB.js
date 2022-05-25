'use strict';

const sqlite = require('sqlite3');

class DB {

    constructor(dbname) {
        this.db = new sqlite.Database(dbname, (err) => {
            if (err) throw err;
        });
    }

    async startDB() {
        await this.dropTables();
        await this.createTables();
        await this.activateForeignKeyControl();
    }

    async createTables() { //the order is important, before referenced tables and after referencing tables
        await this.createTablePosition();
        await this.createTableSKU();
        await this.createTableTestDescriptor();
        await this.createTableUser();
        await this.createTableRestockOrder();
        await this.createTableReturnOrder();
        await this.createTableTestResult();
        await this.createTableInternalOrder();
        await this.createTableSKUItem();
        await this.createTableItem();
        await this.createTableProduct();
    }

    async dropTables() {
        await this.dropTableProduct();
        await this.dropTableItem();
        await this.dropTableInternalOrder();
        await this.dropTableTestResult();
        await this.dropTableSKUItem();
        await this.dropTableReturnOrder();
        await this.dropTableRestockOrder();
        await this.dropTableUser();
        await this.dropTableTestDescriptor();
        await this.dropTableSKU();
        await this.dropTablePosition();
    }

    activateForeignKeyControl() {
        return new Promise((resolve, reject) => {
            const sql = 'PRAGMA foreign_keys = ON';
            this.db.run(sql, (err) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(this.lastID);
            });
        });
    }

    getAutoincrementId(table) {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT seq FROM sqlite_sequence WHERE name = ?';
            this.db.get(sql, [table], (err, id) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(id.seq);
            });
        });
    }

    createTableSKU() {
        return new Promise((resolve, reject) => {
            const sql = 'CREATE TABLE IF NOT EXISTS SKU (id INTEGER PRIMARY KEY AUTOINCREMENT, description TEXT NOT NULL, weight REAL NOT NULL, volume REAL NOT NULL, price REAL NOT NULL, notes TEXT NOT NULL, available_quantity INTEGER NOT NULL, position_id TEXT DEFAULT NULL, FOREIGN KEY(position_id) REFERENCES POSITION(id))';
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
        return new Promise((resolve, reject) => {
            const sql = `
                CREATE TABLE IF NOT EXISTS SKU_ITEM (
                    rfid TEXT PRIMARY KEY,
                    available INTEGER NOT NULL, /* boolean */
                    sku_id INTEGER NOT NULL,
                    date_of_stock DATE NOT NULL,
                    product_id INTEGER DEFAULT NULL,
                    restock_order_id INTEGER DEFAULT NULL,
                    return_order_id INTEGER DEFAULT NULL,
                    internal_order_id INTEGER DEFAULT NULL,
                    FOREIGN KEY(sku_id) REFERENCES SKU(id),
                    CONSTRAINT fk_restock
                        FOREIGN KEY(restock_order_id) 
                        REFERENCES RESTOCK_ORDER(id)
                        ON DELETE SET NULL,
                    CONSTRAINT fk_internal
                        FOREIGN KEY(internal_order_id) 
                        REFERENCES INTERNAL_ORDER(id)
                        ON DELETE SET NULL,
                    CONSTRAINT fk_return
                        FOREIGN KEY(return_order_id)
                        REFERENCES RETURN_ORDER(id)
                        ON DELETE SET NULL
                )`;
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
        return new Promise((resolve, reject) => {
            const sql = 'CREATE TABLE IF NOT EXISTS POSITION (id TEXT PRIMARY KEY, aisle TEXT NOT NULL, row TEXT NOT NULL, col TEXT NOT NULL, max_weight REAL NOT NULL, max_volume REAL NOT NULL, occupied_weight REAL NOT NULL, occupied_volume REAL NOT NULL)';
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
        return new Promise((resolve, reject) => {
            const sql = 'CREATE TABLE IF NOT EXISTS TEST_DESCRIPTOR (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, procedure_description TEXT NOT NULL, sku_id INTEGER NOT NULL, FOREIGN KEY(sku_id) REFERENCES SKU(id))';
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
        return new Promise((resolve, reject) => {
            const sql = 'CREATE TABLE IF NOT EXISTS TEST_RESULT (id INTEGER PRIMARY KEY AUTOINCREMENT, date TEXT NOT NULL, result INTEGER NOT NULL, sku_item_rfid TEXT NOT NULL, test_descriptor_id INTEGER NOT NULL, FOREIGN KEY(sku_item_rfid) REFERENCES SKU_ITEM(rfid), FOREIGN KEY(test_descriptor_id) REFERENCES TEST_DESCRIPTOR(id))';
            this.db.run(sql, (err) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(this.lastID);
            });
        });
    }

    createTableUser() {
        return new Promise((resolve, reject)  => {
            const sql = 'CREATE TABLE IF NOT EXISTS USER (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT NOT NULL, name TEXT NOT NULL, surname TEXT NOT NULL, type TEXT NOT NULL, password TEXT NOT NULL)'; 
            this.db.run(sql, (err) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(this.lastID);
            });
        });
    }

    createTableRestockOrder() {
        return new Promise((resolve, reject) => {
            const sql = 'CREATE TABLE IF NOT EXISTS RESTOCK_ORDER (id INTEGER PRIMARY KEY AUTOINCREMENT, issue_date TEXT NOT NULL, state TEXT NOT NULL, supplier_id INTEGER NOT NULL, TNdelivery_date TEXT DEFAULT NULL, FOREIGN KEY(supplier_id) REFERENCES USER(id))';
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
        return new Promise((resolve, reject) => {
            const sql = 'CREATE TABLE IF NOT EXISTS RETURN_ORDER (id INTEGER PRIMARY KEY AUTOINCREMENT, return_date TEXT NOT NULL, restock_order_id INTEGER NOT NULL, FOREIGN KEY(restock_order_id) REFERENCES RESTOCK_ORDER(id))';
            this.db.run(sql, (err) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(this.lastID);
            });
        });
    }

    createTableInternalOrder() {
        return new Promise((resolve, reject) => {
            const sql = 'CREATE TABLE IF NOT EXISTS INTERNAL_ORDER (id INTEGER PRIMARY KEY AUTOINCREMENT, issue_date TEXT NOT NULL, state TEXT NOT NULL, customer_id INTEGER NOT NULL, FOREIGN KEY(customer_id) REFERENCES USER(id))';
            this.db.run(sql, (err) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(this.lastID);
            });
        });
    }

    createTableItem() {
        return new Promise((resolve, reject) => {
            const sql = 'CREATE TABLE IF NOT EXISTS ITEM (id INTEGER PRIMARY KEY, sku_id INTEGER NOT NULL, description TEXT NOT NULL, price REAL NOT NULL, supplier_id INTEGER NOT NULL, FOREIGN KEY(sku_id) REFERENCES SKU(id), FOREIGN KEY(supplier_id) REFERENCES USER(id))';
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
        return new Promise((resolve, reject) => {
            const sql = `
                CREATE TABLE IF NOT EXISTS PRODUCT (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    sku_id INTEGER NOT NULL,
                    description TEXT NOT NULL,
                    price REAL NOT NULL,
                    quantity INTEGER NOT NULL,
                    restock_order_id INTEGER DEFAULT NULL,
                    internal_order_id INTEGER DEFAULT NULL,
                    return_order_id INTEGER DEFAULT NULL,
                    FOREIGN KEY(sku_id) REFERENCES SKU(id),
                    CONSTRAINT fk_restock
                        FOREIGN KEY(restock_order_id) 
                        REFERENCES RESTOCK_ORDER(id)
                        ON DELETE SET NULL,
                    CONSTRAINT fk_internal
                        FOREIGN KEY(internal_order_id) 
                        REFERENCES INTERNAL_ORDER(id)
                        ON DELETE SET NULL,
                    CONSTRAINT fk_return
                        FOREIGN KEY(return_order_id)
                        REFERENCES RETURN_ORDER(id)
                        ON DELETE SET NULL
                )`;
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
        return new Promise((resolve, reject) => {
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
        return new Promise((resolve, reject) => {
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
        return new Promise((resolve, reject) => {
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
        return new Promise((resolve, reject) => {
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
        return new Promise((resolve, reject) => {
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

    dropTableUser() {
        return new Promise((resolve, reject) => {
            const sql = 'DROP TABLE IF EXISTS USER';
            this.db.run(sql, (err) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(this.lastID);
            });
        });
    }

    dropTableRestockOrder() {
        return new Promise((resolve, reject) => {
            const sql = 'DROP TABLE IF EXISTS RESTOCK_ORDER';
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
        return new Promise((resolve, reject) => {
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

    dropTableInternalOrder() {
        return new Promise((resolve, reject) => {
            const sql = 'DROP TABLE IF EXISTS INTERNAL_ORDER';
            this.db.run(sql, (err) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(this.lastID);
            });
        });
    }

    dropTableItem() {
        return new Promise((resolve, reject) => {
            const sql = 'DROP TABLE IF EXISTS ITEM';
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
        return new Promise((resolve, reject) => {
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

module.exports.db = db;
module.exports.DB = DB;