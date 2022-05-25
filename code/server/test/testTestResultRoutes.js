const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
chai.should();

const app = require('../server');
var agent = chai.request.agent(app);

const db = require('../Modules/DB').db;
// const Position = require('../Modules/Position')
// const SKU = require('../Modules/SKU')
// const TestDescriptor = require('../Modules/TestDescriptor')

// const pos_dao = new Position(db.db)
// const sku_dao = new SKU(db.db)
// const td_dao = new TestDescriptor(db.db)

describe('test test results apis', () => {

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
        price: 10.99,
        availableQuantity: 50
    }

    const td1 = {
        name: "td1",
        procedureDescription: "procedure descr",
        idSKU: 1
    }

    const skuit1 = {
        "RFID": "1234",
        "SKUId": 1,
        "DateOfStock": "2021/11/29 12:30"
    }


    beforeEach(async () => {
        await db.startDB();
        await agent.post('/api/position').send(pos1);
        await agent.post('/api/sku').send(sku1);
        await agent.post('/api/testDescriptor').send(td1);
        await agent.post('/api/skuitem').send(skuit1);
    })

    tr_valid = {
        "rfid": "1234",
        "idTestDescriptor": 1,
        "Date": "2021/11/28",
        "Result": true
    }

    tr_wrong_key = {
        "rfid": "1234",
        "idTestDescriptor": 1,
        "Date": "2021/11/28",
        "res": true
    }

    tr_ne_rfid = {
        "rfid": "2345",
        "idTestDescriptor": 1,
        "Date": "2021/11/28",
        "Result": true
    }

    createTestResult(201, tr_valid);
    createTestResult(422, tr_wrong_key);
    createTestResult(404, tr_ne_rfid);
    getTestResults(404, "2345", 'no sku item associated to rfid', tr_valid);
    getTestResults(200, "1234", tr_valid, tr_valid);

});

function createTestResult(expectedHTTPStatus, data) {
    it('create test result', function (done) {
        if (data !== undefined) {
            agent.post('/api/skuitems/testResult')
                .send(data)
                .then(function (res) {
                    res.should.have.status(expectedHTTPStatus);
                    done();
                });
        } else {
            agent.post('/api/skuitems/testResult') //we are not sending any data
                .then(function (res) {
                    res.should.have.status(expectedHTTPStatus);
                    done();
                });
        }

    });
}

function getTestResults(expectedHTTPStatus, rfid, body, tr) {
    it('get test results', async function () {
        await agent.post('/api/skuitems/testResult').send(tr);
        const res = await agent.get('/api/skuitems/' + rfid + '/testResults');
        res.should.have.status(expectedHTTPStatus);
        if (res.status == 200) {
            res.body[0].Date.should.equal(body.Date);
            res.body[0].idTestDescriptor.should.equal(body.idTestDescriptor);
            res.body[0].Result.should.equal(body.Result);
        }
        else {
            res.body.should.equal(body);
        }

    });
}
