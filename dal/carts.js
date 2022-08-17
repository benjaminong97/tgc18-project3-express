const {Cart} = require('../models')

const getCart = async (userId) => {
    return await Cart.collection().where({
        'user_id': userId
    }).fetch({
        require: false,
        withRelated: ['mouse']
    })
}

const getCartByUserAndMouse = async (userId, mouseId) => {
    return await Cart.where({
        'user_id' : userId,
        'mouse_id' : mouseId
    }).fetch({
        require:false
    })
}

async function createCart(userId, mouseId, quantity) {
    let cart = new Cart({
        'user_id' : userId,
        'mouse_id' : mouseId,
        'quantity': quantity
    })
    await cart.save()
    return cart
}

async function removeFromCart(userId, mouseId, newQuantity=0) {
    let cart = await getCartByUserAndMouse(userId,mouseId);
    if (cart) {
        await cart.destroy()
        return true
    } 
    return false
}

async function updateQuantity(userId, mouseId, newQuantity) {
    let cart = await getCartByUserAndMouse(userId, mouseId)
    if (cart) {
        cart.set('quantity', newQuantity)
        cart.save()
        return true
    }
    return false 
}

module.exports = {getCart, getCartByUserAndMouse, createCart, removeFromCart, updateQuantity}