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
                "products": [{"SKUId":1,"description":"a product","price":11,"qty":30},
                            {"SKUId":1,"description":"another product","price":12,"qty":20}],
                "supplierId" : 1
            
        }

    let data1 = 
        {
            
                "issueDate":"2021/11/29 09:33",
                "products": [{"SKUId":1,"description":"a product","price":11,"qty":30}],
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
    //create sku
    let sku = 
    {
        "description" : "another sku",
        "weight" : 100,
        "volume": 50,
        "notes": "first sku",
        "price": 11,
        "availableQuantity":50
    }
    //create skuItem
    let skuItems = 
         [
          {"SKUId":12,"rfid":"12345678901234567890123456789016"},
          {"SKUId":12,"rfid":"12345678901234567890123456789017"}
         ]
    

    
    beforeEach(async () => {

        await db.startTest();
        await agent.post('/api/newUser').send(user1);
        await agent.post('/api/sku').send(sku);
        
    })


    //testing create restock api
    newRestockOrder(201, data);
    newRestockOrder(404, data1);
    newRestockOrder(422);



    //testing get
    getRestockOrder(200, 1, data);

    //testing put
    //putSkuItems(200,1,skuItems, data);
    

    //testing delete
    deleteRestockOrder(204, 1, data);
    deleteRestockOrder(422, -1, data);
    deleteRestockOrder(503, 2, data);
    
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


function getRestockOrder(expectedHTTPStatus, id, data) {
    it('get restock order', async function () {
        await agent.post('/api/restockOrder').send(data);
        const res = await agent.get('/api/restockOrders');
        res.should.have.status(expectedHTTPStatus);
        
        const res2 = await agent.get('/api/restockOrders/'+id);
        res2.should.have.status(expectedHTTPStatus);
        
    });
}

/*
function putSkuItems(expectedHTTPStatus, id, items, data){
    it('put restock order', async function () {
        await agent.post('/api/restockOrder').send(data);
        await agent.put('api/restockOrder/'+id).send({"newState":"DELIVERED"});
        const res = await agent.put('/api/restockOrders'+id+'/skuItems').send(items);
        res.should.have.status(expectedHTTPStatus);
        
    });

}
*/

function deleteRestockOrder(expectedHTTPStatus,id,data){
    it('Deleting restock', async function () {
        let add = await agent.post('/api/restockOrder').send(data)
                    add.should.have.status(201);
        let res = await agent.delete('/api/restockOrder/'+id)
                res.should.have.status(expectedHTTPStatus);
    });
}
