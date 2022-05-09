'use strict';

class Position{

    constructor(db) {
        this.db = db;
    }


    //ricontrolla OccupiedWeight e OccupiedVolume
    createNewPosition(data,positionID){
        return new Promise((resolve, reject) => {
            const sql = 'INSERT INTO POSITION(ID, AISLE, ROW, COL, MAX_WEIGHT, MAX_VOLUME, OCCUPIED_WEIGHT, OCCUPIED_VOLUME) VALUES(?, ?, ?, ?, ?, ?, 0, 0)';
            this.db.run(sql, [positionID, data.aisle, data.row, data.col, data.maxweight, data.maxvolume], (err) => {
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
                        id:r.ID,
                        aisle : r.AISLE,
                        row : r.ROW,
                        col : r.COL,
                        max_weight : r.MAX_WEIGHT,
                        max_volume: r.MAX_VOLUME,
                        occupied_weight: r.OCCUPIEDWEIGHT, 
                        occupied_volume: r.OCCUPIEDVOLUME,
                    }
                ));
                resolve(position);
            });
        });
    }

    modifyPosition(id, data, newid){
        return new Promise((resolve, reject)=>{
        const sql = 'UPDATE POSITION SET id = ?, aisle = ?, row = ?, col = ?, max_weight = ?, max_volume = ?, occupied_weight = ?, occupied_volume = ? WHERE ID = ?'
        this.db.run(sql, [newid,data.aisle, data.row, data.col, data.max_weight, data.max_volume, data.occupied_weight, data.occupied_volume,id], (err, r)=>{
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





}

module.exports = Position;








