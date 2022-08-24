const orderDataLayer = require('../dal/orders')
const {getVariantById} = require('../dal/mouses')

class OrderServices {
    constructor(order_id) {
        this.order_id = order_id
    }

    async getOrderById() {
        return await orderDataLayer.getOrderById(this.order_id)
    }

    async getOrderItemsByOrderId() {
        return await orderDataLayer.getOrderItemsByOrderId(this.order_id)
    }

    async createOrder(stripeSession) {
        const address = await orderDataLayer.createAddress(
            stripeSession.customer_details.address
       )
       const order = await orderDataLayer.createOrder(
        stripeSession,
        address.toJSON().id
       )

       
    }
}

module.exports = OrderServices