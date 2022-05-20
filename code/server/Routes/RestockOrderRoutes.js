'use strict'

const express = require('express');
const RestockOrder = require('../Modules/RestockOrder');
const db = require('../Modules/DB');

const restockOrderRouter = express.Router();
const restockOrder = new RestockOrder(db.db);

const Product = require('../Modules/Product');
const product = new Product (db.db);
const SkuItem = require('../Modules/SkuItem');
const skuItem = new SkuItem(db.db);



//get all tested

//test ok
restockOrderRouter.get('/api/restockOrders', async (req, res) => {

  let restock;
  try {
    restock = await restockOrder.getAllRestockOrderNotIssued();
    restock = restock.concat(await restockOrder.getAllRestockOrderIssued());
    restock = restock.concat(await restockOrder.getAllRestockOrderDelivery());
  } catch (err) {
    return res.status(500).json({ error: "generic error" });
  }
  return res.status(200).json(restock);

});

//test ok 
restockOrderRouter.get('/api/restockOrdersIssued', async (req, res) => {

  try {
    let x = await restockOrder.getAllRestockOrderIssued();
    return res.status(200).json(x);
  } catch (err) {
    return res.status(500).json({ error: "generic error" });
  }

});

//test ok  
restockOrderRouter.get('/api/restockOrders/:id', async (req, res) => {

  if (req.params.id === undefined) {
    return res.status(422).json({ error: 'validation of id failed' });
  }

  const id = req.params.id;

  let state;
  try {
      state = await restockOrder.getRestockOrderStateById(id);
  } catch(err) {
      console.log(err);
      return res.status(500).json({error: "generic error"});
  }

  // checks if id exists, request validation
  if (state === '') {
      return res.status(404).json({error: "no restock order associated to id"});
  }

  console.log(id);

  let restock_orders;
  try {
      if (state === 'ISSUED') {
          restock_orders = await restockOrder.getRestockOrderIssuedById(id);
      }
      else if (state === 'DELIVERY') {
          restock_orders = await restockOrder.getRestockOrderDeliveryById(id);
      }
      else{
        restock_orders = await restockOrder.getRestockOrderByID(id);
      }
  } catch(err) {
      console.log(err);
      return res.status(500).json({error: "generic error"});
  }

  return res.status(200).json(restock_orders)


});

//test ok 
restockOrderRouter.get('/api/restockOrders/:id/returnItems', async (req, res) => {

  if (req.params.id === undefined) {
    return res.status(422).json({ error: 'validation of id failed' });
  }

  let id = req.params.id;
 
  
 let y = await restockOrder.getRestockOrderStateById(id);
 if(y === '') {
   return res.status(404).json({error: "no order associated to id"});
 }

 
 if(y.state != "COMPLETEDRETURN") {
  return res.status(422).json({error: "order state != COMPLETEDRETURN"});
}


 
try {
  let x = await skuItem.getSKUItemByRestockID(id);
  return res.status(200).json(x);
} catch (err) {
  return res.status(500).json({ error: "generic error" });
}

});

//post
//test ok 
restockOrderRouter.post('/api/restockOrder', async (req, res) => {

  if (req.body.issueDate === undefined || req.body.products === undefined || req.body.supplierId === undefined) {
    return res.status(422).json({ err: "unprocessable entity" });
  }

  const ro = req.body;
  
  try {
    await restockOrder.createNewRestockOrder(ro);
    let id = await db.getAutoincrementID('RESTOCK_ORDER');
    for (let i = 0; i < ro.products.length; i++) {
      await product.insertProductRestockOrder(ro.products[i].SKUId, ro.products[i].description, ro.products[i].price, ro.products[i].qty, id);
    }
    return res.status(201).json();
  } catch (err) {
    return res.status(503).json({ error: "generic error" });
  }

});

//put
//test ok 
restockOrderRouter.put('/api/restockOrder/:id', async (req, res) => {

  if (Object.keys(req.params).length === 0 || req.params.id < 0
    || Object.keys(req.body) === 0) {
    return res.status(422).json({})
  }

  const roi = req.params.id;
  const state = req.body;

  //console.log(roi);
  //console.log(state.newState);

  
  let y = await restockOrder.getRestockOrderStateById(roi);
  if(y === '') {
    return res.status(404).json({error: "no order associated to id"});
  }
 

  try {
    await restockOrder.modifyState(roi, state.newState);
  } catch (err) {
    return res.status(503).json({ err: "generic error" })
  }

  return res.status(200).json();

});

//test ok 
restockOrderRouter.put('/api/restockOrder/:id/skuItems', async (req, res) => {

  if (Object.keys(req.params).length === 0 || req.params.id < 0
    || Object.keys(req.body) === 0) {
    return res.status(422).json({})
  }

  const id = req.params.id;
  let items = req.body.skuItems;

  
  let y = await restockOrder.getRestockOrderStateById(roi);
  if(y === '') {
    return res.status(404).json({error: "no order associated to id"});
  }

  if(y !== 'DELIVERED'){
    return res.status(422).json({error: "state is not DELIVERED"});
  }

  let x = await skuItem.getSKUItemByRestockID(id);
  
  //elimante items present in database
  items = items.filter(function(objFromItem) {
    return !x.find(function(objFromx) {
      return objFromItem.rfid === objFromx.rfid
    })
  })
  
  console.log(items);
      
  try {
    for (let i = 0; i < items.length; i++) {
      await skuItem.setRestockOrderId(items[i], id); 
    }
  } catch (err) {
    return res.status(503).json({ err: "generic error" })
  }
  

  return res.status(200).json();

});

//test ok
restockOrderRouter.put('/api/restockOrder/:id/transportNote', async (req, res) => {

  if (Object.keys(req.params).length === 0 || req.params.id < 0
    || Object.keys(req.body) === 0) {
    return res.status(422).json({})
  }

  const id = req.params.id;
  const TNdate = req.body.transportNote.deliveryDate;

  const state = await restockOrder.getRestockOrderStateById(id);

  if(state === '') {
    return res.status(404).json({error: "no order associated to id"});
  }
  console.log(state);

  if(state !== 'DELIVERY'){
    return res.status(422).json({error : "order state !== DELIVERY"});
  }

  
  var d2 = await restockOrder.getRestockOrderIssueDateByID(id);
  

  var d1 = Date.parse(TNdate); //d1 = delivery_date
  d2 = Date.parse(d2); //d2 = issue_date

  if(d1 < d2){
    return res.status(422).json({error : "delivery_date < issue_date check date"});
  }
  
  //console.log("stampo d2");
  //console.log(d2); 


  //console.log("stampo d1");
  //console.log(d1); 
  
  try {
    await restockOrder.addTNdate(id, TNdate);
  } catch (err) {
    return res.status(503).json({ err: "generic error" })
  }

  return res.status(200).json();

});


//not tested 
restockOrderRouter.delete('/api/restockOrder/:id', async (req, res) => {
  if (!Number.isInteger(parseFloat(req.params.id)) || req.params.id < 0) {
    return res.status(422).json({ error: 'validation of id failed' });
  }

  const id = req.params.id;
  try {
    await restockOrder.deleteRestockOrder(id);
    await product.deleteProductByRestockOrderId(id);
    //await skuItem.deleteSKUItemByRestockOrderId(id);
    return res.status(204).json();
  } catch (err) {
    return res.status(503).json({ error: "generic error" });
  }

});





module.exports = restockOrderRouter;