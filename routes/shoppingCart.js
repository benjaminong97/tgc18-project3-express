const express = require('express')
const router = express.Router()

const CartServices = require('../services/cart_services')
const { route } = require('./home')

router.get('/', async(req,res) => {
    let cart = new CartServices(req.session.user.id)
    res.render('cart/index', {
        'shoppingCart' : (await cart.getCart()).toJSON()
    })
})

router.get('/:mouse_id/add', async (req,res) => {
    let cart = new CartServices(req.session.user.id)
    await cart.addToCart(req.params.mouse_id, 1)
    req.flash('success_messages', 'Added to cart!')
    res.redirect('/mouses')
})

router.get('/:mouse_id/remove', async (req,res)=> {
    let cart = new CartServices(req.session.user.id)
    await cart.remove(req.params.mouse_id)
    req.flash('success_messages', 'Item has been removed')
    res.redirect('/cart/')
})

router.post('/:mouse_id/quantity/update', async (req,res) => {
    let cart = new CartServices(req.session.user.id)
    await cart.setQuantity(req.params.mouse_id, req.body.newQuantity)
    req.flash('success_messages', 'Cart quantity updated')
    res.redirect('/cart/')
})

module.exports = router