const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
chai.should();

const app = require('../server');
var agent = chai.request.agent(app);

const db = require('../Modules/DB').db;

describe('test return order apis', () => {

    const reso =
        {
            "issueDate":"2021/11/29 09:33",
            "products": [{"SKUId":1,"description":"a product","price":11,"qty":30},
                        {"SKUId":2,"description":"another product","price":12,"qty":20}],
            "supplierId" : 1  
        };

    const user = 
        {
            "username": "user1@ezwh.com",
            "name": "John",
            "surname" : "Smith",
            "password" : "testpassword",
            "type" : "supplier"
        };

    const sku1 =
        {
            "description" : "a new sku",
            "weight" : 100,
            "volume" : 50,
            "notes" : "first SKU",
            "price" : 11,
            "availableQuantity" : 50
        };

    const sku2 =
        {
            "description" : "another sku",
            "weight" : 100,
            "volume" : 50,
            "notes" : "first SKU",
            "price" : 11,
            "availableQuantity" : 50
        };

    const skui1 =
        {
            "RFID":"12345678901234567890123456789016",
            "SKUId":1,
            "DateOfStock":"2021/11/29 12:30"
        };

    const skui2 =
        {
            "RFID":"12345678901234567890123456789015",
            "SKUId":2,
            "DateOfStock":"2021/11/29 12:30"
        };

    const data1 = //right
        {
            "returnDate":"2021/11/29 09:33",
            "products": [{"SKUId":1,"description":"a product","price":11,"RFID":"12345678901234567890123456789016"},
                        {"SKUId":2,"description":"another product","price":12,"RFID":"12345678901234567890123456789015"}],
            "restockOrderId" : 1
        };

    const data2 = //wrong: no restock order associated to restockOrderId
        {
            "returnDate":"2021/11/29 09:33",
            "products": [{"SKUId":1,"description":"a product","price":11,"RFID":"12345678901234567890123456789016"},
                        {"SKUId":2,"description":"another product","price":12,"RFID":"12345678901234567890123456789015"}],
            "restockOrderId" : 2
        };


    beforeEach(async () => {
        await db.startTest();
        await agent.post('/api/newUser').send(user);
        await agent.post('/api/sku').send(sku1);
        await agent.post('/api/sku').send(sku2);
        await agent.post('/api/skuitem').send(skui1);
        await agent.post('/api/skuitem').send(skui2);
        await agent.post('/api/restockOrder').send(reso);
    })

    newReturnOrder(201, data1);
    newReturnOrder(422); //we are not sending any data
    newReturnOrder(404, data2);

    deleteReturnOrder(204, data1, 1);
    deleteReturnOrder(422, data1, -1);

    getReturnOrderById(200, data1, 1);
    getReturnOrderById(404, data1, 2);
    getReturnOrderById(422, data1, 'wrong id');

    getAllReturnOrders(200, data1);

});

function newReturnOrder(expectedHTTPStatus, data) {
    it('create a new return order', function (done) {
        agent.post('/api/returnOrder')
            .send(data)
            .then(function (res) {
                res.should.have.status(expectedHTTPStatus);
                done();
            });
    });
}

function deleteReturnOrder(expectedHTTPStatus, data, id) {
    it('delete a return order', function (done) {
        agent.post('/api/returnOrder')
            .send(data)
            .then(function (res1) {
                res1.should.have.status(201);
                agent.delete('/api/returnOrder/' + id)
                    .then(function (res2) {
                        res2.should.have.status(expectedHTTPStatus);
                        done();
                    });
            });
    });
}

function getReturnOrderById(expectedHTTPStatus, data, id) {
    it('get a return order by id', function (done) {
        agent.post('/api/returnOrder')
            .send(data)
            .then(function (res1) {
                res1.should.have.status(201);
                agent.get('/api/returnOrders/' + id)
                    .then(function (res2) {
                        res2.should.have.status(expectedHTTPStatus);
                        if(res2.status === 200) {
                            res2.body.returnDate.should.equal(data.returnDate);
                            for(let i=0; i<data.products.length; i++) {
                                res2.body.products[i].SKUId.should.equal(data.products[i].SKUId);
                                res2.body.products[i].description.should.equal(data.products[i].description);
                                res2.body.products[i].price.should.equal(data.products[i].price);
                                res2.body.products[i].RFID.should.equal(data.products[i].RFID);
                            }
                            res2.body.restockOrderId.should.equal(data.restockOrderId);
                        }
                        done();
                    });
            });
    });
}

function getAllReturnOrders(expectedHTTPStatus, data) {
    it('get all return orders', function (done) {
        agent.post('/api/returnOrder')
            .send(data)
            .then(function (res1) {
                res1.should.have.status(201);
                agent.post('/api/returnOrder')
                    .send(data)
                    .then(function (res2) {
                        res2.should.have.status(201);
                        agent.get('/api/returnOrders')
                            .then(function (res3) {
                                res3.should.have.status(expectedHTTPStatus);
                                if(res3.status === 200) {
                                    res3.body.length.should.equal(2);
                                }
                                done();
                            });
                    });
            });
    });
}