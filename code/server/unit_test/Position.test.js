'use strict';
const db = require('../Modules/DB').db;
const Position = require('../Modules/Position');
const dao = new Position(db.db);

describe('testDao', () => {
    beforeAll(async () => {
        await db.dropTablePosition();
        await db.createTablePosition();
    });

    test('delete db', async () => {
        let res = await dao.getAllPosition();
        expect(res.length).toStrictEqual(0);
    });

    let data = 
        {
            "positionID" : "800234543412",
            "aisleID" : "8002",
            "row" : "100",
            "col" : "50",
            "maxWeight" : 1000,
            "maxVolume" : 1000
        }

        /*
    let modifiedData = 
    {
        "newAisleID" : "a modifed sku",
        "newRow" : "130",
        "newCol" : "70",
        "newMaxWeight" : 500,
        "newMaxVolume" : 500,
    }
    */

    testNewPosition(data);
    //testModifyPosition(, modifiedData);
    testModifyPositionID("800234543412", "800234543414");
    testdeletePosition("800234543414");

   
});


function testNewPosition(data) {
    test('create new position', async () => {
        
        await dao.createNewPosition(data);
        
       
        let res = await dao.getAllPosition();
        expect(res.length).toStrictEqual(1);
        
        res = await dao.getPosition("800234543412")

        expect(res.id).toStrictEqual("800234543412");
        expect(res.aisle_id).toStrictEqual(data.aisleID);
        expect(res.row).toStrictEqual(data.row);
        expect(res.col).toStrictEqual(data.col);    
        expect(res.max_weight).toStrictEqual(data.maxWeight);
        expect(res.max_volume).toStrictEqual(data.maxVolume);      
    });
}

/*
function testModifyPosition(id, data) {
   
}
*/

function testModifyPositionID(id, newID) {
    test('modify positionID of position', async () => {
        let res = await dao.modifyPositionID(id, newID); //here you have to change row and col 
        expect(res).toStrictEqual(true) 

        res = await dao.getPosition(newID)

        expect(res.id).toStrictEqual(newID);
            
    });
}

function testdeletePosition(id) {
    test('delete position', async () => {
        
        let res = await dao.deletePosition(id);
        expect(res).toStrictEqual(true)

        res = await dao.getAllPosition();
        expect(res.length).toStrictEqual(0);
            
    });
}