'use strict'

class TestResult {

    constructor(db) {
        this.db = db;
    }


    getTestResultByRFID(rfid) {
        return new Promise((resolve, reject) => {

            const sql = `
                SELECT *
                FROM TEST_RESULT
                WHERE sku_item_rfid = ?`;

            this.db.all(sql, [rfid], (err, rows) => {

                if (err) {
                    reject(err);
                    return;
                }

                const test_results = rows.map(row => ({
                    id: row.id,
                    date: row.date, // maybe convert to date?
                    result: row.result == 1,
                    sku_item_rfid: row.sku_item_rfid,
                    test_descriptor_id: row.test_descriptor_id
                }));

                resolve(test_results);
            });
        });
    }

    getTestResultByRFIDAndId(rfid, id) {
        return new Promise((resolve, reject) => {

            const sql = `
                SELECT *
                FROM TEST_RESULT
                WHERE sku_item_rfid = ?
                AND id = ?`;

            this.db.get(sql, [rfid, id], (err, row) => {

                if (err) {
                    reject(err);
                    return;
                }
                let test_result;
                if (row!==undefined) {         
                    test_result = {
                        id: row.id,
                        date: row.date, // maybe convert to date?
                        result: row.result == 1,
                        sku_item_rfid: row.sku_item_rfid,
                        test_descriptor_id: row.test_descriptor_id
                    };
                }
                else {
                    test_result = ''
                }
                resolve(test_result);
            });
        });
    }

    createTestResult(rfid, id_test_descriptor, date, result) {
        return new Promise((resolve, reject) => {

            const sql = `
                INSERT INTO TEST_RESULT
                    (date, result, sku_item_rfid, test_descriptor_id)
                VALUES (?, ?, ?, ?)`;

            this.db.run(sql, [date, result ? 1 : 0, rfid, id_test_descriptor], (err) => {

                if (err) {
                    reject(err);
                    return;
                }

                resolve('');
            });
        });
    }
}

module.exports = TestResult;