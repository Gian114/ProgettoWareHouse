'use strict';

const DB = require('../Modules/DB').DB;
const db = new DB(':memory:');
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
    testGetSKUITEMByRFID("12345678901234567890123456789015", data)
    testGetSKUITEMBySKUID(1,data)
    testGetAll();
    setOrderID("12345678901234567890123456789015", 1, 0)
    setOrderID("12345678901234567890123456789015", 1, 1)
    setRestockOrder("12345678901234567890123456789033", data.SKUId, 1)
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

function testGetSKUITEMByRFID(rfid,data){
    test('get skuitem', async () => {
        
        let res = await dao.getSKUItemByRFID(rfid)
        
        expect(res.RFID).toStrictEqual(data.RFID);
        expect(res.Available).toStrictEqual(1);    
        expect(res.SKUId).toStrictEqual(data.SKUId)
        expect(res.DateOfStock).toStrictEqual(data.DateOfStock);  


            
    });
}

function testGetSKUITEMBySKUID(skuid,data){
    test('get skuitem by sku', async () => {
        
        let res = await dao.getSKUItemsBySKUId(skuid)
        console.log(res)
        expect(res[0].RFID).toStrictEqual(data.RFID);
        expect(res[0].Available).toStrictEqual(1);    
        expect(res[0].SKUId).toStrictEqual(skuid)
        expect(res[0].DateOfStock).toStrictEqual(data.DateOfStock);  


            
    });
}

function testGetAll(){
    test('get all skuitems', async () => {
        
        let res = await dao.getAllSKUItems()
        console.log(res)
        expect(res.length).toStrictEqual(1);
            
    });
}

function setOrderID(rfid, id, type) {
    test('set skuitem order id', async () => {
        let res;
        if(type === 0){
             res = await dao.setInternalOrderId(rfid,id)
        } else if (type === 1){
             res = await dao.setReturnOrderId(rfid,id)
        }
        
        expect(res).toStrictEqual(true)

    });
}

function setRestockOrder(rfid, skuid, roid) {
    test('set skuitem restock order', async () => {

        let item = {rfid: rfid, SKUId: skuid}
        let res = await dao.setRestockOrderId(item, roid)
        
        expect(res).toStrictEqual(true)

    });
}

function testdeleteSKUItem(rfid) {
    test('delete skuitem', async () => {
        
        let res = await dao.deleteSKUItem(rfid)
        expect(res).toStrictEqual(true)

        res = await dao.getAllSKUItems();
        //the other one is still there
        expect(res.length).toStrictEqual(1);
            
    });
}