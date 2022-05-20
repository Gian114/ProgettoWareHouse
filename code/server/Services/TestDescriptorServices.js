'use strict'

const db = require('../Modules/DB');
const TestDescriptor = require('../Modules/TestDescriptor');
const testDescriptor = new TestDescriptor(db.db);
const SKU = require('../Modules/SKU');
const sku = new SKU(db.db);

class TestDescriptorServices {
    
    async getAllTestDescriptors(res) {

        try {
            let x = await testDescriptor.getAllTestDescriptors();
            return res.status(200).json(x);
        } catch(err) {
            return res.status(500).json({error: "generic error"});
        }
    }

    async getTestDescriptorById(res, id) {
     
        let x = '';
        try {
            x = await testDescriptor.getTestDescriptorById(id);
        } catch(err) {
            return res.status(500).json({error: "generic error"});
        }
        
        if(x === '') {
            return res.status(404).json({error: "no test descriptor associated id"});
        } else {
            return res.status(200).json(x);
        }
    }

    async createNewTestDescriptor(res, td) {

        let y = await sku.getSKUByID(td.idSKU);
        if(y === '') {
            return res.status(404).json({error: "no sku associated idSKU"});
        }
    
        try {
            await testDescriptor.createNewTestDescriptor(td);
            return res.status(201).json();
        } catch(err) {
            return res.status(503).json({error: "generic error"});
        }
    }

    async modifyTestDescriptor(res, newValues, id) {

        let x = await testDescriptor.getTestDescriptorById(id);
        let y = await sku.getSKUByID(newValues.newIdSKU);
        if(x === '' || y === '') {
            return res.status(404).json({error: "no test descriptor associated id or no sku associated to IDSku"});
        }

        try {
            await testDescriptor.modifyTestDescriptor(id, newValues);
            return res.status(200).json();
        } catch(err) {
            return res.status(503).json({error: "generic error"});
        }
    }

    async deleteTestDescriptor(res, id) {

        try {
            await testDescriptor.deleteTestDescriptor(id);
            return res.status(204).json();
        } catch(err) {
            return res.status(503).json({error: "generic error"});
        }
    }

}

module.exports = TestDescriptorServices;