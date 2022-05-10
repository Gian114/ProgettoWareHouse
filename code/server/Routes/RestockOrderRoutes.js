'use strict'

const express = require('express');
const RestockOrder = require('../Modules/RestockOrder');
const db = require('../Modules/DB');

const restockOrderRouter = express.Router();
const restockOrder = new RestockOrder(db.db);

const skuItems = require('./SKUItems');

//get

restockOrderRouter.get('/api/restockOrders', async (req, res) => {

    try {
        let x = await restockOrder.getAllRestockOrder();
        return res.status(200).json(x);
    } catch (err) {
        return res.status(500).json({ error: "generic error" });
    }

});

restockOrderRouter.get('/api/restockOrdersIssued', async (req, res) => {

    try {
        let x = await restockOrder.getAllRestockOrderIssued();
        return res.status(200).json(x);
    } catch (err) {
        return res.status(500).json({ error: "generic error" });
    }

});

restockOrderRouter.get('/api/restockOrders/:id', async (req, res) => {

    if(req.params.id === undefined){
        return res.status(422).json({error: 'validation of id failed'});
    }
    
    const id = req.params.id;

    try {
        let x = await restockOrder.getAllRestockOrderByID(id);
    } catch(err) {
        return res.status(500).json({error: "generic error"});
    }
    
    if(x === ''){
        return res.status(404).json({error: "no restock order associated to id"});
    } else {
        return res.status(200).json(x);
    }

});

// l'id è di skuItem
restockOrderRouter.get('/api/restockOrders/:id/returnItems', async (req, res) => {

    if(req.params.id === undefined){
        return res.status(422).json({error: 'validation of id failed'});
    }
    
   

});

//post



module.export = restockOrderRouter;