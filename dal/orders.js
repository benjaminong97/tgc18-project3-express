const { OrderItem, Order, Status, Address } = require('../models')

const getOrderById = async (id) => {
    return await Order.where({
        id: id
    }).fetch({
        require: false,
        withRelated: ['address', 'user', 'status']
    })
}

const getOrderByUserId = async (userId) => {
    return await Order.collection().where({
        user_id: userId
    }).fetch({
        require: false,
        withRelated: ['variants', 'user', 'status', 'address', 'orderItems',
            'orderItems.variant.mouse', 'orderItems.variant.size', 'orderItems.variant.color']
    })
}

const getOrderItemsByOrderId = async (id) => {
    return await OrderItem.where({
        order_id: id
    }).fetchAll({
        require: false,
        withRelated: ['variant', 'variant.mouse.brand', 'variant.color']
    })
}

const getOrderItemsByVariantId = async (variantId) => {
    return await OrderItem.where({
        variant_id: variantId
    }).fetchAll({
        require: false
    })
}

const createOrder = async (stripeSession, addressId) => {
    const order = new Order({
        user_id: stripeSession.metadata.user_id,
        address_id: addressId,
        status_id: 1,
        cost: stripeSession.amount_total,
        payment_reference: stripeSession.payment_intent,
        date: new Date().toISOString().slice(0, 10),
    })

    await order.save()
    return order
}

const createOrderItem = async (orderId, variantId, quantity) => {
    const orderItem = new OrderItem({
        order_id: orderId,
        variant_id: variantId,
        quantity
    })
    await orderItem.save()
    return orderItem
}

const deleteOrder = async (id) => {
    const order = await getOrderById(id)
    await order.destroy()
}

const updateOrderStatus = async (id, statusId) => {
    const order = await getOrderById(id)
    order.set('status_id', statusId)
    await order.save()
    return order
}

const getAllStatus = async () => {
    return await Status.fetchAll().map(status => {
        return [status.get('id'), status.get('name')]
    })
}

const createAddress = async (addressObject, phone) => {
    const newAddress = new Address({
        postal_code: addressObject.postal_code,
        line_1: addressObject.line1,
        line_2: addressObject.line2,
        country: addressObject.country,
        phone_number: phone

    })
    await newAddress.save()
    return newAddress
}

const getAddressById = async (id) => {
    return await Address.where({
        id: id
    }).fetch({
        require: false
    })
}



module.exports = {
    getOrderById, getOrderByUserId, createOrder, deleteOrder, updateOrderStatus, getAllStatus, getAddressById,
    createOrder, createOrderItem, getOrderItemsByOrderId, getOrderItemsByVariantId, createAddress
}