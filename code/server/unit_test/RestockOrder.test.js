'use strict';

const db = require('../Modules/DB');
const RestockOrder = require('../Modules/RestockOrder');
const roDao = new RestockOrder(db.db)

describe('test Restock Order', () => {
    beforeAll(async () => {
        await db.dropTableRestockOrder();
        await db.createTableRestockOrder();
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
        
        await roDao.createNewRestockOrder(data); //here he don't create because of pragma?
        
        let res = await roDao.getAllRestockOrderIssued();
        res = res.concat(await roDao.getAllRestockOrderNotIssued());
        res = res.concat(await roDao.getAllRestockOrderDelivery());
        expect(res.length).toStrictEqual(1);
        
        const id = await db.getAutoincrementId('RESTOCK_ORDER');
        res = await roDao.getRestockOrderByID(id);

        expect(res.issueDate).toStrictEqual(data.issueDate);
        expect(res.products).toStrictEqual([]);
        expect(res.supplierId).toStrictEqual(data.supplierId);     
    });
}