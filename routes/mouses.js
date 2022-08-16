const express = require("express");
const router = express.Router();
const dataLayer = require('../dal/mouses')


// #1 import in the mouse model
const {Mouse, Brand, Variant, Color, Feature, Backlighting, GameType} = require('../models');
const { route } = require("./home");

//import in forms
const { bootstrapField, createMouseForm, createVariantForm } = require('../forms');
const async = require("hbs/lib/async");




// PRODUCTS

router.get('/', async (req,res)=>{
    // #2 - fetch all the mouses (ie, SELECT * from mouses)
    let mouses = await Mouse.collection().fetch({
        withRelated:['brand', 'features', 'gameType', 'backlighting']
    });
    res.render('mouses/index', {
        'mouses': mouses.toJSON() // #3 - convert collection to JSON
    })
})

router.get('/create', async(req,res) => {
    // getting required form fields 
const allBrands = await dataLayer.getAllBrands()
const allFeatures = await dataLayer.getAllFeatures()
const allBacklightings = await dataLayer.getAllBacklightings()
const allGameTypes = await dataLayer.getAllGameTypes()
    

    const mouseForm = createMouseForm(allBrands, allFeatures, allBacklightings, allGameTypes)
    res.render('mouses/create', {
        'form' : mouseForm.toHTML(bootstrapField)
    })
    
})

router.post('/create', async(req,res)=>{
    // getting required form fields 
const allBrands = await dataLayer.getAllBrands()
const allFeatures = await dataLayer.getAllFeatures()
const allBacklightings = await dataLayer.getAllBacklightings()
const allGameTypes = await dataLayer.getAllGameTypes()
    

    const mouseForm = createMouseForm(allBrands, allFeatures, allBacklightings, allGameTypes);
    mouseForm.handle(req, {
        'success': async (form) => {
            let {features, ...mouseData} = form.data
            const mouse = new Mouse(mouseData);
            await mouse.save();

            if (features) {
                await mouse.features().attach(features.split(','))
            }

            req.flash('success_messages', `New Mouse: ${mouse.get('name')} has been created!`)

            res.redirect('/mouses');

        },
        'error': async (form) => {
            res.render('products/create', {
                'form': form.toHTML(bootstrapField)
            })
        }
    })
})

router.get('/:mouse_id/update', async(req,res) => {
// getting required form fields 
const allBrands = await dataLayer.getAllBrands()
const allFeatures = await dataLayer.getAllFeatures()
const allBacklightings = await dataLayer.getAllBacklightings()
const allGameTypes = await dataLayer.getAllGameTypes()

    const mouseId = req.params.mouse_id
    const mouse = await Mouse.where({
        'id' : mouseId
    }).fetch({
        require: true,
        withRelated:['features']
    })
    
    const mouseForm = createMouseForm(allBrands, allFeatures, allBacklightings, allGameTypes)
    mouseForm.fields.name.value = mouse.get('name')
    mouseForm.fields.cost.value = mouse.get('cost')
    mouseForm.fields.description.value = mouse.get('description')
    mouseForm.fields.features.value = mouse.get('features')
    mouseForm.fields.height.value = mouse.get('height')
    mouseForm.fields.width.value = mouse.get('width')
    mouseForm.fields.length.value = mouse.get('length')
    mouseForm.fields.numberOfButtons.value = mouse.get('numberOfButtons')
    mouseForm.fields.connectivity.value = mouse.get('connectivity')
    mouseForm.fields.dpi.value = mouse.get('dpi')
    mouseForm.fields.shape.value = mouse.get('shape')
    mouseForm.fields.weight.value = mouse.get('weight')
    mouseForm.fields.brand_id.value = mouse.get('brand_id')
    mouseForm.fields.gameType_id.value = mouse.get('gameType_id')
    mouseForm.fields.backlighting_id.value = mouse.get('backlighting_id')

    let selectedFeatures = await product.related('features').pluck('id')
    mouseForm.fields.features.value=selectedFeatures


    res.render('mouses/update', {
        'form' : mouseForm.toHTML(bootstrapField),
        'mouse': mouse.toJSON()

    })
})



