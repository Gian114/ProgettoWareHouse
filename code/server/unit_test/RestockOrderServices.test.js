'use strict';

const RestockOrderServices = require('../Services/RestockOrderServices');
const RestockOrder = require('../Modules/RestockOrder');
const SKUItem = require('../Modules/SKUItem');
const Product = require('../Modules/Product');
const User = require('../Modules/User');
const DB = require('../Modules/DB').DB;

const db = new DB(':memory:');

const reso = new RestockOrder(db.db);
const skui = new SKUItem(db.db);
const prod = new Product(db.db);
const user = new User(db.db);
const roServices = new RestockOrderServices(reso, skui, prod, user, db);

describe("Restock order services", () => {

    const data1 = 
    {
        "issueDate": "2020/10/28 10:33",
        "products": [{ "SKUId": 10, "description": "prod", "price": 18.99, "qty": 15 },
        { "SKUId": 35, "description": "prod due", "price": 11.99, "qty": 20 }],
        "supplierId": 2
    };

    const data2 = 
    {
        "issueDate": "2021/10/28 10:33",
        "products": [{ "SKUId": 10, "description": "prod", "price": 18.99, "qty": 15 }],
        "supplierId": 1

    };

    
    const skui1 =
    {
        "RFID": "12345678901234567890123456789016",
        "SKUId": 1, 
        "DateOfStock":"2021/11/29 12:30"
    };

    const skui2 =
    {
        "RFID": "12345678901234567890123456789017",
        "SKUId": 2,
        "DateOfStock":"2021/11/28 12:30"
    };


    beforeEach(async () => {
        await db.dropTableRestockOrder();
        await db.dropTableSKUItem();
        await db.dropTableProduct();
        await db.dropTableUser();
        await db.createTableRestockOrder();
        await db.createTableSKUItem();
        await db.createTableProduct();
        await db.createTableUser();
        await skui.createNewSKUItem(skui1);
        await skui.createNewSKUItem(skui2);
    });



    ////// ADD SUPPLIER ID CHECK
    /*
    test('Create restock order', async () => {
        await roServices.addRestockOrder(data1);

        let res = await roServices.getRestockOrderByID(1);
        expect(res).toEqual({
            issueDate: data1.issueDate,
            state: "ISSUED",
            products: data1.products, //in realtà va bene devo cambiare il modo in cui passo 
            supplierId: data1.supplierId,
        });

       
    });
    */

    test('Get return orders', async () => {
        await roServices.addRestockOrder(data1);

        let res = await roServices.getRestockOrder();
        expect(res.length).toStrictEqual(1);
        
        /* 
        fix product name
        expect(res[0]).toEqual({
            id: 1,
            issueDate: data1.issueDate,
            supplierId: data1.supplierId
        });
        */

        await roServices.addRestockOrder(data2);
        res = await roServices.getRestockOrder();
        expect(res.length).toStrictEqual(2);

        res = await roServices.getRestockOrderByID(3);
        expect(res).toEqual(404); //not found
    });

    //here you can add check of skuItems and Prod

    test('Delete restock orders', async () => {
        await roServices.addRestockOrder(data1);

        await roServices.deleteRestockOrder(1);
        let res = await roServices.getRestockOrder();
        expect(res.length).toStrictEqual(0);

    });
    

});