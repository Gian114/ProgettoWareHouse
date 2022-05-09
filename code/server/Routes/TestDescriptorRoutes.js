'use strict'

const express = require('express');
const testDescriptorRouter = express.Router();

const db = require('../Modules/DB');
const TestDescriptor = require('../Modules/TestDescriptor');
const testDescriptor = new TestDescriptor(db.db);
const SKURoutes = require('./SKURoutes');
const sku = SKURoutes.sku;

//get

testDescriptorRouter.get('/api/testDescriptors', async (req,res) =>{

  try {
    let x = await testDescriptor.getAllTestDescriptors();
    return res.status(200).json(x);
  } catch(err) {
    return res.status(500).json({error: "generic error"});
  }

});
  
testDescriptorRouter.get('/api/testDescriptors/:id', async (req,res) =>{

  if(req.params.id === undefined){
    return res.status(422).json({error: 'validation of id failed'});
  }

  const id = req.params.id;
  try {
    let x = await testDescriptor.getTestDescriptorByID(id);
  } catch(err) {
    return res.status(500).json({error: "generic error"});
  }

  if(x === ''){
    return res.status(404).json({error: "no test descriptor associated id"});
  } else {
    return res.status(200).json(x);
  }
  
});

//post
  
testDescriptorRouter.post('/api/testDescriptor', async (req,res)=>{
    
  if(req.body.name === undefined || req.body.procedureDescription === undefined || req.body.idSKU === undefined){
        return res.status(422).json({err:"validation of request body failed"});
    }

  const td = req.body;
  let y = await sku.getSKUByID(td.idSKU);
  if(y === '') {
    return res.status(404).json({error: "no sku associated idSKU"});
  }
    
  try{
    await testDescriptor.createNewTestDescriptor(td);
    return res.status(201).json();
  } catch(err) {
    return res.status(503).json({error: "generic error"});
  }

});

//put

testDescriptorRouter.put('/api/testDescriptor/:id', async (req,res)=>{
    
  if(req.body.newName === undefined || req.body.newProcedureDescription === undefined || req.body.newIdSKU === undefined || req.params.id === undefined){
        return res.status(422).json({err:"validation of request body or of id failed"});
    }

  const newvalues = req.body;
  const id = req.params.id;

  let x = await testDescriptor.getTestDescriptorByID(id);
  let y = await sku.getSKUByID(newvalues.newIdSKU);
  if(x === '' || y === '') {
    return res.status(404).json({error: "no test descriptor associated id or no sku associated to IDSku"});
  }

  try{
    await testDescriptor.modifyTestDescriptor(id, newvalues);
    return res.status(200).json();
  } catch(err) {
    return res.status(503).json({error: "generic error"});
  }
  
});

//delete

testDescriptorRouter.delete('/api/testDescriptor/:id', async (req,res)=>{

  if(req.params.id === undefined){
    return res.status(422).json({error: 'validation of id failed'});
  }

  const id = req.params.id;

  try {
    await testDescriptor.deleteTestDescriptor(id);
    return res.status(204).json();
  } catch(err) {
    return res.status(503).json({error: "generic error"});
  }

});

module.exports = testDescriptorRouter;