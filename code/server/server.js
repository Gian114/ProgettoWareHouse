'use strict';

const express = require('express');
const db = require('./Modules/DB');

const SKURoutes = require('./Routes/SKURoutes');
const SKUItemsRouter = require('./Routes/SKUItemsRoutes');
const testDescriptorRouter = require('./Routes/TestDescriptorRoutes');
const testResultRouter = require('./Routes/TestResultRoutes');
const positionRouter = require('./Routes/PositionRoutes');
const returnOrderRouter = require('./Routes/ReturnOrderRoutes');


// init express
const app = new express();
const port = 3001;

app.use(express.json());
app.use('', SKURoutes.skuRouter);
app.use('', SKUItemsRouter);
app.use('', positionRouter);
app.use('', testDescriptorRouter);
app.use('', testResultRouter);
app.use('', returnOrderRouter);

db.startDB();

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

module.exports = app;