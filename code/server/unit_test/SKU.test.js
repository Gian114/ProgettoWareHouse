'use strict';

const DB = require('../Modules/DB').DB;
const db = new DB(':memory:');
const SKU = require('../Modules/SKU');
const dao = new SKU(db.db)

describe('testDao', () => {
    beforeAll(async () => {
        await db.dropTableSKU();
        await db.createTableSKU();
    });

    test('delete db', async () => {
        let res = await dao.getListofSKU();
        expect(res.length).toStrictEqual(0);
    });

    let data = 
        {
            "description" : "a new sku",
            "weight" : 100,
            "volume" : 50,
            "notes" : "first SKU",
            "price" : 10.99,
            "availableQuantity" : 50
        }

    let modifiedData = 
    {
        "newDescription" : "a modifed sku",
        "newWeight" : 120,
        "newVolume" : 80,
        "newNotes" : "modified SKU",
        "newPrice" : 10.99,
        "newAvailableQuantity" : 60
    }

    testNewSKU(data);
    testModifySKU(1, modifiedData);
    testModifyPosition(1, '8024111111112222');
    testdeleteSKU(1);

   
});


function testNewSKU(data) {
    test('create new sku', async () => {
        
        await dao.createSKU(data);
        
       
        let res = await dao.getListofSKU();
        expect(res.length).toStrictEqual(1);
        
        res = await dao.getSKUByID(1)

        expect(res.id).toStrictEqual(1);
        expect(res.description).toStrictEqual(data.description);
        expect(res.volume).toStrictEqual(data.volume);
        expect(res.notes).toStrictEqual(data.notes);    
        expect(res.price).toStrictEqual(data.price);
        expect(res.availableQuantity).toStrictEqual(data.availableQuantity);      
    });
}

function testModifySKU(id, data) {
    test('modify sku', async () => {
        
        await dao.modifySKU(id, data);
          
        const res = await dao.getSKUByID(id)

        expect(res.id).toStrictEqual(id);
        expect(res.description).toStrictEqual(data.newDescription);
        expect(res.volume).toStrictEqual(data.newVolume);
        expect(res.notes).toStrictEqual(data.newNotes);    
        expect(res.price).toStrictEqual(data.newPrice);
        expect(res.availableQuantity).toStrictEqual(data.newAvailableQuantity);      
    });
}

function testModifyPosition(id, position) {
    test('modify position of sku', async () => {
        
        let res = await dao.modifyPosition(id, position);
        expect(res).toStrictEqual(true)

        res = await dao.getSKUByID(id)

        expect(res.position).toStrictEqual(position);
            
    });
}

function testdeleteSKU(id) {
    test('delete sku', async () => {
        
        let res = await dao.deleteSKU(id);
        expect(res).toStrictEqual(true)

        res = await dao.getListofSKU();
        expect(res.length).toStrictEqual(0);
            
    });
}