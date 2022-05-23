'use strict'

const express = require('express');
const returnOrderRouter = express.Router();

const db = require('../Modules/DB').db;
const ReturnOrder = require('../Modules/ReturnOrder');
const returnOrder = new ReturnOrder(db.db);
const RestockOrder = require('../Modules/RestockOrder');
const restockOrder = new RestockOrder(db.db);
const SkuItem = require('../Modules/SKUItem');
const skuItem = new SkuItem(db.db);
const Product = require('../Modules/Product');
const product = new Product(db.db);
const ReturnOrderServices = require('../Services/ReturnOrderServices');
const returnOrderServices = new ReturnOrderServices(returnOrder, restockOrder, skuItem, product);


//get

returnOrderRouter.get('/api/returnOrders', async (req, res) => {

    const x = await returnOrderServices.getAllReturnOrders();
    if(x === false){
        return res.status(500).json({error: "generic error"})
    }
    return res.status(200).json(x);

});

returnOrderRouter.get('/api/returnOrders/:id', async (req, res) => {

    if(!Number.isInteger(parseFloat(req.params.id)) || req.params.id<0) {
        return res.status(422).json({error: 'validation of id failed'});
    }
   
    const id = req.params.id;
    const x = await returnOrderServices.getReturnOrderById(id);

    if (x === false) {
        return res.status(500).json({error: "generic error"});
    }
    else if(x === '') {
        return res.status(404).json({error: "no return order associated to id"});
    }
    return res.status(200).json(x);

});

//post

returnOrderRouter.post('/api/returnOrder', async (req, res) => {

    if(req.body.returnDate === undefined || req.body.products === undefined || !Number.isInteger(parseFloat(req.body.restockOrderId)) || req.body.restockOrderId<0) {
            return res.status(422).json({err:"validation of request body failed"});
        }

    const ro = req.body;
    const x = await returnOrderServices.createNewReturnOrder(ro);
    if(x === false ){
        return res.status(503).json({error: "generic error"});
    }
    else if(x === '') {
        return res.status(404).json({error: "no restock order associated to restockOrderId"});
    }
    else if (x === 1) {
        return res.status(404).json({error: `no sku item associated to RFID or wrong correspondence between RFID and SKUId`});
    }
    return res.status(201).json();

});

//delete

returnOrderRouter.delete('/api/returnOrder/:id', async (req, res) => {

    if(!Number.isInteger(parseFloat(req.params.id)) || req.params.id<0) {
        return res.status(422).json({error: 'validation of id failed'});
    }

    const id = req.params.id;
    const x = await returnOrderServices.deleteReturnOrder(id);

    if(x === false){
        return res.status(503).json({error: "generic error"})
    } 
    return res.status(204).json();

});
  
module.exports = returnOrderRouter;