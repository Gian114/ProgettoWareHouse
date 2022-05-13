'use strict'

const express = require('express');
const InternalOrder = require('../Modules/InternalOrder');

const db = require('../Modules/DB');
const io_table = new InternalOrder(db.db);

const internalOrderRouter = express.Router()

internalOrderRouter.get('/api/internalOrders', async (req, res) => {
    
    let internal_orders;
    try {
        internal_orders = await io_table.getInternalOrders();
    } catch(err) {
        console.log(err);
        return res.status(500).json({error: "generic error"});
    }

    return res.status(200).json(internal_orders)
})

internalOrderRouter.get('/api/internalOrdersIssued', async (req, res) => {

    const state = 'ISSUED';
    
    let internal_orders;
    try {
        internal_orders = await io_table.getInternalOrdersByState(state);
    } catch(err) {
        console.log(err);
        return res.status(500).json({error: "generic error"});
    }

    return res.status(200).json(internal_orders)
})

internalOrderRouter.get('/api/internalOrdersAccepted', async (req, res) => {
    
    const state = 'ACCEPTED';

    let internal_orders;
    try {
        internal_orders = await io_table.getInternalOrdersByState(state);
    } catch(err) {
        console.log(err);
        return res.status(500).json({error: "generic error"});
    }

    return res.status(200).json(internal_orders)
})

internalOrderRouter.get('/api/internalOrders/:id', async (req, res) => {
    
    const id = req.params.id;

    let internal_orders;
    try {
        internal_orders = await io_table.getInternalOrderById(id);
    } catch(err) {
        console.log(err);
        return res.status(500).json({error: "generic error"});
    }

    return res.status(200).json(internal_orders)
})

// NOT FINISHED
internalOrderRouter.post('/api/internalOrders', async (req, res) => {
    
    const id = req.params.id;

    let internal_orders;
    try {
        internal_orders = await io_table.getInternalOrderById(id);
    } catch(err) {
        console.log(err);
        return res.status(500).json({error: "generic error"});
    }

    return res.status(200).json(internal_orders)
})


module.exports = internalOrderRouter
