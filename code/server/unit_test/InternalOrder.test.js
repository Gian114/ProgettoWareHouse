const DB = require("../Modules/DB").DB;
const db = new DB(':memory:');
const InternalOrder = require("../Modules/InternalOrder");
const io_dao = new InternalOrder(db.db);

const io1 = {
    issue_date: "1/1/2018",
    state: "ISSUED",
    customer_id: 1,
};

const io2 = {
    issue_date: "1/2/2018",
    state: "DELIVERY",
    customer_id: 2,
};

const io3 = {
    issue_date: "1/3/2018",
    state: "COMPLETED",
    customer_id: 1,
};

describe("InternalOrder dao no err tests", () => {
    beforeEach(async () => {
        await db.dropTableInternalOrder();
        await db.createTableInternalOrder();
        await db.dropTableProduct();
        await db.createTableProduct();
        // await db.dropTableInternalOrder();
        // await db.createTableInternalOrder();
    });

    // test('delete db', async () => {
    //     let res = await tr_dao.getTestResults();
    //     expect(res.length).toStrictEqual(0);
    // });

    testCreateInternalOrder();
    testGetInternalOrdersNotCompleted();
    testModifyInternalOrderState();
});

function testCreateInternalOrder() {
    test("create new internal order", async () => {
        let res;
        res = await io_dao.createInternalOrder(
            io1.issue_date,
            io1.state,
            io1.customer_id
        );
        expect(res).toStrictEqual(1);
    });
}

function testGetInternalOrdersNotCompleted() {
    test("get internal orders not completed", async () => {
        let res;

        await insertInternalOrder([io1, io2, io3]);

        res = await io_dao.getInternalOrdersNotCompleted();
        expect(res.length).toStrictEqual(2);

        compareInternalOrders(res[0], io1);
        compareInternalOrders(res[1], io2);
    });
}

function testModifyInternalOrderState() {
    test("modify internal order state", async () => {
        let res;
        await insertInternalOrder([io1, io2, io3]);

        res = await io_dao.modifyInternalOrderState(1, 'DELIVERY')
        expect(res).toStrictEqual(true);

        res = await io_dao.getInternalOrderStateById(1);
        expect(res).toStrictEqual('DELIVERY');
    });
}

async function insertInternalOrder(ios) {
    for (io of ios) {
        await io_dao.createInternalOrder(io.issue_date, io.state, io.customer_id);
    }
}

function compareInternalOrders(io1, io2) {
    expect(io1.issueDate).toStrictEqual(io2.issue_date);
    expect(io1.state).toStrictEqual(io2.state);
    expect(io1.customerId).toStrictEqual(io2.customer_id);
}
