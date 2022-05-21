'use strict'

const express = require('express');

const InternalOrderServices = require('../Services/InternalOrderServices');
const io_serv = new InternalOrderServices();

function idIsValid(id) {
    return (Number.isInteger(parseFloat(id)) && id > 0);
}

const internalOrderRouter = express.Router()

internalOrderRouter.get('/api/internalOrders', async (_, res) => {
    // only validation needed is user authorization which is not yet to implement

    let internal_orders;
    try {
        // internal_orders = await io_table.getInternalOrdersNotCompleted();
        // internal_orders.concat(await io_table.getInternalOrdersCompleted());
        internal_orders = await io_serv.getInternalOrders();
    } catch(err) {
        console.log(err);
        return res.status(500).json({error: "generic error"});
    }

    return res.status(200).json(internal_orders)
})

// only validation needed is user authorization which is not yet to implement
internalOrderRouter.get('/api/internalOrdersIssued', async (_, res) => {

    const state = 'ISSUED';
    
    let internal_orders;
    try {
        internal_orders = await io_serv.getInternalOrdersByState(state);
    } catch(err) {
        console.log(err);
        return res.status(500).json({error: "generic error"});
    }

    return res.status(200).json(internal_orders)
})

// only validation needed is user authorization which is not yet to implement
internalOrderRouter.get('/api/internalOrdersAccepted', async (_, res) => {

    const state = 'ACCEPTED';

    let internal_orders;
    try {
        internal_orders = await io_serv.getInternalOrdersByState(state);
    } catch(err) {
        console.log(err);
        return res.status(500).json({error: "generic error"});
    }

    return res.status(200).json(internal_orders)
})

// all validations but authorizations done
internalOrderRouter.get('/api/internalOrders/:id', async (req, res) => {
    const id = req.params.id;

    // request validation
    if (!idIsValid(id)) {
        return res.status(422).json({error: "validation of id failed"});
    }

    let internal_order;
    try {
        internal_order = await io_serv.getInternalOrderById(id);
    } catch(err) {
        return res.status(500).json({error: "generic error"});
    }
    if (internal_order === undefined) {
        return res.status(404).json({error: "no internal order associated to id"});
    }

    return res.status(200).json(internal_order)
})

// all validations but authorizations done
internalOrderRouter.post('/api/internalOrders', async (req, res) => {
    // request validation
    if (Object.keys(req.body).length !== 3){
        return res.status(422).json('validation of request body failed')
    }

    const internal_order = {
        issueDate: req.body.issueDate,
        customerId: req.body.customerId,
        state: 'ISSUED'
    }

    const products = req.body.products

    let internal_order_id;
    try {
        internal_order_id = await io_serv.createInternalOrder(internal_order.issueDate, internal_order.state, internal_order.customerId, products);
    } catch(err) {
        console.log(err);
        return res.status(503).json({error: "generic error"});
    }

    return res.status(201).json()
})

// need to implement 404
internalOrderRouter.put('/api/internalOrders/:id', async (req, res) => {
    const id = req.params.id;
    const state = req.body.newState;

    // request validation
    if (!idIsValid(id)){
        return res.status(422).json('validation of id failed');
    }
    if (state === undefined || (state === 'COMPLETED' && req.body.products === undefined) || Object.keys(req.body).length > 2) {
        return res.status(422).json('validation of request body failed');
    }

    try {
        // set new state in internal order table 
        await io_serv.modifyInternalOrder(id, state, req.body.products);
    } catch(err) {
        console.log(err);
        return res.status(500).json({error: "generic error"});
    }

    return res.status(200).json()    
})

// sku_item table should have on delete set null on internal_order_id
// all validations but authorizations done
internalOrderRouter.delete('/api/internalOrders/:id', async (req, res) => {
    const id = req.params.id;

    if (!idIsValid(id)) {
        return res.status(422).json('validation of id failed');
    }

    try {
        await io_serv.deleteInternalOrder(id);
    } catch(err) {
        console.log(err);
        return res.status(500).json({error: "generic error"});
    }

    return res.status(204).json()    
})

module.exports = internalOrderRouter
