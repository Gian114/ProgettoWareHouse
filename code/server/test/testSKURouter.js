const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
chai.should();

const app = require('../server');
var agent = chai.request.agent(app);

const db = require('../Modules/DB').db;



describe('test sku apis', () => {

    beforeEach(async () => {

        await db.startTest();
        
    })

 
    //testing create sku
    let data = 
        {
            "description" : "a new sku",
            "weight" : 100,
            "volume" : 50,
            "notes" : "first SKU",
            "price" : 11,
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
    it('create a new sku', async function () {
        if (data !== undefined) {
            let res = await agent.post('/api/sku').send(data)
                    res.should.have.status(expectedHTTPStatus)
             } else {
            let res = await agent.post('/api/sku') //we are not sending any data
                    res.should.have.status(expectedHTTPStatus);
        }
    });
}

function getSKU(expectedHTTPStatus, id, expectedData) {
    it('getting skus', async function () {
                let res = await agent.post('/api/sku').send(expectedData)
                    if(expectedData === undefined){
                        res.should.have.status(422)
                    } else {res.should.have.status(201);}
                    res = await agent.get('/api/skus/' + id)
                        res.should.have.status(expectedHTTPStatus);
                        if(expectedHTTPStatus === 200){
                            res.body.id.should.equal(id);
                            res.body.description.should.equal(expectedData.description);
                            res.body.weight.should.equal(expectedData.weight);
                            res.body.volume.should.equal(expectedData.volume);
                            res.body.notes.should.equal(expectedData.notes);
                            res.body.price.should.equal(expectedData.price);
                            res.body.availableQuantity.should.equal(expectedData.availableQuantity);}
                        
                })
}



function deleteSKU(expectedHTTPStatus, id) {
    it('Deleting sku', async function () {
        let res = await agent.delete('/api/skus/' + id)
        res.should.have.status(expectedHTTPStatus);
    });
}
