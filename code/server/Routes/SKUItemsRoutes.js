
//skuItems
const express = require('express');

const skuItemRouter = express.Router()
const SKUItem = require('../Modules/SKUItems');
const db = require('../Modules/DB');

const skuItem = new SKUItem(db.db);


app.get('/api/skuitems', async (req,res) =>{

    let x = await skuItem.getAllSKUItems();
    return res.status(200).json(x);
  
  });
  
  app.get('/api/skuitems/:rfid', async (req,res) =>{
  
    const id = req.params.rfid;
    let x = await skuItem.getSKUItemByRFID(id);
    return res.status(200).json(x);
  
  });
  
  app.post('/api/skuitem', async (req,res)=>{
  
    const item = req.body;
    await skuItem.createNewSKUItem(item);
    return res.status(201).json();
  
  });
  
  app.delete('/api/skuitems/:rfid', async (req,res) =>{
  
    const id = req.params.rfid;
    await skuItem.deleteSKUItem(id);
    return res.status(204).json();
  
  });
  
  app.put('/api/skuitems/:rfid', async (req,res)=>{
  
    const id = req.params.rfid;
    const newvalues = req.body;
    await skuItem.modifySKU(id, newvalues);
    return res.status(200).json();
  
  });