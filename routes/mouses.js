const express = require("express");
const router = express.Router();
const dataLayer = require('../dal/mouses')



// #1 import in the mouse model
const { Mouse, Brand, Variant, Color, Feature, Backlighting, GameType } = require('../models');
const { route } = require("./home");

//import in forms
const { bootstrapField, createMouseForm, createVariantForm, createSearchForm } = require('../forms');
const async = require("hbs/lib/async");




// PRODUCTS

router.get('/', async (req, res) => {
    // #2 - fetch all the mouses (ie, SELECT * from mouses)
    // let mouses = await Mouse.collection().fetch({
    //     withRelated: ['brand', 'features', 'gameType', 'backlighting']
    // });

    //get all relationships
    const allBrands = await dataLayer.getAllBrands()
    const allFeatures = await dataLayer.getAllFeatures()
    const allBacklightings = await dataLayer.getAllBacklightings()
    const allGameTypes = await dataLayer.getAllGameTypes()

    //shiftall relationships
    allBrands.unshift([0, '----'])
    allFeatures.unshift([0, '----'])
    allBacklightings.unshift([0, '----'])
    allGameTypes.unshift([0, '----'])

    let searchForm = createSearchForm(allBrands, allFeatures, allBacklightings, allGameTypes)
    let q = Mouse.collection()

    searchForm.handle(req, {
        'empty': async (form) => {
            let mouses = await q.fetch({
                withRelated: ['brand', 'features', 'gameType', 'backlighting']
            })
            res.render('mouses/index', {
                'mouses': mouses.toJSON(), // #3 - convert collection to JSON
                'form' : form.toHTML(bootstrapField),
                
            })
        },

        'error': async (form) => {
            let mouses = await q.fetch({
                withRelated: ['brand', 'features', 'gameType', 'backlighting']
            })
            res.render('mouses/index', {
                'mouses': mouses.toJSON(), // #3 - convert collection to JSON
                'form' : form.toHTML(bootstrapField)
            })
        },
        'success': async (form) => {
           if (form.data.name) { 
            q.where('name', 'like', '%' + form.data.name + '%')
           }

           if (form.data.min_cost) {
            q.where('cost', '>=', form.data.min_cost)
           }
           
           if (form.data.max_cost) {
            q.where('cost', '<=', form.data.max_cost);
        }

        if (form.data.features) {
            q.query('join', 'features_mouses', 'mouses.id', 'mouse_id').where(
                'feature_id', 'in', form.data.features.split(',')
            )
        }
        
        if(form.data.backlighting_id && form.data.backlighting_id != "0") {
            q.where('brand_id', '=', 'form.data.backlighting_id')
        }

        if (form.data.gameType_id && form.data.gameType_id != '0') {
            q.where('gameType_id', '=', 'form.data.gameType_id')
        }

        if (form.data.brand_id && form.data.brand_id != '0') {
            q.where('brand_id', '=', 'form.data.brand_id')
        }



           let mouses = await q.fetch({
                withRelated: ['brand', 'features', 'gameType', 'backlighting']
           })
           res.render('mouses', {
            'mouses': mouses.toJSON(),
            'form': form.toHTML(bootstrapField),
            
           })
        }
    })


    
})

router.get('/create', async (req, res) => {
    // getting required form fields 
    const allBrands = await dataLayer.getAllBrands()
    const allFeatures = await dataLayer.getAllFeatures()
    const allBacklightings = await dataLayer.getAllBacklightings()
    const allGameTypes = await dataLayer.getAllGameTypes()


    const mouseForm = createMouseForm(allBrands, allFeatures, allBacklightings, allGameTypes)
    res.render('mouses/create', {
        'form': mouseForm.toHTML(bootstrapField)
    })

})

router.post('/create', async (req, res) => {
    // getting required form fields 
    const allBrands = await dataLayer.getAllBrands()
    const allFeatures = await dataLayer.getAllFeatures()
    const allBacklightings = await dataLayer.getAllBacklightings()
    const allGameTypes = await dataLayer.getAllGameTypes()


    const mouseForm = createMouseForm(allBrands, allFeatures, allBacklightings, allGameTypes);
    mouseForm.handle(req, {
        'success': async (form) => {
            let { features, ...mouseData } = form.data
            const mouse = new Mouse(mouseData);
            await mouse.save();

            if (features) {
                await mouse.features().attach(features.split(','))
            }

            req.flash('success_messages', `New Mouse: ${mouse.get('name')} has been created!`)

            res.redirect('/mouses');

        },
        'error': async (form) => {
            res.render('mouses/create', {
                'form': form.toHTML(bootstrapField)
            })
        }
    })
})

