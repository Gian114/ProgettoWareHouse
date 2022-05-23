'use strict';

const db = require('../Modules/DB').db;
const ReturnOrder = require('../Modules/ReturnOrder');
const roDao = new ReturnOrder(db.db);

describe('test return order', () => {
    beforeAll(async () => {
        await db.dropTableReturnOrder();
        await db.createTableReturnOrder();
    });

    test('delete db', async () => {
        let res = await roDao.getAllReturnOrders();
        expect(res.length).toStrictEqual(0);
    });

    const data = 
        {
            "returnDate":"2021/11/29 09:33",
            "products": [{"SKUId":12,"description":"a product","price":10.99,"RFID":"12345678901234567890123456789016"},
                        {"SKUId":180,"description":"another product","price":11.99,"RFID":"12345678901234567890123456789038"}],
            "restockOrderId" : 1
        }
    testNewRo(data);

    test('delete return order', async () => {

        let res = await roDao.deleteReturnOrder(1);
        res = await roDao.getAllReturnOrders();
        expect(res.length).toStrictEqual(0);
    });
});

function testNewRo(data) {
    test('create new return order', async () => {
        
        await roDao.createNewReturnOrder(data);
        
        let res = await roDao.getAllReturnOrders();
        expect(res.length).toStrictEqual(1);
        
        res = await roDao.getReturnOrderById(1);
        expect(res.returnDate).toStrictEqual(data.returnDate);
        expect(res.products).toStrictEqual([]);
        expect(res.restockOrderId).toStrictEqual(data.restockOrderId);     
    });
}