const express = require('express');
const router = express.Router();
const {getOrdersByUserId} = require('../../dal/orders')

router.get('/:user_id', async (req, res) => {
    
    try {
        
        const orders = await getOrdersByUserId(req.params.user_id)
        console.log(orders)
        res.send(orders)
    } catch(e) {
        res.status(500)
        res.send('unable to get orders')
    }
})




module.exports = router