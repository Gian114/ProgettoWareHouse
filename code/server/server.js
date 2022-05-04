'use strict';
const express = require('express');
const SKU = require('./Modules/SKU');
// init express
const app = new express();
const port = 3001;

app.use(express.json());

const db = new SKU("SKU");

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

app.post('/api/addFirstUser', async (req,res)=>{

  const item = req.body.sku
  await db.newTableSKU()
  db.createSKU(item)
  return res.status(201).json("ok")
})

app.get('/api/getSKUItems', async (req,res) =>{

  let x = await db.getSKUItems()
  return res.status(201).json(x)

})

app.get('/api/getSKUByID', async (req,res) =>{

  const id = req.headers.id
  let x = await db.getSKUByID(id)
  console.log(x)
  return res.status(201).json(x)

})






module.exports = app;