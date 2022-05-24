const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
chai.should();

const app = require('../server');
var agent = chai.request.agent(app);

const db = require('../Modules/DB').db;



describe('test sku apis', () => {

    beforeEach(async () => {
        await db.dropTableSKU()
        await db.createTableSKU()
        
    })

    afterEach(async ()=>{
        await db.dropTableSKU()
    })
    //testing create sku
    let data = 
        {
            "description" : "a new sku",
            "weight" : 100,
            "volume" : 50,
            "notes" : "first SKU",
            "price" : 10.99,
            "availableQuantity" : 50
        }

    //testing createsku api
    newSKU(201, data);
    newSKU(422);

    let sku = 
        {
            "description" : "another sku",
            "weight" : 120,
            "volume" : 60,
            "notes" : "second SKU",
            "price" : 12,
            "availableQuantity" : 55
        }

      
    //testing get sku
    getSKU(200, 1, sku)
    getSKU(422) //no id so 422
    getSKU(404, 3) //no associated sku with that id
    
    //testing delete
    deleteSKU(204, 1);
    
});




function newSKU(expectedHTTPStatus, data) {
    it('create a new sku', function (done) {
        if (data !== undefined) {
            agent.post('/api/sku')
                .send(data)
                .then(function (res) {
                    res.should.have.status(expectedHTTPStatus);
                    done();
                });
             } else {
            agent.post('/api/sku') //we are not sending any data
                .then(function (res) {
                    res.should.have.status(expectedHTTPStatus);
                    done();
                });
        }

    });
}

function getSKU(expectedHTTPStatus, id, expectedData) {
    it('getting skus', function (done) {
                agent.post('/api/sku')
                .send(expectedData)
                .then(function (res) {
                    if(expectedData === undefined){
                        res.should.have.status(422)
                    } else {res.should.have.status(201);}
                    agent.get('/api/skus/' + id)
                    .then(function (r) {
                        r.should.have.status(expectedHTTPStatus);
                        if(expectedHTTPStatus === 200){
                        r.body.id.should.equal(id);
                        r.body.description.should.equal(expectedData.description);
                        r.body.weight.should.equal(expectedData.weight);
                        r.body.volume.should.equal(expectedData.volume);
                        r.body.notes.should.equal(expectedData.notes);
                        r.body.price.should.equal(expectedData.price);
                        r.body.availableQuantity.should.equal(expectedData.availableQuantity);}
                        done();
                    });
                })
            
            });
}



function deleteSKU(expectedHTTPStatus, id) {
    it('Deleting sku', function (done) {
        agent.delete('/api/skus/' + id)
            .then(function (res) {
                res.should.have.status(expectedHTTPStatus);
                done();
            });
    });
}
