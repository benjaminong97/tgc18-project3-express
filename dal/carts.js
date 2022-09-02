const {Cart} = require('../models')

const getCart = async (userId) => {
    return await Cart.collection().where({
        'user_id': userId
    }).fetch({
        require: false,
        withRelated: ['mouse', 'variant']
    })
}

const getCartByUserAndVariant = async (userId, variantId) => {
    
    return await Cart.where({
        user_id : userId,
        variant_id : variantId
    }).fetch({
        require:false
    })
}

async function createCart(userId, mouseId, variantId, quantity) {
    let cart = new Cart({
        'user_id' : userId,
        'mouse_id' : mouseId,
        'variant_id' : variantId,
        'quantity': quantity
    })
    await cart.save()
    return cart
}

async function removeFromCart(userId, variantId) {
    let cart = await getCartByUserAndVariant(userId, variantId);
    console.log(userId, variantId)
    console.log(cart)
    if (cart) {
        await cart.destroy()
        return true
    } 
    return false
}

async function updateQuantity(userId, variantId, newQuantity) {
    console.log(userId, variantId, newQuantity)
    let cart = await getCartByUserAndVariant(userId, variantId)
    
    if (cart) {
        cart.set('quantity', newQuantity)
        cart.save()
        return true
    }
    return false 
}

module.exports = {getCart, getCartByUserAndVariant, createCart, removeFromCart, updateQuantity}