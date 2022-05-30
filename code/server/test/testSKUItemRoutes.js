const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
chai.should();

const app = require('../server');
var agent = chai.request.agent(app);

const db = require('../Modules/DB').db;



describe('test skuitems apis', () => {

    beforeEach(async () => {
            await db.startDB()

            let sku =
            {
                    "description" : "another sku",
                    "weight" : 100,
                    "volume" : 50,
                    "notes" : "first SKU",
                    "price" : 10.99,
                    "availableQuantity" : 50
            }
            await agent.post('/api/sku').send(sku)
    })

  

    let data = 
    {
        "RFID":"12345678901234567890123456789015",
        "SKUId":1,
        "DateOfStock":"2021/11/29 12:30"
    }

    let wrongData = 
    {
        "RFID":"12345678901234567890123456789015",
        "SKUId":2,
        "DateOfStock":"2021/11/29 12:30"
    }


    
    //to insert a skuitem i must have the sku so i called a post inside the beforeEach

    newSKUItem(201, data);
    newSKUItem(422);
    newSKUItem(404, wrongData)
    



    //test modify skuitem

    let modifiedItem = 
    {
        "newRFID":"12345678901234567890123456789026",
        "newAvailable": 1,
        "newDateOfStock":"2021/11/29 12:30"
    }

    modifyItem(200, data, "12345678901234567890123456789015", modifiedItem)
    modifyItem(422, data)

    //deleting item so i pass the item to be created and after i delete it

    deleteSKUItem(204, data, "12345678901234567890123456789026")

    
  
});


function newSKUItem(expectedHTTPStatus, data) {
    it('create a new skuitem', async function () {
        if (data !== undefined) {
            let res = await agent.post('/api/skuitem').send(data)
                    res.should.have.status(expectedHTTPStatus);
             } else {
                let res = await agent.post('/api/skuitem') //we are not sending any data
                    res.should.have.status(expectedHTTPStatus);
             }
    });
}


function modifyItem(expectedHTTPStatus, skuitem, RFID, newbody) {
    it('modify skuitem', async function () {
            let res = await agent.post('/api/skuitem').send(skuitem)
                if(skuitem !== undefined){
                    res.should.have.status(201)}
                    else{res.should.have.status(422)}
                res = await agent.put('/api/skuitems/' + RFID).send(newbody)
                    res.should.have.status(expectedHTTPStatus);    
          
             })
    }
  
    function deleteSKUItem(expectedHTTPStatus, skuitem, rfid) {
        it('Deleting skuitem', async function () {
            let res = await agent.post('/api/skuitem').send(skuitem)
                    if(skuitem !== undefined){
                        res.should.have.status(201)}
                        else{res.should.have.status(422)}
                res = await agent.delete('/api/skuitems/' + rfid)
                    res.should.have.status(expectedHTTPStatus);
          
        });
    }