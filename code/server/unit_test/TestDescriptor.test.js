const db = require('../Modules/DB')
const TestDescriptor = require('../Modules/TestDescriptor');
const tdDao = new TestDescriptor(db.db)

describe('testDao', () => {
    beforeAll(async () => {
        await db.dropTableTestDescriptor();
        await db.createTableTestDescriptor();
    });

    test('delete db', async () => {
        let res = await tdDao.getAllTestDescriptors();
        expect(res.length).toStrictEqual(0);
    });

    let data = 
        {
            "name": "test descriptor 3",
            "procedureDescription": "This test is described by...",
            "idSKU" : 1
        }
    testNewTd(data);
});

function testNewTd(data) {
    test('create new test descriptor', async () => {
        
        await tdDao.createNewTestDescriptor(data);
        
        let res = await tdDao.getAllTestDescriptors();
        expect(res.length).toStrictEqual(1);
        
        const id = await db.getAutoincrementID('TEST_DESCRIPTOR');
        res = await tdDao.getTestDescriptorById(id);

        expect(res.id).toStrictEqual(id);
        expect(res.name).toStrictEqual(data.name);
        expect(res.procedureDescription).toStrictEqual(data.procedureDescription);
        expect(res.idSKU).toStrictEqual(data.idSKU);        
    });
}