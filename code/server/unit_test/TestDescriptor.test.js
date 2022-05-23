'use strict';

const db = require('../Modules/DB').db;
const TestDescriptor = require('../Modules/TestDescriptor');
const tdDao = new TestDescriptor(db.db)

describe('test test descriptor', () => {
    beforeAll(async () => {
        await db.dropTableTestDescriptor();
        await db.createTableTestDescriptor();
    });

    test('delete db', async () => {
        let res = await tdDao.getAllTestDescriptors();
        expect(res.length).toStrictEqual(0);
    });

    const data = 
        {
            "name": "test descriptor 3",
            "procedureDescription": "This test is described by...",
            "idSKU": 1
        };
    testNewTd(data);

    const newData = 
        {
            "newName": "test descriptor 1",
            "newProcedureDescription": "This test is described by...",
            "newIdSKU": 1
        };
    testModTd(newData);

    test('delete test descriptor', async () => {
        const id = await db.getAutoincrementId('TEST_DESCRIPTOR');
        let res = await tdDao.deleteTestDescriptor(id);
        res = await tdDao.getAllTestDescriptors();
        expect(res.length).toStrictEqual(0);
    });
});

function testNewTd(data) {
    test('create new test descriptor', async () => {
        
        await tdDao.createNewTestDescriptor(data);
        
        let res = await tdDao.getAllTestDescriptors();
        expect(res.length).toStrictEqual(1);
        
        const id = await db.getAutoincrementId('TEST_DESCRIPTOR');
        res = await tdDao.getTestDescriptorById(id);

        expect(res.id).toStrictEqual(id);
        expect(res.name).toStrictEqual(data.name);
        expect(res.procedureDescription).toStrictEqual(data.procedureDescription);
        expect(res.idSKU).toStrictEqual(data.idSKU);        
    });
}

function testModTd(newData) {
    test('modify test descriptor', async () => {
        
        const id = await db.getAutoincrementId('TEST_DESCRIPTOR');
        await tdDao.modifyTestDescriptor(id, newData)
        
        let res = await tdDao.getAllTestDescriptors();
        expect(res.length).toStrictEqual(1);
        
        res = await tdDao.getTestDescriptorById(id);

        expect(res.id).toStrictEqual(id);
        expect(res.name).toStrictEqual(newData.newName);
        expect(res.procedureDescription).toStrictEqual(newData.newProcedureDescription);
        expect(res.idSKU).toStrictEqual(newData.newIdSKU);        
    });
}