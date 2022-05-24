'use strict'

const express = require('express');
const skuItemRouter = express.Router()

const db = require('../Modules/DB').db;

const SKUItem = require('../Modules/SKUItem');
const dao = new SKUItem(db.db)
const SKU = require('../Modules/SKU')
const sku = new SKU(db.db)

const SKUItemServices = require('../Services/SKUItemServices')
const siservices = new SKUItemServices(dao, sku)

//get

skuItemRouter.get('/api/skuitems', async (req,res) =>{
   
    const si = await siservices.getSKUItems();
    if(si === false){
      res.status(500).json({error: "generic error"})
    }
    return res.status(200).json(si);
    
  });

  skuItemRouter.get('/api/skuitems/sku/:id', async (req,res) =>{

    if(Object.keys(req.params).length === 0){
      return res.status(422).json({})}

    if(!Number.isInteger(parseFloat(req.params.id)) || req.params.id<0) {
        return res.status(422).json({error: 'validation of id failed'});
    }

    const id = req.params.id;
    const si = await siservices.getSKUItemsBySKUID(id)
    if(si === false){
      return res.status(500).json({error: "generic error"})
    }
    if(si !== []){
      return res.status(200).json(si);
      } else {
      return res.status(404).json({error: "no sku associated to id"});
      }
    
  
  });
  
  skuItemRouter.get('/api/skuitems/:rfid', async (req,res) =>{
  
    if(Object.keys(req.params).length === 0){
      return res.status(422).json({})}


    if(!Number.isInteger(parseFloat(req.params.rfid)) || req.params.rfid<0) {
        return res.status(422).json({error: 'validation of id failed'});
    }
    
   
    const rfid = req.params.rfid;
    const si = await siservices.getSKUItemsByRFID(rfid)
    if(si === false){
      return res.status(500).json({error: "generic error"})
    }
    return res.status(200).json(si);
  
  });

  //post
  
  skuItemRouter.post('/api/skuitem', async (req,res)=>{

    if(Object.keys(req.body).length === 0){
      return res.status(422).json({})}
  

    if(req.body.RFID === undefined || req.body.SKUId === undefined ||
      req.body.DateOfStock === undefined){
        return res.status(422).json({})}  
    
    const item = req.body;
    
    const si = await siservices.createSKUItem(item)
    if(si === false){
      return res.status(503).json({error: "generic error"})
    } else if(si === 404){
      return res.status(404).json({err:"sku with that skuid not found"});
    }
    return res.status(201).json();
  
  });
  
  //put
  skuItemRouter.put('/api/skuitems/:rfid', async (req,res)=>{

    if(Object.keys(req.body).length === 0 || 
    Object.keys(req.params).length === 0){
      return res.status(422).json({})}

    if(!Number.isInteger(parseFloat(req.params.rfid)) || req.params.rfid<0) {
      return res.status(422).json({error: 'validation of id failed'});
    }
  

    if(req.body.newRFID === undefined || req.body.newAvailable === undefined || req.body.newDateOfStock === undefined){
        return res.status(422).json({})}  
  
    const rfid = req.params.rfid;
    const newvalues = req.body;

   const si = await siservices.modifySKUItem(rfid, newvalues)
   if(si === false){
    return res.status(503).json({error: "generic error"})
  }
  return res.status(200).json();
  
  });

  //delete
  
  skuItemRouter.delete('/api/skuitems/:rfid', async (req,res) =>{
    
    if (Object.keys(req.params).length === 0){
      return res.status(422).json({})}

    if(!Number.isInteger(parseFloat(req.params.rfid)) || req.params.rfid<0) {
        return res.status(422).json({error: 'validation of id failed'});
    }

    const rfid = req.params.rfid;
    const si = await siservices.deleteSKUItem(rfid)
    if(si === false){
      return res.status(503).json({error: "generic error"})
    }
    return res.status(204).json();
  
  });
  
  module.exports = skuItemRouter;