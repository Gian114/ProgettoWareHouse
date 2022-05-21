'use strict'

const express = require('express');
const testDescriptorRouter = express.Router();

const TestDescriptorServices = require('../Services/TestDescriptorServices');
const testDescriptorServices = new TestDescriptorServices();

//get

testDescriptorRouter.get('/api/testDescriptors', async (req, res) => {

    const x = await testDescriptorServices.getAllTestDescriptors();
    if(x === false){
        return res.status(500).json({error: "generic error"})
    }
    return res.status(200).json(x);

});
  
testDescriptorRouter.get('/api/testDescriptors/:id', async (req, res) => {

    if(!Number.isInteger(parseFloat(req.params.id)) || req.params.id<0) {
        return res.status(422).json({error: 'validation of id failed'});
    }

    const id = req.params.id;
    const x = testDescriptorServices.getTestDescriptorById(id);

    if (x === false) {
        return res.status(500).json({error: "generic error"});
    }
    else if(x === '') {
        return res.status(404).json({error: "no test descriptor associated id"});
    }
    return res.status(200).json(x);
  
});

//post
  
testDescriptorRouter.post('/api/testDescriptor', async (req, res) => {
    
    if(req.body.name === undefined || req.body.procedureDescription === undefined || !Number.isInteger(parseFloat(req.body.idSKU)) || req.body.idSKU<0) {
        return res.status(422).json({err:"validation of request body failed"});
    }

    const td = req.body;
    const x = await testDescriptorServices.createNewTestDescriptor(td);
    if(x === false ){
        return res.status(503).json({error: "generic error"});
    }
    else if(x === '') {
        return res.status(404).json({error: "no sku associated idSKU"});
    }
    return res.status(201).json();

});

//put

testDescriptorRouter.put('/api/testDescriptor/:id', async (req, res) => {
    
    if(req.body.newName === undefined || req.body.newProcedureDescription === undefined || !Number.isInteger(parseFloat(req.body.newIdSKU)) || !Number.isInteger(parseFloat(req.params.id)) || req.params.id<0 || req.body.newIdSKU<0) {
        return res.status(422).json({err:"validation of request body or of id failed"});
    }

    const newValues = req.body;
    const id = req.params.id;
    const x = await testDescriptorServices.modifyTestDescriptor(newValues, id);

    if(x === false){
        return res.status(503).json({error: "generic error"})
    } 
    else if(x === '') {
        return res.status(404).json({error: "no test descriptor associated id or no sku associated to IDSku"});
    }
    return res.status(200).json();
    
});

//delete

testDescriptorRouter.delete('/api/testDescriptor/:id', async (req, res) => {

    if(!Number.isInteger(parseFloat(req.params.id)) || req.params.is<0){
        return res.status(422).json({error: 'validation of id failed'});
    }

    const id = req.params.id;
    const x = await testDescriptorServices.deleteTestDescriptor(id);

    if(x === false){
        return res.status(503).json({error: "generic error"})
    } 
    return res.status(204).json();

});

module.exports = testDescriptorRouter;