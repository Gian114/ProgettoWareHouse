const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
chai.should();

const app = require('../server');
var agent = chai.request.agent(app);

const db = require('../Modules/DB').db;

describe('test item apis', () => {

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

    const user = 
        {
            "username": "user1@ezwh.com",
            "name": "John",
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
        await db.startTest();
        await agent.post('/api/sku').send(sku1);
        await agent.post('/api/sku').send(sku2);
        await agent.post('/api/newUser').send(user);
        await agent.post('/api/item').send(data1);
    });

    newItem(201, data2);
    newItem(422, data3);
    newItem(422, data4);
    newItem(422); //we are not sending any data
    newItem(404, data5);
    newItem(404, data6);

    modifyItem(200, 12, newData);
    modifyItem(404, 1, newData);
    modifyItem(422, 12); //we are not sending any data
    modifyItem(422, -1, newData);

    deleteItem(204, 12);
    deleteItem(422, 'wrong id');

    getItemById(200, data2, data2.id);
    getItemById(404, data2, 1);
    getItemById(422, data2, -1);

    getAllItems(200, data2);

});

function newItem(expectedHTTPStatus, data) {
    it('create a new item', function (done) {
        agent.post('/api/item')
            .send(data)
            .then(function (res) {
                res.should.have.status(expectedHTTPStatus);
                done();
            });
    });
}

function modifyItem(expectedHTTPStatus, id, newData) {
    it('modify an item', function (done) {
        agent.put('/api/item/' + id)
            .send(newData)
            .then(function (res) {
                res.should.have.status(expectedHTTPStatus);
                done();
            });
    });
}

function deleteItem(expectedHTTPStatus, id) {
    it('delete an item', function (done) {
        agent.delete('/api/items/' + id)
            .then(function (res) {
                res.should.have.status(expectedHTTPStatus);
                done();
            });
    });
}

function getItemById(expectedHTTPStatus, data, id) {
    it('get an item by id', function (done) {
        agent.post('/api/item')
            .send(data)
            .then(function (res1) {
                res1.should.have.status(201);
                agent.get('/api/items/' + id)
                    .then(function (res2) {
                        res2.should.have.status(expectedHTTPStatus);
                        if(res2.status === 200) {
                            res2.body.id.should.equal(data.id);
                            res2.body.description.should.equal(data.description);
                            res2.body.price.should.equal(data.price);
                            res2.body.SKUId.should.equal(data.SKUId);
                            res2.body.supplierId.should.equal(data.supplierId);
                        }
                        done();
                    });
            });
    });
}

function getAllItems(expectedHTTPStatus, data) {
    it('get all items', function (done) {
        agent.post('/api/item')
            .send(data)
            .then(function (res1) {
                res1.should.have.status(201);
                agent.get('/api/items')
                    .then(function (res2) {
                        res2.should.have.status(expectedHTTPStatus);
                        if(res2.status === 200) {
                            res2.body.length.should.equal(2);
                        }
                        done();
                    });
            });
    });
}