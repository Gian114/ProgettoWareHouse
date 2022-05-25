const DB = require("../Modules/DB").DB;
const InternalOrder = require("../Modules/InternalOrder");
const Product = require('../Modules/Product');
const SKUItem = require('../Modules/SKUItem')
const InternalOrderServices = require("../Services/InternalOrderServices");

const db = new DB(":memory:");

const io_serv = new InternalOrderServices(
    new InternalOrder(db.db),
    new Product(db.db),
    new SKUItem(db.db));

const io1 = {
    issue_date: "1/1/2018",
    state: "ISSUED",
    customer_id: 1,
    products: [
        { SKUId: 1, description: "descr", price: 10.3, qty: 2 }
    ]
};

const io2 = {
    issue_date: "1/2/2018",
    state: "DELIVERY",
    customer_id: 2,
    products: [
        { SKUId: 1, description: "descr", price: 10.3, qty: 2 }
    ]
};

describe('InternalOrder services no err tests', () => {

    beforeEach(async () => {
        await db.dropTableInternalOrder();
        await db.dropTableProduct();
        await db.dropTableSKUItem();
        await db.createTableInternalOrder();
        await db.createTableProduct();
        await db.createTableSKUItem();
    });

    testCreateInternalOrder();
    getInternalOrders();
    getInternalOrdersByState();

});

function testCreateInternalOrder() {
    test('create new internal order', async () => {

        let res;
        res = await io_serv.createInternalOrder(io1.issue_date, io1.state, io1.customer_id, io1.products);
        expect(res).toStrictEqual(1);
    });
}

function getInternalOrders() {
    test('get internal orders', async () => {
        let res;
        await insertInternalOrders([io1, io2])

        res = await io_serv.getInternalOrders();
        compareInternalOrders(res[0], io1);
        compareInternalOrders(res[1], io2);

    });
}

function getInternalOrdersByState() {
    test('get internal orders by state', async () => {
        // check out what's wrong with products
        let res;
        await insertInternalOrders([io1, io2])

        res = await io_serv.getInternalOrdersByState('ISSUED');
        expect(res.length).toStrictEqual(1)
        compareInternalOrders(res[0], io1);

        res = await io_serv.getInternalOrdersByState('DELIVERY');
        expect(res.length).toStrictEqual(1)
        compareInternalOrders(res[0], io2);

    });
}

async function insertInternalOrders(ios) {
    for (io of ios) {
        await io_serv.createInternalOrder(io.issue_date, io.state, io.customer_id, io.products);
    }
}

function compareInternalOrders(io1, io2) {
    expect(io1.issueDate).toStrictEqual(io2.issue_date);
    expect(io1.state).toStrictEqual(io2.state);
    expect(io1.customerId).toStrictEqual(io2.customer_id);
    expect(io1.products).toEqual(io2.products);
}
