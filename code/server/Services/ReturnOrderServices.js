'use strict'

const db = require('../Modules/DB').db;

class ReturnOrderServices {

    constructor(reto, reso, skui, prod) {
        this.returnOrder = reto;
        this.restockOrder = reso;
        this.skuItem = skui;
        this.product = prod;
    }

    async getAllReturnOrders() {

        try {
            let x = await this.returnOrder.getAllReturnOrders();
            for(let i=0; i<x.length; i++) {
                x[i].products = await this.product.getProductsByReturnOrder(x[i].id);
            }
            return x;
        } catch(err) {
            return false;
        }
    }

    async getReturnOrderById(id) {

        try {
            let x = await this.returnOrder.getReturnOrderById(id);
            if(x === ''){
                return x;
            } else {
                x.products = await this.product.getProductsByReturnOrder(id);
                return x;
            }
        } catch(err) {
            return false;
        }
    }

    async createNewReturnOrder(ro) {

        let x = await this.restockOrder.getRestockOrderByID(ro.restockOrderId);
        if(x === '') {
            return x;
        }
        for(let i=0; i<ro.products.length; i++) {
            x = await this.skuItem.getSKUItemByRFIDAndSKUId(ro.products[i].RFID, ro.products[i].SKUId);
            if(x === '') {
                return 1;
            }
        }
    
        try {
            x = await this.returnOrder.createNewReturnOrder(ro);
            let id = await db.getAutoincrementId('RETURN_ORDER');
            for(let i=0; i<ro.products.length; i++) {
                await this.product.insertProductReturnOrder(ro.products[i].SKUId, ro.products[i].description, ro.products[i].price, id);
                await this.skuItem.setReturnOrderId(ro.products[i].RFID, id);
            }
            return x;
        } catch(err) {
            return false;
        }
    }

    async deleteReturnOrder(id) {

        try {
            await this.product.deleteProductByReturnOrderId(id);
            const x = await this.returnOrder.deleteReturnOrder(id);
            return x;
        } catch(err) {
            return false;
        }
    }

}

module.exports = ReturnOrderServices;