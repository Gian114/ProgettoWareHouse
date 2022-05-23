'use strict';

const express = require('express');
const db = require('./Modules/DB').db;

const skuRouter = require('./Routes/SKURoutes');
const skuItemRouter = require('./Routes/SKUItemRoutes');
const positionRouter = require('./Routes/PositionRoutes');
const testDescriptorRouter = require('./Routes/TestDescriptorRoutes');
const testResultRouter = require('./Routes/TestResultRoutes');
const userRouter = require('./Routes/UserRouter');
const restockOrderRouter = require('./Routes/RestockOrderRoutes');
const returnOrderRouter = require('./Routes/ReturnOrderRoutes');
const internalOrderRouter = require('./Routes/InternalOrderRoutes')
const itemRouter = require('./Routes/ItemRoutes')


// init express
const app = new express();
const port = 3001;

app.use(express.json());
app.use('', skuRouter);
app.use('', skuItemRouter);
app.use('', positionRouter);
app.use('', testDescriptorRouter);
app.use('', testResultRouter);
app.use('', userRouter);
app.use('', restockOrderRouter);
app.use('', returnOrderRouter);
app.use('', internalOrderRouter);
app.use('', itemRouter);

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