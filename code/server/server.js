'use strict';
const express = require('express');
const DB = require('./Modules/DB');
const SKU = require('./Modules/SKU');
const SKUItem = require('./Modules/SKUItems')
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

/*app.get('/api/startDB', async (req,res) => {

  await db.newTableSKU();
  await db.newTableSKUItem();
  await db.newTableTestDescriptor();
  return res.status(200).json();

});*/


module.exports = app;