'use strict';
const express = require('express');
const DB = require('./Modules/DB');
const SKU = require('./Modules/SKU');
// init express
const app = new express();
const port = 3001;

app.use(express.json());

const db = new DB("EZWH");
const sku = new SKU(db.db);

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
  return res.status(201).json("ok")

})

app.post('/api/createSKU', async (req,res)=>{

  const item = req.body.sku
  await sku.createSKU(item)
  return res.status(201).json("ok")

})

app.get('/api/getSKUItems', async (req,res) =>{

  let x = await sku.getSKUItems()
  return res.status(201).json(x)

})

app.get('/api/getSKUByID', async (req,res) =>{

  const id = req.headers.id
  let x = await sku.getSKUByID(id)
  return res.status(201).json(x)

})





module.exports = app;