const chai = require('chai');
const chaiHttp = require('chai-http');

chai.use(chaiHttp);
chai.should();

const app = require('../server');
var agent = chai.request.agent(app);

const skus = require('./utils-sku');
const skuitems = require('./utils-skuitems');
const positions = require('./utils-positions');
const testdescriptors = require('./utils-testdescriptor');
const users = require('./utils-users');
const restockorders = require('./utils-restockorder');
const returnorders = require('./utils-returnorder');
const skucrud = require('./crud/test-CRUD-SKUs');
const skuitemcrud = require('./crud/test-CRUD-SKUitems');
const positioncrud = require('./crud/test-CRUD-Position');
const testdescriptorcrud = require('./crud/test-CRUD-TestDescriptor');
const testresultcrud = require('./crud/test-CRUD-TestResult');
const usercrud = require('./crud/test-CRUD-User');
const restockordercrud = require('./crud/test-CRUD-RestockOrder');
const retordcrud = require('./crud/test-CRUD-ReturnOrder');
const intordcrud = require('./crud/test-CRUD-InternalOrder');
const itemcrud = require('./crud/test-CRUD-Item');

const db = require('../Modules/DB').db

before('start db', (done) => {
    db.startDBAcceptanceTests().then(() => done());
})

describe.only('Test CRUD', () => {
    skucrud.testSkuCRUD();
    skuitemcrud.testSkuItemsCRUD();
    positioncrud.testPositionCRUD();
    testdescriptorcrud.testTestDescriptorCRUD();
    testresultcrud.testTestResultCRUD();
    usercrud.testUserCRUD();
    restockordercrud.testRestockOrderCRUD()
    //retordcrud.testReturnOrderCRUD();
    intordcrud.testInternalOrderCRUD();
    itemcrud.testItemCRUD();
    

})