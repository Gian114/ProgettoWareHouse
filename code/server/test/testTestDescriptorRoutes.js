const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
chai.should();

const app = require('../server');
var agent = chai.request.agent(app);

const db = require('../Modules/DB').db;

describe('test test desciptor apis', () => {

    const sku =
        {
                "description" : "another sku",
                "weight" : 100,
                "volume" : 50,
                "notes" : "first SKU",
                "price" : 10.99,
                "availableQuantity" : 50
        };
    
    const data1 = //right
        {
            "name": "test descriptor 3",
            "procedureDescription": "This test is described by...",
            "idSKU" : 1
        };

    const data2 = //wrong: no sku associated to id
        {
            "name": "test descriptor 1",
            "procedureDescription": "This test is described by...",
            "idSKU" : 2
        };

    const data3 = //wrong: validation of request body failed
        {
            "name": "test descriptor 1",
            "procedureDescription": "This test is described by...",
            "idSKU" : -3
        };

    const newData1 = //right
        {
            "newName": "test descriptor 1",
            "newProcedureDescription": "This test is described by...",
            "newIdSKU": 1
        };

    const newData2 = //wrong: no sku associated to id
        {
            "newName": "test descriptor 1",
            "newProcedureDescription": "This test is described by...",
            "newIdSKU": 2
        };


    beforeEach(async () => {
        await db.startTest();
        await agent.post('/api/sku/').send(sku);
    });

    newTestDescriptor(201, data1);
    newTestDescriptor(404, data2);
    newTestDescriptor(422, data3);
    newTestDescriptor(422); //we are not sending any data
    
    modifyTestDescriptor(200, data1, 1, newData1);
    modifyTestDescriptor(404, data1, 1, newData2);
    modifyTestDescriptor(404, data1, 2, newData1);
    modifyTestDescriptor(422, data1, 1); //we are not sending any data
    modifyTestDescriptor(422, data1, 'wrong id', newData1);

    deleteTestDescriptor(204, data1, 1);
    deleteTestDescriptor(422, data1, -1);

    getTestDescriptorById(200, data1, 1);
    getTestDescriptorById(404, data1, 2);
    getTestDescriptorById(422, data1, -1);

    getAllTestDescriptors(200, data1);

});

function newTestDescriptor(expectedHTTPStatus, data) {
    it('create a new test descriptor', function (done) {
        agent.post('/api/testDescriptor/')
            .send(data)
            .then(function (res) {
                res.should.have.status(expectedHTTPStatus);
                done();
            });
    });
}

function modifyTestDescriptor(expectedHTTPStatus, data, id, newData) {
    it('modify a test descriptor', function (done) {
        agent.post('/api/testDescriptor/')
            .send(data)
            .then(function (res1) {
                res1.should.have.status(201);
                agent.put('/api/testDescriptor/' + id)
                    .send(newData)
                    .then(function (res2) {
                        res2.should.have.status(expectedHTTPStatus);
                        done();
                    });
            });
    });
}

function deleteTestDescriptor(expectedHTTPStatus, data, id) {
    it('delete a test descriptor', function (done) {
        agent.post('/api/testDescriptor/')
            .send(data)
            .then(function (res1) {
                res1.should.have.status(201);
                agent.delete('/api/testDescriptor/' + id)
                    .then(function (res2) {
                        res2.should.have.status(expectedHTTPStatus);
                        done();
                    });
            });
    });
}

function getTestDescriptorById(expectedHTTPStatus, data, id) {
    it('get a test descriptor by id', function (done) {
        agent.post('/api/testDescriptor/')
            .send(data)
            .then(function (res1) {
                res1.should.have.status(201);
                agent.get('/api/testDescriptors/' + id)
                    .then(function (res2) {
                        res2.should.have.status(expectedHTTPStatus);
                        if(res2.status === 200) {
                            res2.body.id.should.equal(id);
                            res2.body.name.should.equal(data.name);
                            res2.body.procedureDescription.should.equal(data.procedureDescription);
                            res2.body.idSKU.should.equal(data.idSKU);
                        }
                        done();
                    });
            });
    });
}

function getAllTestDescriptors(expectedHTTPStatus, data) {
    it('get all test descriptors', function (done) {
        agent.post('/api/testDescriptor/')
            .send(data)
            .then(function (res1) {
                res1.should.have.status(201);
                agent.post('/api/testDescriptor/')
                    .send(data)
                    .then(function (res2) {
                        res2.should.have.status(201);
                        agent.get('/api/testDescriptors/')
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