router.post('/:mouse_id/update', async (req,res) => {
    // getting required form fields 
const allBrands = await dataLayer.getAllBrands()
const allFeatures = await dataLayer.getAllFeatures()
const allBacklightings = await dataLayer.getAllBacklightings()
const allGameTypes = await dataLayer.getAllGameTypes()

    //fetch the nouse to be updated
    const mouse = await Mouse.where({
        'id': req.params.mouse_id
    }).fetch({
        require: true,
        withRelated:['features', 'brand', 'gameType', 'backlighting']
    })

    //process form
    const mouseForm = createMouseForm(allBrands, allFeatures, allBacklightings, allGameTypes)
    mouseForm.handle(req, {
        'success': async (form) => {
            let {features, ...mouseData} = form.data;
            


            mouse.set(mouseData);
            mouse.save();
            let featureIds = features.split(',')
            let existingFeatureIds = await mouse.related('features').pluck('id')

            // remove all features that arent selected
            let toRemove = existingFeatureIds.filter( feature => featureIds.includes(feature) === false)

            await mouse.features().detach(toRemove)

            await mouse.features().attach(featureIds)



            res.redirect('/mouses');
        },
        'error' : async(form) => {
            res.render('mouses/update', {
                'form': form.toHTML(bootstrapField),
                'mouse': mouse.toJSON()
            })
        }
    })
})

router.get('/:mouse_id/delete', async (req,res) => {
    //fetch mouse
    const mouse = await Mouse.where({
        'id' : req.params.mouse_id
    }).fetch({
        require: true
    })

    res.render('mouses/delete', {
        'mouse': mouse.toJSON()
    })
})

router.post('/:mouse_id/delete', async(req,res) => {
    // fetch the mouse to be deleted 
    const mouse = await Mouse.where({
        'id' : req.params.mouse_id
    }).fetch({
        require: true
    })
    await mouse.destroy()
    res.redirect('/mouses')
})

// PRODUCT VARIANTS 
router.get('/:mouse_id/variants', async (req,res) => {
    const mouse = await Mouse.where({
        'id' : req.params.mouse_id
    }).fetch({
        withRelated: ['brand', 'features', 'gameType', 'backlighting']
    })

    const variant = await Variant.where({
        'mouse_id' : req.params.mouse_id
    }).fetchAll({
        withRelated: ['mouse', 'color']
    })

    res.render('mouses/variants', {
        mouse: mouse.toJSON(),
        variant: variant.toJSON()
    })
})


router.get('/:mouse_id/variants/create', async (req, res) => {
    const mouse = await Mouse.where({
        'id' : req.params.mouse_id
    }).fetch({
        require: true
    })

    const allColors = await Color.fetchAll().map((color) => {
        return [color.get('id'), color.get('name')]
    })

    const variantForm = createVariantForm(allColors)

    res.render('mouses/create-variant', {
        mouse: mouse.toJSON(),
        variantForm: variantForm.toHTML(bootstrapField)
    })
})

router.post('/:mouse_id/variants/create', async (req,res) => {
    const mouse =  await Mouse.where({
        'id' : req.params.mouse_id
    }).fetch({
        require: true
    })

    const allColors = await Color.fetchAll().map((color) => {
        return [color.get('id'), color.get('name')]
    })

    const variantForm = createVariantForm(allColors)

    

    variantForm.handle(req, {
        'success': async (form) => {
            let variantData = form.data
            const variant = new Variant({
                mouse_id: req.params.mouse_id,
                image_url: variantData.image_url,
                stock : variantData.stock,
                thumbnail_image_url: variantData.thumbnail_image_url,
                color_id : variantData.color_id
            })
            await variant.save()

            req.flash('success_messages', 'New Product Variant has been created!')

            res.redirect(`/mouses/${req.params.mouse_id}/variants`)
        },
        'error': async(form) => {
            res.render('/mouses/create-variant', {
                mouse: mouse.toJSON(),
                variantForm: form.toHTML(bootstrapField)
            })
        }
    })
})


module.exports = router;