'use strict';

const ItemServices = require('../Services/ItemServices');
const Item = require('../Modules/Item');
const SKU = require('../Modules/SKU');
const User = require('../Modules/User');
const DB = require('../Modules/DB').DB;

const db = new DB(':memory:');
const itDao = new Item(db.db);
const sku = new SKU(db.db);
const user = new User(db.db);
const itServices = new ItemServices(itDao, sku, user);

describe("Item services", () => {
    
    const sku1 =
        {
            "description" : "a new sku",
            "weight" : 100,
            "volume" : 50,
            "notes" : "first SKU",
            "price" : 10.99,
            "availableQuantity" : 50
        };

    const sku2 =
        {
            "description" : "another sku",
            "weight" : 100,
            "volume" : 50,
            "notes" : "first SKU",
            "price" : 10.99,
            "availableQuantity" : 50
        };

    const user1 = 
        {
            "username":"user1@ezwh.com",
            "name":"John",
            "surname" : "Smith",
            "password" : "testpassword",
            "type" : "supplier"
        };

    const data1 = //right
        {
            "id" : 12,
            "description" : "a new item",
            "price" : 10.99,
            "SKUId" : 1,
            "supplierId" : 1
        };

    const data2 = //right
        {
            "id" : 15,
            "description" : "a new item",
            "price" : 10.99,
            "SKUId" : 2,
            "supplierId" : 1
        };

    const data3 = //wrong: this supplier already sells an item with the same SKUId
        {
            "id" : 10,
            "description" : "a new item",
            "price" : 10.99,
            "SKUId" : 1,
            "supplierId" : 1
        };

    const data4 = //wrong: this supplier already sells an Item with the same ID
        {
            "id" : 12,
            "description" : "a new item",
            "price" : 10.99,
            "SKUId" : 2,
            "supplierId" : 1
        };

    const data5 = //wrong: Sku not found
        {
            "id" : 20,
            "description" : "a new item",
            "price" : 10.99,
            "SKUId" : 3,
            "supplierId" : 1
        };

    const data6 = //wrong: supplier not associated to id
        {
            "id" : 34,
            "description" : "a new item",
            "price" : 10.99,
            "SKUId" : 1,
            "supplierId" : 2
        };

    const newData = //right
        {
            "newDescription" : "a new sku",
            "newPrice" : 10.99
        };
    

    beforeEach(async () => {
        await db.dropTableItem();
        await db.dropTableSKU();
        await db.dropTableUser();
        await db.createTableItem();
        await db.createTableSKU();
        await db.createTableUser();
        await sku.createSKU(sku1);
        await sku.createSKU(sku2);
        await user.createUser(user1);
        await itServices.createNewItem(data1);
    });

    test('Create items', async () => {

        let res = await itServices.createNewItem(data4);
        expect(res).toEqual(2);

        await itServices.createNewItem(data2);
        res = await itServices.getItemById(data2.id);
        expect(res).toEqual({
            id: data2.id,
            description: data2.description,
            price: data2.price,
            SKUId: data2.SKUId,
            supplierId: data2.supplierId
        });

        res = await itServices.createNewItem(data3);
        expect(res).toEqual(1);

        res = await itServices.createNewItem(data5);
        expect(res).toEqual('');

        res = await itServices.createNewItem(data6);
        expect(res).toEqual('');
    });

    test('Get items', async () => {

        let res = await itServices.getAllItems();
        expect(res.length).toStrictEqual(1);
        expect(res[0]).toEqual({
            id: data1.id,
            description: data1.description,
            price: data1.price,
            SKUId: data1.SKUId,
            supplierId: data1.supplierId
        });

        await itServices.createNewItem(data2);
        res = await itServices.getAllItems();
        expect(res.length).toStrictEqual(2);

        res = await itServices.getItemById(3);
        expect(res).toEqual('');
    });

    test('Modify items', async () => {

        await itServices.modifyItem(newData, data1.id);
        let res = await itServices.getItemById(data1.id);
        expect(res).toEqual({
            id: data1.id,
            description: newData.newDescription,
            price: newData.newPrice,
            SKUId: data1.SKUId,
            supplierId: data1.supplierId
        });

        res = await itServices.modifyItem(newData, 1);
        expect(res).toEqual('');
    });

    test('Delete items', async () => {
        
        await itServices.deleteItem(1);
        let res = await itServices.getAllItems();
        expect(res.length).toStrictEqual(1);

        await itServices.deleteItem(data1.id);
        res = await itServices.getAllItems();
        expect(res.length).toStrictEqual(0);
    });

});