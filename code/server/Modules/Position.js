'use strict';

class Position{

    constructor(db) {
        this.db = db;
    }


    //ricontrolla OccupiedWeight e OccupiedVolume
    createNewPosition(data){
        return new Promise((resolve, reject) => {
            const sql = 'INSERT INTO POSITION(ID, AISLE_ID, ROW, COL, MAX_WEIGHT, MAX_VOLUME, OCCUPIED_WEIGHT, OCCUPIED_VOLUME) VALUES(?, ?, ?, ?, ?, ?, 0, 0)';
            this.db.run(sql, [data.positionID, data.aisle_id, data.row, data.col, data.max_weight, data.max_volume], (err) => {
                if (err) {
                  reject(err);
                  return;
                }
                resolve(this.lastID);
            });
        });
    }

    getAllPosition() {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM POSITION';
            this.db.all(sql, [], (err, rows) => {
                if (err) {
                    reject(err);
                    return;
                }
                
                const position = rows.map((r) => (
                
                    {  
                        id: r.id,
                        aisle_id : r.aisle_id,
                        row : r.row,
                        col : r.col,
                        max_weight : r.max_weight,
                        max_volume: r.max_volume,
                        occupied_weight: r.occupied_weight, 
                        occupied_volume: r.occupied_volume,
                    }
                ));
                resolve(position);
            });
        });
    }

    modifyPosition(id, data, newid){
        return new Promise((resolve, reject)=>{
        const sql = 'UPDATE POSITION SET ID = ?, AISLE_ID = ?, ROW = ?, COL = ?, MAX_WEIGHT = ?, MAX_VOLUME = ?, OCCUPIED_WEIGHT = ?, OCCUPIED_VOLUME = ? WHERE ID = ?'
        this.db.run(sql, [newid, data.aisle_id, data.row, data.col, data.max_weight, data.max_volume, data.occupied_weight, data.occupied_volume,id], (err, r)=>{
            if (err) {
                reject(err);
                return;
            }
            resolve(true)
        })

        })
    }

    modifyPositionID(oldID, newID){
        return new Promise((resolve, reject)=>{
            const sql = 'UPDATE POSITION SET ID = ? WHERE ID = ?'
            this.db.run(sql, [newID, oldID], (err, r)=>{
                if (err) {
                    reject(err);
                    return;
                }
                resolve(true)
            })
    
            })
        }

    

    deletePosition(positionID) {
        return new Promise((resolve, reject) => {
            const sql = 'DELETE FROM POSITION WHERE ID = ?';
            this.db.run(sql, [positionID], (err, r) => {
                if (err) {
                    reject(err);
                    return;
                }
               
                resolve(true);
            });
        });
    }


    occupyPosition(positionID, data){
        return new Promise((resolve, reject)=>{
            const sql = 'UPDATE POSITION SET occupied_weight = ? AND occupied_volume = ? WHERE ID = ?'
            this.db.run(sql, [data.weight, data.volume, positionID], (err, r)=>{
                if (err) {
                    reject(err);
                    return;
                }
                resolve(true)
            })
    
            })
    }

    getPosition(positionID){
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM POSITION WHERE id = ?';
            this.db.all(sql, [positionID], (err, r) => {
                if (err) {
                    reject(err);
                    return;
                }
                
                if(r !== undefined){
                const position =     
                    {  
                        id: r.id,
                        aisle_id : r.aisle_id,
                        row : r.row,
                        col : r.col,
                        max_weight : r.max_weight,
                        max_volume: r.max_volume,
                        occupied_weight: r.occupied_weight, 
                        occupied_volume: r.occupied_volume,
                    }
                
                resolve(position);
                }
                else {
                    const position = ''
                    resolve(position)
                }
            });
        });
    }
}

module.exports = Position;





