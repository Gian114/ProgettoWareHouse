'use strict';

class TestDescriptorServices {

    constructor(td, sku) {
        this.testDescriptor = td;
        this.sku = sku;
    }
    
    async getAllTestDescriptors() {

        try {
            const x = await this.testDescriptor.getAllTestDescriptors();
            return x;
        } catch(err) {
            console.log(err);
            return false;
        }
    }

    async getTestDescriptorById(id) {
     
        try {
            const x = await this.testDescriptor.getTestDescriptorById(id);
            return x;
        } catch(err) {
            console.log(err);
            return false;
        }
    }

    async createNewTestDescriptor(td) {
        
        let x = await this.sku.getSKUByID(td.idSKU);
        if(x === '') {
            return x;
        }
        
        try {
            x = await this.testDescriptor.createNewTestDescriptor(td);
            return x;
        } catch(err) {
            console.log(err);
            return false;
        }
    }

    async modifyTestDescriptor(newValues, id) {

        let x = await this.testDescriptor.getTestDescriptorById(id);
        let y = await this.sku.getSKUByID(newValues.newIdSKU);
        if(x === '' || y === '') {
            return '';
        }

        try {
            x = await this.testDescriptor.modifyTestDescriptor(id, newValues);
            return x;
        } catch(err) {
            console.log(err);
            return false;
        }
    }

    async deleteTestDescriptor(id) {

        try {
            const x = await this.testDescriptor.deleteTestDescriptor(id);
            return x;
        } catch(err) {
            console.log(err);
            return false;
        }
    }

}

module.exports = TestDescriptorServices;