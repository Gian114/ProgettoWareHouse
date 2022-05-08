//sku
const express = require('express');
const SKU = require('../Modules/SKU');

const skuRouter = express.Router()



const db = require('../Modules/DB');
const sku = new SKU(db.db);

skuRouter.post('/api/sku', async (req,res)=>{

    const item = req.body;
    
    await sku.createSKU(item);
    return res.status(201).json();
  
  });
  
  skuRouter.get('/api/skus', async (req,res) =>{
  
    let x = await sku.getListofSKU();
    return res.status(200).json(x);
  
  });
  
  skuRouter.get('/api/skus/:id', async (req,res) =>{
  
    const id = req.params.id;
    let x = await sku.getSKUByID(id);
    return res.status(200).json(x);
  
  });
  
  skuRouter.delete('/api/skus/:id', async (req,res) =>{
  
    const id = req.params.id;
    await sku.deleteSKU(id);
    return res.status(204).json();
  
  });
  
  skuRouter.put('/api/sku/:id', async (req,res)=>{
  
    const id = req.params.id;
    const newvalues = req.body;
    await sku.modifySKU(id, newvalues);
    return res.status(200).json();
  
  });
  

  module.exports = skuRouter;