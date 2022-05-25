const SKUItemServices = require('../Services/SKUItemServices')

const SKUItem = require('../Modules/SKUItem')

const DB = require('../Modules/DB').DB;
const db = new DB(':memory:');
const dao = new SKUItem(db.db)

const SKU = require('../Modules/SKU')
const sku = new SKU(db.db)

const si_service = new SKUItemServices(dao, sku)


describe("create and get SKUItem(s)", () => {
    beforeEach(async () => {

        //deleting data 
        await db.dropTableSKUItem();
        await db.createTableSKUItem()
        await db.dropTableSKU()
        await db.createTableSKU();
        
        await sku.createSKU({
            "description" : "a new sku",
            "weight" : 100,
            "volume" : 50,
            "notes" : "first SKU",
            "price" : 10.99,
            "availableQuantity" : 50
        })
        await sku.createSKU({
            "description" : "another sku",
            "weight" : 100,
            "volume" : 50,
            "notes" : "second SKU",
            "price" : 10.99,
            "availableQuantity" : 50
        })


    });

    let data = 
    {
        "RFID":"12345678901234567890123456789015",
        "SKUId":1,
        "DateOfStock":"2021/11/29 12:30"
    }

        
    let data2 = 
    {
        "RFID":"12345678901234567890123456789026",
        "SKUId":2,
        "DateOfStock":"2021/11/30 12:30"
    }

    let wdata = 
    {
        "SKUId":2,
        "DateOfStock":"2021/11/30 12:30"
    }


    createSI(data);
    createSI(data2);
    //createSI(wdata) //test must fail cause wrong data(no rfid)

});



async function createSI(data) {
    test('create skuitem', async () => {
        let res = await si_service.createSKUItem(data)
        //if everything is fine it returns true
        expect(res).toEqual(true);
        //lets see if the skuitem is actually there with a get
        res = await si_service.getSKUItemsByRFID(data.RFID)
        expect(res).toEqual({
            RFID: data.RFID,
            SKUId: data.SKUId,
            Available: 0,
            DateOfStock: data.DateOfStock
        })
    });
}

//another testcase
describe("get skuitems by skuid and modify", () => {

    let modify = 
    {
        "newRFID":"12345678901234567890123456789026",
        "newAvailable": 1,
        "newDateOfStock":"2021/11/30 12:30"
    }
    
    testGet_Modify(2, modify)
    //testGet_Modify(1) //test failes, no data
    //testGet_Modify(3, modify) //test failes, no such item

});


async function testGet_Modify(skuid, data) {
    test('get skuitems by skuid and modify', async () => {
        let res = await si_service.getSKUItemsBySKUID(skuid)
        //it returns an array with all skuitems having that skuid reference and available = 1, in this case as we created 2 items in the test above
        //we expect no items as available is 0 for both
        expect(res).toEqual([]);
        
        //but if we modify one skuitem by putting available = 1, we are not changing the rfid
        await si_service.modifySKUItem(data.newRFID, data)
        res = await si_service.getSKUItemsBySKUID(skuid)
        //now we expect one item
        expect(res[0]).toEqual({
            RFID: data.newRFID,
            SKUId: skuid,
            Available: data.newAvailable,
            DateOfStock: data.newDateOfStock
        })
        
    });
}

describe("get skuitems by rfid", () => {

    let data = 
    {
        "RFID":"12345678901234567890123456789015",
        "SKUId":1,
        "DateOfStock":"2021/11/29 12:30"
    }

    //testGetRFID(data)
    
});

async function testGetRFID(data) {
    test('get skuitems by rfid', async () => {

        let res = await si_service.getSKUItemsByRFID(data.RFID)
        //we expect one item
        expect(res).toEqual({
            RFID: data.RFID,
            SKUId: data.SKUId,
            Available: 0,
            DateOfStock: data.DateOfStock
        })
        
    });
}


//another testcase
describe("delete SKUItem", () => {
  
    testDelete("12345678901234567890123456789015");
 
});

async function testDelete(rfid) {
    test('delete skuitem', async () => {
        let res = await si_service.deleteSKUItem(rfid)
        //if everything worked fine the services returns true
        expect(res).toEqual(true);
    });
}