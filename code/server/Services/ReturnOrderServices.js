'use strict'

const db = require('../Modules/DB');
const ReturnOrder = require('../Modules/ReturnOrder');
const returnOrder = new ReturnOrder(db.db);
const RestockOrder = require('../Modules/RestockOrder');
const restockOrder = new RestockOrder(db.db);
const SkuItem = require('../Modules/SKUItem');
const skuItem = new SkuItem(db.db);
const Product = require('../Modules/Product');
const product = new Product(db.db);

class ReturnOrderServices {

    async getAllReturnOrders() {

        try {
            let x = await returnOrder.getAllReturnOrders();
            for(let i=0; i<x.length; i++) {
                x[i].products = await product.getProductsByReturnOrder(x[i].id);
            }
            return x;
        } catch(err) {
            return false;
        }
    }

    async getReturnOrderById(id) {

        try {
            let x = await returnOrder.getReturnOrderById(id);
            if(x === ''){
                return x;
            } else {
                x.products = await product.getProductsByReturnOrder(id);
                return x;
            }
        } catch(err) {
            return false;
        }
    }

    async createNewReturnOrder(ro) {

        let x = await restockOrder.getRestockOrderByID(ro.restockOrderId);;
        if(x === '') {
            return x;
        }
        for(let i=0; i<ro.products.length; i++) {
            x = await skuItem.getSKUItemByRFIDAndSKUId(ro.products[i].RFID, ro.products[i].SKUId);
            if(x === '') {
                return 1
            }
        }
    
        try {
            x = await returnOrder.createNewReturnOrder(ro);
            let id = await db.getAutoincrementID('RETURN_ORDER');
            for(let i=0; i<ro.products.length; i++) {
                await product.insertProductReturnOrder(ro.products[i].SKUId, ro.products[i].description, ro.products[i].price, id);
                await skuItem.setReturnOrderId(ro.products[i].RFID, id);
            }
            return x;
        } catch(err) {
            return false;
        }
    }

    async deleteReturnOrder(id) {

        try {
            await product.deleteProductByReturnOrderId(id);
            const x = await returnOrder.deleteReturnOrder(id);
            return x;
        } catch(err) {
            return false;
        }
    }

}

module.exports = ReturnOrderServices;