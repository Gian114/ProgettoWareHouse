'use strict';
const express = require('express');
const DB = require('./Modules/DB');
const SKU = require('./Modules/SKU');
const SKUItem = require('./Modules/SKUItems')
// init express
const app = new express();
const port = 3001;

app.use(express.json());

const db = new DB("EZWH");
const sku = new SKU(db.db);
const skuitem = new SKUItem(db.db);

//GET /api/test
app.get('/api/hello', (req,res)=>{
  let message = {
    message: 'Hello World!'
  }
  return res.status(200).json(message);
});

// activate the server
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});

app.get('/api/startDB', async (req,res) => {

  await db.newTableSKU()
  await db.newTableSKUItem()
  return res.status(201).json("ok")

})

//sku
app.post('/api/createSKU', async (req,res)=>{

  const item = req.body.sku
  await sku.createSKU(item)
  return res.status(201).json("ok")

})

app.get('/api/getListofSKU', async (req,res) =>{

  let x = await sku.getListofSKU()
  return res.status(201).json(x)

})

app.get('/api/getSKUByID', async (req,res) =>{

  const id = req.headers.id
  let x = await sku.getSKUByID(id)
  return res.status(201).json(x)

})

app.get('/api/deleteSKU', async (req,res) =>{

  const id = req.headers.id
  await sku.deleteSKU(id)
  return res.status(201).json("ok")

})

app.post('/api/modifySKU', async (req,res)=>{

  const newvalues = req.body.values
  await sku.modifySKU(newvalues)
  return res.status(201).json("ok")

})



//skuitems
app.get('/api/getAllSKUItems', async (req,res) =>{

  let x = await skuitem.getAllSKUItems()
  return res.status(201).json(x)

})

app.get('/api/getSKUItemByRFID', async (req,res) =>{

  const id = req.headers.rfid
  let x = await skuitem.getSKUItemByRFID(id)
  return res.status(201).json(x)

})

app.post('/api/createNewSKUItem', async (req,res)=>{

  const item = req.body.skuitem
  await skuitem.createNewSKUItem(item)
  return res.status(201).json("ok")

})

app.get('/api/deleteSKUItem', async (req,res) =>{

  const id = req.headers.rfid
  await skuitem.deleteSKUItem(id)
  return res.status(201).json("ok")

})

app.post('/api/modifySKUItem', async (req,res)=>{

  const newvalues = req.body.values
  await skuitem.modifySKU(newvalues)
  return res.status(201).json("ok")

})





module.exports = app;