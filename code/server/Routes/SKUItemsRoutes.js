'use strict'

const express = require('express');
const SKUItem = require('../Modules/SKUItems');
const db = require('../Modules/DB');

const skuItemRouter = express.Router()
const skuItem = new SKUItem(db.db);

//get

skuItemRouter.get('/api/skuitems', async (req,res) =>{

  let x

  try{
    x = await skuItem.getAllSKUItems();
  }catch(err){
    return res.status(500).json({error: "generic error"})
  }
    
    return res.status(200).json(x);
  
  });

  skuItemRouter.get('/api/skuitems/sku/:id', async (req,res) =>{

    if(Object.keys(req.params).length === 0){
      return res.status(422).json({})}

    const id = req.params.id;
    let x

    try{
      x = await skuItem.getSKUItemsBySKUID(id);
    }catch(err){
      return res.status(500).json({err: "generic error"})
    }
    
    if(x !== []){
      return res.status(200).json(x);
    } else {
      return res.status(404).json({error: "no sku associated to id"});
    }

    
  
  });
  
  skuItemRouter.get('/api/skuitems/:rfid', async (req,res) =>{
  
    if(Object.keys(req.params).length === 0){
      return res.status(422).json({})}
    
    let x;
    const id = req.params.rfid;
    try{
      x = await skuItem.getSKUItemByRFID(id);
    }catch(err){
      return res.status(500).json({err:"generic error"})
    }
   
    return res.status(200).json(x);
  
  });

  //post
  
  skuItemRouter.post('/api/skuitem', async (req,res)=>{

    if(Object.keys(req.body).length === 0){
      return res.status(422).json({})}
  

    if(req.body.RFID === undefined || req.body.SKUId === undefined ||
      req.body.DateOfStock === undefined){
        return res.status(422).json({})}  
    
    const item = req.body;
    console.log(item);
    
    try{
      await skuItem.createNewSKUItem(item);
    }catch(err){
      return res.status(503).json({err:"generic error"})
    }
    
    return res.status(201).json();
  
  });
  
  //put
  skuItemRouter.put('/api/skuitems/:rfid', async (req,res)=>{

    if(Object.keys(req.body).length === 0 || 
    Object.keys(req.params).length === 0){
      return res.status(422).json({})}
  

    if(req.body.newRFID === undefined || req.body.newAvailable === undefined || req.body.newDateOfStock === undefined){
        return res.status(422).json({})}  
  
    const rfid = req.params.rfid;
    const newvalues = req.body;

    try{
      await skuItem.modifySKUItem(rfid, newvalues);
    }catch(err){
      return res.status(503).json({err:"generic error"})
    }
    
    return res.status(200).json();
  
  });

  //delete
  
  skuItemRouter.delete('/api/skuitems/:rfid', async (req,res) =>{
    
    if (Object.keys(req.params).length === 0){
      return res.status(422).json({})}

    const id = req.params.rfid;
    let x

    try{
      x = await skuItem.deleteSKUItem(id);
    }catch(err){
      return res.status(503).json({err: "generic error"})
    }
    
    if(x === false){
      res.status(204).json({message:"did not find the skuitem"})
    }
    return res.status(204).json();
  
  });
  
  module.exports.skuItemRouter = skuItemRouter;
  module.exports.skuItem = skuItem;