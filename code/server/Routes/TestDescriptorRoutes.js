const express = require('express');
const testDescriptorRouter = express.Router();

const db = require('../Modules/DB');
const TestDescriptor = require('../Modules/TestDescriptor');
const testDescriptor = new TestDescriptor(db.db);

//testDescriptor
testDescriptorRouter.get('/api/testDescriptors', async (req,res) =>{

  let x = await testDescriptor.getAllTestDescriptors();
  return res.status(200).json(x);

});
  
testDescriptorRouter.get('/api/testDescriptors/:id', async (req,res) =>{

  const id = req.params.id;
  let x = await testDescriptor.getTestDescriptorByID(id);
  return res.status(200).json(x);

});
  
testDescriptorRouter.post('/api/testDescriptor', async (req,res)=>{

  const td = req.body;
  await testDescriptor.createNewTestDescriptor(td);
  return res.status(201).json();

});

testDescriptorRouter.put('/api/testDescriptor/:id', async (req,res)=>{

  const newvalues = req.body;
  const id = req.params.id;
  await testDescriptor.modifyTestDescriptor(id, newvalues);
  return res.status(200).json();

});

testDescriptorRouter.delete('/api/testDescriptor/:id', async (req,res)=>{

  const id = req.params.id;
  await testDescriptor.deleteTestDescriptor(id);
  return res.status(204).json();

});

module.exports = testDescriptorRouter;