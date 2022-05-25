'use strict'


const express = require('express');
const restockOrderRouter = express.Router();

const db = require('../Modules/DB').db;
const RestockOrder = require('../Modules/RestockOrder');
const restockOrder = new RestockOrder(db.db);
const Product = require('../Modules/Product');
const product = new Product(db.db);
const SkuItem = require('../Modules/SkuItem');
const skuItem = new SkuItem(db.db);
const User = require('../Modules/User');
const user = new User(db.db);
const RestockOrderServices = require('../Services/RestockOrderServices');
const restockServices = new RestockOrderServices(restockOrder, skuItem, product, user, db);

//get all tested

//test ok
restockOrderRouter.get('/api/restockOrders', async (req, res) => {

  const rs = await restockServices.getRestockOrder()
  if (rs === false) {
    return res.status(500).json({ error: "generic error" })
  }
  return res.status(200).json(rs);

});

//test ok 
restockOrderRouter.get('/api/restockOrdersIssued', async (req, res) => {

  const rs = await restockServices.getIssuedRestockOrder()
  if (rs === false) {
    return res.status(500).json({ error: "generic error" })
  }
  return res.status(200).json(rs);

});

//test ok  
restockOrderRouter.get('/api/restockOrders/:id', async (req, res) => {

  if (req.params.id === undefined) {
    return res.status(422).json({ error: 'validation of id failed' });
  }

  const id = req.params.id;

  const rs = await restockServices.getRestockOrderByID(id)
  if (rs === 404) {
    return res.status(404).json({ error: "no order associated to id" })
  }
  if (rs === false) {
    return res.status(500).json({ error: "generic error" })
  }
  return res.status(200).json(rs);

});

//test ok 
restockOrderRouter.get('/api/restockOrders/:id/returnItems', async (req, res) => {

  if (req.params.id === undefined) {
    return res.status(422).json({ error: 'validation of id failed' });
  }

  let id = req.params.id;

  const rs = await restockServices.getItemsByRestockId(id);
  if (rs === 404) {
    return res.status(404).json({ error: "no order associated to id" })
  }
  if (rs === 422) {
    return res.status(422).json({ error: "order state != COMPLETEDRETURN" })
  }
  if (rs === false) {
    return res.status(500).json({ error: "generic error" })
  }

  return res.status(200).json(rs);

});

//post
restockOrderRouter.post('/api/restockOrder', async (req, res) => {

  if (req.body.issueDate === undefined || req.body.products === undefined || req.body.supplierId === undefined) {
    return res.status(422).json({ err: "unprocessable entity" });
  }

  const ro = req.body;

  let restock = await restockServices.addRestockOrder(ro);

  if (restock === 403){
    return res.status(404).json({ error: "suppliers not defined" });
  }

  if (restock === 404){
    return res.status(404).json({ error: "no supplier associated at order" });
  }

  if (restock === false) {
    return res.status(503).json({ error: "generic error" });
  }
  return res.status(201).json();

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

  let ns = restockServices.changeState(roi, state.newState);

  if (ns === 404) {
    return res.status(404).json({ error: "no order associated to id" })
  }

  if (ns === false) {
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

  let x = await skuItem.getSKUItemByRestockID(id);

  //elimante items present in database
  items = items.filter(function (objFromItem) {
    return !x.find(function (objFromx) {
      return objFromItem.rfid === objFromx.rfid
    })
  })


  let rs = await restockServices.addSkuItem(id, items);
  if (rs === 404) {
    return res.status(404).json({ error: "no order associated to id" });
  }

  if (rs === 422) {
    return res.status(422).json({ error: "order state is not DELIVERED" });
  }

  if (rs === false) {
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

  var d2 = await restockOrder.getRestockOrderIssueDateByID(id);


  var d1 = Date.parse(TNdate); //d1 = delivery_date
  d2 = Date.parse(d2); //d2 = issue_date

  //console.log("stampo d2");
  //console.log(d2); 


  //console.log("stampo d1");
  //console.log(d1); 

  if (d1 < d2) {
    return res.status(422).json({ error: "delivery_date < issue_date check date" });
  }

  let rs = await restockServices.addTransportNOte(id, TNdate);

  if (rs === 404) {
    return res.status(404).json({ error: "no order associated to id" });
  }

  if (rs === 422) {
    return res.status(422).json({ error: "order state is not DELIVERED" });
  }

  if (rs === false) {
    return res.status(503).json({ err: "generic error" })
  }

  return res.status(200).json();

});


//not tested 
restockOrderRouter.delete('/api/restockOrder/:id', async (req, res) => {
  if (req.params.id < 0) {
    return res.status(422).json({ error: 'validation of id failed' });
  }
  
  const id = req.params.id;

  let rs = await restockServices.deleteRestockOrder(id);


  if (rs === false) {
    return res.status(503).json({ error: "generic error" });
  }

  return res.status(204).json();

});





module.exports = restockOrderRouter;