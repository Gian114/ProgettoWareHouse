const DB = require('../Modules/DB').DB;
const db = new DB(':memory:');
const TestResult = require('../Modules/TestResult');
const TestResultServices = require('../Services/TestResultServices');

const tr_serv = new TestResultServices(new TestResult(db.db));

const tr1 = {
    rfid: "abc123",
    test_descriptor_id: 1,
    date: '1/1/2020',
    result: true
}

const tr2 = {
    rfid: "abc123",
    test_descriptor_id: 2,
    date: '2/1/2020',
    result: false
}

const tr3 = {
    rfid: "123abc",
    test_descriptor_id: 2,
    date: '2/1/2020',
    result: false
}

describe('TestResult services no err tests', () => {
    beforeEach(async () => {
        await db.dropTableTestResult();
        await db.createTableTestResult();
    });

    testCreateTestResult();
    testGetTestResultsByRFID();
    testGetTestResultByRFIDAndId();
    testModifyTestResult();
    testRemoveTestResult();

});

function testCreateTestResult() {
    test('create new test result', async () => {

        let res;
        res = await tr_serv.createTestResult(tr1.rfid, tr1.test_descriptor_id, tr1.date, tr1.result);
        expect(res).toStrictEqual('');
    });
}

function testGetTestResultsByRFID() {
    test('get test results by rfid', async () => {

        let res;
        await insertTestResults([tr1, tr2, tr3]);

        res = await tr_serv.getTestResultsByRFID(tr1.rfid);
        expect(res.length).toStrictEqual(2);

        compareTestResults(res[0], tr1);
        compareTestResults(res[1], tr2);

        res = await tr_serv.getTestResultsByRFID(tr3.rfid);
        expect(res.length).toStrictEqual(1);

        compareTestResults(res[0], tr3);
    });
}

function testGetTestResultByRFIDAndId() {
    test('get test result by rfid and id', async () => {

        let res;
        await insertTestResults([tr1, tr2, tr3]);

        res = await tr_serv.getTestResultByRFIDAndId(tr1.rfid, 1);
        compareTestResults(res, tr1);

        res = await tr_serv.getTestResultByRFIDAndId(tr2.rfid, 2);
        compareTestResults(res, tr2);

        res = await tr_serv.getTestResultByRFIDAndId(tr3.rfid, 3);
        compareTestResults(res, tr3);
    });
}

function testModifyTestResult() {
    test('modify test result', async () => {

        let res;
        await insertTestResults([tr1, tr2, tr3]);

        res = await tr_serv.modifyTestResult(tr2.rfid, 2, "1/1/2022", false, 6);
        expect(res).toStrictEqual('')

        res = await tr_serv.getTestResultByRFIDAndId(tr2.rfid, 2);
        expect(res.Date).toStrictEqual("1/1/2022");
        expect(res.Result).toStrictEqual(false);
        expect(res.idTestDescriptor).toStrictEqual(6);
    });
}

function testRemoveTestResult() {
    test('remove test result', async () => {

        let res;
        await insertTestResults([tr1, tr2, tr3]);

        res = await tr_serv.removeTestResult(tr2.rfid, 2);
        expect(res).toStrictEqual('')

        res = await tr_serv.getTestResultsByRFID(tr2.rfid);
        expect(res.length).toStrictEqual(1);
        compareTestResults(res[0], tr1);
    });
}

async function insertTestResults(trs) {
    for (tr of trs) {
        await tr_serv.createTestResult(tr.rfid, tr.test_descriptor_id, tr.date, tr.result);
    }
}

function compareTestResults(tr1, tr2) {
    expect(tr1.Date).toStrictEqual(tr2.date);
    expect(tr1.Result).toStrictEqual(tr2.result);
    //expect(tr1.sku_item_rfid).toStrictEqual(tr2.rfid);
    expect(tr1.idTestDescriptor).toStrictEqual(tr2.test_descriptor_id);
}
