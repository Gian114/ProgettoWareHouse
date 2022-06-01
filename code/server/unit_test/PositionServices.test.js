"use strict"

const PositionServices = require('../Services/PositionServices');
const Position = require('../Modules/Position')

const DB = require('../Modules/DB').DB;
const db = new DB(':memory:');

const pos = new Position(db.db)

const pos_service = new PositionServices(pos)

describe("Position Services", () => {
    
    beforeEach(async () => {

        //deleting data 
        await db.dropTablePosition();
        await db.createTablePosition();

        //creating sku
        let data =
        {
            "positionID": "800234543412",
            "aisleID": "8002",
            "row": "3454",
            "col": "3412",
            "maxWeight": 100,
            "maxVolume": 100
        }

        await pos.createNewPosition(data);
        
    });

    let data =
    {
        "positionID": "800234543412",
        "aisleID": "8002",
        "row": "3454",
        "col": "3412",
        "maxWeight": 100,
        "maxVolume": 100
    }

    let data1 =
    {
        "positionID": "800234543413",
        "aisleID": "8002",
        "row": "3454",
        "col": "3413",
        "maxWeight": 100,
        "maxVolume": 100
    }

    let data2 =
    {
        "positionID": "803234543545",
        "newAisleID": "8032",
        "newRow": "3454",
        "newCol": "3545",
        "newMaxWeight": 100,
        "newMaxVolume": 100,
        "newOccupiedWeight":200,
        "newOccupiedVolume":150
    }




    testPosition("800234543412", data);
    testModify("800234543413",data1,data2,"803234543545")

});


async function testPosition(id, data) {
    test('get Position', async () => {
        let res = await pos_service.getPosition();
        //console.log(res);
        expect(res.length).toStrictEqual(1);
        expect(res[0]).toEqual({
            id: id,
            aisle_id: data.aisleID,
            row: data.row,
            col: data.col,
            max_weight: data.maxWeight,
            max_volume: data.maxVolume,
            occupied_weight: 0,
            occupied_volume: 0
        });
    });
}


async function testModify(id, data1, data2, newID) {
    test('modify Position', async () => {
        let a = await pos_service.addPosition(data1);
        expect(a).toStrictEqual(201);

        let res = await pos_service.changePosition(id, data2, newID)
        expect(res).toEqual(true);

         //test 404
         let res2 = await pos_service.changePositionID("900234543412","803234543546","8032","3454","3546");
         expect(res2).toEqual(404);
        
    });

}


describe("delete Position", () => {
  
    testDelete("800234543412");
 
});

async function testDelete(id) {
    test('delete Position', async () => {
        let res = await pos_service.deletePosition(id)
        //if everything worked fine the services returns true
        expect(res).toEqual(true);
    });
}


