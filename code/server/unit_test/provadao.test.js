'use strict';

const db = require('../Modules/DB');
const SKUdao = require('../Modules/SKU');
const dao = new SKUdao(db.db)

describe('testDao', () => {
    beforeAll(async () => {
        //await skuDAO.deleteUserData();
    });

    test('delete db', async () => {
    
       // expect(res.length).toStrictEqual(0);
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
        
        
        
    testNewUser(data);
});

function testNewUser(data) {
    test('create new user', async () => {
        
        await dao.createSKU(data);
        
        var res = await dao.getSKUByID(1);
        //expect(res.length).toStrictEqual(1);
        
        //res = await userDao.getUserByUsername(username);

        expect(res.description).toStrictEqual(data.description);
        expect(res.weight).toStrictEqual(data.weight);
        expect(res.volume).toStrictEqual(data.volume);
        expect(res.notes).toStrictEqual(data.notes);
    });
}
