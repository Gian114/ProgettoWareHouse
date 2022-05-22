'use strict';

const db = require('../Modules/DB')
const ReturnOrder = require('../Modules/ReturnOrder');
const roDao = new ReturnOrder(db.db)

describe('test test descriptor', () => {
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
        const id = await db.getAutoincrementId('RETURN_ORDER');
        let res = await roDao.deleteReturnOrder(id);
        res = await roDao.getAllReturnOrders();
        expect(res.length).toStrictEqual(0);
    });
});

function testNewRo(data) {
    test('create new return order', async () => {
        
        await roDao.createNewReturnOrder(data);
        
        let res = await roDao.getAllReturnOrders();
        expect(res.length).toStrictEqual(1);
        
        const id = await db.getAutoincrementId('TEST_DESCRIPTOR');
        res = await roDao.getReturnOrderById(id);

        expect(res.returnDate).toStrictEqual(data.returnDate);
        expect(res.products).toStrictEqual([]);
        expect(res.restockOrderId).toStrictEqual(data.restockOrderId);     
    });
}