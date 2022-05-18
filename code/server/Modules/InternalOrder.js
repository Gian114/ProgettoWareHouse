'use strict'

class InternalOrder {

    constructor(db) {
        this.db = db;
    }

    getInternalOrders() {
        
    }

    async getInternalOrdersNotCompleted() {
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
                AND IO.state != COMPLETED;
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

    async getInternalOrdersCompleted() {
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
                    S.rfid AS rfid
                FROM INTERNAL_ORDER IO, PRODUCT P, SKU_ITEM S
                WHERE IO.id = P.internal_order_id
                AND S.internal_order_id = IO.id
                AND S.sku_id = P.sku_id
                AND IO.state = COMPLETED;
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
                            rfid: row.rfid
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

    // DOESN'T WORK WITH COMPLETED (NOT NEEDED FOR CURRENT APIS)
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

    getInternalOrderStateById(id) {
        return new Promise((resolve, reject) => {

            const sql = `
                SELECT 
                    state
                FROM INTERNAL_ORDER
                WHERE id = ?;
                `;

            this.db.get(sql, [id], (err, row) => {

                if (err) {
                    reject(err);
                    return;
                }
                let state = '';
                if (row !== undefined) {
                    state = row.state;
                }

                resolve(state);
            });
        });
    }

    getInternalOrderNotCompletedById(id) {
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

                const internal_order = rows.map(row => ({
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
                )[0];

                resolve(internal_order);
            });
        });
    }

    getInternalOrderCompletedById(id) {
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
                    S.rfid AS rfid
                FROM INTERNAL_ORDER IO, PRODUCT P, SKU_ITEM S
                WHERE IO.id = P.internal_order_id
                AND S.internal_order_id = IO.id
                AND S.sku_id = P.sku_id
                AND IO.id = ?;
                `;

            this.db.all(sql, [id], (err, rows) => {

                if (err) {
                    reject(err);
                    return;
                }

                const internal_order = rows.map(row => ({
                        id: row.io_id,
                        issueDate: row.issue_date, // maybe convert to date?
                        state: row.state,
                        customerId: row.customer_id,
                        product: {
                            SKUid: row.sku_id,
                            description: row.description,
                            price: row.price,
                            rfid: row.rfid
                        }
                    })).reduce(function (ios, obj) {
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
                    }
                )[0];

                resolve(internal_order);
            });
        });
    }

    async createInternalOrder(issue_date, state, customer_id) {
        await this.insertInternalOrder(issue_date, state, customer_id);
        return this.getLastInsertId();
    }

    modifyInternalOrderState(id, new_state) {
        return new Promise((resolve, reject) => {

            const sql = `
                UPDATE INTERNAL_ORDER 
                SET state = ?
                WHERE id = ?;
                `;

            this.db.run(sql, [new_state, id], (err) => {

                if (err) {
                    reject(err);
                    return;
                }
                resolve('');
            });
        });
    }

    deleteInternalOrderById(id) {
        return new Promise((resolve, reject) => {

            const sql = `
                DELETE FROM INTERNAL_ORDER 
                WHERE id = ?;
                `;

            this.db.run(sql, [id], (err) => {

                if (err) {
                    reject(err);
                    return;
                }
                resolve('');
            });
        });
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
}

module.exports = InternalOrder;