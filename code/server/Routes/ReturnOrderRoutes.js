'use strict'

const express = require('express');
const returnOrderRouter = express.Router();

const db = require('../Modules/DB');
const ReturnOrder = require('../Modules/ReturnOrder');
const returnOrder = new ReturnOrder(db.db);
//const restockOrder = require('./RestockOrderRoutes');

//get

returnOrderRouter.get('/api/returnOrders', async (req,res) =>{

try {
    let x = await returnOrder.getAllReturnOrders();
    return res.status(200).json(x);
} catch(err) {
    return res.status(500).json({error: "generic error"});
}

});

returnOrderRouter.get('/api/returnOrders/:id', async (req,res) =>{

if(req.params.id === undefined){
    return res.status(422).json({error: 'validation of id failed'});
}

const id = req.params.id;
try {
    let x = await returnOrder.getReturnOrderByID(id);
} catch(err) {
    return res.status(500).json({error: "generic error"});
}

if(x === ''){
    return res.status(404).json({error: "no return order associated to id"});
} else {
    return res.status(200).json(x);
}

});

//post

returnOrderRouter.post('/api/returnOrder', async (req,res)=>{
console.log('ciao');
if(req.body.returnDate === undefined || req.body.products === undefined || req.body.restockOrderId === undefined){
        return res.status(422).json({err:"validation of request body failed"});
    }

const ro = req.body;
/*let y = await restockOrder.getRestockOrderyID(ro.restockOrderId);
if(y === '') {
    return res.status(404).json({error: "no restock order associated to restockOrderId"});
}*/
    
try{
    await returnOrder.createNewReturnOrder(ro);
    return res.status(201).json();
} catch(err) {
    return res.status(503).json({error: "generic error"});
}

});

//delete

returnOrderRouter.delete('/api/returnOrder/:id', async (req,res)=>{

if(req.params.id === undefined){
    return res.status(422).json({error: 'validation of id failed'});
}

const id = req.params.id;

try {
    await returnOrder.deleteReturnOrder(id);
    return res.status(204).json();
} catch(err) {
    return res.status(503).json({error: "generic error"});
}

});
  
module.exports = returnOrderRouter;