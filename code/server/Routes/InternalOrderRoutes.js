'use strict'

const express = require('express');
const InternalOrder = require('../Modules/InternalOrder');
// will need to change when return instance
const SKUItem = require('../Modules/SKUItem');

const db = require('../Modules/DB');
const io_table = new InternalOrder(db.db);
const prod_table = require('../Modules/Product');
const item_table = new SKUItem(db.db);

const internalOrderRouter = express.Router()

// need to deal with completed orders
internalOrderRouter.get('/api/internalOrders', async (req, res) => {
    
    let internal_orders;
    try {
        internal_orders = await this.getInternalOrdersNotCompleted();
        internal_orders.concat(await this.getInternalOrdersCompleted());
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

    let state;
    try {
        state = await io_table.getInternalOrderStateById(id);
    } catch(err) {
        console.log(err);
        return res.status(500).json({error: "generic error"});
    }

    // checks if id exists
    if (state === '') {
        return res.status(404).json({error: "no internal order associated to id"});
    }

    let internal_orders;
    try {
        if (state === 'COMPLETED') {
            internal_orders = await io_table.getInternalOrderCompletedById(id);
        }
        else {
            internal_orders = await io_table.getInternalOrderNotCompletedById(id);
        }
    } catch(err) {
        console.log(err);
        return res.status(500).json({error: "generic error"});
    }

    return res.status(200).json(internal_orders)
})

internalOrderRouter.post('/api/internalOrders', async (req, res) => {
    const internal_order = {
        issueDate: req.body.issueDate,
        customerId: req.body.customerId,
        state: 'ISSUED'
    }

    const products = req.body.products

    let internal_order_id;
    try {
        internal_order_id = await io_table.createInternalOrder(internal_order.issueDate, internal_order.state, internal_order.customerId);
    } catch(err) {
        console.log(err);
        return res.status(500).json({error: "generic error"});
    }
    for (const prod of products) {
        try {
            await prod_table.insertProductInternalOrder(prod.SKUId, prod.description, prod.price, prod.qty, internal_order_id)
        } catch(err) {
            console.log(err);
            return res.status(500).json({error: "generic error"});
        }
    }

    return res.status(201).json()
})

internalOrderRouter.put('/api/internalOrders/:id', async (req, res) => {
    const id = req.params.id;
    const state = req.body.newState;

    try {
        // set new state in internal order table 
        await io_table.modifyInternalOrderState(id, state);
        if (state === 'COMPLETED') {
            // add internal order id to sku item
            products = req.body.products;
            for (prod of products) {
                item_table.setInternalOrderId(prod.RFID, id);
            }
        }
    } catch(err) {
        console.log(err);
        return res.status(500).json({error: "generic error"});
    }

    return res.status(200).json()    
})

// need to define the behavior in SKU_ITEM table on delete
internalOrderRouter.delete('/api/internalOrders/:id', async (req, res) => {
    const id = req.params.id;

    try {
        await io_table.deleteInternalOrderById(id);
        await prod_table.deleteProductByInternalOrderId(id);
    } catch(err) {
        console.log(err);
        return res.status(500).json({error: "generic error"});
    }

    return res.status(204).json()    
})

module.exports = internalOrderRouter
