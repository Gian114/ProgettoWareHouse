'use strict';
const express = require('express');
const db = require('./Modules/DB');

const SKURouter = require('./Routes/SKURoutes');
const SKUItemsRoutes = require('./Routes/SKUItemsRoutes');
const positionRoutes = require('./Routes/PositionRoutes')
const testDescriptorRouter = require('./Routes/TestDescriptorRoutes');


// init express
const app = new express();
const port = 3001;

app.use(express.json());


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
  await db.dropTables();
  await db.newTableSKU();
  await db.newTableSKUItem();
  await db.newTablePosition();
  await db.newTableTestDescriptor();
  return res.status(200).json();
});

app.use('', SKURouter);
app.use('', SKUItemsRoutes);
app.use('',positionRoutes);
app.use('', testDescriptorRouter);


module.exports = app;