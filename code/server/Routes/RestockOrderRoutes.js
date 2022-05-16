'use strict'

const express = require('express');
const RestockOrder = require('../Modules/RestockOrder');
const db = require('../Modules/DB');

const restockOrderRouter = express.Router();
const restockOrder = new RestockOrder(db.db);

const product = require('../Modules/Product');

const skuItemRoutes = require('./SKUItemRoutes');
const skuItem = skuItemRoutes.skuItem;


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

//aggiungi controlli 
restockOrderRouter.get('/api/restockOrders/:id', async (req, res) => {

    if(req.params.id === undefined){
        return res.status(422).json({error: 'validation of id failed'});
    }
    
    const id = req.params.id;

    try {
        let x = await restockOrder.getRestockOrderByID(id);
        return res.status(200).json(x);
    } catch(err) {
        return res.status(500).json({error: "generic error"});
    }
    

});

// uncomplete
restockOrderRouter.get('/api/restockOrders/:id/returnItems', async (req, res) => {

    if(req.params.id === undefined){
        return res.status(422).json({error: 'validation of id failed'});
    }
    
   

});

//post
//test ok manca 404
restockOrderRouter.post('/api/restockOrder', async (req,res)=>{

    if(req.body.issueDate === undefined || req.body.products === undefined || req.body.supplierId === undefined){
            return res.status(422).json({err:"validation of request body failed"});
        }

    const ro = req.body;

 
    try{
        await restockOrder.createNewRestockOrder(ro);   
        let id = await db.getAutoincrementID('RESTOCK_ORDER'); 
        for(let i=0; i<ro.products.length; i++) {
          await product.insertProductRestockOrder(ro.products[i].SKUId, ro.products[i].description, ro.products[i].price, ro.products[i].qty, id);
        }
        return res.status(201).json();
    } catch(err) {
        return res.status(503).json({error: "generic error"});
    }

});

//put
//test ok manca 404
restockOrderRouter.put('/api/restockOrder/:id', async (req,res)=>{

    if( Object.keys(req.params).length === 0 || req.params.id<0
    || Object.keys(req.body)===0){
      return res.status(422).json({})}
  
      const roi = req.params.id;
      const state = req.body;

      console.log(roi);
      console.log(state.newState); 

       /*
      let y = await restockOrder.getRestockOrderByID(id);
      if(y === '') {
        return res.status(404).json({error: "no order associated to id"});
      }
      */

    try{
      await restockOrder.modifyState(roi,state.newState);
    }catch(err){
      return res.status(503).json({err:"generic error"})
    }
    
    return res.status(200).json();
  
  });

  //manca 404
  restockOrderRouter.put('/api/restockOrder/:id/skuItems', async (req,res)=>{

    if( Object.keys(req.params).length === 0 || req.params.id<0
    || Object.keys(req.body)===0){
      return res.status(422).json({})}
  
      const id = req.params.id;
      const items = req.body.skuItems;

          /*
      let y = await restockOrder.getRestockOrderByID(id);
      if(y === '') {
        return res.status(404).json({error: "no order associated to id"});

      if(y.state != "DELIVERED"){
        return res.status(422).json({error: "order state != DELIVERED"});
      }
      }
      */
            
    try{
      for(let i=0; i<items.length; i++) {
        await skuItem.setRestockOrderId(items[i], id);
      } 
    }catch(err){
      return res.status(503).json({err:"generic error"})
    }
    
    return res.status(200).json();
  
  });

  //test ok
  restockOrderRouter.put('/api/restockOrder/:id/transportNote', async (req,res)=>{

    if( Object.keys(req.params).length === 0 || req.params.id<0
    || Object.keys(req.body)===0){
      return res.status(422).json({})}
  
      const id = req.params.id;
      const TNdate = req.body.transportNote.deliveryDate; 
      
      console.log(TNdate);

      /*
      let y = await restockOrder.getRestockOrderByID(id);
      if(y === '') {
        return res.status(404).json({error: "no order associated to id"});
      }
      */

    try{
      await restockOrder.addTNdate(id,TNdate); 
    }catch(err){
      return res.status(503).json({err:"generic error"})
    }
    
    return res.status(200).json();
  
  });


//delete. qui va fatto il delete anche degli skuitem e dei product 
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