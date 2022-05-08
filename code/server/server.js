'use strict';
const express = require('express');


const SKURouter = require('./Routes/SKURoutes');

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

app.use('', SKURouter);

/*app.get('/api/startDB', async (req,res) => {

  await db.newTableSKU();
  await db.newTableSKUItem();
  await db.newTableTestDescriptor();
  return res.status(200).json();

});*/


module.exports = app;