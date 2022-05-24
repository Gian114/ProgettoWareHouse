'use strict';

const DB = require('../Modules/DB').DB;
const db = new DB(':memory:');
const Item = require('../Modules/Item');
const itDao = new Item(db.db);

describe('test item', () => {
    beforeAll(async () => {
        await db.dropTableItem();
        await db.createTableItem();
    });

    test('delete db', async () => {
        let res = await itDao.getAllItems();
        expect(res.length).toStrictEqual(0);
    });

    const data = 
        {
            "id" : 12,
            "description" : "a new item",
            "price" : 10.99,
            "SKUId" : 1,
            "supplierId" : 2
        };
    testNewIt(data);

    const newData = 
        {
            "newDescription" : "a new sku",
            "newPrice" : 10.99
        };
    testModIt(data, newData);

    test('delete test descriptor', async () => {
        let res = await itDao.deleteItem(data.id);
        res = await itDao.getAllItems();
        expect(res.length).toStrictEqual(0);
    });
});

function testNewIt(data) {
    test('create new item', async () => {
        
        await itDao.createNewItem(data);
        
        let res = await itDao.getAllItems();
        expect(res.length).toStrictEqual(1);
        
        res = await itDao.getItemById(data.id);

        expect(res.id).toStrictEqual(data.id);
        expect(res.description).toStrictEqual(data.description);
        expect(res.price).toStrictEqual(data.price);
        expect(res.SKUId).toStrictEqual(data.SKUId);
        expect(res.supplierId).toStrictEqual(data.supplierId);        
    });
}

function testModIt(data, newData) {
    test('modify item', async () => {
        
        await itDao.modifyItem(data.id, newData);
        
        let res = await itDao.getAllItems();
        expect(res.length).toStrictEqual(1);
        
        res = await itDao.getItemById(data.id);

        expect(res.id).toStrictEqual(data.id);
        expect(res.description).toStrictEqual(newData.newDescription);
        expect(res.price).toStrictEqual(newData.newPrice); 
        expect(res.SKUId).toStrictEqual(data.SKUId);
        expect(res.supplierId).toStrictEqual(data.supplierId);      
    });
}