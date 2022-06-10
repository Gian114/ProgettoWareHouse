const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
chai.should();

const app = require('../server');
var agent = chai.request.agent(app);

const db = require('../Modules/DB').db;

describe('test internal order apis', () => {

    const pos1 = {
        positionID: "000100010001",
        aisleID: "0001",
        row: "0001",
        col: "0001",
        maxWeight: 150.0,
        maxVolume: 150.0,
        occupiedWeight: 20.0,
        occupiedVolume: 30.0,
    }

    const sku1 = {
        description: "a new sku",
        weight: 100,
        volume: 50,
        notes: "first SKU",
        price: 11,
        availableQuantity: 50
    }

    const skuit1 = {
        "RFID": "1234",
        "SKUId": 1,
        "DateOfStock": "2021/11/29 12:30"
    }

    const user1 = {
        "username": "user1@ezwh.com",
        "name": "John",
        "surname": "Smith",
        "password": "testpassword",
        "type": "customer"
    }


    beforeEach(async () => {
        await db.startTest();
        await agent.post('/api/position').send(pos1);
        await agent.post('/api/sku').send(sku1);
        await agent.post('/api/skuitem').send(skuit1);
        await agent.post('/api/newUser').send(user1);
    })

    io_valid = {
        "issueDate": "2021/11/29 09:33",
        "products": [
            { "SKUId": 1, "description": "a product", "price": 11, "qty": 1 }
        ],
        "customerId": 1
    }

    io_invalid = {
        "issueDate": "2021/11/29 09:33",
        "products": [
            { "SKUId": 1, "description": "a product", "price": 11, "qty": 1 }
        ],
        "customerId": 1,
        "hello": 3
    }
    io_ne_cust = {
        "issueDate": "2021/11/29 09:33",
        "products": [
            { "SKUId": 1, "description": "a product", "price": 11, "qty": 1 }
        ],
        "customerId": 2
    }

    createInternalOrder(201, io_valid);
    createInternalOrder(404, io_ne_cust);
    createInternalOrder(422, io_invalid);
    modifyInternalOrder(200, 1, { "newState": "ACCEPTED" }, io_valid);
    modifyInternalOrder(422, 1, { "newState": "COMPLETED" }, io_valid);
    modifyInternalOrder(200, 1, {
        "newState": "COMPLETED",
        "products": [{ "SkuID": 1, "RFID": "1234" }]
    }, io_valid);
    modifyInternalOrder(404, 2, { "newState": "ACCEPTED" }, io_valid);

    deleteInternalOrder(204, 1, io_valid)
    deleteInternalOrder(204, 1, io_valid) // non ex should still return 204


});

function createInternalOrder(expectedHTTPStatus, req_body) {
    it('create internal order', async function () {
        let res = await agent.post('/api/internalOrders').send(req_body);
        res.should.have.status(expectedHTTPStatus);
        res = await agent.get('/api/internalOrders');
        if (expectedHTTPStatus === 201) {
            res.body.length.should.equal(1);
        }
        else {
            res.body.length.should.equal(0);
        }
    });
}

// pass only valid ios
function modifyInternalOrder(expectedHTTPStatus, id, req_body, io) {
    it('modify internal order', async function () {
        let res = await agent.post('/api/internalOrders').send(io);
        res.should.have.status(201);
        res = await agent.put('/api/internalOrders/' + id).send(req_body);
        res.should.have.status(expectedHTTPStatus);
        res = await agent.get('/api/internalOrders');
        if (expectedHTTPStatus === 200) {
            res.body[0].state.should.equal(req_body.newState);
        }
    });
}

function deleteInternalOrder(expectedHTTPStatus, id, io) {
    it('delete internal order', async function () {
        let res = await agent.post('/api/internalOrders').send(io);
        res = await agent.delete('/api/internalOrders/' + id);
        res.should.have.status(expectedHTTPStatus);
        res = await agent.get('/api/internalOrders');
        res.body.length.should.equal(0);
    });
}