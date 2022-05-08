//sku
const express = require('express');
const SKU = require('../Modules/SKU');

const skuRouter = express.Router()

const sku = new SKU(db.db);

const db = require('../Modules/DB');

app.post('/api/sku', async (req,res)=>{

    const item = req.body;
    
    await sku.createSKU(item);
    return res.status(201).json();
  
  });
  
  app.get('/api/skus', async (req,res) =>{
  
    let x = await sku.getListofSKU();
    return res.status(200).json(x);
  
  });
  
  app.get('/api/skus/:id', async (req,res) =>{
  
    const id = req.params.id;
    let x = await sku.getSKUByID(id);
    return res.status(200).json(x);
  
  });
  
  app.delete('/api/skus/:id', async (req,res) =>{
  
    const id = req.params.id;
    await sku.deleteSKU(id);
    return res.status(204).json();
  
  });
  
  app.put('/api/sku/:id', async (req,res)=>{
  
    const id = req.params.id;
    const newvalues = req.body;
    await sku.modifySKU(id, newvalues);
    return res.status(200).json();
  
  });
  

  module.exports = sku;