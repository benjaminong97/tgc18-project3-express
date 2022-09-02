const express = require("express");
const router = express.Router();
const CartServices = require('../../services/cart_services');


//get cart
router.get('/:user_id', async function(req,res) {
    console.log('cart reached')
    let cartServices = new CartServices(req.params.user_id)

    try{
        const cartItems = await cartServices.getCart()
        let cartJSON = cartItems.toJSON()

        res.status(200)
        console.log(cartJSON)
        res.send (cartJSON)
    } catch (e) {
        res.status(500)
        res.send('Unable to get cart')
    }
})

//add to cart
router.post('/:user_id/add/:mouse_id/:variant_id', async function (req,res) {
    let cartServices = new CartServices(req.params.user_id)
    try {
        await cartServices.addToCart(req.params.variant_id, req.params.mouse_id, 1)
        res.status(200)
        console.log('cart creation api accessed')
        res.send('Added to cart!')
    } catch (e) {
        console.log(e)
        res.status(500)
        res.send('Unable to add item to cart')
    }
})


//update cart item quantity
router.post('/:user_id/update/:variant_id', async function (req,res) {
    let cartServices = new CartServices(req.params.user_id)
    try {
        await cartServices.setQuantity(req.params.variant_id, req.body.quantity)
        res.status(200)
        res.send('Cart item quantity updated!')
    } catch (e) {
        res.status(500)
        res.send('Unable to update cart item quantity')
    }
})


// delete cart item from cart
router.post('/:user_id/remove/:variant_id', async function(req,res){
    let cartServices = new CartServices(req.params.user_id)
    try {
        await cartServices.remove(req.params.variant_id)
        res.status(200)
        res.send('Cart item removed')
    } catch (e) {
        res.status(500)
        res.send('Unable to remove cart item')
    }
})

module.exports = router