const TestResult = require('./TestResult');

const db = require('../db_singleton');
const tr_table = new TestResult(db.db);

class TestResultController {
    constructor() {
        this.sku_item_controller = SKUItemController();
    }

    getTestResultByRFID(request) {
        // validate request
        if (!sku_item_controller.rfid_exists(request.params.rfid)) {
            return res.status(404).json('no sku item associated to rfid');
        }
        else if (!sku_item_controller.rfid_is_valid(request.params.rfid)) {
            return res.status(422).json('validation of rfid failed');
        }
    }
}
