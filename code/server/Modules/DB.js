'use strict';

class DB {

    sqlite = require('sqlite3');

    constructor(dbname) {
        this.db = new this.sqlite.Database(dbname, (err) => {
            if(err) throw err;
        });
        
    }

    dropTables() {
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

    newTableSKU() {
        return new Promise((resolve, reject)  => {
            const sql = 'CREATE TABLE IF NOT EXISTS SKU (id INTEGER PRIMARY KEY AUTOINCREMENT, description VARCHAR, weight DOUBLE, volume DOUBLE, notes TEXT, position_id INTEGER, available_quantity INTEGER, price DOUBLE)';
            this.db.run(sql, (err) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(this.lastID);
            });
        });
    }

    newTableSKUItem() {
        return new Promise((resolve, reject)  => {
            const sql = 'CREATE TABLE IF NOT EXISTS SKU_ITEM (rfid TEXT PRIMARY KEY, available INTEGER, sku_id INTEGER, date_of_stock DATE)';
            this.db.run(sql, (err) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(this.lastID);
            });
        });
    }

    newTableTestDescriptor() {
        return new Promise((resolve, reject)  => {
            const sql = 'CREATE TABLE IF NOT EXISTS TEST_DESCRIPTOR (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, procedureDescription TEXT, sku_id INTEGER)';
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


const db = new DB('EZWH');

module.exports = db;