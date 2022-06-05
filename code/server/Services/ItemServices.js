'use strict';

class ItemServices {

    constructor(it, sku, user) {
        this.item = it;
        this.sku = sku;
        this.user = user;
    }
    
    async getAllItems() {

        try {
            const x = await this.item.getAllItems();
            return x;
        } catch(err) {
            
            return false;
        }
    }

    async getItemById(id) {

        try {
            const x = await this.item.getItemById(id);
            return x;
        } catch(err) {
            
            return false;
        }
    }

    async createNewItem(it) {

        let x = await this.sku.getSKUByID(it.SKUId);
        let y = await this.user.getSupplierById(it.supplierId);
        if(x === '' || y === '') {
            return '';
        }
        x = await this.item.getItemBySKUIdAndSupplierId(it.SKUId, it.supplierId);
        if(x !== '') {
            return 1;
        }
        x = await this.item.getItemByIdAndSupplierId(it.id, it.supplierId);
        if(x !== '') {
            return 2;
        }
    
        try {
            x = await this.item.createNewItem(it);
            return x;
        } catch(err) {
            
            return false;
        }
    }

    async modifyItem(newValues, id) {

        let x = await this.item.getItemById(id);
        if(x === '') {
            return x;
        }

        try {
            x = await this.item.modifyItem(id, newValues);
            return x;
        } catch(err) {
            
            return false;
        }
    }

    async deleteItem(id) {

        try {
            const x = this.item.deleteItem(id);
            return x;
        } catch(err) {
            
            return false;
        }
    }

}

module.exports = ItemServices;