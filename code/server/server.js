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
const skuItem = new SKUItem(db.db);
const testDescriptor = new TestDescriptor(db.db);

//GET /api/test
app.get('/api/hello', (req,res)=>{
  let message = {
    message: 'Hello World!'
  };
  return res.status(200).json(message);
});

// activate the server
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});

app.get('/api/startDB', async (req,res) => {

  await db.newTableSKU();
  await db.newTableSKUItem();
  await db.newTableTestDescriptor();
  return res.status(200).json();

});

//sku
app.post('/api/sku', async (req,res)=>{

  const item = req.body;
  await sku.createSKU(item);
  return res.status(201).json();

});

app.get('/api/skus', async (req,res) =>{

  let x = await sku.getListofSKU();
  return res.status(200).json(x);

});

app.get('/api/skus/:id', async (req,res) =>{

  const id = req.params.id;
  let x = await sku.getSKUByID(id);
  return res.status(200).json(x);

});

app.delete('/api/skus/:id', async (req,res) =>{

  const id = req.params.id;
  await sku.deleteSKU(id);
  return res.status(204).json();

});

app.put('/api/sku/:id', async (req,res)=>{

  const id = req.params.id;
  const newvalues = req.body;
  await sku.modifySKU(id, newvalues);
  return res.status(200).json();

});



//skuItems
app.get('/api/skuitems', async (req,res) =>{

  let x = await skuItem.getAllSKUItems();
  return res.status(200).json(x);

});

app.get('/api/skuitems/:rfid', async (req,res) =>{

  const id = req.params.rfid;
  let x = await skuItem.getSKUItemByRFID(id);
  return res.status(200).json(x);

});

app.post('/api/skuitem', async (req,res)=>{

  const item = req.body;
  await skuItem.createNewSKUItem(item);
  return res.status(201).json();

});

app.delete('/api/skuitems/:rfid', async (req,res) =>{

  const id = req.params.rfid;
  await skuItem.deleteSKUItem(id);
  return res.status(204).json();

});

app.put('/api/skuitems/:rfid', async (req,res)=>{

  const id = req.params.rfid;
  const newvalues = req.body;
  await skuItem.modifySKU(id, newvalues);
  return res.status(200).json();

});



//testDescriptor
app.get('/api/testDescriptors', async (req,res) =>{

  let x = await testDescriptor.getAllTestDescriptors();
  return res.status(200).json(x);

});

app.get('/api/testDescriptors/:id', async (req,res) =>{

  const id = req.params.id;
  let x = await testDescriptor.getTestDescriptorByID(id);
  return res.status(200).json(x);

});

app.post('/api/testDescriptor', async (req,res)=>{

  const td = req.body;
  await testDescriptor.createNewTestDescriptor(td);
  return res.status(201).json();

});

app.put('/api/testDescriptor/:id', async (req,res)=>{

  const newvalues = req.body;
  const id = req.params.id;
  await testDescriptor.modifyTestDescriptor(id, newvalues);
  return res.status(200).json();

});

app.delete('/api/testDescriptor/:id', async (req,res)=>{

  const id = req.params.id;
  await testDescriptor.deleteTestDescriptor(id, newvalues);
  return res.status(204).json();

});


module.exports = app;