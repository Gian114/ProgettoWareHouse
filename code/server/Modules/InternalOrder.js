'use strict'

class InternalOrder {

    constructor(db) {
        this.db = db;
    }

    getInternalOrders() {
        return new Promise((resolve, reject) => {

            const sql = `
                SELECT 
                    IO.id AS io_id,
                    IO.issue_date AS issue_date,
                    IO.state AS state,
                    IO.customer_id AS customer_id,
                    P.id AS p_id,
                    P.sku_id AS sku_id,
                    P.price AS price,
                    P.description AS description,
                    P.quantity AS quantity
                FROM INTERNAL_ORDER IO, PRODUCT P
                WHERE IO.id = P.internal_order_id;
                `;

            this.db.all(sql, [], (err, rows) => {

                if (err) {
                    reject(err);
                    return;
                }

                const internal_orders_dict = rows.map(row => ({
                        id: row.io_id,
                        issueDate: row.issue_date, // maybe convert to date?
                        state: row.state,
                        customerId: row.customer_id,
                        product: {
                            SKUid: row.sku_id,
                            description: row.description,
                            price: row.price,
                            quantity: row.quantity
                        }
                    })).reduce(function (ios, obj) {
                        ios[obj.id] = 
                            ios[obj.id] || 
                            {
                                id: obj.id,
                                issueDate: obj.issueDate,
                                state: obj.state,
                                products: [],
                                customerId:obj.customerId
                            };
                        ios[obj.id].products.push(obj.product);
                        return ios
                    }, {}
                );

                resolve(Object.values(internal_orders_dict));
            });
        });
    }

    getInternalOrdersByState(state) {
        return new Promise((resolve, reject) => {

            const sql = `
                SELECT 
                    IO.id AS io_id,
                    IO.issue_date AS issue_date,
                    IO.state AS state,
                    IO.customer_id AS customer_id,
                    P.id AS p_id,
                    P.sku_id AS sku_id,
                    P.price AS price,
                    P.description AS description,
                    P.quantity AS quantity
                FROM INTERNAL_ORDER IO, PRODUCT P
                WHERE IO.id = P.internal_order_id
                AND IO.state = ?;
                `;

            this.db.all(sql, [state], (err, rows) => {

                if (err) {
                    reject(err);
                    return;
                }

                const internal_orders_dict = rows.map(row => ({
                        id: row.io_id,
                        issueDate: row.issue_date, // maybe convert to date?
                        state: row.state,
                        customerId: row.customer_id,
                        product: {
                            SKUid: row.sku_id,
                            description: row.description,
                            price: row.price,
                            quantity: row.quantity
                        }
                    })).reduce(function (ios, obj) {
                        ios[obj.id] = 
                            ios[obj.id] || 
                            {
                                id: obj.id,
                                issueDate: obj.issueDate,
                                state: obj.state,
                                products: [],
                                customerId:obj.customerId
                            };
                        ios[obj.id].products.push(obj.product);
                        return ios
                    }, {}
                );

                resolve(Object.values(internal_orders_dict));
            });
        });
    }

    getInternalOrderById(id) {
        return new Promise((resolve, reject) => {

            const sql = `
                SELECT 
                    IO.id AS io_id,
                    IO.issue_date AS issue_date,
                    IO.state AS state,
                    IO.customer_id AS customer_id,
                    P.id AS p_id,
                    P.sku_id AS sku_id,
                    P.price AS price,
                    P.description AS description,
                    P.quantity AS quantity
                FROM INTERNAL_ORDER IO, PRODUCT P
                WHERE IO.id = P.internal_order_id
                AND IO.id = ?;
                `;

            this.db.all(sql, [id], (err, rows) => {

                if (err) {
                    reject(err);
                    return;
                }

                const internal_orders = rows.map(row => ({
                        id: row.io_id,
                        issueDate: row.issue_date, // maybe convert to date?
                        state: row.state,
                        customerId: row.customer_id,
                        product: {
                            SKUid: row.sku_id,
                            description: row.description,
                            price: row.price,
                            quantity: row.quantity
                        }
                    })).reduce(function (io, obj) {
                        io = (Object.keys(io).length !== 0 ? io : 
                            {
                                id: obj.id,
                                issueDate: obj.issueDate,
                                state: obj.state,
                                products: [],
                                customerId:obj.customerId
                            });
                        io.products.push(obj.product);
                        return io
                    }, {}
                );

                resolve(internal_orders);
            });
        });
    }

    async createInternalOrder(issue_date, state, customer_id) {
        await this.insertInternalOrder(issue_date, state, customer_id);
        return this.getLastInsertId();
    }

    // helpers (private functions)
    insertInternalOrder(issue_date, state, customer_id) {
        return new Promise((resolve, reject) => {

            const sql = `
                INSERT INTO INTERNAL_ORDER (issue_date, state, customer_id)
            VALUES (?, ?, ?);`;

            this.db.run(sql, [issue_date, state, customer_id], (err) => {

                if (err) {
                    reject(err);
                    return;
                }

                resolve();
            });
        });
    }

    getLastInsertId() {
        return new Promise((resolve, reject) => {

            const sql = `
                SELECT last_insert_rowid()`;

            this.db.get(sql, [], (err, row) => {

                if (err) {
                    reject(err);
                    return;
                }

                resolve(row['last_insert_rowid()']);
            });
        });
    }

    // modifyTestResult(rfid, id, new_date, new_result, new_id_td) {
    //     return new Promise((resolve, reject) => {

    //         const sql = `
    //             UPDATE TEST_RESULT
    //             SET
    //                 date = ?, 
    //                 result = ?,
    //                 test_descriptor_id = ?
    //             WHERE id = ? AND sku_item_rfid = ?`;

    //         this.db.run(sql, [new_date, new_result ? 1 : 0, new_id_td, id, rfid], (err) => {

    //             if (err) {
    //                 reject(err);
    //                 return;
    //             }

    //             resolve('');
    //         });
    //     });
    // }

    // removeTestResult(rfid, id) {
    //     return new Promise((resolve, reject) => {

    //         const sql = `
    //             DELETE FROM TEST_RESULT
    //             WHERE id = ? AND sku_item_rfid = ?`;

    //         this.db.run(sql, [id, rfid], (err) => {

    //             if (err) {
    //                 reject(err);
    //                 return;
    //             }

    //             resolve('');
    //         });
    //     });
    // }
}

module.exports = InternalOrder;