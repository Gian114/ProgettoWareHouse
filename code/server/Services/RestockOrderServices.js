const RestockOrder = require('../Modules/RestockOrder');
const db = require('../Modules/DB');
const restockOrder = new RestockOrder(db.db);

const Product = require('../Modules/Product');
const product = new Product(db.db);

const SkuItem = require('../Modules/SkuItem');
const skuItem = new SkuItem(db.db);

class RestockOrderServices {

    //get

    async getRestockOrder() {

        let restock;
        try {
            restock = await restockOrder.getAllRestockOrderNotIssued();
            restock = restock.concat(await restockOrder.getAllRestockOrderIssued());
            restock = restock.concat(await restockOrder.getAllRestockOrderDelivery());
        } catch (err) {
            return false
        }
        return restock;
    }

    async getIssuedRestockOrder() {
        let x;
        try {
            x = await restockOrder.getAllRestockOrderIssued();
        } catch (err) {
            return false;
        }
        return x;
    }

    async getRestockOrderByID(id) {
        let state;
        try {
            state = await restockOrder.getRestockOrderStateById(id);
        } catch (err) {
            return 404;
        }

        let restock_orders;
        try {
            if (state === 'ISSUED') {
                restock_orders = await restockOrder.getRestockOrderIssuedById(id);
            }
            else if (state === 'DELIVERY') {
                restock_orders = await restockOrder.getRestockOrderDeliveryById(id);
            }
            else {
                restock_orders = await restockOrder.getRestockOrderByID(id);
            }
        } catch (err) {
            console.log(err);
            return false;
        }

        return restock_orders;
    }

    async getItemsByRestockId() {
        let state;
        try {
            state = await restockOrder.getRestockOrderStateById(id);
        } catch (err) {
            return 404;
        }

        // checks if id exists, request validation

        if (state != "COMPLETEDRETURN") {
            return 422;
        }

        let restock;
        try {
            restock = await skuItem.getSKUItemByRestockID(id);
        } catch (err) {
            return false;
        }
        return restock;
    }

    //post 

    async addRestockOrder(ro) {
        let x;

        try {
            await restockOrder.createNewRestockOrder(ro);
            let id = await db.getAutoincrementID('RESTOCK_ORDER');
            for (let i = 0; i < ro.products.length; i++) {
                await product.insertProductRestockOrder(ro.products[i].SKUId, ro.products[i].description, ro.products[i].price, ro.products[i].qty, id);
            }
        } catch (err) {
            return false;
        }
    }

    //put

    async changeState(roi, newState) {
        let state;
        try {
            state = await restockOrder.getRestockOrderStateById(roi);
        } catch (err) {
            return 404;
        }

        try {
            await restockOrder.modifyState(roi, newState);
        } catch (err) {
            return false;
        }

        return newState;

    }

    async addSkuItem(roi, items) {
        let state;
        try {
            state = await restockOrder.getRestockOrderStateById(roi);
        } catch (err) {
            return 404;
        }

        // checks if id exists, request validation

        if (state !== "DELIVERED") {
            return 422;
        }

        try {
            for (let i = 0; i < items.length; i++) {
                await skuItem.setRestockOrderId(items[i], roi);
            }
        } catch (err) {
            return false;
        }

        return state;

    }

    async addTransportNOte(roi, tn) {
        let state;
        try {
            state = await restockOrder.getRestockOrderStateById(roi);
        } catch (err) {
            return 404;
        }

        if (state !== "DELIVERY") {
            return 422;
        }

        try {
            await restockOrder.addTNdate(roi, tn);
        } catch (err) {
            return false;
        }

        return state;

    }

    async deleteRestockOrder(id) {
        let ok = "ok";
        try {
            await restockOrder.deleteRestockOrder(id);
            await product.deleteProductByRestockOrderId(id);
            //await skuItem.deleteSKUItemByRestockOrderId(id);
        } catch (err) {
            return false;
        }

        return ok;
    }



}

module.exports = RestockOrderServices
