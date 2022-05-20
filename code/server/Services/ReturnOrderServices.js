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

    async getAllReturnOrders(res) {

        try {
            let x = await returnOrder.getAllReturnOrders();
            for(let i=0; i<x.length; i++) {
                x[i].products = await product.getProductsByReturnOrder(x[i].id);
            }
            return res.status(200).json(x);
        } catch(err) {
            console.log(err);
            return res.status(500).json({error: "generic error"});
        }
    }

    async getReturnOrderById(res, id) {

        try {
            let x = await returnOrder.getReturnOrderById(id);
            if(x === ''){
                return res.status(404).json({error: "no return order associated to id"});
            } else {
                x.products = await product.getProductsByReturnOrder(id);
                return res.status(200).json(x);
            }
        } catch(err) {
            console.log(err);
            return res.status(500).json({error: "generic error"});
        }
    }

    async createNewReturnOrder(res, ro) {

        let y = await restockOrder.getRestockOrderByID(ro.restockOrderId);
        if(y === '') {
            return res.status(404).json({error: "no restock order associated to restockOrderId"});
        }
        let x = '';
        for(let i=0; i<ro.products.length; i++) {
            x = await skuItem.getSKUItemByRFIDAndSKUId(ro.products[i].RFID, ro.products[i].SKUId);
            if(x === '') {
                return res.status(404).json({error: `no sku item associated to RFID or wrong correspondence between RFID and SKUId`});
            }
        }
            
        try{
            await returnOrder.createNewReturnOrder(ro);
            let id = await db.getAutoincrementID('RETURN_ORDER');
            for(let i=0; i<ro.products.length; i++) {
                await product.insertProductReturnOrder(ro.products[i].SKUId, ro.products[i].description, ro.products[i].price, id);
                await skuItem.setReturnOrderId(ro.products[i].RFID, id);
            }
            return res.status(201).json();
        } catch(err) {
            console.log(err);
            return res.status(503).json({error: "generic error"});
        }
    }

    async deleteReturnOrder(res, id) {

        try {
            await product.deleteProductByReturnOrderId(id);
            await returnOrder.deleteReturnOrder(id);
            return res.status(204).json();
        } catch(err) {
            console.log(err);
            return res.status(503).json({error: "generic error"});
        }
    }

}

module.exports = ReturnOrderServices;