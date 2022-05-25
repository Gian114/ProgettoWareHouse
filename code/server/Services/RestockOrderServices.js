'use strict';

class RestockOrderServices {

    constructor(reso, skui, prod, user, db) {
        this.restockOrder = reso;
        this.skuItem = skui;
        this.product = prod;
        this.user = user;
        this.db = db;
    }

    //get

    async getRestockOrder() {

        let res;
        try {
            res = await this.restockOrder.getAllRestockOrderNotIssued();
            res = res.concat(await this.restockOrder.getAllRestockOrderIssued());
            res = res.concat(await this.restockOrder.getAllRestockOrderDelivery());
        } catch (err) {
            return false
        }
        return res;
    }

    async getIssuedRestockOrder() {
        let x;
        try {
            x = await this.restockOrder.getAllRestockOrderIssued();
        } catch (err) {
            return false;
        }
        return x;
    }

    async getRestockOrderByID(id) {
        let state;
        try {
            state = await this.restockOrder.getRestockOrderStateById(id);
        } catch (err) {
            return 404;
        }
        if(state === ''){
            return 404;
        }

        let restock_orders;
        try {
            if (state === 'ISSUED') {
                restock_orders = await this.restockOrder.getRestockOrderIssuedById(id);
            }
            else if (state === 'DELIVERY') {
                restock_orders = await this.restockOrder.getRestockOrderDeliveryById(id);
            }
            else {
                restock_orders = await this.restockOrder.getRestockOrderByID(id);
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
            state = await this.restockOrder.getRestockOrderStateById(id);
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
        let suppliers;
        let user;
        try{
            suppliers = await this.user.getSuppliers();
        }catch(err){
            return 403;
        }
        user = suppliers.find(sup => sup.id===ro.supplierId);
        if(user === undefined){
            return 404;
        }

        try {
            await this.restockOrder.createNewRestockOrder(ro);
            let id = await this.db.getAutoincrementId('RESTOCK_ORDER');
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
            state = await this.restockOrder.getRestockOrderStateById(roi);
        } catch (err) {
            return 404;
        }

        try {
            await this.restockOrder.modifyState(roi, newState);
        } catch (err) {
            return false;
        }

        return newState;

    }

    async addSkuItem(roi, items) {
        let state;
        try {
            state = await this.restockOrder.getRestockOrderStateById(roi);
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
            state = await this.restockOrder.getRestockOrderStateById(roi);
        } catch (err) {
            return 404;
        }

        if (state !== "DELIVERY") {
            return 422;
        }

        try {
            await this.restockOrder.addTNdate(roi, tn);
        } catch (err) {
            return false;
        }

        return state;

    }

    async deleteRestockOrder(id) {
        let ok = "ok";
        try {
            await this.restockOrder.deleteRestockOrder(id);
            await this.product.deleteProductByRestockOrderId(id);
            //await skuItem.deleteSKUItemByRestockOrderId(id);
        } catch (err) {
            return false;
        }

        return ok;
    }



}

module.exports = RestockOrderServices;
