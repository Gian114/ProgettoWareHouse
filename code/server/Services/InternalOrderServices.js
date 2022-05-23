

class InternalOrderServices {
        constructor(io, prod, item) {
            this.io_table = io;
            this.prod_table = prod;
            this.item_table = item;

        }
    async getInternalOrders() {
        let internal_orders;
        internal_orders = this.transformInternalOrdersListNotCompleted(await this.io_table.getInternalOrdersNotCompleted());
        const io_comp = this.transformInternalOrdersListCompleted(await this.io_table.getInternalOrdersCompleted());
        internal_orders.concat(io_comp);
        return internal_orders;
    }

    async getInternalOrdersByState(state) {
        // this doesn't work if state === COMPLETED, but it is never called
        // with state = COMPLETED by the apis so for now it is ok
        const internal_orders = this.transformInternalOrdersListNotCompleted(await this.io_table.getInternalOrdersByState(state));
        return internal_orders;
    }

    async getInternalOrderById(id) {
        let state, internal_order;
        state = await this.io_table.getInternalOrderStateById(id);
    
        // checks if id exists, request validation
        if (state === '') {
            return undefined;
        }
        else if (state === 'COMPLETED') {
            internal_order = this.transformInternalOrderCompleted(await this.io_table.getInternalOrderCompletedById(id));
        }
        else {
            internal_order = this.transformInternalOrderNotCompleted(await this.io_table.getInternalOrderNotCompletedById(id));
        }

        return internal_order;
    }

    async createInternalOrder(issue_date, state, customer_id, products) {
        const internal_order_id = await this.io_table.createInternalOrder(issue_date, state, customer_id);
        for (const prod of products) {
            await this.prod_table.insertProductInternalOrder(prod.SKUId, prod.description, prod.price, prod.qty, internal_order_id)
        }
    }

    async modifyInternalOrder(id, new_state, sku_items = undefined) {
        // set new state in internal order table 
        await this.io_table.modifyInternalOrderState(id, new_state);
        if (new_state === 'COMPLETED' && sku_items != undefined) {
            // add internal order id to sku item
            for (const prod of sku_items) {
                // NEED TO CHANGE THIS USING SERVICES
                this.item_table.setInternalOrderId(prod.RFID, id);
            }
        }
    }

    async deleteInternalOrder(id) {
        await this.prod_table.deleteProductByInternalOrderId(id);
        await this.io_table.deleteInternalOrderById(id);
    }

    transformInternalOrdersListNotCompleted(query_res) {
        const prods = query_res.reduce(function (ios, obj) {
            ios[obj.id] = 
                ios[obj.id] || 
                {
                    id: obj.id,
                    issueDate: obj.issueDate,
                    state: obj.state,
                    products: [],
                    customerId:obj.customerId
                };
            ios[obj.id].products.push(obj.product);
            return ios
            }, {}
        );
        return Object.values(prods);
    }

    transformInternalOrdersListCompleted(query_res) {
        const prods = query_res.reduce(function (ios, obj) {
            ios[obj.id] = 
                ios[obj.id] || 
                {
                    id: obj.id,
                    issueDate: obj.issueDate,
                    state: obj.state,
                    products: [],
                    customerId:obj.customerId
                };
            ios[obj.id].products.push(obj.product);
            return ios
            }, {}
        );
        return Object.values(prods);
    }

    transformInternalOrderNotCompleted(query_res) {
        return query_res.reduce(function (io, obj) {
            io = (Object.keys(io).length !== 0 ? io : 
                {
                    id: obj.id,
                    issueDate: obj.issueDate,
                    state: obj.state,
                    products: [],
                    customerId:obj.customerId
                });
            io.products.push(obj.product);
            return io
            }, {}
        );
    }

    transformInternalOrderCompleted(query_res) {
        return query_res.reduce(function (io, obj) {
            io = (Object.keys(io).length !== 0 ? io : 
                {
                    id: obj.id,
                    issueDate: obj.issueDate,
                    state: obj.state,
                    products: [],
                    customerId:obj.customerId
                });
            io.products.push(obj.product);
            return io
            }, {}
        );
    }
}

module.exports = InternalOrderServices;