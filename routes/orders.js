const express = require('express');
const router = express.Router();
const OrderServices = require('../services/order_services');
const { Order } = require('../models')
const {createOrderSearchForm} = require('../forms');
const { bootstrapField } = require('../forms');

router.get('/', async (req,res) => {
    const orderServices = new OrderServices()
    orderSearchForm = createOrderSearchForm(await orderServices.getAllStatus())

    const q = Order.collection()

    orderSearchForm.handle(req, {
        empty: async (form) => {
            const orders = await q.fetch({
                withRelated: ['user', 'status', 'address']
            })

            const resultsNumber = orders.toJSON().length

            res.render('orders/index', {
                orderSearchForm: form.toHTML(bootstrapField),
                resultsNumber,
                orders: orders.toJSON()
            })
        },
        error: async (form) => {
            const orders = await q.fetch({
                withRelated: ['user', 'status', 'address']
            })

            const resultsNumber = orders.toJSON().length
            res.render('orders/index', {
                orderSearchForm: form.toHTML(bootstrapField),
                resultsNumber,
                orders: orders.toJSON()
            })
        },
        success: async (form) => {
            if (form.data.order_id) {
                q.where('id', '=', form.data.order_id)
            }

            if (form.data.status_id) {
                q.where('status_id', '=', form.data.status_id)
            }

            if (form.data.date) {
                q.where('date', '=', form.data.date)
            }

            const orders = await q.fetch({
                withRelated : ['user', 'status', 'address']
            })

            const resultsNumber = orders.toJSON().length

            res.render('orders/index', {
                orderSearchForm: form.toHTML(bootstrapField),
                resultsNumber,
                orders: orders.toJSON()
            })

        }

        
    })
    
})

router.post('/:order_id/status/update', async (req,res) => {
    const orderServices = new OrderServices(req.params.order_id)
    await orderServices.updateStatus(req.body.status_id)
    req.flash('success_messages', "Order status updated")
    res.redirect('/orders')
})

module.exports = router