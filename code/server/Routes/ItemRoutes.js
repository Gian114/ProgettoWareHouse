'use strict'

const express = require('express');
const itemRouter = express.Router();

const ItemServices = require('../Services/ItemServices');
const itemServices = new ItemServices();

//get

itemRouter.get('/api/items', async (req, res) => {

    return itemServices.getAllItems(res);
  
});
    
itemRouter.get('/api/items/:id', async (req, res) => {
  
    if(!Number.isInteger(parseFloat(req.params.id)) || req.params.id<0) {
      return res.status(422).json({error: 'validation of id failed'});
    }
  
    const id = req.params.id;
    return itemServices.getItemById(res, id);
    
});
  
  //post
    
itemRouter.post('/api/item', async (req, res) => {
      
    if(!Number.isInteger(parseFloat(req.body.id)) || req.body.description === undefined || !Number.isFinite(parseFloat(req.body.price)) || !Number.isInteger(parseFloat(req.body.SKUId)) || !Number.isInteger(parseFloat(req.body.supplierId)) || req.params.id<0 || req.body.price<0 || req.body.SKUId<0 || req.body.supplierId<0) {
        return res.status(422).json({error: 'validation of body failed'});
    }

    const it = req.body;
    return itemServices.createNewItem(res, it);
  
});
  
  //put
  
itemRouter.put('/api/item/:id', async (req, res) => {
      
    if(req.body.newDescription === undefined || !Number.isFinite(parseFloat(req.body.newPrice)) || req.body.newPrice<0) {
          return res.status(422).json({err:"validation of request body failed"});
      }
  
    const newValues = req.body;
    const id = req.params.id;
    return itemServices.modifyItem(res, newValues, id);
    
});
  
  //delete
  
itemRouter.delete('/api/items/:id', async (req, res) => {
  
    if(!Number.isInteger(parseFloat(req.params.id)) || req.params.id<0){
        return res.status(422).json({error: 'validation of id failed'});
    }
  
    const id = req.params.id;
    return itemServices.deleteItem(res, id);
  
});
  
module.exports = itemRouter;