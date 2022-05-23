'use strict';

const TestDescriptorServices = require('../Services/TestDescriptorServices');
const TestDescriptor = require('../Modules/TestDescriptor');
const SKU = require('../Modules/SKU');

const db = require('../Modules/DB');
const tdDao = new TestDescriptor(db.db);
const sku = new SKU(db.db);
const tdServices = new TestDescriptorServices(tdDao, sku);

describe("Test descriptor services", () => {
    const sku1 =
        {
            "description" : "a new sku",
            "weight" : 100,
            "volume" : 50,
            "notes" : "first SKU",
            "price" : 10.99,
            "availableQuantity" : 50
        };

    const data1 = //right
        {
            "name": "test descriptor 3",
            "procedureDescription": "This test is described by...",
            "idSKU" : 1
        };

    const data2 = //right
        {
            "name": "test descriptor 5",
            "procedureDescription": "This test is described by...",
            "idSKU" : 1
        };

    const data3 = //wrong: no sku associated to id
        {
            "name": "test descriptor 1",
            "procedureDescription": "This test is described by...",
            "idSKU" : 2
        };
    
    const newData1 = 
        {
            "newName": "test descriptor 1",
            "newProcedureDescription": "This test is described by...",
            "newIdSKU": 1
        };
    
    const newData2 = //wrong: no sku associated to id
        {
            "newName": "test descriptor 1",
            "newProcedureDescription": "This test is described by...",
            "newIdSKU": 2
        };


    beforeEach(async () => {
        await db.dropTableTestDescriptor();
        await db.dropTableSKU();
        await db.createTableTestDescriptor();
        await db.createTableSKU();
        await sku.createSKU(sku1);
        await tdDao.createNewTestDescriptor(data1);
    });

    test('Create test descriptors', async () => {
        await tdServices.createNewTestDescriptor(data2);

        let res = await tdServices.getTestDescriptorById(2);
        expect(res).toEqual({
            id: 2,
            name: data2.name,
            procedureDescription: data2.procedureDescription,
            idSKU : data2.idSKU
        });

        res = await tdServices.createNewTestDescriptor(data3);
        expect(res).toEqual('');
    });

    test('Get test descriptors', async () => {

        let res = await tdServices.getAllTestDescriptors();
        expect(res.length).toStrictEqual(1);
        expect(res[0]).toEqual({
            id: 1,
            name: data1.name,
            procedureDescription: data1.procedureDescription,
            idSKU : data1.idSKU
        });

        await tdServices.createNewTestDescriptor(data2);
        res = await tdServices.getAllTestDescriptors();
        expect(res.length).toStrictEqual(2);

        res = await tdServices.getTestDescriptorById(3);
        expect(res).toEqual('');
    });

    test('Modify test descriptors', async () => {

        await tdServices.modifyTestDescriptor(newData1, 1);
        let res = await tdServices.getTestDescriptorById(1);
        expect(res).toEqual({
            id: 1,
            name: newData1.newName,
            procedureDescription: newData1.newProcedureDescription,
            idSKU : newData1.newIdSKU
        });
        
        res = await tdServices.modifyTestDescriptor(newData2, 1);
        expect(res).toEqual('');

        res = await tdServices.modifyTestDescriptor(newData1, 3);
        expect(res).toEqual('');
    });

    test('Delete test descriptors', async () => {
        
        await tdServices.deleteTestDescriptor(2);
        let res = await tdServices.getAllTestDescriptors();
        expect(res.length).toStrictEqual(1);

        await tdServices.deleteTestDescriptor(1);
        res = await tdServices.getAllTestDescriptors();
        expect(res.length).toStrictEqual(0);
    });

});