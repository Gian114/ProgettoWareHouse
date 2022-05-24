"use strict"

const PositionServices = require('../Services/PositionServices');
const Position = require('../Modules/Position')

const DB = require('../Modules/DB').DB;
const db = new DB(':memory:');

const pos = new Position(db.db)

const pos_service = new PositionServices(pos)

describe("Position Services)", () => {
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

        let data2 =
        {
            "positionID": "803234543545",
            "aisleID": "8032",
            "row": "3454",
            "col": "3545",
            "maxWeight": 100,
            "maxVolume": 100
        }

        await pos.createNewPosition(data);
        //await pos.createSKU(data2);

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

    let data2 =
    {
        "positionID": "803234543545",
        "aisleID": "8032",
        "row": "3454",
        "col": "3545",
        "maxWeight": 100,
        "maxVolume": 100
    }


    testPosition("800234543412", data);

});


async function testPosition(id, data) {
    test('get Position', async () => {
        let res = await pos_service.getPosition();
        expect(res.length).toStrictEqual(1);
        expect(res[0]).toEqual({
            positionID: id,
            aisle_id: data.aisle_id,
            row: data.row,
            col: data.col,
            maxWeight: data.maxWeight,
            maxVolume: data.maxVolume,
            occupiedWeight: 0,
            occupiedVolume: 0,
        });
    });
}

