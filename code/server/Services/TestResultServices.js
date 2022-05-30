class TestResultServices {

    constructor(test_res_dao) {
        this.dao = test_res_dao;
    }

    async getTestResultsByRFID(rfid) {
        return await this.dao.getTestResultsByRFID(rfid);
    }

    async getTestResultByRFIDAndId(rfid, id) {
        return await this.dao.getTestResultByRFIDAndId(rfid, id);
    }

    async createTestResult(rfid, test_descr_id, date, result) {
        return await this.dao.createTestResult(rfid, test_descr_id, date, result);
    }

    async modifyTestResult(rfid, id, new_date, new_res, new_test_descr_id) {
        return await this.dao.modifyTestResult(rfid, id, new_date, new_res, new_test_descr_id);
    }

    async removeTestResult(rfid, id) {
        return await this.dao.removeTestResult(rfid, id);
    }

}

module.exports = TestResultServices;
