const express = require('express');
const { Variant } = require('../models');
const router = express.Router();

const CartServices = require('../services/cart_services');
const OrderServices = require('../services/order_services');
const Stripe = require('stripe')(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2020-08-27'
})

router.get('/:user_id/checkout', async (req,res) => {
    console.log(req.params.user_id)
    const cart = new CartServices(req.params.user_id)
    
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
        if (item.related('variant').get('image_url')) {
            lineItem['images'] = [item.related('variant').get('image_url')]
        }
        lineItems.push(lineItem);
        // save the quantity data along with the product id
        meta.push({
            'mouse_id' : item.get('mouse_id'),
            'variant_id': item.get('variant_id'),
            'quantity': item.get('quantity')
        })
    }

    let metaData = JSON.stringify(meta);
    const payment = {
        payment_method_types: ['card'],
        line_items: lineItems,
        success_url: process.env.STRIPE_SUCCESS_URL + '?sessionId={CHECKOUT_SESSION_ID}',
        cancel_url: process.env.STRIPE_ERROR_URL,
        shipping_address_collection: {
            allowed_countries: ['SG'],
        },
        phone_number_collection: {
            enabled: true,
        },
        metadata: {
            'orders': metaData,
            'user_id' : req.params.user_id
        }
    }

    let stripeSession = await Stripe.checkout.sessions.create(payment)
    res.render('checkout/checkout', {
        'sessionId' : stripeSession.id,
        'publishableKey' : process.env.STRIPE_PUBLISHABLE_KEY
    })

})

router.post('/process_payment', express.raw({type: 'application/json'}), async (req, res) => {
    console.log('payment processing')
    let payload = req.body;
    let endpointSecret = process.env.STRIPE_ENDPOINT_SECRET;
    let sigHeader = req.headers["stripe-signature"];
    let event;
    try {
        event = Stripe.webhooks.constructEvent(payload, sigHeader, endpointSecret);

    } catch (e) {
        res.send({
            'error': e.message
        })
        
    }
    if (event.type == 'checkout.session.completed') {
        let stripeSession = event.data.object;
        // process stripeSession
        console.log('stripe received')
        const orderServices = new OrderServices()
        await orderServices.createOrder(stripeSession)

        const user_id = stripeSession.metadata.user_id
        
        const cart = new CartServices(user_id)
        
        for (let order of JSON.parse(stripeSession.metadata.orders)) {
            //update stock remaining
            
            let orderQuantity = order.quantity
            let variantId = order.variant_id

            const variant = await Variant.where({
                'id': variantId
            }).fetch({
                require: true
            })

            variantJSON = variant.toJSON()

            variant.set({
                stock : (variantJSON.stock - orderQuantity)
            })

            await variant.save()

            
            //delete cart items
            await cart.remove(variantId)


            
        }
    

    }
    res.send({ received: true });
})

router.get('/success', async (req,res) => {
    res.redirect('https://3000-benjaminong-tgc18projec-anbc7vnm7qy.ws-us63.gitpod.io/profile')
})

module.exports = router;