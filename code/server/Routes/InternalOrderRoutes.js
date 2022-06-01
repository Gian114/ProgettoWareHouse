'use strict'

const express = require('express');

const InternalOrder = require('../Modules/InternalOrder');
const SKUItem = require('../Modules/SKUItem');
const Product = require('../Modules/Product');

const db = require('../Modules/DB').db;

const prod_table = new Product(db.db);
const item_table = new SKUItem(db.db);
const io = new InternalOrder(db.db);

const InternalOrderServices = require('../Services/InternalOrderServices');
const io_serv = new InternalOrderServices(io, prod_table, item_table);

function idIsValid(id) {
    return (Number.isInteger(Number(id)) && id > 0);
}

async function ioIdExists(id) {
    let res
    try {
        res = (await io.getInternalOrderStateById(id));
    } catch {
        return false
    }
    return (res !== '')
}

const internalOrderRouter = express.Router()

internalOrderRouter.get('/api/internalOrders', async (_, res) => {
    // only validation needed is user authorization which is not yet to implement

    let internal_orders;
    try {
        internal_orders = await io_serv.getInternalOrders();
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: "generic error" });
    }

    return res.status(200).json(internal_orders)
})

// only validation needed is user authorization which is not yet to implement
internalOrderRouter.get('/api/internalOrdersIssued', async (_, res) => {

    const state = 'ISSUED';

    let internal_orders;
    try {
        internal_orders = await io_serv.getInternalOrdersByState(state);
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: "generic error" });
    }

    return res.status(200).json(internal_orders)
})

// only validation needed is user authorization which is not yet to implement
internalOrderRouter.get('/api/internalOrdersAccepted', async (_, res) => {

    const state = 'ACCEPTED';

    let internal_orders;
    try {
        internal_orders = await io_serv.getInternalOrdersByState(state);
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: "generic error" });
    }

    return res.status(200).json(internal_orders)
})

// all validations but authorizations done
internalOrderRouter.get('/api/internalOrders/:id', async (req, res) => {
    const id = req.params.id;

    // request validation
    if (!idIsValid(id)) {
        return res.status(422).json({ error: "validation of id failed" });
    }
    if (!(await ioIdExists(id))) {
        return res.status(404).json('no internal order with specified id');
    }

    let internal_order;
    try {
        internal_order = await io_serv.getInternalOrderById(id);
    } catch (err) {
        return res.status(500).json({ error: "generic error" });
    }
    if (internal_order === undefined) {
        return res.status(404).json({ error: "no internal order associated to id" });
    }

    return res.status(200).json(internal_order)
})

// all validations but authorizations done
internalOrderRouter.post('/api/internalOrders', async (req, res) => {
    // request validation
    if (Object.keys(req.body).length !== 3) {
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
    } catch (err) {
        if (err.errno === 19) {
            return res.status(404).json('customerId or SKUId do not exist')
        }
        console.log(err);
        return res.status(503).json({ error: "generic error" });
    }

    return res.status(201).json()
})

internalOrderRouter.put('/api/internalOrders/:id', async (req, res) => {
    const id = req.params.id;
    const state = req.body.newState;

    // request validation
    if (!idIsValid(id)) {
        return res.status(422).json('validation of id failed');
    }
    if (!(await ioIdExists(id))) {
        return res.status(404).json('no internal order with specified id');
    }

    if (state == undefined || (state === 'COMPLETED' && req.body.products == undefined) || Object.keys(req.body).length > 2) {
        return res.status(422).json('validation of request body failed');
    }

    try {
        // set new state in internal order table 
        await io_serv.modifyInternalOrder(id, state, req.body.products);
    } catch (err) {
        if (err.errno === 19) {
            return res.status(404).json('no internal order for the given id');
        }
        console.log(err);
        return res.status(500).json({ error: "generic error" });
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
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: "generic error" });
    }

    return res.status(204).json()
})

module.exports = internalOrderRouter
