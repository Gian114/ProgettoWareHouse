'use strict'

const express = require('express');
const InternalOrder = require('../Modules/InternalOrder');
// will need to change when return instance
const SKUItem = require('../Modules/SKUItem');

const db = require('../Modules/DB');
const io_table = new InternalOrder(db.db);
const prod_table = require('../Modules/Product');
const item_table = new SKUItem(db.db);

function idIsValid(id) {
    return (Number.isInteger(parseFloat(id)) && id > 0);
}

const internalOrderRouter = express.Router()

internalOrderRouter.get('/api/internalOrders', async (req, res) => {
    // only validation needed is user authorization which is not yet to implement

    let internal_orders;
    try {
        internal_orders = await io_table.getInternalOrdersNotCompleted();
        internal_orders.concat(await io_table.getInternalOrdersCompleted());
    } catch(err) {
        console.log(err);
        return res.status(500).json({error: "generic error"});
    }

    return res.status(200).json(internal_orders)
})

// only validation needed is user authorization which is not yet to implement
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

// only validation needed is user authorization which is not yet to implement
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

// all validations but authorizations done
internalOrderRouter.get('/api/internalOrders/:id', async (req, res) => {
    const id = req.params.id;

    // request validation
    if (!idIsValid(id)) {
        return res.status(422).json({error: "validation of id failed"});
    }

    let state;
    try {
        state = await io_table.getInternalOrderStateById(id);
    } catch(err) {
        console.log(err);
        return res.status(500).json({error: "generic error"});
    }

    // checks if id exists, request validation
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
        internal_order_id = await io_table.createInternalOrder(internal_order.issueDate, internal_order.state, internal_order.customerId);
        console.log(typeof(internal_order_id));
    } catch(err) {
        console.log(err + ' 1');
        return res.status(503).json({error: "generic error"});
    }
    for (const prod of products) {
        try {
            console.log(typeof(prod.SKUId));
            // prod.SKUId
            await prod_table.insertProductInternalOrder(prod.SKUId, prod.description, prod.price, prod.qty, internal_order_id)
        } catch(err) {
            console.log(err + ' 2');
            return res.status(503).json({error: "generic error"});
        }
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
        await io_table.modifyInternalOrderState(id, state);
        if (state === 'COMPLETED') {
            // add internal order id to sku item
            const products = req.body.products;
            for (const prod of products) {
                item_table.setInternalOrderId(prod.RFID, id);
            }
        }
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
        await prod_table.deleteProductByInternalOrderId(id);
        // await item_table.deleteInternalOrderId(id);
        await io_table.deleteInternalOrderById(id);
    } catch(err) {
        console.log(err);
        return res.status(500).json({error: "generic error"});
    }

    return res.status(204).json()    
})

module.exports = internalOrderRouter
