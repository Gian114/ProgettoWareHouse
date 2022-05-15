'use strict'

const express = require('express');
const returnOrderRouter = express.Router();

const db = require('../Modules/DB');
const ReturnOrder = require('../Modules/ReturnOrder');
const returnOrder = new ReturnOrder(db.db);
const restockOrderRoutes = require('./RestockOrderRoutes');
const restockOrder = restockOrderRoutes.restockOrder;
const skuItemRoutes = require('./SKUItemRoutes');
const skuItem = skuItemRoutes.skuItem;
const product = require('../Modules/Product');

//get

returnOrderRouter.get('/api/returnOrders', async (req, res) => {

    try {
        let x = await returnOrder.getAllReturnOrders();
        return res.status(200).json(x);
    } catch(err) {
        return res.status(500).json({error: "generic error"});
    }

});

returnOrderRouter.get('/api/returnOrders/:id', async (req, res) => {

    if(!Number.isInteger(parseFloat(req.params.id)) || req.params.is<0) {
        return res.status(422).json({error: 'validation of id failed'});
    }
   
    const id = req.params.id;
    try {
        let x = await returnOrder.getReturnOrderByID(id);
        if(x === ''){
            return res.status(404).json({error: "no return order associated to id"});
        } else {
            return res.status(200).json(x);
        }
    } catch(err) {
        return res.status(500).json({error: "generic error"});
    }

});

//post

returnOrderRouter.post('/api/returnOrder', async (req, res) => {

    if(req.body.returnDate === undefined || req.body.products === undefined || !Number.isInteger(parseFloat(req.body.restockOrderId)) || req.body.restockOrderId<0) {
            return res.status(422).json({err:"validation of request body failed"});
        }

    const ro = req.body;
    /*let y = await restockOrder.getRestockOrderByID(ro.restockOrderId);
    if(y === '') {
        return res.status(404).json({error: "no restock order associated to restockOrderId"});
    }
    let x = '';
    for(let i=0; i<ro.products.length; i++) {
        x = await skuItem.getSKUItemByRFID(ro.products[i].RFID);
        if(x === '') {
            return res.status(404).json({error: `no sku item associated to RFID: ${ro.products[i].RFID}`});
        }
    }*/
        
    try{
        await returnOrder.createNewReturnOrder(ro);
        let id = await db.getAutoincrementID('RETURN_ORDER');
        for(let i=0; i<ro.products.length; i++) {
            await product.insertProductReturnOrder(ro.products[i].SKUId, ro.products[i].description, ro.products[i].price, id);
            await skuItem.setReturnOrderId(ro.products[i].RFID, id);
        }
        return res.status(201).json();
    } catch(err) {
        console.log(err);
        return res.status(503).json({error: "generic error"});
    }

});

//delete

returnOrderRouter.delete('/api/returnOrder/:id', async (req, res) => {

    if(!Number.isInteger(parseFloat(req.params.id)) || req.params.is<0) {
        return res.status(422).json({error: 'validation of id failed'});
    }

    const id = req.params.id;
    try {
        await returnOrder.deleteReturnOrder(id);
        let products = await product.getProductsByReturnOrder(id);
        for(let i=0; i<products.length; i++) {
            await product.deleteProduct(products[i]);
        }
        let skuItems = await skuItem.getSKUItemsByReturnOrderId(id);
        for(i=0; i<skuItems.length; i++) {
            await skuItem.setReturnOrderId(skuItems[i], 'NULL');
        }
        return res.status(204).json();
    } catch(err) {
        return res.status(503).json({error: "generic error"});
    }

});
  
module.exports = returnOrderRouter;