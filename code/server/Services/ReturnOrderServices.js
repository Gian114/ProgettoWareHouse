'use strict';

class ReturnOrderServices {

    constructor(reto, reso, skui, prod, db) {
        this.returnOrder = reto;
        this.restockOrder = reso;
        this.skuItem = skui;
        this.product = prod;
        this.db = db;
    }

    async getAllReturnOrders() {

        try {
            let x = await this.returnOrder.getAllReturnOrders();
            for (let i = 0; i < x.length; i++) {
                x[i].products = await this.product.getProductsByReturnOrder(x[i].id);
            }
            return x;
        } catch (err) {
            
            return false;
        }
    }

    async getReturnOrderById(id) {

        try {
            let x = await this.returnOrder.getReturnOrderById(id);
            if (x === '') {
                return x;
            } else {
                x.products = await this.product.getProductsByReturnOrder(id);
                return x;
            }
        } catch (err) {
            
            return false;
        }
    }

    async createNewReturnOrder(ro) {

        let x = await this.restockOrder.getRestockOrderIssuedById(ro.restockOrderId);
        if (x === '') {
            return x;
        }

        try {
            x = await this.returnOrder.createNewReturnOrder(ro);
            let id = await this.db.getAutoincrementId('RETURN_ORDER');
            for (let i = 0; i < ro.products.length; i++) {
                await this.product.insertProductReturnOrder(ro.products[i].SKUId, ro.products[i].itemId, ro.products[i].description, ro.products[i].price, id);
                await this.skuItem.setReturnOrderId(ro.products[i].RFID, id);
            }
            return x;
        } catch (err) {
            
            return false;
        }
    }

    async deleteReturnOrder(id) {

        try {
            await this.product.deleteProductsByReturnOrderId(id);
            const x = await this.returnOrder.deleteReturnOrder(id);
            return x;
        } catch (err) {
            
            return false;
        }
    }

}

module.exports = ReturnOrderServices;