"use strict"

const db = require('../Modules/DB').db;

class RestockOrderServices {


    //get

    constructor(restock, product, skuItem) {
        this.restock = restock;
        this.product = product;
        this.skuItem = skuItem;
    }

    async getRestockOrder() {

        let res;
        try {
            res = await this.restock.getAllRestockOrderNotIssued();
            res = res.concat(await this.restock.getAllRestockOrderIssued());
            res = res.concat(await this.restock.getAllRestockOrderDelivery());
        } catch (err) {
            return false
        }
        return res;
    }

    async getIssuedRestockOrder() {
        let x;
        try {
            x = await this.restock.getAllRestockOrderIssued();
        } catch (err) {
            return false;
        }
        return x;
    }

    async getRestockOrderByID(id) {
        let state;
        try {
            state = await this.restock.getRestockOrderStateById(id);
        } catch (err) {
            return 404;
        }

        let restock_orders;
        try {
            if (state === 'ISSUED') {
                restock_orders = await this.restock.getRestockOrderIssuedById(id);
            }
            else if (state === 'DELIVERY') {
                restock_orders = await this.restock.getRestockOrderDeliveryById(id);
            }
            else {
                restock_orders = await this.restock.getRestockOrderByID(id);
            }
        } catch (err) {
            console.log(err);
            return false;
        }

        return restock_orders;
    }

    async getItemsByRestockId(id) {
        let state;
        try {
            state = await restockOrder.getRestockOrderStateById(id);
        } catch (err) {
            return 404;
        }


        if (state != "COMPLETEDRETURN") {
            return 422;
        }

        let restock;
        try {
            restock = await this.skuItem.getSKUItemByRestockID(id);
        } catch (err) {
            return false;
        }
        return restock;
    }

    //post 

    async addRestockOrder(ro) {

        try {
            await this.restock.createNewRestockOrder(ro);
            let id = await db.getAutoincrementId('RESTOCK_ORDER');
            for (let i = 0; i < ro.products.length; i++) {
                await this.product.insertProductRestockOrder(ro.products[i].SKUId, ro.products[i].description, ro.products[i].price, ro.products[i].qty, id);
            }
        } catch (err) {
            console.log(err);
            return false;
        }
    }

    //put

    async changeState(roi, newState) {
        let state;
        try {
            state = await this.restock.getRestockOrderStateById(roi);
        } catch (err) {
            return 404;
        }

        try {
            await this.restock.modifyState(roi, newState);
        } catch (err) {
            return false;
        }

        return newState;

    }

    async addSkuItem(roi, items) {
        let state;
        try {
            state = await this.restock.getRestockOrderStateById(roi);
        } catch (err) {
            return 404;
        }

        // checks if id exists, request validation

        if (state !== "DELIVERED") {
            return 422;
        }

        try {
            for (let i = 0; i < items.length; i++) {
                await this.skuItem.setRestockOrderId(items[i], roi);
            }
        } catch (err) {
            return false;
        }

        return state;

    }

    async addTransportNOte(roi, tn) {
        let state;
        try {
            state = await this.restock.getRestockOrderStateById(roi);
        } catch (err) {
            return 404;
        }

        if (state !== "DELIVERY") {
            return 422;
        }

        try {
            await this.restock.addTNdate(roi, tn);
        } catch (err) {
            return false;
        }

        return state;

    }

    async deleteRestockOrder(id) {
        let ok = "ok";
        try {
            await this.restock.deleteRestockOrder(id);
            await this.product.deleteProductByRestockOrderId(id);
            //await skuItem.deleteSKUItemByRestockOrderId(id);
        } catch (err) {
            return false;
        }

        return ok;
    }



}

module.exports = RestockOrderServices
