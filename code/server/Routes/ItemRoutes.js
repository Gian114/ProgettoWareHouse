'use strict'

const express = require('express');
const itemRouter = express.Router();

const db = require('../Modules/DB');
const Item = require('../Modules/Item');
const item = new Item(db.db);
const SKURoutes = require('./SKURoutes');
const sku = SKURoutes.sku;

//get

itemRouter.get('/api/items', async (req, res) => {

    try {
      let x = await item.getAllItems();
      return res.status(200).json(x);
    } catch(err) {
      return res.status(500).json({error: "generic error"});
    }
  
  });
    
itemRouter.get('/api/items/:id', async (req, res) => {
  
    if(!Number.isInteger(parseFloat(req.params.id))) {
      return res.status(422).json({error: 'validation of id failed'});
    }
  
    const id = req.params.id;
    try {
      let x = await item.getItemByID(id);
    } catch(err) {
      return res.status(500).json({error: "generic error"});
    }
  
    if(x === '') {
      return res.status(404).json({error: "no item associated id"});
    } else {
      return res.status(200).json(x);
    }
    
  });
  
  //post
    
  itemRouter.post('/api/item', async (req, res) => {
      
    if(!Number.isInteger(parseFloat(req.body.id)) || req.body.description === undefined || !Number.isFinite(parseFloat(req.body.price)) || !Number.isInteger(parseFloat(req.body.SKUId)) || !Number.isInteger(parseFloat(req.body.supplierId))) {
        return res.status(422).json({error: 'validation of body failed'});
    }

    const it = req.body;
    let y = await item.getItemBySKUIdAndSupplierId(it.SKUId, it.supplierId);
    if(y !== '') {
        return res.status(422).json({error: "this supplier already sells an item with the same SKUId"});
    }
    y = await item.getItemByIdAndSupplierId(it.id, it.supplierId);
    if(y !== '') {
        return res.status(422).json({error: "this supplier already sells an item with the same ID"});
    }
    y = await sku.getSKUByID(it,SKUId);
    if(y === '') {
        return res.status(404).json({error: "Sku not found"});
    }
      
    try {
        await item.createNewItem(it);
        return res.status(201).json();
    } catch(err) {
        return res.status(503).json({error: "generic error"});
    }
  
  });
  
  //put
  
  itemRouter.put('/api/item/:id', async (req, res) => {
      
    if(req.body.Description === undefined || !Number.isFinite(parseFloat(req.body.price))) {
          return res.status(422).json({err:"validation of request body failed"});
      }
  
    const newvalues = req.body;
    const id = req.params.id;
    let x = await item.getItemByID(id);
    if(x === '') {
      return res.status(404).json({error: "Item not existing"});
    }
  
    try {
      await item.modifyItem(id, newvalues);
      return res.status(200).json();
    } catch(err) {
      return res.status(503).json({error: "generic error"});
    }
    
  });
  
  //delete
  
  itemRouter.delete('/api/items/:id', async (req, res) => {
  
    if(!Number.isInteger(parseFloat(req.params.id))){
      return res.status(422).json({error: 'validation of id failed'});
    }
  
    const id = req.params.id;
    try {
      await item.deleteItem(id);
      return res.status(204).json();
    } catch(err) {
      return res.status(503).json({error: "generic error"});
    }
  
  });
  
  module.exports = itemRouter;