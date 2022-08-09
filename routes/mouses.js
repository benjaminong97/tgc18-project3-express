const express = require("express");
const router = express.Router();
const {bootstrapField, createMouseForm} = require('../forms')

// #1 import in the mouse model
const {Mouse} = require('../models');
const { route } = require("./home");

router.get('/', async (req,res)=>{
    // #2 - fetch all the mouses (ie, SELECT * from mouses)
    let mouses = await Mouse.collection().fetch();
    res.render('mouses/index', {
        'mouses': mouses.toJSON() // #3 - convert collection to JSON
    })
})

route.get('/create', async(req,res) => {
    const mouseForm = createMouseForm()
    res.render('mouses/create', {
        'form' : mouseForm.toHTML(bootstrapField)
    })
})

router.post('/create', async(req,res)=>{
    const mouseForm = createMouseForm();
    mouseForm.handle(req, {
        'success': async (form) => {
            const mouse = new Mouse();
            mouse.set('name', form.data.name);
            mouse.set('cost', form.data.cost);
            mouse.set('description', form.data.description);
            mouse.set('weight', form.data.weight)
            mouse.set('features', form.data.features)
            mouse.set('backlighting', form.data.backlighting)
            mouse.set('height', form.data.height)
            mouse.set('width', form.data.width)
            mouse.set('length', form.data.length)
            mouse.set('numberOfButtons', form.data.numberOfButtons)
            mouse.set('connectivity', form.data.connectivity)
            mouse.set('shape', form.data.shape)
            await mouse.save();
            res.redirect('/mouses');

        }
    })
})

module.exports = router;