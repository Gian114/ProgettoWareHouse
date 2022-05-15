'use strict'

const express = require('express');
const RestockOrder = require('../Modules/RestockOrder');
const db = require('../Modules/DB');

const restockOrderRouter = express.Router();
const restockOrder = new RestockOrder(db.db);

const skuItemRoutes = require('./SKUItemsRoutes');
const Products = require('../Modules/Product');
const skuItem = skuItemRoutes.skuItem;
const product = new Products(db.db);

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

// uncomplete
restockOrderRouter.get('/api/restockOrders/:id/returnItems', async (req, res) => {

    if(req.params.id === undefined){
        return res.status(422).json({error: 'validation of id failed'});
    }
    
   

});

//post

restockOrderRouter.post('/api/restockOrder', async (req,res)=>{

    if(req.body.issueDate === undefined || req.body.products === undefined || req.body.supplierId === undefined){
            return res.status(422).json({err:"validation of request body failed"});
        }

    const ro = req.body;

 
    try{
        await restockOrder.createNewRestockOrder(ro);  //non va 
        let id = await db.getAutoincrementID('RESTOCK_ORDER'); //NON VA
        console.log(id);
        for(let i=0; i<ro.products.length; i++) {
          await product.insertProductByRestockId(ro.products[i], id);
        }
        return res.status(201).json();
    } catch(err) {
        return res.status(503).json({error: "generic error"});
    }

});

//put
restockOrderRouter.put('/api/restockOrder/:id', async (req,res)=>{

    if( Object.keys(req.params).length === 0 || req.params.id<0
    || Object.keys(req.body)===0){
      return res.status(422).json({})}
  
      id = req.params.id;
      state = req.body;

      let y = await restockOrder.getRestockOrderByID(id);
      if(y === '') {
        return res.status(404).json({error: "no order associated to id"});
      }

    try{
      await restockOrder.modifyState(id,state);
    }catch(err){
      return res.status(503).json({err:"generic error"})
    }
    
    return res.status(200).json();
  
  });

  //uncomplete
  restockOrderRouter.put('/api/restockOrder/:id/skuItems', async (req,res)=>{

    if( Object.keys(req.params).length === 0 || req.params.id<0
    || Object.keys(req.body)===0){
      return res.status(422).json({})}
  
      id = req.params.id;
      items = req.body;

      let y = await restockOrder.getRestockOrderByID(id);
      if(y === '') {
        return res.status(404).json({error: "no order associated to id"});
      }

    try{
      //await skuItem.addSkuItemByRestockId(id,items); should be implemented
    }catch(err){
      return res.status(503).json({err:"generic error"})
    }
    
    return res.status(200).json();
  
  });

  restockOrderRouter.put('/api/restockOrder/:id/transportNote', async (req,res)=>{

    if( Object.keys(req.params).length === 0 || req.params.id<0
    || Object.keys(req.body)===0){
      return res.status(422).json({})}
  
      id = req.params.id;
      TNdate = req.body; //dovresti prendere solo la data

      let y = await restockOrder.getRestockOrderByID(id);
      if(y === '') {
        return res.status(404).json({error: "no order associated to id"});
      }

    try{
      await skuItem.addTNdate(id,TNdate); 
    }catch(err){
      return res.status(503).json({err:"generic error"})
    }
    
    return res.status(200).json();
  
  });


//delete 

restockOrderRouter.delete('/api/restockOrder/:id', async(req, res)=>{
    if(!Number.isInteger.parseInt(req.params.id) || req.params.id<0) {
        return res.status(422).json({error: 'validation of id failed'});
    }

    const id = req.params.id;
    try {
        await restockOrder.deleteReturnOrder(id);
        return res.status(204).json();
    } catch(err) {
        return res.status(503).json({error: "generic error"});
    }

});





module.exports.restockOrderRouter = restockOrderRouter;
module.exports.restockOrder = restockOrder;