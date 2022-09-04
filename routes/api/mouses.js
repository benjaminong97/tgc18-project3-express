const express = require('express')
const router = express.Router();
const { Mouse, Review } = require('../../models')
const { createMouseForm } = require('../../forms')

const productDataLayer = require('../../dal/mouses')

router.get('/', async (req, res) => {
    console.log('received req')
    try {
        res.send(await productDataLayer.getAllMouses())
    } catch {
        res.sendStatus(500)
    }

})

// router.get('/:mouse_id', async(req,res) => {
//     let mouseId = req.params.mouse_id
//     let mouse = await productDataLayer.getMouseById(mouseId)
//     res.send(mouse)
// })

router.get('/:mouse_id/details', async (req, res) => {
    let mouseId = req.params.mouse_id
    const mouse = await productDataLayer.getMouseById(mouseId)
    res.send(mouse)
})

router.get('/features', async (req, res) => {
    let allFeatures = await productDataLayer.getAllFeatures()
    res.send(allFeatures)
})

router.get('/backlightings', async (req, res) => {
    let allBacklightings = await productDataLayer.getAllBacklightings()
    res.send(allBacklightings)
})

router.get('/gametypes', async (req, res) => {
    let allGameTypes = await productDataLayer.getAllGameTypes()
    res.send(allGameTypes)
})

router.get('/brands', async (req, res) => {
    let allBrands = await productDataLayer.getAllBrands()
    res.send(allBrands)
})

router.post('/', async (req, res) => {
    const allBrands = await productDataLayer.getAllBrands()
    const allBacklightings = await productDataLayer.getAllBacklightings()
    const allFeatures = await productDataLayer.getAllFeatures()
    const allGameTypes = await productDataLayer.getAllGameTypes()
    const mouseForm = createMouseForm(allBrands, allFeatures, allBacklightings, allGameTypes);

    mouseForm.handle(req, {
        'success': async (form) => {
            let { features, ...mouseData } = form.data
            const mouse = new Mouse(mouseData)
            await productDataLayer.save()

            // saving the many to many relationship
            if (features) {
                await mouse.features().attach(features.split(','))
            }
            res.send(mouse)
        },
        'error': async (form) => {
            let errors = {}
            for (let key in form.fields) {
                if (form.fieds[key].error) {
                    errors[key] = form.fields[key].error
                }
            }
            res.send(JSON.stringify(errors))
        }
    })


})

router.post('/search', async (req, res) => {
    console.log(req.body)
    let q = Mouse.collection()

    if (req.body.name) {
        q = q.where('name', 'ilike', '%' + req.body.name + '%')
    }

    if (req.body.min_cost) {
        q.where('cost', '>=', req.body.min_cost)
    }

    if (req.body.max_cost) {
        q.where('cost', '<=', req.body.max_cost);
    }

    if (req.body.dpi) {
        q.where('dpi', '>=', req.body.dpi)
    }

    if (req.body.gameType) {
        q.query('join', 'gameTypes', 'mouses.gameType_id', 'gameTypes.id').where(
            'gameTypes.id', 'in', req.body.gameType.split(',')
        )
    }

    if (req.body.brand && req.body.brand.length != 0) {
        console.log(req.body.brand)
        q.query('join', 'brands', 'mouses.brand_id', 'brands.id').where(
            'brands.id', 'in', req.body.brand
        )
    }

    if (req.body.shape) {
        q.where('shape', '=', req.body.shape)
    }

    if (req.body.connectivity) {
        q.where('connectivity', '=', req.body.connectivity)
    }

    if (req.body.backlighting && req.body.backlighting.length != 0) {
        q.query('join', 'backlightings', 'mouses.backlighting_id', 'backlightings.id').where(
            'backlightings.id', 'in', req.body.backlighting
        )
    }

    if (req.body.features && req.body.features.length != 0) {
        console.log(req.body.features)
        q.query('join', 'features_mouses', 'mouses.id', 'features_mouses.mouse_id').where(
            'feature_id', 'in', req.body.features
        )
    }

    let searchResults = await q.fetch({
        withRelated: ['variants', 'features', 'backlighting', 'gameType', 'brand']
    })
    


    res.send(searchResults)

})

// adding review
router.post('/comment', async(req,res) => {
    const review = new Review({
        rating: req.body.rating,
        comment: req.body.comment,
        mouse_id: req.body.mouse_id,
        review_datetime: new Date()
    })

    await review.save()
    res.send(review)
})

//getting all reviews for a mouse
router.get('/comment/:mouse_id', async(req,res) => {
    console.log(req.params.mouse_id)
    

    
    let review = await Review.where({
        mouse_id : req.params.mouse_id
    }).fetchAll({
        require: false
    })

    
    res.send(review)
})

module.exports = router;