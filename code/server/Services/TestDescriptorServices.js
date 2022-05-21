'use strict'

const db = require('../Modules/DB');
const TestDescriptor = require('../Modules/TestDescriptor');
const testDescriptor = new TestDescriptor(db.db);
const SKU = require('../Modules/SKU');
const sku = new SKU(db.db);

class TestDescriptorServices {
    
    async getAllTestDescriptors() {

        try {
            const x = await testDescriptor.getAllTestDescriptors();
            return x;
        } catch(err) {
            return false;
        }
    }

    async getTestDescriptorById(id) {
     
        try {
            const x = await testDescriptor.getTestDescriptorById(id);
            return x;
        } catch(err) {
            return false;
        }
    }

    async createNewTestDescriptor(td) {

        let x = await sku.getSKUByID(td.idSKU);
        if(x === '') {
            return x;
        }
    
        try {
            x = await testDescriptor.createNewTestDescriptor(td);
            return x;
        } catch(err) {
            return false;
        }
    }

    async modifyTestDescriptor(newValues, id) {

        let x = await testDescriptor.getTestDescriptorById(id);
        let y = await sku.getSKUByID(newValues.newIdSKU);
        if(x === '' || y === '') {
            return '';
        }

        try {
            x = await testDescriptor.modifyTestDescriptor(id, newValues);
            return x;
        } catch(err) {
            return false;
        }
    }

    async deleteTestDescriptor(id) {

        try {
            const x = await testDescriptor.deleteTestDescriptor(id);
            return x;
        } catch(err) {
            return false;
        }
    }

}

module.exports = TestDescriptorServices;