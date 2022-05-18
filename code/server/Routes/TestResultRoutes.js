'use strict'

const express = require('express');
const TestResult = require('../Modules/TestResult');

const db = require('../Modules/DB');
const tr_table = new TestResult(db.db);

const testResultRouter = express.Router()

function rfidExists(rfid) {
    // TODO: implement in SKUItem
    return true
}

function rfidIsValid(rfid) {
    // TODO: implement in SKUItem
    return true
}

function idIsValid(id) {
    return (Number.isInteger(parseFloat(id)) && id > 0);
}

testResultRouter.get('/api/skuitems/:rfid/testResults', async (req, res) => {
    const rfid = req.params.rfid;
    
    // request validation
    if (!rfidIsValid(rfid)) {
        return res.status(422).json('validation of rfid failed');
    }
    else if (!rfidExists(rfid)) {
        return res.status(404).json('no sku item associated to rfid');
    }
    
    let test_results;
    try {
        test_results = await tr_table.getTestResultByRFID(rfid);
    } catch(err) {
        return res.status(500).json({error: "generic error"})
    }

    return res.status(200).json(test_results)
})

testResultRouter.get('/api/skuitems/:rfid/testResults/:id', async (req, res) => {
    const rfid = req.params.rfid;
    const id = req.params.id;

    // request validation
    if (!rfidIsValid(rfid) || !idIsValid(id)) {
        return res.status(422).json('validation of id or rfid failed');
    }

    let test_results;
    try {
        test_results = await tr_table.getTestResultByRFIDAndId(rfid, id);
    } catch(err) {
        return res.status(500).json({error: "generic error"});
    }

    if (test_results === '') {
        return res.status(404).json('no test result found for the given parameters');
    }

    return res.status(200).json(test_results)
})

testResultRouter.post('/api/skuitems/testResult', async (req, res) => {
    const test_res = req.body;

    // request validation
    if (Object.keys(test_res).length !== 4){
        return res.status(422).json('validation of request body failed')
    }
    if (!rfidIsValid(rfid)) {
        return res.status(422).json('validation of rfid failed');
    }
    if (!rfidExists(rfid)) {
        return res.status(404).json('no SKUItem for the given rfid');
    }
    // TODO: validate id TestDescriptor 
    
    try {
        await tr_table.createTestResult(test_res.rfid, test_res.idTestDescriptor, test_res.Date, test_res.Result);
    } catch(err) {
        return res.status(500).json('generic error');
    }

    return res.status(201).json();
})

testResultRouter.put('/api/skuitems/:rfid/testResult/:id', async (req, res) => {
    const rfid = req.params.rfid;
    const id = req.params.id;

    // request validation
    if (Object.keys(req.body).length !== 3){
        return res.status(422).json('validation of request body failed')
    }
    if (!rfidIsValid(rfid) || !idIsValid(id)) {
        return res.status(422).json('validation of id or rfid failed');
    }
    if (!rfidExists(rfid)) {
        return res.status(404).json('no SKUItem for the given rfid');
    }
    // TODO: validate id TestDescriptor and id TestResult

    try {
        await tr_table.modifyTestResult(rfid, id, req.body.newDate, req.body.newResult, req.body.newIdTestDesciptor);
    } catch(err) {
        return res.status(503).json('generic error');
    }

    return res.status(200).json();
})

testResultRouter.delete('/api/skuitems/:rfid/testResult/:id', async (req, res) => {
    const rfid = req.params.rfid;
    const id = req.params.id;

    // request validation
    if (!rfidIsValid(rfid) || !idIsValid(id)) {
        return res.status(422).json('validation of id or rfid failed');
    }

    try {
        await tr_table.removeTestResult(rfid, id);
    } catch(err) {
        return res.status(503).json('generic error');
    }

    return res.status(204).json();
})

module.exports = testResultRouter
