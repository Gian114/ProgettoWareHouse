'use strict';

const ReturnOrderServices = require('../Services/ReturnOrderServices');
const ReturnOrder = require('../Modules/ReturnOrder');
const RestockOrder = require('../Modules/RestockOrder');
const SKUItem = require('../Modules/SKUItem');
const Product = require('../Modules/Product');
const DB = require('../Modules/DB').DB;

const db = new DB(':memory:');
const roDao = new ReturnOrder(db.db);
const reso = new RestockOrder(db.db);
const skui = new SKUItem(db.db);
const prod = new Product(db.db);
const roServices = new ReturnOrderServices(roDao, reso, skui, prod, db);

describe("Return order services", () => {

    const reso1 =
        {
            "issueDate":"2021/11/29 09:33",
            "products": [{"SKUId":1,"description":"a product","price":10.99,"qty":30},
                        {"SKUId":3,"description":"another product","price":11.99,"qty":20}],
            "supplierId" : 2  
        };

    const skui1 =
        {
            "RFID":"1111",
            "SKUId":1,
            "DateOfStock":"2021/11/29 12:30"
        };

    const skui2 =
        {
            "RFID":"1112",
            "SKUId":3,
            "DateOfStock":"2021/11/29 12:30"
        };

    const data1 = //right
        {
            "returnDate":"2021/11/29 09:33",
            "products": [{"SKUId":1,"description":"a product","price":10.99,"RFID":"1111"},
                        {"SKUId":3,"description":"another product","price":11.99,"RFID":"1112"}],
            "restockOrderId" : 1
        };

    const data2 = //right
        {
            "returnDate":"2018/11/29 09:33",
            "products": [],
            "restockOrderId" : 1
        };

    const data3 = //wrong: no restock order associated to restockOrderId
        {
            "returnDate":"2021/11/29 09:33",
            "products": [{"SKUId":1,"description":"a product","price":10.99,"RFID":"1111"},
                        {"SKUId":3,"description":"another product","price":11.99,"RFID":"1112"}],
            "restockOrderId" : 2
        };

    const data4 = //wrong: no sku item associated to RFID or wrong correspondence between RFID and SKUId
        {
            "returnDate":"2021/11/29 09:33",
            "products": [{"SKUId":2,"description":"a product","price":10.99,"RFID":"1111"},
                        {"SKUId":3,"description":"another product","price":11.99,"RFID":"1113"}],
            "restockOrderId" : 1
        };


    beforeEach(async () => {
        await db.dropTableReturnOrder();
        await db.dropTableRestockOrder();
        await db.dropTableSKUItem();
        await db.dropTableProduct();
        await db.createTableReturnOrder();
        await db.createTableRestockOrder();
        await db.createTableSKUItem();
        await db.createTableProduct();
        await reso.createNewRestockOrder(reso1);
        await skui.createNewSKUItem(skui1);
        await skui.createNewSKUItem(skui2);
        await prod.insertProductRestockOrder(1,"a product",10.99, 30, 1);
        await prod.insertProductRestockOrder(3,"another product",11.99, 20, 1);
        await roServices.createNewReturnOrder(data1);
    });

    test('Create return orders', async () => {
        await roServices.createNewReturnOrder(data2);

        let res = await roServices.getReturnOrderById(2);
        expect(res).toEqual({
            returnDate: data2.returnDate,
            products: data2.products,
            restockOrderId: data2.restockOrderId
        });

        res = await roServices.createNewReturnOrder(data3);
        expect(res).toEqual('');

        res = await roServices.createNewReturnOrder(data4);
        expect(res).toEqual(true);
    });

    test('Get return orders', async () => {

        let res = await roServices.getAllReturnOrders();
        expect(res.length).toStrictEqual(1);
        expect(res[0]).toEqual({
            id: 1,
            returnDate: data1.returnDate,
            products: data1.products,
            restockOrderId: data1.restockOrderId
        });

        await roServices.createNewReturnOrder(data2);
        res = await roServices.getAllReturnOrders();
        expect(res.length).toStrictEqual(2);

        res = await roServices.getReturnOrderById(3);
        expect(res).toEqual('');
    });

    test('Delete return orders', async () => {
        
        await roServices.deleteReturnOrder(2);
        let res = await roServices.getAllReturnOrders();
        expect(res.length).toStrictEqual(1);

        await roServices.deleteReturnOrder(1);
        res = await roServices.getAllReturnOrders();
        expect(res.length).toStrictEqual(0);
    });

});