'use strict'

const express = require('express');
const TestResult = require('../Modules/TestResult');
const TestResultServices = require('../Services/TestResultServices');
const SKUItem = require('../Modules/SKUItem')

const db = require('../Modules/DB').db;
const skuit_dao = new SKUItem(db.db);
const tr_serv = new TestResultServices(new TestResult(db.db));

const testResultRouter = express.Router()

async function rfidExists(rfid) {
    let res
    try {
        res = (await skuit_dao.getSKUItemByRFID(rfid));
    } catch {
        return false
    }
    return (res.RFID !== undefined)
}

async function idExists(rfid, id) {
    let res
    try {
        res = (await tr_serv.getTestResultByRFIDAndId(rfid, id));
    } catch {
        return false
    }
    return (res.id !== undefined)
}

function rfidIsValid(rfid) {
    return (rfid.match(/^[0-9a-z]+$/) && rfid.length === 32);
}

function idIsValid(id) {
    return (Number.isInteger(parseFloat(id)) && id > 0);
}

function checkBodyKeys(body, keys) {
    for (const key of keys) {
        if (body[key] === undefined) {
            return false;
        }
    }
    return true;
}

testResultRouter.get('/api/skuitems/:rfid/testResults', async (req, res) => {
    const rfid = req.params.rfid;

    // request validation
    if (!rfidIsValid(rfid)) {
        return res.status(422).json('validation of rfid failed');
    }
    //console.log(rfidExists(rfid));
    if (!await rfidExists(rfid)) {
        return res.status(404).json('no sku item associated to rfid');
    }

    let test_results;
    try {
        test_results = await tr_serv.getTestResultsByRFID(rfid);
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: "generic error" })
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
        test_results = await tr_serv.getTestResultByRFIDAndId(rfid, id);
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: "generic error" });
    }

    if (test_results === '') {
        return res.status(404).json('no test result found for the given parameters');
    }

    return res.status(200).json(test_results)
})

testResultRouter.post('/api/skuitems/testResult', async (req, res) => {
    const test_res = req.body;

    // request validation
    if ((Object.keys(test_res).length !== 4) || !checkBodyKeys(req.body, ['rfid', 'idTestDescriptor', 'Date', 'Result'])) {
        return res.status(422).json('validation of request body failed')
    }
    if (!rfidIsValid(test_res.rfid)) {
        return res.status(422).json('validation of rfid failed');
    }

    try {
        await tr_serv.createTestResult(test_res.rfid, test_res.idTestDescriptor, test_res.Date, test_res.Result);
    } catch (err) {
        if (err.errno === 19) {
            return res.status(404).json('rfid or testDescriptorId do not exist');
        }
        return res.status(500).json('generic error');
    }

    return res.status(201).json();
})

testResultRouter.put('/api/skuitems/:rfid/testResult/:id', async (req, res) => {
    const rfid = req.params.rfid;
    const id = req.params.id;

    // request validation
    if (Object.keys(req.body).length !== 3) {
        return res.status(422).json('validation of request body failed')
    }
    if (!rfidIsValid(rfid) || !idIsValid(id)) {
        return res.status(422).json('validation of id or rfid failed');
    }
    if (!(await rfidExists(rfid)) || !(await idExists(rfid, id))) {
        return res.status(404).json('rfid or id not found');
    }

    try {
        await tr_serv.modifyTestResult(rfid, id, req.body.newDate, req.body.newResult, req.body.newIdTestDescriptor);
    } catch (err) {
        console.log(err);
        return res.status(503).json({ error: 'generic error' });
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
        await tr_serv.removeTestResult(rfid, id);
    } catch (err) {
        console.log(err);
        return res.status(503).json('generic error');
    }

    return res.status(204).json();
})

module.exports = testResultRouter
