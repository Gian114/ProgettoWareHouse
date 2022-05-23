'use strict';

const db = require('../Modules/DB').db
const SKUItem = require('../Modules/SKUItem');
const dao = new SKUItem(db.db)

describe('testDao', () => {
    beforeAll(async () => {
        await db.dropTableSKUItem();
        await db.createTableSKUItem();
    });

    test('delete db', async () => {
        let res = await dao.getAllSKUItems();
        expect(res.length).toStrictEqual(0);
    });

    let data = 
    {
        "RFID":"12345678901234567890123456789015",
        "SKUId":1,
        "DateOfStock":"2021/11/29 12:30"
    }


    let modifiedData = 
    {
        "newRFID":"12345678901234567890123456789015",
        "newAvailable":1,
        "newDateOfStock":"2021/11/29 12:30"
    }


    testNewSKUItem(data);
    testModifySKUItem("12345678901234567890123456789015", modifiedData);
    testdeleteSKUItem("12345678901234567890123456789015");
   
});


function testNewSKUItem(data) {
    test('create new skuitem', async () => {
        
        await dao.createNewSKUItem(data);
        
       
        let res = await dao.getAllSKUItems();
        expect(res.length).toStrictEqual(1);
        
        res = await dao.getSKUItemByRFID(data.RFID)       
        expect(res.RFID).toStrictEqual(data.RFID);
        expect(res.SKUId).toStrictEqual(data.SKUId);
        expect(res.Available).toStrictEqual(0);    
        expect(res.DateOfStock).toStrictEqual(data.DateOfStock);      
    });
}

function testModifySKUItem(rfid, data) {
    test('modify skuitem', async () => {
        
        await dao.modifySKUItem(rfid, data)
          
       
        let res = await dao.getSKUItemByRFID(data.newRFID)

        expect(res.RFID).toStrictEqual(data.newRFID);
        expect(res.Available).toStrictEqual(data.newAvailable);    
        expect(res.DateOfStock).toStrictEqual(data.newDateOfStock);        
    });
}

function testdeleteSKUItem(rfid) {
    test('delete skuitem', async () => {
        
        let res = await dao.deleteSKUItem(rfid)
        expect(res).toStrictEqual(true)

        res = await dao.getAllSKUItems();
        expect(res.length).toStrictEqual(0);
            
    });
}