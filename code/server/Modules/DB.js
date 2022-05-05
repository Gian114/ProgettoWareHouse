'use strict';

class DB{

    sqlite = require('sqlite3');

    constructor(dbname) {
        this.db = new this.sqlite.Database(dbname, (err) => {
            if(err) throw err;
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

}

module.exports = DB;