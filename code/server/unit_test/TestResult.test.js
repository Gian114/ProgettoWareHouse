'use strict';
const DB = require('../Modules/DB').DB;
const db = new DB(':memory:');
const TestResult = require('../Modules/TestResult');
const tr_dao = new TestResult(db.db);

// there is no validation of content in the dao so errors are not really meaningful (sql errors)
describe('TestResult dao tests', () => {
    beforeEach(async () => {
        await db.dropTableTestResult();
        await db.createTableTestResult();
    });
    
    test('delete db', async () => {
        let res = await tr_dao.getTestResults();
        expect(res.length).toStrictEqual(0);
    });

    testCreateTestResult("1111", 1, '11/11/2020', true);
    testGetTestResultsByRFID("1111", 1, '11/11/2020', true);
    testGetTestResultsByRFIDAndId("abc123", false);
    testModifyTestResult("ssss", true);
    testRemoveTestResult("ssss", true);
});

function testCreateTestResult(rfid, test_descriptor_id, date, result) {
    test('create new test result', async () => {
        
        await createTestResult(rfid, test_descriptor_id, date, result);
        
        let res = await tr_dao.getTestResults();
        expect(res.length).toStrictEqual(1);

        expect(res[0].date).toStrictEqual(date);
        expect(res[0].result).toStrictEqual(result);
        expect(res[0].sku_item_rfid).toStrictEqual(rfid);
        expect(res[0].test_descriptor_id).toStrictEqual(test_descriptor_id);        
    });
}

function testGetTestResultsByRFID(rfid, test_descriptor_id, date, result) {
    test('get test results by rfid', async () => {
        await createTestResult(rfid, test_descriptor_id, date, result);
        await createTestResult(rfid, test_descriptor_id, date, !result);

        let res = await tr_dao.getTestResultsByRFID(rfid);
        expect(res.length).toStrictEqual(2);

        expect(res[0].date).toStrictEqual(date);
        expect(res[0].result).toStrictEqual(result);
        expect(res[0].sku_item_rfid).toStrictEqual(rfid);
        expect(res[0].test_descriptor_id).toStrictEqual(test_descriptor_id);

        expect(res[1].date).toStrictEqual(date);
        expect(res[1].result).toStrictEqual(!result);
        expect(res[1].sku_item_rfid).toStrictEqual(rfid);
        expect(res[1].test_descriptor_id).toStrictEqual(test_descriptor_id);
    });
}

function testGetTestResultsByRFIDAndId(rfid, result) {
    test('get test results by rfid and id', async () => {
        await createTestResult(rfid, 1, "1/1/1990", result);
        await createTestResult(rfid, 2, "2/1/1990", result);
        await createTestResult(rfid, 1, "3/1/1990", result);
        await createTestResult(rfid, 3, "4/1/1990", result);

        let res = await tr_dao.getTestResultByRFIDAndId(rfid, 1);

        expect(res.result).toStrictEqual(result);
        expect(res.sku_item_rfid).toStrictEqual(rfid);
        expect(res.test_descriptor_id).toStrictEqual(1);
        expect(res.date).toStrictEqual("1/1/1990");

        res = await tr_dao.getTestResultByRFIDAndId(rfid, 4);

        expect(res.date).toStrictEqual("4/1/1990");
        expect(res.result).toStrictEqual(result);
        expect(res.sku_item_rfid).toStrictEqual(rfid);
        expect(res.test_descriptor_id).toStrictEqual(3);
    });
}

function testModifyTestResult(rfid, result) {
    test('modify test result', async () => {
        await createTestResult(rfid, 1, "1/1/1990", result);
        await createTestResult(rfid, 2, "2/1/1990", result);
        await createTestResult(rfid, 1, "3/1/1990", result);
        await createTestResult(rfid, 3, "4/1/1990", result);

        await tr_dao.modifyTestResult(rfid, 2, "1/1/1991", true, 10)
        let res = await tr_dao.getTestResultByRFIDAndId(rfid, 2);

        expect(res.result).toStrictEqual(true);
        expect(res.sku_item_rfid).toStrictEqual(rfid);
        expect(res.test_descriptor_id).toStrictEqual(10);
        expect(res.date).toStrictEqual("1/1/1991");

        await tr_dao.modifyTestResult(rfid, 3, "3/1/1990", false, 2);
        res = await tr_dao.getTestResultByRFIDAndId(rfid, 3);

        expect(res.date).toStrictEqual("3/1/1990");
        expect(res.result).toStrictEqual(false);
        expect(res.sku_item_rfid).toStrictEqual(rfid);
        expect(res.test_descriptor_id).toStrictEqual(2);
    });
}

function testRemoveTestResult(rfid, result) {
    test('remove test result', async () => {
        await createTestResult(rfid, 1, "1/1/1990", result);
        await createTestResult(rfid, 2, "2/1/1990", result);

        await tr_dao.removeTestResult(rfid, 1)
        let res = await tr_dao.getTestResults();
        expect(res.length).toStrictEqual(1);

        expect(res[0].result).toStrictEqual(result);
        expect(res[0].sku_item_rfid).toStrictEqual(rfid);
        expect(res[0].test_descriptor_id).toStrictEqual(2);
        expect(res[0].date).toStrictEqual("2/1/1990");

        await tr_dao.removeTestResult(rfid, 2);
        res = await tr_dao.getTestResultByRFIDAndId(rfid, 3);
        expect(res.length).toStrictEqual(0);
    });
}

async function createTestResult(rfid, test_descriptor_id, date, result) {
    await tr_dao.createTestResult(rfid, test_descriptor_id, date, result);
}