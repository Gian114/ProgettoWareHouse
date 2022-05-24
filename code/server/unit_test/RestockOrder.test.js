'use strict';

const db = require('../Modules/DB').db;
const RestockOrder = require('../Modules/RestockOrder');
const roDao = new RestockOrder(db.db);
const User = require('../Modules/User');
const userDao = new User(db.db);

describe('test Restock Order', () => {
    beforeAll(async () => {
        await db.dropTableRestockOrder();
        await db.createTableRestockOrder();
        await db.dropTableProduct();
        await db.createTableProduct();
        await db.dropTableUser();
        await db.createTableUser();
    });

    test('delete db', async () => {
        let res = await roDao.getAllRestockOrderNotIssued();
        res = res.concat(await roDao.getAllRestockOrderIssued());
        res = res.concat(await roDao.getAllRestockOrderDelivery());
        expect(res.length).toStrictEqual(0);
    });

    const data = 
        {
            "issueDate":"2021/11/29 09:33",
            "products": [{"SKUId":12,"description":"a product","price":10.99,"RFID":"12345678901234567890123456789016"},
                        {"SKUId":180,"description":"another product","price":11.99,"RFID":"12345678901234567890123456789038"}],
            "supplierId" : 1
        }
    testNewRo(data);

    test('delete restock order', async () => {
        const id = await db.getAutoincrementId('RESTOCK_ORDER');
        let res = await roDao.deleteRestockOrder(id);
        res = await roDao.getAllRestockOrderIssued(); //when restock is created state is issued
        expect(res.length).toStrictEqual(0);
    });
});

//testare altra roba
function testNewRo(data) {
    test('create new restock order', async () => {

        /*
        const user_data =
        {
            "username":"user1@ezwh.com",
            "name":"John",
            "surname" : "Smith",
            "password" : "testpassword",
            "type" : "supplier"
    
        };
        */
    
        
        //await userDao.createUser(user_data);
        await roDao.createNewRestockOrder(data); 
        
        let res = await roDao.getAllRestockOrderIssued();
        res = res.concat(await roDao.getAllRestockOrderNotIssued());
        res = res.concat(await roDao.getAllRestockOrderDelivery());
        expect(res.length).toStrictEqual(1);
        
        res = await roDao.getRestockOrderByID(1);

        expect(res.issueDate).toStrictEqual(data.issueDate);
        expect(res.products).toStrictEqual([]);
        expect(res.supplierId).toStrictEqual(data.supplierId);     
    });
}