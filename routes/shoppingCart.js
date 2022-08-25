const express = require('express')
const router = express.Router()

const CartServices = require('../services/cart_services')
const { route } = require('./home')
const {checkIfAuthenticated} = require('../middlewares')

router.get('/', async(req,res) => {
    let cart = new CartServices(req.session.user.id)

    let test = (await cart.getCart()).toJSON()
    console.log(test)
    res.render('cart/index', {
        'shoppingCart' : (await cart.getCart()).toJSON()
    })
})

router.get('/:mouse_id/:variant_id/add',checkIfAuthenticated, async (req,res) => {
    let cart = new CartServices(req.session.user.id)
    await cart.addToCart(req.params.variant_id,req.params.mouse_id, 1)
    req.flash('success_messages', 'Added to cart!')
    res.redirect('/mouses')
})

router.get('/:variant_id/remove', async (req,res)=> {
    let cart = new CartServices(req.session.user.id)
    await cart.remove(req.params.variant_id)
    req.flash('success_messages', 'Item has been removed')
    res.redirect('/cart/')
})

router.post('/:variant_id/quantity/update', async (req,res) => {
    let cart = new CartServices(req.session.user.id)
    console.log(req.params.variant_id, req.body.newQuantity)
    await cart.setQuantity(req.params.variant_id, req.body.newQuantity)
    req.flash('success_messages', 'Cart quantity updated')
    res.redirect('/cart/')
})

module.exports = router