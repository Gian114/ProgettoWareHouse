
class User{

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

    getUser(data){
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM USER WHERE username = ? AND type = ?';
            this.db.get(sql, [data.username, data.type], (err, r) => {
                if (err) {
                    reject(err);
                    return;
                }
                if(r !== undefined){
                const user = 
                    {  
                        id: r.id,
                        username: r.username,
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


    getSuppliers(){
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM USER WHERE type = "supplier"';
            this.db.all(sql, [], (err, rows) => {
                if (err) {
                    reject(err);
                    return;
                }
                if(rows !== undefined){

                
                const user = rows.map((r) => (
                
                    {  
                        id : r.id,
                        username: r.username,
                        name: r.name,
                        surname: r.surname,
                        type: r.type
                    }
                ));
                resolve(user);
                } else {
                    const user = ''
                    resolve(user)
                }
            });
        });
    }

    login(data, type){
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM USER WHERE username = ? AND password = ? AND type = ?';
            this.db.get(sql, [data.username, data.password, type], (err, rows) => {
                if (err) {
                    reject(err);
                    return;
                }

                if(rows !== undefined){
                    //only one row if everything works correctly
                    resolve(rows);    
                } else {
                    
                    resolve(false)
                }
            });
        });
    }

    modifyUserType(data, username){
        return new Promise((resolve, reject)=>{
            //gestire old values e position
        const sql = 'UPDATE USER SET type = ? WHERE username = ? and type = ?'
        this.db.run(sql, [data.newType, username, data.oldType], (err, r)=>{
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
            this.db.run(sql, [data.username, data.type], (err, r) => {
                if (err) {
                    reject(err);
                    return;
                }
                if(r!==undefined){
                    resolve(true);
                } else {
                    resolve(false)
                }
                
            });
        });
    }

  
    getUsers(){
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM USER';
            this.db.all(sql, [], (err, rows) => {
                if (err) {
                    reject(err);
                    return;
                }
                if(rows !== undefined){

                
                const user = rows.map((r) => (
                
                    {  
                        id : r.id,
                        username: r.username,
                        name: r.name,
                        surname: r.surname,
                        type: r.type
                    }
                ));
                resolve(user);
                } else {
                    const user = ''
                    resolve(user)
                }
            });
        });
    }
    


}

module.exports = User;