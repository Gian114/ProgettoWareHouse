const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
chai.should();

const app = require('../server');
var agent = chai.request.agent(app);

const db = require('../Modules/DB').db;






describe('test skuitems apis', () => {

    beforeEach(async () => {

        await db.dropTableSKUItem()
        await db.createTableSKUItem()
        await db.activateForeignKeyControl()
        
    })

    afterEach(async ()=>{
        await db.dropTableSKUItem()
    })

    
    let data = 
    {
        "RFID":"12345678901234567890123456789015",
        "SKUId":1,
        "DateOfStock":"2021/11/29 12:30"
    }

    
    //to insert a skuitem i must call the post api for sku too
    let sku =
    {
            "description" : "another sku",
            "weight" : 100,
            "volume" : 50,
            "notes" : "first SKU",
            "price" : 10.99,
            "availableQuantity" : 50
    }

    newSKUItem(201, sku, data);
    newSKUItem(422);




    //test modify skuitem

    let modifiedItem = 
    {
        "newRFID":"12345678901234567890123456789026",
        "newAvailable": 1,
        "newDateOfStock":"2021/11/29 12:30"
    }

    modifyItem(200, "12345678901234567890123456789015", modifiedItem)
    modifyItem(422)

    //deleting item

    deleteSKUItem(204, "12345678901234567890123456789026")

    
  
});


function newSKUItem(expectedHTTPStatus, sku, data) {
    it('create a new skuitem', function (done) {
        if (data !== undefined) {
            agent.post('/api/sku')
            .send(sku)
            .then(function(res){
                res.should.have.status(201)
            agent.post('/api/skuitem')
                .send(data)
                .then(function (res) {
                    res.should.have.status(expectedHTTPStatus);
                    done();
                });
            }).catch(done())
             } else {
            agent.post('/api/skuitem') //we are not sending any data
                .then(function (res) {
                    res.should.have.status(expectedHTTPStatus);
                    done();
                });
        }

    });
}


function modifyItem(expectedHTTPStatus, RFID, newbody) {
    it('modify skuitem', function (done) {
            agent.put('/api/skuitems/' + RFID)
                .send(newbody)
                .then(function (res) {
                    res.should.have.status(expectedHTTPStatus);
                    done();
                });
             })
    }
  
    function deleteSKUItem(expectedHTTPStatus, rfid) {
        it('Deleting skuitem', function (done) {
            agent.delete('/api/skuitems/' + rfid)
                .then(function (res) {
                    res.should.have.status(expectedHTTPStatus);
                    done();
                });
        });
    }