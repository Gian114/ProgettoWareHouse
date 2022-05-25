"use strict"

const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
chai.should();

const app = require('../server');
var agent = chai.request.agent(app);

const db = require('../Modules/DB').db;



describe('test position apis', () => {

    beforeEach(async () => {

        await db.startDB();
        
    })

 
    //testing create position
    let data = 
        {
            "positionID" : "800234543412",
            "aisleID" : "8002",
            "row" : "3454",
            "col" : "3412",
            "maxWeight" : 1000,
            "maxVolume" : 1000
        }

    //testing createsku api
    newPosition(201, data);
    newPosition(422);

    let data1 = 
        {
            "positionID" : "831222543414",
            "aisleID" : "8312",
            "row" : "2254",
            "col" : "3414",
            "maxWeight" : 1000,
            "maxVolume" : 1000
        }

    /*  
    //testing get
    getPosition(200, data1)
    getPosition(500)
    */ 
    
    //testing delete
    deletePosition(204, "800234543412", data);
    
});




function newPosition(expectedHTTPStatus, data) {
    it('create a new position', async function () {
        if (data !== undefined) {
            let res = await agent.post('/api/position').send(data)
                    res.should.have.status(expectedHTTPStatus)
             } else {
            let res = await agent.post('/api/position') //not sending any data
                    res.should.have.status(expectedHTTPStatus);
        }
    });
}


/*
function getPosition(expectedHTTPStatus, expectedData) {
    it('getting positions', async function () {
                let res = await agent.post('/api/position').send(expectedData)
                    if(expectedData === undefined){
                        res.should.have.status(422)
                    } else {res.should.have.status(201);}
                    res = await agent.get('/api/positions')
                        res.should.have.status(expectedHTTPStatus);
                        if(expectedHTTPStatus === 200){
                            res[0].body.id.should.equal(expectedData.positionID);
                            res[0].body.aisle_id.should.equal(expectedData.aisleID);
                            res[0].body.row.should.equal(expectedData.row);
                            res[0].body.col.should.equal(expectedData.col);
                            res[0].body.max_weight.should.equal(expectedData.maxWeight);
                            res[0].body.max_volume.should.equal(expectedData.maxVolume);
                            res[0].body.occupied_weight.should.equal(0);
                            res[0].body.occupied_volume.should.equal(0);}
                        
                })
}
*/




function deletePosition(expectedHTTPStatus, id, data) {
    it('Deleting position', async function () {
        let add = await agent.post('/api/position').send(data)
                    add.should.have.status(201);
        let res = await agent.delete('/api/position/' + id)
                res.should.have.status(expectedHTTPStatus);
    });
}
