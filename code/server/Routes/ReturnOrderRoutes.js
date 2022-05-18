'use strict'

const express = require('express');
const returnOrderRouter = express.Router();

const ReturnOrderServices = require('../Services/ReturnOrderServices');
const returnOrderServices = new ReturnOrderServices();


//get

returnOrderRouter.get('/api/returnOrders', async (req, res) => {

    return returnOrderServices.getAllReturnOrders(res);

});

returnOrderRouter.get('/api/returnOrders/:id', async (req, res) => {

    if(!Number.isInteger(parseFloat(req.params.id)) || req.params.id<0) {
        return res.status(422).json({error: 'validation of id failed'});
    }
   
    const id = req.params.id;
    return returnOrderServices.getReturnOrderById(res, id);

});

//post

returnOrderRouter.post('/api/returnOrder', async (req, res) => {

    if(req.body.returnDate === undefined || req.body.products === undefined || !Number.isInteger(parseFloat(req.body.restockOrderId)) || req.body.restockOrderId<0) {
            return res.status(422).json({err:"validation of request body failed"});
        }

    const ro = req.body;
    return returnOrderServices.createNewReturnOrder(res, ro);

});

//delete

returnOrderRouter.delete('/api/returnOrder/:id', async (req, res) => {

    if(!Number.isInteger(parseFloat(req.params.id)) || req.params.id<0) {
        return res.status(422).json({error: 'validation of id failed'});
    }

    const id = req.params.id;
    return returnOrderServices.deleteReturnOrder(res, id);

});
  
module.exports = returnOrderRouter;