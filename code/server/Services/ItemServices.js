'use strict'

const db = require('../Modules/DB');
const Item = require('../Modules/Item');
const item = new Item(db.db);
const SKU = require('../Modules/SKU');
const sku = new SKU(db.db);

class ItemServices {
    
    async getAllItems() {

        try {
            const x = await item.getAllItems();
            return x;
        } catch(err) {
            return false;
        }
    }

    async getItemById(id) {

        try {
            const x = await item.getItemById(id);
            return x;
        } catch(err) {
            return false;
        }
    }

    async createNewItem(it) {

        let x = await sku.getSKUByID(it.SKUId);
        if(x === '') {
            return x;
        }
        x = await item.getItemBySKUIdAndSupplierId(it.SKUId, it.supplierId);
        if(x !== '') {
            return 1;
        }
        x = await item.getItemByIdAndSupplierId(it.id, it.supplierId);
        if(y !== '') {
            return 2;
        }
    
        try {
            x = await item.createNewItem(it);
            return x;
        } catch(err) {
            return false;
        }
    }

    async modifyItem(newValues, id) {

        let x = await item.getItemByID(id);
        if(x === '') {
            return x;
        }

        try {
            x = await item.modifyItem(id, newValues);
            return x;
        } catch(err) {
            return false;
        }
    }

    async deleteItem(id) {

        try {
            const x = item.deleteItem(id);
            return x;
        } catch(err) {
            return false;
        }
    }

}

module.exports = ItemServices;