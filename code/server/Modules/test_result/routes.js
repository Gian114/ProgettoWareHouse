'use strict'

const express = require('express');
const TestResult = require('./TestResult');

const db = require('../db_singleton');
const tr_table = new TestResult(db.db);

const test_result_router = express.Router()

test_result_router.get('/api/skuitems/:rfid/testResults', async (req, res) => {
    const rfid = req.params.rfid;
    const test_results = tr_table.getTestResultByRFID(rfid);

    return res.status(200).json(test_results)
})

test_result_router.get('/api/skuitems/:rfid/testResults/:id', async (req, res) => {
    const rfid = req.params.rfid;
    const id = req.params.id;
    const test_results = tr_table.getTestResultByRFIDAndId(rfid, id);

    return res.status(200).json(test_results)
})

test_result_router.post('/api/skuitems/testResult', async (req, res) => {
    const test_res = req.body;
    console.log(test_res);
    await tr_table.createTestResult(test_res.rfid, test_res.idTestDescriptor, test_res.Date, test_res.Result);
    return res.status(201).json();
})

module.exports = test_result_router
