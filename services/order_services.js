const orderDataLayer = require('../dal/orders')
const {getVariantById} = require('../dal/mouses')
const { Address } = require('../models')

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

        let addressObject = stripeSession.customer_details.address
        const address = await orderDataLayer.createAddress(
            addressObject,
            stripeSession.customer_details.phone
       )
       
       const order = await orderDataLayer.createOrder(
        stripeSession,
        address.toJSON().id
       )

       const orderItems = JSON.parse(stripeSession.metadata.orders)
       for (let orderItem of orderItems) {
        await orderDataLayer.createOrderItem(
            order.toJSON().id,
            orderItem.variant_id,
            orderItem.quantity
        )
       }
    }

    async getAllStatus() {
        const allStatus = await orderDataLayer.getAllStatus()
        allStatus.unshift(['', '---Select Status---'])
        return allStatus
    }

    async updateStatus(statusId) {
        return await orderDataLayer.updateOrderStatus(this.order_id, statusId)
    }
}

module.exports = OrderServices