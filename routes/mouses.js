const express = require("express");
const router = express.Router();


// #1 import in the mouse model
const {Mouse, Brand} = require('../models');
const { route } = require("./home");

//import in forms
const { bootstrapField, createMouseForm } = require('../forms');
const async = require("hbs/lib/async");

router.get('/', async (req,res)=>{
    // #2 - fetch all the mouses (ie, SELECT * from mouses)
    let mouses = await Mouse.collection().fetch({
        withRelated:['brand']
    });
    res.render('mouses/index', {
        'mouses': mouses.toJSON() // #3 - convert collection to JSON
    })
})

router.get('/create', async(req,res) => {
    const allBrands = await Brand.fetchAll().map((brand) => {
        return [brand.get('id'), brand.get('name')]
    })

    const mouseForm = createMouseForm(allBrands)
    res.render('mouses/create', {
        'form' : mouseForm.toHTML(bootstrapField)
    })
})

router.post('/create', async(req,res)=>{
    // read in all the brands
    const allBrands = await Brand.fetchAll().map((brand) => {
        return [brand.get('id'), brand.get('name')]
    })

    const mouseForm = createMouseForm(allBrands);
    mouseForm.handle(req, {
        'success': async (form) => {
            const mouse = new Mouse(form.data);
            // mouse.set('name', form.data.name);
            // mouse.set('cost', form.data.cost);
            // mouse.set('description', form.data.description);
            // mouse.set('weight', form.data.weight)
            // mouse.set('features', form.data.features)
            // mouse.set('backlighting', form.data.backlighting)
            // mouse.set('height', form.data.height)
            // mouse.set('width', form.data.width)
            // mouse.set('length', form.data.length)
            // mouse.set('numberOfButtons', form.data.numberOfButtons)
            // mouse.set('connectivity', form.data.connectivity)
            // mouse.set('shape', form.data.shape)
            await mouse.save();
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
    const mouseId = req.params.mouse_id
    const mouse = await Mouse.where({
        'id' : mouseId
    }).fetch({
        require: true
    })

    //fetch all brands
    const allBrands = await Brand.fetchAll().map((brand) => {
        return [brand.get('id'), brand.get('name')]
    })
    const mouseForm = createMouseForm(allBrands)
    mouseForm.fields.name.value = mouse.get('name')
    mouseForm.fields.cost.value = mouse.get('cost')
    mouseForm.fields.description.value = mouse.get('description')
    mouseForm.fields.features.value = mouse.get('features')
    mouseForm.fields.backlighting.value = mouse.get('backlighting')
    mouseForm.fields.height.value = mouse.get('height')
    mouseForm.fields.width.value = mouse.get('width')
    mouseForm.fields.length.value = mouse.get('length')
    mouseForm.fields.numberOfButtons.value = mouse.get('numberOfButtons')
    mouseForm.fields.connectivity.value = mouse.get('connectivity')
    mouseForm.fields.dpi.value = mouse.get('dpi')
    mouseForm.fields.shape.value = mouse.get('shape')
    mouseForm.fields.weight.value = mouse.get('weight')
    mouseForm.fields.brand_id.value = mouse.get('brand_id')


    res.render('mouses/update', {
        'form' : mouseForm.toHTML(bootstrapField),
        'mouse': mouse.toJSON()

    })
})

router.post('/:mouse_id/update', async (req,res) => {
    // get all brands
    const allBrands = await Brand.fetchAll().map((brand) => {
        return [brand.get('id'), brand.get('name')]
    })

    //fetch the nouse to be updated
    const mouse = await Mouse.where({
        'id': req.params.mouse_id
    }).fetch({
        require: true
    })

    //process form
    const mouseForm = createMouseForm(allBrands)
    mouseForm.handle(req, {
        'success': async (form) => {
            mouse.set(form.data);
            mouse.save();
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



module.exports = router;