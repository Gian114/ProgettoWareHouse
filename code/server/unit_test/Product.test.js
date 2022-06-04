'use strict';
const DB = require('../Modules/DB').DB;
const db = new DB(':memory:');
const Product = require('../Modules/Product');
const pr_dao = new Product(db.db);

const prod1 = {
    "SKUId": 12,
    "description": "a product",
    "price": 10.99,
    "qty": 3
}

describe('Product dao tests', () => {
    beforeEach(async () => {
        await db.dropTableProduct();
        await db.createTableProduct();
    });

    testInsertAndGetProductRO();

});

function testInsertAndGetProductRO() {
    test('test product', async () => {

        await pr_dao.insertProductReturnOrder(prod1.SKUId, prod1.description, prod1.price, 1)

        let res = await pr_dao.getProducts();
        expect(res.length).toStrictEqual(1);
        expect(res[0].SKUId).toStrictEqual(prod1.SKUId);
        expect(res[0].description).toStrictEqual(prod1.description);
        expect(res[0].price).toStrictEqual(prod1.price);

        res = await pr_dao.deleteProductsByReturnOrderId(1);

        res = await pr_dao.getProducts();
        expect(res.length).toStrictEqual(0);


    });
}