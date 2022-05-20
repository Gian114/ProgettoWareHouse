'use strict'

const db = require('../Modules/DB');
const Item = require('../Modules/Item');
const item = new Item(db.db);
const SKU = require('../Modules/SKU');
const sku = new SKU(db.db);

class ItemServices {
    
    async getAllItems(res) {

        try {
            let x = await item.getAllItems();
            return res.status(200).json(x);
        } catch(err) {
            return res.status(500).json({error: "generic error"});
        }
    }

    async getItemById(res, id) {

        let x = '';
        try {
            x = await item.getItemById(id);
        } catch(err) {
            return res.status(500).json({error: "generic error"});
        }
        
        if(x === '') {
            return res.status(404).json({error: "no item associated id"});
        } else {
            return res.status(200).json(x);
        }
    }

    async createNewItem(res, it) {

        let y = await item.getItemBySKUIdAndSupplierId(it.SKUId, it.supplierId);
        if(y !== '') {
            return res.status(422).json({error: "this supplier already sells an item with the same SKUId"});
        }
        y = await item.getItemByIdAndSupplierId(it.id, it.supplierId);
        if(y !== '') {
            return res.status(422).json({error: "this supplier already sells an item with the same ID"});
        }
        y = await sku.getSKUByID(it.SKUId);
        if(y === '') {
            return res.status(404).json({error: "Sku not found"});
        }
        
        try {
            await item.createNewItem(it);
            return res.status(201).json();
        } catch(err) {
            return res.status(503).json({error: "generic error"});
        }
    }

    async modifyItem(res, newValues, id) {

        let x = await item.getItemByID(id);
        if(x === '') {
        return res.status(404).json({error: "Item not existing"});
        }
    
        try {
        await item.modifyItem(id, newValues);
        return res.status(200).json();
        } catch(err) {
        return res.status(503).json({error: "generic error"});
        }
    }

    async deleteItem(res, id) {

        try {
            await item.deleteItem(id);
            return res.status(204).json();
        } catch(err) {
            return res.status(503).json({error: "generic error"});
        }
    }

}

module.exports = ItemServices;