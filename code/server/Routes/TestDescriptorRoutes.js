'use strict'

const express = require('express');
const testDescriptorRouter = express.Router();

const TestDescriptorServices = require('../Services/TestDescriptorServices');
const testDescriptorServices = new TestDescriptorServices();

//get

testDescriptorRouter.get('/api/testDescriptors', async (req, res) => {

    return testDescriptorServices.getAllTestDescriptors(res);

});
  
testDescriptorRouter.get('/api/testDescriptors/:id', async (req, res) => {

    if(!Number.isInteger(parseFloat(req.params.id)) || req.params.id<0) {
        return res.status(422).json({error: 'validation of id failed'});
    }

    const id = req.params.id;
    return testDescriptorServices.getTestDescriptorById(res, id);
  
});

//post
  
testDescriptorRouter.post('/api/testDescriptor', async (req, res) => {
    
    if(req.body.name === undefined || req.body.procedureDescription === undefined || !Number.isInteger(parseFloat(req.body.idSKU)) || req.body.idSKU<0) {
        return res.status(422).json({err:"validation of request body failed"});
    }

    const td = req.body;
    return testDescriptorServices.createNewTestDescriptor(res, td);

});

//put

testDescriptorRouter.put('/api/testDescriptor/:id', async (req, res) => {
    
    if(req.body.newName === undefined || req.body.newProcedureDescription === undefined || !Number.isInteger(parseFloat(req.body.newIdSKU)) || !Number.isInteger(parseFloat(req.params.id)) || req.params.id<0 || req.body.newIdSKU<0) {
        return res.status(422).json({err:"validation of request body or of id failed"});
    }

    const newValues = req.body;
    const id = req.params.id;
    return testDescriptorServices.modifyTestDescriptor(res, newValues, id);
  
});

//delete

testDescriptorRouter.delete('/api/testDescriptor/:id', async (req, res) => {

    if(!Number.isInteger(parseFloat(req.params.id)) || req.params.is<0){
        return res.status(422).json({error: 'validation of id failed'});
    }

    const id = req.params.id;
    testDescriptorServices.deleteTestDescriptor(res, id);
  

});

module.exports = testDescriptorRouter;