const express = require('express');
const db = require('../Modules/db_singleton');

const testDescriptor_router = express.Router()
const testDescriptor = require('../Modules/TestDescriptor');

//testDescriptor
app.get('/api/testDescriptors', async (req,res) =>{

    let x = await testDescriptor.getAllTestDescriptors();
    return res.status(200).json(x);
  
  });
  
  app.get('/api/testDescriptors/:id', async (req,res) =>{
  
    const id = req.params.id;
    let x = await testDescriptor.getTestDescriptorByID(id);
    return res.status(200).json(x);
  
  });
  
  app.post('/api/testDescriptor', async (req,res)=>{
  
    const td = req.body;
    await testDescriptor.createNewTestDescriptor(td);
    return res.status(201).json();
  
  });
  
  app.put('/api/testDescriptor/:id', async (req,res)=>{
  
    const newvalues = req.body;
    const id = req.params.id;
    await testDescriptor.modifyTestDescriptor(id, newvalues);
    return res.status(200).json();
  
  });
  
  app.delete('/api/testDescriptor/:id', async (req,res)=>{
  
    const id = req.params.id;
    await testDescriptor.deleteTestDescriptor(id, newvalues);
    return res.status(204).json();
  
  });