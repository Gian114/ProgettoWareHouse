'use strict'

class TestResult {

    constructor(db) {
        this.db = db;
    }


    getTestResultsByRFID(rfid) {
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

    modifyTestResult(rfid, id, new_date, new_result, new_id_td) {
        return new Promise((resolve, reject) => {

            const sql = `
                UPDATE TEST_RESULT
                SET
                    date = ?, 
                    result = ?,
                    test_descriptor_id = ?
                WHERE id = ? AND sku_item_rfid = ?`;

            this.db.run(sql, [new_date, new_result ? 1 : 0, new_id_td, id, rfid], (err) => {

                if (err) {
                    reject(err);
                    return;
                }

                resolve('');
            });
        });
    }

    removeTestResult(rfid, id) {
        return new Promise((resolve, reject) => {

            const sql = `
                DELETE FROM TEST_RESULT
                WHERE id = ? AND sku_item_rfid = ?`;

            this.db.run(sql, [id, rfid], (err) => {

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