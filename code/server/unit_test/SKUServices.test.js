const SKUServices = require('../Services/SKUServices')

const SKU = require('../Modules/SKU')
const Position = require('../Modules/Position')

const db = require('../Modules/DB')
const sku = new SKU(db.db)
const pos = new Position(db.db)

const sku_service = new SKUServices(sku, pos)

describe("get sku(s)", () => {
    beforeEach(async () => {

        //deleting data 
        await db.dropTableSKU();
        await db.createTableSKU();

        //creating sku
        let data = 
        {
            "description" : "a new sku",
            "weight" : 100,
            "volume" : 50,
            "notes" : "first SKU",
            "price" : 10.99,
            "availableQuantity" : 50
        }

        let data2 = 
        {
            "description" : "another sku",
            "weight" : 200,
            "volume" : 120,
            "notes" : "second SKU",
            "price" : 20.12,
            "availableQuantity" : 43
        }   

        await sku.createSKU(data);
        await sku.createSKU(data2);
        
    });

    let data = 
        {
            "description" : "a new sku",
            "weight" : 100,
            "volume" : 50,
            "notes" : "first SKU",
            "price" : 10.99,
            "availableQuantity" : 50
        }
        
    let data2 = 
    {
        "description" : "another sku",
        "weight" : 200,
        "volume" : 120,
        "notes" : "second SKU",
        "price" : 20.12,
        "availableQuantity" : 43
    }


    testSKU(1, data);
    testSKU(2, data2);
    //testSKU(3)   //this test failes

    //testing getSKUList, how many items and is the second one the one with data2?
    testSKUList(data2);

});

    
async function testSKU(id, data) {
    test('get SKU', async () => {
        let res = await sku_service.getSKU(id)
        expect(res).toEqual({
            id: id,
            description : data.description,
            weight : data.weight,
            volume : data.volume,
            notes : data.notes,
            position: null,
            availableQuantity: data.availableQuantity, 
            price: data.price,
        });
    });
}

async function testSKUList(data) {
    test('get SKU list', async () => {
        let res = await sku_service.getSKUs();
        expect(res.length).toEqual(2);
        expect(res[1]).toEqual({
            id: 2,
            description : data.description,
            weight : data.weight,
            volume : data.volume,
            notes : data.notes,
            position: null,
            availableQuantity: data.availableQuantity, 
            price: data.price,
        });
    });
}

//another testcase
describe("modify SKU", () => {
    let modifiedData = 
        {
        "newDescription" : "a modifed sku",
        "newWeight" : 120,
        "newVolume" : 80,
        "newNotes" : "modified SKU",
        "newPrice" : 10.99,
        "newAvailableQuantity" : 60
        }

        let wrongData = 
        {
        "newDescription" : "a modifed again sku",
        "newWeight" : 120,
        "newAvailableQuantity" : 60
        }

    testModify(1, modifiedData);
    //testModify(3, modifiedData);  //this failes because there is no sku with id 3
    //testModify(2, wrongData) //this failes because the data passed is wrong

});


async function testModify(id, data) {
    test('modify SKU', async () => {
        let res = await sku_service.modifySKU(id, data)
        //if everything worked fine the modify in service returns true
        expect(res).toEqual(true);
        //if i get the item, it is now modified
        res = await sku_service.getSKU(id);
        expect(res).toEqual({
            id: id,
            description : data.newDescription,
            weight : data.newWeight,
            volume : data.newVolume,
            notes : data.newNotes,
            position: null,
            availableQuantity: data.newAvailableQuantity, 
            price: data.newPrice,
        });
    });
}


//another testcase
describe("delete SKU", () => {
  
    testDelete(2);
 
});

async function testDelete(id) {
    test('delete SKU', async () => {
        let res = await sku_service.deleteSKU(id)
        //if everything worked fine the services returns true
        expect(res).toEqual(true);
    });
}