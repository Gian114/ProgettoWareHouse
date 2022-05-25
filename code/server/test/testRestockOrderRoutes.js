"use strict"

const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
chai.should();

const app = require('../server');
var agent = chai.request.agent(app);

const db = require('../Modules/DB').db;



describe('test restock Order apis', () => {

 
    //testing create ro
    let data = 
        {
            
                "issueDate":"2021/11/29 09:33",
                "products": [{"SKUId":12,"description":"a product","price":10.99,"qty":30},
                            {"SKUId":180,"description":"another product","price":11.99,"qty":20}],
                "supplierId" : 1
            
        }

    let data1 = 
        {
            
                "issueDate":"2021/11/29 09:33",
                "products": [{"SKUId":12,"description":"a product","price":10.99,"qty":30}],
                "supplierId" : 2
            
        }
    //create user
    const user1 = 
    { 
            "username":"user1@ezwh.com",
            "name":"John",
            "surname" : "Smith",
            "password" : "testpassword",
            "type" : "supplier"
    }

    
    beforeEach(async () => {

        await db.startDB();
        await agent.post('/api/newUser').send(user1);
        
    })


    //testing createsku api
    newRestockOrder(201, data);
    newRestockOrder(404, data1);
    newRestockOrder(422);


    /*  
    //testing get
    getPosition(200, data1)
    getPosition(500)
    */ 
    
    //testing delete
    //deletePosition(204, "800234543412", data);
    
});




function newRestockOrder(expectedHTTPStatus, data) {
    it('create a new restock order', async function () {
        if (data !== undefined) {
            let res = await agent.post('/api/restockOrder').send(data)
                    res.should.have.status(expectedHTTPStatus)
             } else {
            let res = await agent.post('/api/restockOrder') //not sending any data
                    res.should.have.status(expectedHTTPStatus);
        }
    });
}

/*
function deletePosition(expectedHTTPStatus, id, data) {
    it('Deleting position', async function () {
        let add = await agent.post('/api/position').send(data)
                    add.should.have.status(201);
        let res = await agent.delete('/api/position/' + id)
                res.should.have.status(expectedHTTPStatus);
    });
}
*/