router.get('/:mouse_id/update', async (req, res) => {
    // getting required form fields 
    const allBrands = await dataLayer.getAllBrands()
    const allFeatures = await dataLayer.getAllFeatures()
    const allBacklightings = await dataLayer.getAllBacklightings()
    const allGameTypes = await dataLayer.getAllGameTypes()

    const mouseId = req.params.mouse_id
    const mouse = await Mouse.where({
        'id': mouseId
    }).fetch({
        require: true,
        withRelated: ['features']
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

    let selectedFeatures = await mouse.related('features').pluck('id')
    mouseForm.fields.features.value = selectedFeatures


    res.render('mouses/update', {
        'form': mouseForm.toHTML(bootstrapField),
        'mouse': mouse.toJSON()

    })
})



router.post('/:mouse_id/update', async (req, res) => {
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
        withRelated: ['features', 'brand', 'gameType', 'backlighting']
    })

    //process form
    const mouseForm = createMouseForm(allBrands, allFeatures, allBacklightings, allGameTypes)
    mouseForm.handle(req, {
        'success': async (form) => {
            let { features, ...mouseData } = form.data;



            mouse.set(mouseData);
            mouse.save();
            let featureIds = features.split(',')
            let existingFeatureIds = await mouse.related('features').pluck('id')

            // remove all features that arent selected
            let toRemove = existingFeatureIds.filter(feature => featureIds.includes(feature) === false)

            await mouse.features().detach(toRemove)

            await mouse.features().attach(featureIds)


            req.flash('success_messages', `Product (ID: ${req.params.mouse_id}) has been updated!`)
            res.redirect(`/mouses`);
        },
        'error': async (form) => {
            res.render('mouses/update', {
                'form': form.toHTML(bootstrapField),
                'mouse': mouse.toJSON()
            })
        }
    })
})

router.get('/:mouse_id/delete', async (req, res) => {
    //fetch mouse
    const mouse = await Mouse.where({
        'id': req.params.mouse_id
    }).fetch({
        require: true
    })

    res.render('mouses/delete', {
        'mouse': mouse.toJSON()
    })
})

router.post('/:mouse_id/delete', async (req, res) => {
    // fetch the mouse to be deleted 
    const mouse = await Mouse.where({
        'id': req.params.mouse_id
    }).fetch({
        require: true
    })
    await mouse.destroy()
    res.redirect('/mouses')
})

// PRODUCT VARIANTS 
router.get('/:mouse_id/variants', async (req, res) => {
    const mouse = await Mouse.where({
        'id': req.params.mouse_id
    }).fetch({
        withRelated: ['brand', 'features', 'gameType', 'backlighting']
    })

    const variant = await Variant.where({
        'mouse_id': req.params.mouse_id
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
        'id': req.params.mouse_id
    }).fetch({
        require: true
    })

    const allColors = await Color.fetchAll().map((color) => {
        return [color.get('id'), color.get('name')]
    })

    const variantForm = createVariantForm(allColors)

    res.render('mouses/create-variant', {
        mouse: mouse.toJSON(),
        variantForm: variantForm.toHTML(bootstrapField),
        cloudinaryName: process.env.CLOUDINARY_NAME,
        cloudinaryApiKey: process.env.CLOUDINARY_API_KEY,
        cloudinaryPreset: process.env.CLOUDINARY_UPLOAD_PRESET
    })
})

router.post('/:mouse_id/variants/create', async (req, res) => {
    const mouse = await Mouse.where({
        'id': req.params.mouse_id
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
                stock: variantData.stock,
                thumbnail_image_url: variantData.thumbnail_image_url,
                color_id: variantData.color_id
            })
            await variant.save()

            req.flash('success_messages', 'New Product Variant has been created!')

            res.redirect(`/mouses/${req.params.mouse_id}/variants`)
        },
        'error': async (form) => {
            res.render('/mouses/create-variant', {
                mouse: mouse.toJSON(),
                variantForm: form.toHTML(bootstrapField)
            })
        }
    })
})

router.get('/:mouse_id/variants/:variant_id/update', async (req, res) => {
    const variant = await Variant.where({
        'id': req.params.variant_id
    }).fetch({
        require: true,
        withRelated: ['color', 'mouse']
    })

    const allColors = await Color.fetchAll().map((color) => {
        return [color.get('id'), color.get('name')]
    })

    const variantForm = createVariantForm(allColors)
    variantForm.fields.color_id.value = variant.get('color_id')
    variantForm.fields.stock.value = variant.get('stock')
    variantForm.fields.image_url.value = variant.get('image_url')

    res.render('mouses/update-variant', {
        'form': variantForm.toHTML(bootstrapField),
        'variant': variant.toJSON(),
        cloudinaryName: process.env.CLOUDINARY_NAME,
        cloudinaryApiKey: process.env.CLOUDINARY_API_KEY,
        cloudinaryPreset: process.env.CLOUDINARY_UPLOAD_PRESET
    })
})

router.post('/:mouse_id/variants/:variant_id/update', async (req, res) => {
    const variant = await Variant.where({
        'id': req.params.variant_id
    }).fetch({
        require: true,
        withRelated: ['color', 'mouse']
    })

    const allColors = await Color.fetchAll().map((color) => {
        return [color.get('id'), color.get('name')]
    })

    const variantForm = createVariantForm(allColors)
    variantForm.handle(req, {
        'success': async (form) => {
            let variantData = form.data
            variant.set(variantData)
            await variant.save()

            req.flash('success_messages', 'Variant has been updated!')

            res.redirect(`/mouses/${req.params.mouse_id}/variants`)
        },
        'error': async (form) => {
            res.render(`/mouses/${req.params.mouse_id}/variants/${req.params.variant_id}/update`, {
                variant: variant.toJSON(),
                variantForm: form.toHTML(bootstrapField)
            })
        }
    })
})

module.exports = router;