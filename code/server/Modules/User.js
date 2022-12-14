
class User {

    constructor(db) {
        this.db = db;
    }


    createUser(data) {
        return new Promise((resolve, reject) => {
            const sql = 'INSERT INTO USER(username, name, surname, type, password) VALUES(?, ?, ?, ?, ?)';
            this.db.run(sql, [data.username, data.name, data.surname, data.type, data.password], (err) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(true);
            });
        });
    }

    getUser(data) {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM USER WHERE username = ? AND type = ?';
            this.db.get(sql, [data.username, data.type], (err, r) => {
                if (err) {
                    reject(err);
                    return;
                }
                if (r !== undefined) {
                    const user =
                    {
                        id: r.id,
                        email: r.username,
                        name: r.name,
                        surname: r.surname,
                        type: r.type
                    }

                    resolve(user);
                } else {
                    const user = ''
                    resolve(user)
                }
            });
        });
    }


    getSuppliers() {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM USER WHERE type = "supplier"';
            this.db.all(sql, [], (err, rows) => {
                if (err) {
                    reject(err);
                    return;
                }

                const user = rows.map((r) => (

                    {
                        id: r.id,
                        email: r.username,
                        name: r.name,
                        surname: r.surname,
                        type: r.type
                    }
                ));
                resolve(user);

            });
        });
    }

    getSupplierById(id) {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM USER WHERE type = "supplier" AND id = ?';
            this.db.get(sql, [id], (err, r) => {
                if (err) {
                    reject(err);
                    return;
                }

                if (r !== undefined) {
                    const user =
                    {
                        id: r.id,
                        email: r.username,
                        name: r.name,
                        surname: r.surname,
                        type: r.type
                    };
                    resolve(user);
                } else {
                    const user = '';
                    resolve(user);
                }
            });
        });
    }

    login(data, type) {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM USER WHERE username = ? AND password = ? AND type = ?';
            this.db.get(sql, [data.username, data.password, type], (err, row) => {
                if (err) {
                    reject(err);
                    return;
                }

                if (row !== undefined) {
                    //only one row if everything works correctly
                    const user =
                    {
                        id: row.id,
                        username: row.username,
                        name: row.name
                    }
                    resolve(user);
                } else {

                    resolve(false)
                }
            });
        });
    }

    modifyUserType(data, username) {
        return new Promise((resolve, reject) => {
            //gestire old values e position
            const sql = 'UPDATE USER SET type = ? WHERE username = ? and type = ?'
            this.db.run(sql, [data.newType, username, data.oldType], (err) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(true)
            })

        })
    }

    deleteUser(data) {
        return new Promise((resolve, reject) => {
            const sql = 'DELETE FROM USER WHERE username = ? AND type = ?';
            this.db.run(sql, [data.username, data.type], (err) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(true)

            });
        });
    }


    getUsers() {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM USER WHERE type != ?';
            this.db.all(sql, ['manager'], (err, rows) => {
                if (err) {
                    reject(err);
                    return;
                }

                const user = rows.map((r) => (

                    {
                        id: r.id,
                        email: r.username,
                        name: r.name,
                        surname: r.surname,
                        type: r.type
                    }
                ));
                resolve(user);

            });
        });
    }



}

module.exports = User;