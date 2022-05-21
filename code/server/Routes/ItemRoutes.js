'use strict'

const express = require('express');
const itemRouter = express.Router();

const ItemServices = require('../Services/ItemServices');
const itemServices = new ItemServices();

//get

itemRouter.get('/api/items', async (req, res) => {

    const x = await itemServices.getAllItems();
    if(x === false){
        return res.status(500).json({error: "generic error"})
    }
    return res.status(200).json(x);
  
});
    
itemRouter.get('/api/items/:id', async (req, res) => {
  
    if(!Number.isInteger(parseFloat(req.params.id)) || req.params.id<0) {
        return res.status(422).json({error: 'validation of id failed'});
    }
  
    const id = req.params.id;
    const x = itemServices.getItemById(id);

    if (x === false) {
        return res.status(500).json({error: "generic error"});
    }
    else if(x === '') {
        return res.status(404).json({error: "no item associated to id"});
    }
    return res.status(200).json(x);
    
});
  
  //post
    
itemRouter.post('/api/item', async (req, res) => {
      
    if(!Number.isInteger(parseFloat(req.body.id)) || req.body.description === undefined || !Number.isFinite(parseFloat(req.body.price)) || !Number.isInteger(parseFloat(req.body.SKUId)) || !Number.isInteger(parseFloat(req.body.supplierId)) || req.params.id<0 || req.body.price<0 || req.body.SKUId<0 || req.body.supplierId<0) {
        return res.status(422).json({error: 'validation of body failed'});
    }

    const it = req.body;
    const x = await itemServices.createNewItem(it);
    if(x === false ) {
        return res.status(503).json({error: "generic error"});
    }
    else if(x === '') {
        return res.status(404).json({error: "Sku not found"});
    }
    else if(x === 1) {
      return res.status(422).json({error: "this supplier already sells an item with the same SKUId"});
    }
    else if(x === 2) {
        return res.status(422).json({error: "this supplier already sells an item with the same ID"});
    } 
    return res.status(201).json();
  
});
  
  //put
  
itemRouter.put('/api/item/:id', async (req, res) => {
      
    if(req.body.newDescription === undefined || !Number.isFinite(parseFloat(req.body.newPrice)) || req.body.newPrice<0) {
          return res.status(422).json({err:"validation of request body failed"});
      }
  
    const newValues = req.body;
    const id = req.params.id;
    const x = await itemServices.modifyItem(newValues, id);

    if(x === false){
        return res.status(503).json({error: "generic error"})
    } 
    else if(x === '') {
        return res.status(404).json({error: "Item not existing"});
    }
    return res.status(200).json();
    
});
  
  //delete
  
itemRouter.delete('/api/items/:id', async (req, res) => {
  
    if(!Number.isInteger(parseFloat(req.params.id)) || req.params.id<0){
        return res.status(422).json({error: 'validation of id failed'});
    }
  
    const id = req.params.id;
    const x = await itemServices.deleteItem(id);
  
    if(x === false){
        return res.status(503).json({error: "generic error"})
    } 
    return res.status(204).json();
  
});
  
module.exports = itemRouter;