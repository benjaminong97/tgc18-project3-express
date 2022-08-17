const express = require('express');
const router = express.Router();

const CartServices = require('../services/cart_services')
const Stripe = require('stripe')(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2020-08-27'
})

router.get('/', async (req,res) => {
    const cart = new CartServices(req.session.user.id)

    let items = await cart.getCart()

    let lineItems = [];
    let meta = [];
    for (let item of items) {
        const lineItem = {
            'name': item.related('mouse').get('name'),
            'amount': item.related('mouse').get('cost'),
            'quantity': item.get('quantity'),
            'currency': 'SGD'
        }

        // find out how to display variant image here 
        if (item.related('mouse').get('image_url')) {
            lineItem['images'] = [item.related('product').get('image_url')]
        }
        lineItems.push(lineItem);
        // save the quantity data along with the product id
        meta.push({
            'mouse_id' : item.get('mouse_id'),
            'quantity': item.get('quantity')
        })
    }

    let metaData = JSON.stringify(meta);
    const payment = {
        payment_method_types: ['card'],
        line_items: lineItems,
        success_url: process.env.STRIPE_SUCCESS_URL + '?sessionId={CHECKOUT_SESSION_ID}',
        cancel_url: process.env.STRIPE_ERROR_URL,
        metadata: {
            'orders': metaData
        }
    }

    let stripeSession = await Stripe.checkout.sessions.create(payment)
    res.render('checkout/checkout', {
        'sessionId' : stripeSession.id,
        'publishableKey' : process.env.STRIPE_PUBLISHABLE_KEY
    })

})

module.exports = router;